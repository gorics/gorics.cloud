const fs = require('fs');
const path = require('path');

const articles = [
  {
    slug: '2026-04-02-boj-inflation-outlook',
    category: 'financial',
    title: 'BOJ, 엔화 약세와 임금 인상발 인플레 압력 주시…금리 경로 조정 가능성',
    publishedAt: '2026-04-02',
    summary: '일본은행(BOJ)이 춘투발 임금 인상과 지속적인 엔화 약세가 물가 상방 압력으로 작용할 가능성을 경고하며 추가 금리 인상 시점을 저울질하고 있다.',
    content: `
      <p>일본은행(BOJ)은 최근 경제 동향 평가에서 엔화 약세와 춘계 임금 협상(춘투)의 긍정적 결과가 향후 기조적인 인플레이션을 끌어올릴 핵심 변수가 될 것으로 진단했다. 수입 물가 상승이 단기적 충격에 그치지 않고, 임금과 물가의 선순환 구조로 이어질지에 시장의 이목이 쏠리고 있다.</p>
      <p>BOJ 인사들은 과도한 엔화 가치 하락이 가계 구매력 저하와 수입 비용 급등을 초래할 수 있음을 지적하며, 필요시 통화정책을 통한 선제적 대응 가능성을 열어두었다. 이는 기존의 신중한 태도에서 다소 매파적으로 기울어진 것으로, 시장은 연내 추가 금리 인상 시기가 앞당겨질 수 있다고 전망한다.</p>
      <p>외환시장에서는 당국의 구두 개입에도 불구하고 달러 대비 엔화 약세가 좀처럼 진정되지 않는 모습이다. 물가 상방 리스크가 구체화될 경우, BOJ의 정책 정상화 속도 역시 한층 가팔라질 수 있어 글로벌 자금 흐름에도 적잖은 파장이 예상된다.</p>
    `
  },
  {
    slug: '2026-04-02-us-rate-cut-delay',
    category: 'stock',
    title: '연준 인하 기대 후퇴 속 미 증시 변동성 확대…성장주 밸류에이션 부담',
    publishedAt: '2026-04-02',
    summary: '미국 견조한 고용과 물가 지표로 인해 연준의 금리 인하 기대 시점이 뒤로 밀리며, 기술주 중심의 차익 실현 매물이 출회하고 증시 변동성이 커졌다.',
    content: `
      <p>최근 발표된 미국의 주요 경제 지표들이 예상보다 강한 호조를 보이면서, 연방준비제도(Fed)의 조기 금리 인하 기대감이 빠르게 식어가고 있다. 탄탄한 고용 시장과 좀처럼 꺾이지 않는 서비스 물가가 통화 완화의 걸림돌로 작용하는 형국이다.</p>
      <p>시장의 금리 인하 전망 시점이 하반기로 늦춰지면서 미국 국채 금리는 다시 오름세를 보였다. 이는 그간 증시 상승을 주도했던 대형 기술주와 성장주에 직접적인 밸류에이션 부담으로 작용하며, 지수 전반의 변동성을 키우는 요인이 되고 있다.</p>
      <p>월가 전문가들은 당분간 매크로 지표 확인 심리가 짙어지며 섹터별 순환매가 빠르게 일어날 것으로 내다봤다. 특히 고금리 장기화 환경에서 실적 방어력이 입증된 필수소비재나 금융 등 방어주 성격의 업종으로 자산 배분을 재조정하는 움직임이 뚜렷해지고 있다.</p>
    `
  },
  {
    slug: '2026-04-02-oil-price-impact',
    category: 'money',
    title: '국제 유가 불안에 국내 기름값 오름세…생활 물가 체감 부담 가중',
    publishedAt: '2026-04-02',
    summary: '지정학적 리스크로 국제 유가가 상승세를 타면서 국내 주유소 기름값도 연일 오르고 있다. 유류세 인하 조치 연장 여부에 관심이 쏠리는 가운데 가계의 체감 물가 부담이 커지고 있다.',
    content: `
      <p>중동 지역의 지정학적 긴장이 고조되면서 국제 유가의 변동성이 다시 커지고 있다. 주요 산유국들의 감산 기조가 유지되는 가운데, 수급 불안 우려가 더해지며 브렌트유 등 주요 벤치마크 유가가 상승 압력을 받는 모습이다.</p>
      <p>국제 유가 오름세는 시차를 두고 국내 석유류 가격에 반영되며, 최근 전국 주유소의 휘발유와 경유 판매 가격도 뚜렷한 상승 곡선을 그리고 있다. 교통비와 난방비 등 직접적인 에너지 비용 증가는 물론, 전반적인 물가 수준을 끌어올려 가계의 실질 구매력을 위축시킬 수 있다는 우려가 나온다.</p>
      <p>정부는 서민 물가 안정을 위해 이달 말 종료 예정인 유류세 인하 조치의 연장 여부를 신중하게 검토 중이다. 세수 부족 상황과 물가 통제 사이에서 정책 당국의 고민이 깊어지는 가운데, 소비자들은 한 푼이라도 저렴한 주유소를 찾는 등 생활비 방어에 안간힘을 쓰고 있다.</p>
    `
  }
];

const template = (article) => `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${article.title} | gorics.cloud News</title>
  <meta name="description" content="${article.summary}" />
  <link rel="stylesheet" href="/news/styles.css" />
</head>
<body>
  <header class="site-header">
    <div class="container">
      <a class="brand" href="/news/">gorics.cloud News</a>
      <nav class="nav">
        <a href="/">Home</a>
        <a href="/news/">News</a>
      </nav>
    </div>
  </header>

  <main class="article-shell">
    <a class="back-link" href="/news/${article.category}/">← ${article.category} 섹션으로</a>
    <span class="meta-chip">${article.category.toUpperCase()}</span>
    <h1 class="article-title">${article.title}</h1>
    <div class="article-meta">
      <span>발행일: ${article.publishedAt}</span>
    </div>
    <p class="article-summary">${article.summary}</p>

    <section class="article-content">
      ${article.content}
    </section>
  </main>

  <footer class="site-footer">
    <div class="container footer-inner">
      <p>© 2026 gorics.cloud</p>
    </div>
  </footer>
</body>
</html>`;

articles.forEach(article => {
  const dir = path.join(__dirname, 'news', 'articles', article.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), template(article));
  console.log('Created article:', article.slug);
});
