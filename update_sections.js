const fs = require('fs');
const path = require('path');

function updateSection(filePath, category, newArticleHTML, updateTime) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Insert the new article HTML right after <section class="grid">
  content = content.replace(/<section class="grid">/, `<section class="grid">\n${newArticleHTML}`);

  // Update the updated time text
  content = content.replace(/마지막 업데이트: \d{4}-\d{2}-\d{2} \d{2}:\d{2} KST/g, `마지막 업데이트: ${updateTime}`);
  content = content.replace(/한국시간 기준 \d{4}-\d{2}-\d{2} \d{2}:\d{2} KST/g, `한국시간 기준 ${updateTime}`);

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${filePath}`);
}

const updateTime = '2026-04-02 18:30 KST';

const financialHTML = `      <article class="news-card">
        <div class="card-top">
          <span class="pill">FINANCIAL</span>
          <span class="meta-date">추가 시각 2026-04-02 18:30 KST</span>
        </div>
        <h2>BOJ, 엔화 약세와 임금 인상발 인플레 압력 주시…금리 경로 조정 가능성</h2>
        <p class="summary">일본은행(BOJ)이 춘투발 임금 인상과 지속적인 엔화 약세가 물가 상방 압력으로 작용할 가능성을 경고하며 추가 금리 인상 시점을 저울질하고 있다.</p>
        <dl class="meta-list">
          <div><dt>출처</dt><dd>자체 브리핑</dd></div>
          <div><dt>원문</dt><dd><a href="/news/articles/2026-04-02-boj-inflation-outlook/">기사 바로가기</a></dd></div>
          <div><dt>추가 시각</dt><dd>2026-04-02 18:30 KST</dd></div>
          <div><dt>카테고리</dt><dd>financial</dd></div>
        </dl>
      </article>`;

updateSection(path.join(__dirname, 'news', 'financial', 'index.html'), 'financial', financialHTML, updateTime);

const stockHTML = `      <article class="card">
        <span class="pill">STOCK</span>
        <h2>연준 인하 기대 후퇴 속 미 증시 변동성 확대…성장주 밸류에이션 부담</h2>
        <p class="sum">미국 견조한 고용과 물가 지표로 인해 연준의 금리 인하 기대 시점이 뒤로 밀리며, 기술주 중심의 차익 실현 매물이 출회하고 증시 변동성이 커졌다.</p>
        <div class="meta">
          <div><b>출처</b> 자체 브리핑</div>
          <div><b>원문</b> <a href="/news/articles/2026-04-02-us-rate-cut-delay/">기사 바로가기</a></div>
          <div><b>추가 시각</b> 2026-04-02 18:30 KST</div>
          <div><b>카테고리</b> stock</div>
        </div>
      </article>`;

updateSection(path.join(__dirname, 'news', 'stock', 'index.html'), 'stock', stockHTML, updateTime);

const moneyHTML = `      <article class="card">
        <span class="pill">MONEY</span>
        <h2>국제 유가 불안에 국내 기름값 오름세…생활 물가 체감 부담 가중</h2>
        <p class="sum">지정학적 리스크로 국제 유가가 상승세를 타면서 국내 주유소 기름값도 연일 오르고 있다. 유류세 인하 조치 연장 여부에 관심이 쏠리는 가운데 가계의 체감 물가 부담이 커지고 있다.</p>
        <div class="meta">
          <div><b>출처</b> 자체 브리핑</div>
          <div><b>원문</b> <a href="/news/articles/2026-04-02-oil-price-impact/">기사 바로가기</a></div>
          <div><b>추가 시각</b> 2026-04-02 18:30 KST</div>
          <div><b>카테고리</b> money</div>
        </div>
      </article>`;

updateSection(path.join(__dirname, 'news', 'money', 'index.html'), 'money', moneyHTML, updateTime);
