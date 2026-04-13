const topics = [
  {
    id: 'physical',
    title: '자연환경과 지형',
    summary: '한반도의 산지 지형, 하천, 해안, 카르스트, 화산 지형을 묶어서 보는 단원. 지형 형성과 인간 생활의 연결이 자주 출제된다.',
    keywords: ['동고서저', '태백산맥', '하천 상·중·하류', '리아스식 해안', '용암 동굴'],
    tips: [
      '동해안은 단조로운 해안선과 석호, 서·남해안은 갯벌과 복잡한 해안선으로 정리.',
      '제주도는 순상 화산, 울릉도는 종상 화산이라는 대비를 묶어 기억.',
      '카르스트 지형은 석회암 분포 지역과 연결해 본다.'
    ]
  },
  {
    id: 'climate',
    title: '기후와 주민 생활',
    summary: '계절풍, 강수 분포, 도시·농촌 기후 차이, 기후와 생활 방식이 핵심이다. 계절별 원인과 지역 차이를 같이 봐야 한다.',
    keywords: ['계절풍', '장마', '태풍', '대륙성 기후', '해양성 기후'],
    tips: [
      '여름 강수 집중 원인은 북태평양 기단과 오호츠크해 기단의 만남으로 정리.',
      '영동·영서의 차이는 푄 현상과 지형 효과로 설명.',
      '겨울 서해안 폭설은 북서 계절풍 + 해기차로 연결.'
    ]
  },
  {
    id: 'population',
    title: '인구와 도시',
    summary: '인구 이동, 대도시권 확대, 도시 내부 구조와 기능 분화가 중심. 수도권 집중과 지방 소멸 이슈를 연결하면 좋다.',
    keywords: ['수도권 집중', '교외화', '재도시화', '도시 기능 분화', '고령화'],
    tips: [
      '도심 공동화 → 교외화 → 재도시화 흐름을 시간 순으로 암기.',
      '세종시는 행정 기능 분산 사례, 혁신도시는 공공기관 이전 사례로 구분.',
      '인구 피라미드는 고령화·저출산 해석과 같이 본다.'
    ]
  },
  {
    id: 'industry',
    title: '산업과 교통',
    summary: '공업 지역 변화, 첨단 산업 입지, 물류·교통망 발달을 보는 단원. 입지 요인을 문제에 맞게 골라 쓰는 훈련이 중요하다.',
    keywords: ['입지 요인', '수출 산업', '첨단 산업', '고속철도', '항만'],
    tips: [
      '전통 공업 지역과 첨단 산업 지역을 구분해서 기억.',
      '항만은 배후 산업과 수출입 구조를 같이 본다.',
      '교통 발달은 생활권 확대와 지역 구조 변화까지 연결.'
    ]
  },
  {
    id: 'region',
    title: '지역 이해와 국토 통일',
    summary: '북부·중부·남부 지방, 제주, 수도권 등 권역별 특징을 비교하고 국토 통일의 의미를 묻는 단원.',
    keywords: ['관북·관서', '영남·호남', '수도권', '제주', '국토 통일'],
    tips: [
      '지역 구분 기준을 자연·인문 모두로 본다.',
      '각 권역의 대표 산업, 도시, 지형을 묶어서 외운다.',
      '통일은 교통망 연결과 자원·시장 확대 측면으로 정리.'
    ]
  }
];

const comparePoints = [
  { title: '영동 vs 영서', text: '영동은 겨울 강수와 대설, 영서는 분지와 큰 일교차가 포인트.' },
  { title: '서해안 vs 동해안', text: '서해안은 조차 큼·갯벌 발달, 동해안은 수심 깊고 해안선 단조.' },
  { title: '수도권 vs 비수도권', text: '산업·인구·서비스 기능 집중 여부와 지역 격차 문제를 같이 본다.' },
  { title: '제주도 vs 울릉도', text: '화산 지형 공통점은 있지만 화산체 형태와 지형 요소 차이를 구분.' }
];

const quizBank = [
  {
    q: '겨울철 북서 계절풍의 영향을 크게 받아 폭설이 자주 내리는 지역으로 가장 적절한 것은?',
    options: ['동해안', '남해안', '서해안', '내륙 분지'],
    answer: 2,
    explain: '서해안은 해기차로 인해 겨울철 눈구름대가 잘 발달한다.'
  },
  {
    q: '다음 중 수도권 집중 완화를 위한 정책 사례로 가장 적절한 것은?',
    options: ['석호 보전', '혁신도시 조성', '간척 사업', '댐 건설'],
    answer: 1,
    explain: '혁신도시는 공공기관 이전을 통해 지역 균형 발전을 노린 사례다.'
  },
  {
    q: '제주도의 대표적인 화산 지형 요소로 옳은 것은?',
    options: ['우각호', '오름', '카르스트', '삼각주'],
    answer: 1,
    explain: '제주도는 측화산인 오름과 용암 동굴이 대표적이다.'
  },
  {
    q: '공업 입지 요인 중 첨단 산업에서 상대적으로 중요성이 큰 것은?',
    options: ['풍부한 지하 자원', '저렴한 원료', '연구 인력과 정보 접근성', '대규모 목초지'],
    answer: 2,
    explain: '첨단 산업은 연구 개발 인력과 정보 접근성이 핵심 입지 요인이다.'
  },
  {
    q: '도심 공동화 이후 나타나는 일반적인 현상으로 옳은 것은?',
    options: ['교외 인구 감소', '재도시화 이전의 교외화', '산지 지형 발달', '어촌 인구 급증'],
    answer: 1,
    explain: '도심 공동화 뒤에는 주거 기능이 교외로 이동하는 교외화가 흔하다.'
  },
  {
    q: '동해안의 해안 지형 특징으로 옳은 것은?',
    options: ['조차가 매우 크다', '리아스식 해안이 넓다', '해안선이 비교적 단조롭다', '갯벌이 매우 넓다'],
    answer: 2,
    explain: '동해안은 수심이 깊고 해안선이 비교적 단조로운 편이다.'
  }
];

const memoryItems = [
  ['서해안', '조차 큼, 갯벌 발달, 겨울 폭설'],
  ['동해안', '해안선 단조, 석호 분포, 수심 깊음'],
  ['남해안', '리아스식 해안, 다도해'],
  ['제주', '순상 화산, 오름, 감귤'],
  ['울릉도', '종상 화산, 오징어, 관광'],
  ['수도권', '인구·산업·서비스 집중'],
  ['충청권', '행정 기능 분산, 교통 결절'],
  ['호남권', '평야 농업, 서해안 산업 축']
];

const els = {
  topicSelect: document.getElementById('topicSelect'),
  topicCard: document.getElementById('topicCard'),
  compareList: document.getElementById('compareList'),
  quizBox: document.getElementById('quizBox'),
  nextBtn: document.getElementById('nextBtn'),
  resetBtn: document.getElementById('resetBtn'),
  wrongNote: document.getElementById('wrongNote'),
  memoryChecklist: document.getElementById('memoryChecklist'),
  scoreText: document.getElementById('scoreText'),
  streakText: document.getElementById('streakText')
};

const state = {
  topicId: topics[0].id,
  quizIndex: 0,
  score: 0,
  streak: 0,
  answered: false,
  wrongNotes: JSON.parse(localStorage.getItem('krgeo-wrong-notes') || '[]')
};

function renderTopics() {
  els.topicSelect.innerHTML = topics.map(topic => `<option value="${topic.id}">${topic.title}</option>`).join('');
  els.topicSelect.value = state.topicId;
  drawTopicCard();
}

function drawTopicCard() {
  const topic = topics.find(t => t.id === state.topicId);
  els.topicCard.innerHTML = `
    <h3>${topic.title}</h3>
    <p>${topic.summary}</p>
    <div class="chip-row">${topic.keywords.map(keyword => `<span class="chip">${keyword}</span>`).join('')}</div>
    <div class="point-list">${topic.tips.map(tip => `<div class="compare-card"><p>${tip}</p></div>`).join('')}</div>
  `;
}

function renderCompare() {
  els.compareList.innerHTML = comparePoints.map(item => `
    <div class="compare-card">
      <h4>${item.title}</h4>
      <p>${item.text}</p>
    </div>
  `).join('');
}

function renderMemory() {
  els.memoryChecklist.innerHTML = memoryItems.map(([title, text]) => `
    <div class="memory-item">
      <h4>${title}</h4>
      <p>${text}</p>
    </div>
  `).join('');
}

function persistWrongNotes() {
  localStorage.setItem('krgeo-wrong-notes', JSON.stringify(state.wrongNotes));
}

function renderWrongNotes() {
  if (!state.wrongNotes.length) {
    els.wrongNote.innerHTML = '<div class="wrong-item"><p>아직 저장된 오답이 없다. 틀린 문제는 자동으로 여기에 쌓인다.</p></div>';
    return;
  }
  els.wrongNote.innerHTML = state.wrongNotes.slice(-6).reverse().map(item => `
    <div class="wrong-item">
      <h4>${item.q}</h4>
      <p>정답: ${item.answerText}</p>
      <p>해설: ${item.explain}</p>
    </div>
  `).join('');
}

function updateScore() {
  els.scoreText.textContent = `점수 ${state.score}`;
  els.streakText.textContent = `연속 정답 ${state.streak}`;
}

function currentQuiz() {
  return quizBank[state.quizIndex % quizBank.length];
}

function renderQuiz() {
  const quiz = currentQuiz();
  state.answered = false;
  els.quizBox.innerHTML = `
    <div class="quiz-question">
      <h3>${quiz.q}</h3>
      <p>개념을 떠올리고 가장 정확한 선택지를 고르면 된다.</p>
    </div>
    <div class="quiz-options">
      ${quiz.options.map((option, index) => `<button class="quiz-option" data-index="${index}">${index + 1}. ${option}</button>`).join('')}
    </div>
    <div id="feedback"></div>
  `;

  els.quizBox.querySelectorAll('.quiz-option').forEach(button => {
    button.addEventListener('click', () => answerQuiz(Number(button.dataset.index)));
  });
}

function answerQuiz(selected) {
  if (state.answered) return;
  state.answered = true;
  const quiz = currentQuiz();
  const buttons = [...els.quizBox.querySelectorAll('.quiz-option')];
  const feedback = document.getElementById('feedback');

  buttons.forEach((btn, index) => {
    if (index === quiz.answer) btn.classList.add('correct');
    if (index === selected && selected !== quiz.answer) btn.classList.add('wrong');
    btn.disabled = true;
  });

  if (selected === quiz.answer) {
    state.score += 10;
    state.streak += 1;
    feedback.innerHTML = `<div class="compare-card"><h4>정답</h4><p>${quiz.explain}</p></div>`;
  } else {
    state.streak = 0;
    state.wrongNotes.push({
      q: quiz.q,
      answerText: quiz.options[quiz.answer],
      explain: quiz.explain
    });
    persistWrongNotes();
    renderWrongNotes();
    feedback.innerHTML = `<div class="compare-card"><h4>오답</h4><p>정답은 <strong>${quiz.options[quiz.answer]}</strong>. ${quiz.explain}</p></div>`;
  }
  updateScore();
}

els.topicSelect.addEventListener('change', (e) => {
  state.topicId = e.target.value;
  drawTopicCard();
});

els.nextBtn.addEventListener('click', () => {
  state.quizIndex += 1;
  renderQuiz();
});

els.resetBtn.addEventListener('click', () => {
  state.score = 0;
  state.streak = 0;
  state.wrongNotes = [];
  persistWrongNotes();
  updateScore();
  renderWrongNotes();
  renderQuiz();
});

renderTopics();
renderCompare();
renderMemory();
renderWrongNotes();
updateScore();
renderQuiz();
