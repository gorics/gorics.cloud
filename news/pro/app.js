const state={articles:[],filtered:[],category:'All',query:''};
const grid=document.getElementById('newsGrid');
const updatedAt=document.getElementById('updatedAt');
const searchInput=document.getElementById('searchInput');
const categoryFilters=document.getElementById('categoryFilters');

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[m]));
}

function renderFilters(){
  const categories=['All',...new Set(state.articles.map(a=>a.category).filter(Boolean))];
  categoryFilters.innerHTML=categories.map(category=>`<button class="filter-chip ${state.category===category?'active':''}" data-category="${escapeHtml(category)}">${escapeHtml(category)}</button>`).join('');
  [...categoryFilters.querySelectorAll('button')].forEach(button=>{
    button.addEventListener('click',()=>{state.category=button.dataset.category;applyFilters();});
  });
}

function renderArticles(){
  if(!state.filtered.length){
    grid.innerHTML='<article class="article-card empty-state">조건에 맞는 기사가 없습니다.</article>';
    return;
  }
  grid.innerHTML=state.filtered.map(article=>`<article class="article-card"><span class="section-label">${escapeHtml(article.category||'News')}</span><h3>${escapeHtml(article.title||'제목 없음')}</h3><div class="article-meta"><span>${escapeHtml(article.publishedAt||'')}</span><span>${escapeHtml(article.slug||'')}</span></div><p class="article-summary">${escapeHtml(article.summary||'')}</p><a class="read-more" href="${escapeHtml(article.path||'#')}">기사 보기 →</a></article>`).join('');
}

function applyFilters(){
  const query=state.query.trim().toLowerCase();
  state.filtered=state.articles.filter(article=>{
    const categoryOk=state.category==='All'||article.category===state.category;
    const target=`${article.title||''} ${article.summary||''}`.toLowerCase();
    const queryOk=!query||target.includes(query);
    return categoryOk&&queryOk;
  });
  renderFilters();
  renderArticles();
}

async function loadNews(){
  try{
    const res=await fetch('/news/index.json',{cache:'no-store'});
    if(!res.ok)throw new Error('Failed to load news index');
    const data=await res.json();
    state.articles=Array.isArray(data.articles)?data.articles:[];
    updatedAt.textContent=data.updatedAt?`마지막 업데이트: ${data.updatedAt}`:'업데이트 정보 없음';
    applyFilters();
  }catch(error){
    console.error(error);
    grid.innerHTML='<article class="article-card empty-state">뉴스 목록을 불러오지 못했습니다.</article>';
    updatedAt.textContent='JSON 로드 실패';
  }
}

searchInput.addEventListener('input',e=>{state.query=e.target.value;applyFilters();});
loadNews();