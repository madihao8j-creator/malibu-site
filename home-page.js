/* =========================================================
   MALIBU — Homepage topic cards renderer
   ========================================================= */

const ICON_LEAF = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20c8 0 14-6 16-16C10 4 4 10 4 20Z"/><path d="M4 20c4-4 8-7 16-16"/></svg>`;
const ICON_ARROW = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 5l-7 7 7 7"/></svg>`;
const ICON_CHEVRON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>`;

function topicCardHTML(topic){
  return `
  <a class="topic-card" href="topic.html?id=${topic.id}" style="--tc1:${topic.colors[0]}; --tc2:${topic.colors[1]};">
    <div class="topic-card-media"></div>
    <div class="topic-card-body">
      <div class="topic-card-icon">${ICON_LEAF}</div>
      <div class="topic-card-title">${topic.nameEn}</div>
      <p class="topic-card-desc">${topic.intro.slice(0, 58)}...</p>
      <span class="topic-card-arrow">${ICON_ARROW}</span>
    </div>
  </a>`;
}

document.addEventListener('DOMContentLoaded', () => {
  const primaryEl = document.getElementById('topics-primary');
  const extraEl = document.getElementById('topics-extra');
  if(!primaryEl || !extraEl) return;

  const primary = TOPICS.slice(0, 3);
  const extra = TOPICS.slice(3);

  primaryEl.innerHTML = primary.map(topicCardHTML).join('');
  extraEl.innerHTML = extra.map(topicCardHTML).join('');

  initScrollReveal('#topics-primary .topic-card', 'reveal');

  const moreBtn = document.getElementById('more-toggle');
  moreBtn.innerHTML = `<span class="more-label">بیشتر</span>${ICON_CHEVRON}`;
});
