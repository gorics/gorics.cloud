const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'news', 'index.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const newArticles = [
  {
    title: 'BOJ, 엔화 약세와 임금 인상발 인플레 압력 주시…금리 경로 조정 가능성',
    slug: '2026-04-02-boj-inflation-outlook',
    path: '/news/articles/2026-04-02-boj-inflation-outlook/',
    category: 'financial',
    publishedAt: '2026-04-02',
    summary: '일본은행(BOJ)이 춘투발 임금 인상과 지속적인 엔화 약세가 물가 상방 압력으로 작용할 가능성을 경고하며 추가 금리 인상 시점을 저울질하고 있다.'
  },
  {
    title: '연준 인하 기대 후퇴 속 미 증시 변동성 확대…성장주 밸류에이션 부담',
    slug: '2026-04-02-us-rate-cut-delay',
    path: '/news/articles/2026-04-02-us-rate-cut-delay/',
    category: 'stock',
    publishedAt: '2026-04-02',
    summary: '미국 견조한 고용과 물가 지표로 인해 연준의 금리 인하 기대 시점이 뒤로 밀리며, 기술주 중심의 차익 실현 매물이 출회하고 증시 변동성이 커졌다.'
  },
  {
    title: '국제 유가 불안에 국내 기름값 오름세…생활 물가 체감 부담 가중',
    slug: '2026-04-02-oil-price-impact',
    path: '/news/articles/2026-04-02-oil-price-impact/',
    category: 'money',
    publishedAt: '2026-04-02',
    summary: '지정학적 리스크로 국제 유가가 상승세를 타면서 국내 주유소 기름값도 연일 오르고 있다. 유류세 인하 조치 연장 여부에 관심이 쏠리는 가운데 가계의 체감 물가 부담이 커지고 있다.'
  }
];

data.articles = [...newArticles, ...data.articles];
data.updatedAt = '2026-04-02 18:30 KST';

fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
console.log('Updated news/index.json');
