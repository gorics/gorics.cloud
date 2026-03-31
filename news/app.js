function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[m]));
}

function categoryLabel(category = '') {
  const map = {
    financial: '금융',
    stock: '증시',
    money: '생활경제',
    social: '사회',
    education: '교육',
    csat: '수능'
  };

  return map[category] || category || '기타';
}

function renderArticleCard(article) {
  const tags = [article.category, article.publishedAt].filter(Boolean)
    .map((value) => `<span>${escapeHtml(value)}</span>`)
    .join('');

  return `
    <article class="article-card">
      <span class="meta-chip">${escapeHtml(article.category || 'News')}</span>
      <h3>${escapeHtml(article.title || '제목 없음')}</h3>
      <div class="card-meta">${tags}</div>
      <p class="article-summary">${escapeHtml(article.summary || '')}</p>
      <a class="read-more" href="${escapeHtml(article.path || '#')}">기사 보기 →</a>
    </article>
  `;
}

async function loadNews() {
  const grid = document.getElementById('newsGrid');
  const updatedAt = document.getElementById('updatedAt');

  try {
    const res = await fetch('/news/index.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load news index');

    const data = await res.json();
    const articles = Array.isArray(data.articles) ? data.articles : [];

    updatedAt.textContent = data.updatedAt
      ? `마지막 업데이트: ${data.updatedAt}`
      : '업데이트 정보 없음';

    if (!articles.length) {
      grid.innerHTML = '<div class="article-card empty-state">아직 등록된 뉴스가 없습니다.</div>';
      return;
    }

    const grouped = articles.reduce((acc, article) => {
      const key = article.category || 'etc';
      if (!acc[key]) acc[key] = [];
      acc[key].push(article);
      return acc;
    }, {});

    const categoryOrder = ['financial', 'stock', 'money', 'social', 'education', 'csat'];
    const orderedKeys = [
      ...categoryOrder.filter((category) => grouped[category]),
      ...Object.keys(grouped).filter((category) => !categoryOrder.includes(category))
    ];

    grid.innerHTML = orderedKeys.map((category) => `
      <section class="category-block">
        <div class="category-head">
          <p class="section-label">${escapeHtml(category)}</p>
          <h3>${escapeHtml(categoryLabel(category))} 섹터</h3>
        </div>
        <div class="news-grid sector-grid">
          ${grouped[category].map(renderArticleCard).join('')}
        </div>
      </section>
    `).join('');
  } catch (error) {
    console.error(error);
    grid.innerHTML = '<div class="article-card empty-state">뉴스 목록을 불러오지 못했습니다.</div>';
    updatedAt.textContent = 'JSON 로드 실패';
  }
}

loadNews();
