/* =========================================================
   MALIBU — Shared interactions
   Scroll reveal, "more" toggle, flip cards, toast helper
   ========================================================= */

// ---- Toast ----
function showToast(msg){
  let toast = document.getElementById('toast');
  if(!toast){
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 2600);
}

// ---- Scroll reveal ----
function initScrollReveal(selector, revealClass){
  const els = document.querySelectorAll(selector);
  if(!('IntersectionObserver' in window)){
    els.forEach(el => el.classList.add(revealClass));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add(revealClass);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach(el => io.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal('.reveal-el', 'reveal');
  initScrollReveal('.topic-card', 'reveal');

  // ---- Homepage "more" toggle ----
  const moreBtn = document.getElementById('more-toggle');
  const extra = document.getElementById('topics-extra');
  if(moreBtn && extra){
    moreBtn.addEventListener('click', () => {
      const isOpen = extra.classList.toggle('open');
      moreBtn.classList.toggle('open', isOpen);
      moreBtn.querySelector('.more-label').textContent = isOpen ? 'کمتر' : 'بیشتر';
      if(isOpen) initScrollReveal('#topics-extra .topic-card', 'reveal');
    });
  }

  // ---- Flip cards (question / answer) ----
  document.querySelectorAll('.qa-flip-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.qa-card');
      if(card) card.classList.toggle('flipped');
    });
  });
});
