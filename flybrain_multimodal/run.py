import csv,gzip,json,os,random,struct,time,urllib.request
from pathlib import Path
import numpy as np, torch, torch.nn as nn, torch.nn.functional as F
from PIL import Image,ImageDraw
from transformers import AutoTokenizer,AutoModelForCausalLM
from diffusers import DiffusionPipeline

R=Path(__file__).parent; O=R/'results'; C=R/'cache'; O.mkdir(parents=True,exist_ok=True); C.mkdir(exist_ok=True)
SEED=20260929; random.seed(SEED); np.random.seed(SEED); torch.manual_seed(SEED); torch.set_num_threads(min(4,os.cpu_count() or 2))
STYLES=['analytical','creative','alert','calm']
LTXT={'analytical':'precise logical concise scientific','creative':'imaginative vivid original exploratory','alert':'direct cautious safety focused','calm':'calm balanced patient clear'}
STXT={'analytical':'technical scientific diagram, precise geometry, clean laboratory illustration','creative':'surreal vibrant imaginative cinematic artwork, rich detail','alert':'dramatic high contrast warning atmosphere, sharp lighting','calm':'soft light, serene minimal composition, peaceful colors'}

def dl(url,p):
    if not p.exists(): urllib.request.urlretrieve(url,p)

def connectome():
    cp=C/'connectome.bin.gz'; mp=C/'neuron_meta.json'
    dl('https://raw.githubusercontent.com/snedea/flybrain/main/data/connectome.bin.gz',cp)
    dl('https://raw.githubusercontent.com/snedea/flybrain/main/data/neuron_meta.json',mp)
    raw=gzip.open(cp,'rb').read(); n,e=struct.unpack_from('<II',raw,0)
    dt=np.dtype([('pre','<u4'),('post','<u4'),('w','<f4')]); ed=np.frombuffer(raw,dtype=dt,count=e,offset=8)
    mo=8+e*12; m=np.frombuffer(raw,dtype=np.uint8,count=n*3,offset=mo).reshape(n,3); gid=m[:,1].astype(np.uint16)|(m[:,2].astype(np.uint16)<<8)
    g=int(gid.max())+1; W=np.zeros((g,g),np.float64); np.add.at(W,(gid[ed['pre']],gid[ed['post']]),ed['w']); den=np.abs(W).sum(1,keepdims=True); W=np.divide(W,den,out=np.zeros_like(W),where=den>0).astype(np.float32)
    meta=json.loads(mp.read_text()); names=[f'G{i}' for i in range(g)]
    for x in meta['groups']:
        if x['id']<g:names[x['id']]=x['name']
    return torch.tensor(W),names,{'neurons':n,'connections':e,'groups':g,'nonzero_group_edges':int(np.count_nonzero(W))}

def fly_states(W,names):
    idx={n:i for i,n in enumerate(names)}
    stim={
      'analytical':{'VIS_ME':1.2,'MB_KC':1.4,'CX_FC':1.0,'CX_PFN':.8},
      'creative':{'VIS_R1R6':1.0,'MB_KC':1.6,'CX_EPG':1.1,'GENERIC_CENTRAL':.6},
      'alert':{'OLF_ORN_DANGER':1.8,'MECH_BRISTLE':1.2,'GNG_DESC':1.2,'GENERIC_CENTRAL':.5},
      'calm':{'THERMO_COOL':1.4,'MB_MBON_APP':1.0,'CX_HDELTA':.8,'GENERIC_CENTRAL':.3}}
    out=[]
    for s in STYLES:
        inp=torch.zeros(W.shape[0]); x=torch.zeros_like(inp)
        for k,v in stim[s].items():
            if k in idx: inp[idx[k]]+=v
        for t in range(10): x=torch.tanh(.72*x+1.15*(x@W)+(inp*(1-.2*t) if t<3 else 0))
        out.append(x)
    return out

class A(nn.Module):
    def __init__(self,fd,ld,sd):
        super().__init__(); self.t=nn.Sequential(nn.Linear(fd,128),nn.GELU(),nn.Linear(128,128),nn.GELU()); self.l=nn.Linear(128,ld);self.s=nn.Linear(128,sd);self.c=nn.Linear(128,4)
    def forward(self,x): h=self.t(x);return self.l(h),self.s(h),self.c(h)

def llm_target(tok,emb,t):
    ids=tok(t,return_tensors='pt',add_special_tokens=False).input_ids
    with torch.no_grad():return emb(ids).mean(1)[0].float()

def sd_target(pipe,t):
    q=pipe.tokenizer(t,padding='max_length',max_length=pipe.tokenizer.model_max_length,truncation=True,return_tensors='pt')
    with torch.no_grad():h=pipe.text_encoder(q.input_ids)[0]
    m=q.attention_mask.float().unsqueeze(-1);return ((h*m).sum(1)/m.sum(1).clamp_min(1))[0].float()

def train(ad,states,lt,st):
    X=torch.stack(states);YL=torch.stack(lt);YS=torch.stack(st);Y=torch.arange(4);opt=torch.optim.AdamW(ad.parameters(),lr=2e-3);rows=[];best=1e9
    for ep in range(401):
        x=X.repeat_interleave(12,0)+.015*torch.randn(48,X.shape[1]);yl=YL.repeat_interleave(12,0);ys=YS.repeat_interleave(12,0);y=Y.repeat_interleave(12,0)
        pl,ps,pc=ad(x);a=1-F.cosine_similarity(pl,yl,dim=-1).mean();b=1-F.cosine_similarity(ps,ys,dim=-1).mean();c=F.cross_entropy(pc,y);loss=a+b+.35*c
        opt.zero_grad();loss.backward();opt.step()
        if loss.item()<best:best=loss.item();torch.save(ad.state_dict(),O/'adapter.pt')
        if ep%20==0:
            acc=(ad(X)[2].argmax(-1)==Y).float().mean().item();rows.append({'epoch':ep,'loss':loss.item(),'llm':a.item(),'sd':b.item(),'acc':acc});print('TRAIN',rows[-1],flush=True)
    ad.load_state_dict(torch.load(O/'adapter.pt',map_location='cpu'))
    with open(O/'training.csv','w',newline='') as f:w=csv.DictWriter(f,fieldnames=rows[0]);w.writeheader();w.writerows(rows)
    return best

def gen(model,tok,prompt,ctrl=None):
    text=tok.apply_chat_template([{'role':'user','content':prompt}],tokenize=False,add_generation_prompt=True);e=tok(text,return_tensors='pt');kw=dict(max_new_tokens=64,do_sample=False,pad_token_id=tok.eos_token_id,repetition_penalty=1.05)
    with torch.no_grad():
      if ctrl is None:o=model.generate(**e,**kw);ids=o[0,e.input_ids.shape[1]:]
      else:
        te=model.get_input_embeddings()(e.input_ids);cc=ctrl.view(1,1,-1).to(te.dtype).repeat(1,4,1);inp=torch.cat([cc,te],1);mask=torch.ones(inp.shape[:2],dtype=e.attention_mask.dtype);o=model.generate(inputs_embeds=inp,attention_mask=mask,**kw);ids=o[0]
    return tok.decode(ids,skip_special_tokens=True).strip()

def montage(a,b,p):
    c=Image.new('RGB',(a.width+b.width,max(a.height,b.height)+28),'white');c.paste(a,(0,28));c.paste(b,(a.width,28));d=ImageDraw.Draw(c);d.text((4,6),'BASE',fill='black');d.text((a.width+4,6),'FLY-CONDITIONED',fill='black');c.save(p)

def main():
    t=time.time();W,names,info=connectome();states=fly_states(W,names);print('FLY',info,flush=True)
    lid='HuggingFaceTB/SmolLM2-135M-Instruct';sid='diffusers/tiny-stable-diffusion-torch'
    tok=AutoTokenizer.from_pretrained(lid);lm=AutoModelForCausalLM.from_pretrained(lid,torch_dtype=torch.float32).eval();lt=[llm_target(tok,lm.get_input_embeddings(),LTXT[s]) for s in STYLES]
    pipe=DiffusionPipeline.from_pretrained(sid,torch_dtype=torch.float32,safety_checker=None).to('cpu');st=[sd_target(pipe,STXT[s]) for s in STYLES]
    ad=A(W.shape[0],lt[0].numel(),st[0].numel());best=train(ad,states,lt,st);ad.eval()
    correct=0
    with torch.no_grad():
      for i,x in enumerate(states):
        for _ in range(50):correct+=int(ad((x+.03*torch.randn_like(x))[None])[2].argmax(-1)[0])==i
    acc=correct/200
    si=1;lc,sc,cl=ad(states[si][None]);style=STYLES[int(cl.argmax(-1)[0])]
    p='Explain in one short paragraph how a fruit-fly connectome can be used as a controller for an AI system. Be technically honest.';btxt=gen(lm,tok,p);ftxt=gen(lm,tok,p,lc[0]);(O/'llm_base.txt').write_text(btxt);(O/'llm_fly.txt').write_text(ftxt);print('BASE',btxt,flush=True);print('FLYTXT',ftxt,flush=True)
    bp='a futuristic fruit fly brain connected to an artificial intelligence computer, scientific concept art';fp=bp+', '+STXT[style]
    g0=torch.Generator().manual_seed(SEED);g1=torch.Generator().manual_seed(SEED);bi=pipe(bp,num_inference_steps=12,guidance_scale=7,generator=g0,height=128,width=128).images[0];bi.save(O/'sd_base.png')
    pe,ne=pipe.encode_prompt(fp,device=torch.device('cpu'),num_images_per_prompt=1,do_classifier_free_guidance=True,negative_prompt='');v=sc.to(pe.dtype);v=v/v.norm(dim=-1,keepdim=True).clamp_min(1e-6);pe=pe+.10*pe.norm(dim=-1).mean().detach()*v[:,None,:];fi=pipe(prompt_embeds=pe,negative_prompt_embeds=ne,num_inference_steps=12,guidance_scale=7,generator=g1,height=128,width=128).images[0];fi.save(O/'sd_fly.png');montage(bi,fi,O/'sd_comparison.png')
    mae=float(np.mean(np.abs(np.asarray(bi).astype(float)-np.asarray(fi).astype(float))))
    rep={'elapsed_sec':time.time()-t,'flybrain':info,'llm':lid,'stable_diffusion':sid,'llm_parameters':sum(p.numel() for p in lm.parameters()),'adapter_parameters':sum(p.numel() for p in ad.parameters()),'best_training_loss':best,'noisy_style_accuracy':acc,'selected_style':'creative','predicted_style':style,'llm_base':btxt,'llm_fly_conditioned':ftxt,'sd_base_prompt':bp,'sd_fly_prompt':fp,'pixel_mae':mae,'limits':['frozen LLM and SD; only FlyBrain adapter trained','connectome projected to functional groups for coupling','tiny Stable Diffusion checkpoint used for CPU execution','proof of learned coupling, not human-level cognition']};(O/'report.json').write_text(json.dumps(rep,indent=2));print('REPORT',json.dumps(rep,indent=2),flush=True)
if __name__=='__main__':main()
