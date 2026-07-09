/* =========================================================
   MALIBU — Shared Header & Footer
   Injected into every page via #site-header-mount / #site-footer-mount
   ========================================================= */

(function(){

  const ICONS = {
    mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-11Z"/><path d="m4 6 8 6.5L20 6"/></svg>`,
    search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>`,
    close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>`
  };

  function headerTemplate(active){
    const navItem = (key, label, href) => `<a class="nav-pill${active===key?' active':''}" href="${href}">${label}</a>`;
    return `
    <header id="site-header">
      <div class="header-inner">
        <a href="index.html" class="brand">
          <span class="brand-name">malibu</span>
          <span class="brand-sub">glow up</span>
        </a>
        <nav class="header-nav">
          ${navItem('home','خانه','index.html')}
          ${navItem('comments','نظرات','comments.html')}
          ${navItem('about','درباره ما','about.html')}
        </nav>
        <div class="header-icons">
          <button class="icon-btn" id="btn-mail" title="ارتباط با ما" aria-label="ایمیل">${ICONS.mail}</button>
          <button class="icon-btn" id="btn-search" title="جستجو" aria-label="جستجو">${ICONS.search}</button>
        </div>
      </div>
    </header>

    <div id="search-overlay">
      <button class="search-close" id="search-close">${ICONS.close}</button>
      <div class="search-box">
        <input type="text" id="search-input" placeholder="دنبال چه موضوعی می‌گردی؟ (مثلاً تغذیه، پوست...)" autocomplete="off">
        <div class="search-results" id="search-results"></div>
      </div>
    </div>
    `;
  }

  function footerTemplate(){
    return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-bottom">
          <span>© 2026 Malibu Glow Up. تمامی حقوق محفوظ است.</span>
          <a href="#">حریم خصوصی</a>
          <a href="#">قوانین استفاده</a>
          <a href="#" id="footer-contact">تماس با ما</a>
        </div>
      </div>
    </footer>
    `;
  }

  function mount(){
    const headerMount = document.getElementById('site-header-mount');
    const footerMount = document.getElementById('site-footer-mount');
    const active = document.body.getAttribute('data-active-nav') || '';
    if(headerMount) headerMount.innerHTML = headerTemplate(active);
    if(footerMount) footerMount.innerHTML = footerTemplate();

    // sticky shadow on scroll
    const header = document.getElementById('site-header');
    if(header){
      const onScroll = () => {
        if(window.scrollY > 12) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
      };
      window.addEventListener('scroll', onScroll, {passive:true});
      onScroll();
    }

    // mail icon -> opens default mail client (mailto). Replace ADDRESS with the real inbox.
    const mailBtn = document.getElementById('btn-mail');
    const CONTACT_EMAIL = 'hello@malibuglowup.com'; // TODO: replace with the channel owner's real email
    if(mailBtn){
      mailBtn.addEventListener('click', () => {
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('پیام از سایت مالیبو')}`;
      });
    }
    const footerContact = document.getElementById('footer-contact');
    if(footerContact){
      footerContact.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `mailto:${CONTACT_EMAIL}`;
      });
    }

    // search overlay
    const searchBtn = document.getElementById('btn-search');
    const overlay = document.getElementById('search-overlay');
    const closeBtn = document.getElementById('search-close');
    const input = document.getElementById('search-input');
    const results = document.getElementById('search-results');

    function openSearch(){
      overlay.classList.add('open');
      setTimeout(() => input.focus(), 150);
    }
    function closeSearch(){
      overlay.classList.remove('open');
      input.value='';
      results.innerHTML='';
    }
    if(searchBtn) searchBtn.addEventListener('click', openSearch);
    if(closeBtn) closeBtn.addEventListener('click', closeSearch);
    if(overlay) overlay.addEventListener('click', (e) => { if(e.target === overlay) closeSearch(); });
    document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeSearch(); });

    if(input){
      input.addEventListener('input', () => {
        const q = input.value.trim();
        results.innerHTML = '';
        if(!q || typeof TOPICS === 'undefined') return;
        const matches = TOPICS.filter(t =>
          t.nameFa.includes(q) || t.nameEn.toLowerCase().includes(q.toLowerCase())
        );
        if(matches.length === 0){
          results.innerHTML = `<div class="search-result-item">نتیجه‌ای پیدا نشد</div>`;
          return;
        }
        matches.forEach(t => {
          const a = document.createElement('a');
          a.href = `topic.html?id=${t.id}`;
          a.className = 'search-result-item';
          a.style.display='block';
          a.textContent = `${t.nameFa} — ${t.nameEn}`;
          results.appendChild(a);
        });
      });
    }
  }

  document.addEventListener('DOMContentLoaded', mount);
})();
