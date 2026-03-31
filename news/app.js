function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[m]));
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

    grid.innerHTML = articles.map((article) => {
      const tags = [article.category, article.publishedAt].filter(Boolean)
        .map(value => `<span>${escapeHtml(value)}</span>`)
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
    }).join('');
  } catch (error) {
    console.error(error);
    grid.innerHTML = '<div class="article-card empty-state">뉴스 목록을 불러오지 못했습니다.</div>';
    updatedAt.textContent = 'JSON 로드 실패';
  }
}

loadNews();