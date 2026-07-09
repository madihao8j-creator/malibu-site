/* =========================================================
   MALIBU — Single topic page renderer
   Reads ?id=<topic-id> and builds the whole page from TOPICS
   ========================================================= */

const ICON_PLAY = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7L8 5z"/></svg>`;
const ICON_FLIP = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 5l-7 7 7 7"/></svg>`;
const ICON_BACK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 19l7-7-7-7"/></svg>`;

function getTopicIdFromUrl(){
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function renderTopicPage(){
  const id = getTopicIdFromUrl();
  const topic = TOPICS.find(t => t.id === id) || TOPICS[0];

  document.title = `${topic.nameFa} | Malibu Glow Up`;

  // Hero
  const hero = document.getElementById('topic-hero');
  hero.style.background = `linear-gradient(135deg, ${topic.colors[0]}, ${topic.colors[1]})`;
  document.getElementById('topic-eyebrow').textContent = topic.nameEn;

  // Video badge (only for video-type posts)
  const badgeWrap = document.getElementById('video-badge-wrap');
  if(topic.type === 'video'){
    badgeWrap.innerHTML = `
      <div class="video-badge">
        <a class="video-badge-btn" href="${topic.videoLink}" target="_blank" rel="noopener">
          <span class="play-circle">${ICON_PLAY}</span>
          <span>مشاهده ویدیوی آموزشی در تلگرام</span>
        </a>
      </div>`;
  } else {
    badgeWrap.innerHTML = '';
  }

  // Intro
  document.getElementById('topic-intro').textContent = topic.intro;

  // QA cards
  const qaGrid = document.getElementById('qa-grid');
  qaGrid.innerHTML = topic.questions.map((qa, i) => `
    <div class="qa-card reveal-el" style="transition-delay:${i*60}ms">
      <div class="qa-card-inner">
        <div class="qa-card-face qa-card-front">
          <p class="qa-card-question">${escapeHtmlLocal(qa.q)}</p>
          <button class="qa-flip-btn" title="نمایش پاسخ">${ICON_FLIP}</button>
        </div>
        <div class="qa-card-face qa-card-back">
          <p>${escapeHtmlLocal(qa.a)}</p>
          <button class="qa-flip-btn" title="بازگشت">${ICON_BACK}</button>
        </div>
      </div>
    </div>
  `).join('');

  // Summary
  document.getElementById('summary-title').textContent = 'جمع‌بندی';
  document.getElementById('summary-text').textContent = topic.summary;

  // Results
  document.getElementById('results-title').textContent = topic.resultsTitle;
  document.getElementById('results-desc').textContent = topic.resultsDesc;
  const resultsGrid = document.getElementById('results-grid');
  resultsGrid.innerHTML = topic.resultColors.map(([c1,c2]) =>
    `<div class="result-photo reveal-el" style="--rc1:${c1}; --rc2:${c2};"></div>`
  ).join('');

  // wire up flip buttons + reveal for freshly injected content
  document.querySelectorAll('.qa-flip-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.qa-card');
      if(card) card.classList.toggle('flipped');
    });
  });
  initScrollReveal('.reveal-el', 'reveal');
}

function escapeHtmlLocal(str){
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

document.addEventListener('DOMContentLoaded', renderTopicPage);
