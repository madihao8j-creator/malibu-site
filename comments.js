/* =========================================================
   MALIBU — Comments page logic (async, GitHub-backed)
   ========================================================= */

const ICON_STAR = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 6.16 6.8.66-5.14 4.6 1.53 6.68L12 17.06l-6.09 3.54 1.53-6.68-5.14-4.6 6.8-.66L12 2.5z"/></svg>`;
const ICON_HEART = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12.1 20.5S3 15 3 8.9C3 5.9 5.3 4 7.9 4c1.7 0 3.3.9 4.2 2.4C13 4.9 14.6 4 16.3 4 18.9 4 21.1 5.9 21.1 8.9c0 6.1-9 11.6-9 11.6Z"/></svg>`;
const ICON_REPLY = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 10H5a2 2 0 0 0-2 2v7l4-3h9a2 2 0 0 0 2-2v-2M13 3l6 6-6 6"/></svg>`;
const ICON_ADMIN = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2 3 6v6c0 5 3.8 8.7 9 10 5.2-1.3 9-5 9-10V6l-9-4Z"/><path d="m9 12 2 2 4-4"/></svg>`;

let currentAskStars = 5;
let visibleCount = 4;
let allComments = [];

function renderReviewStars(n){
  let html = '';
  for(let i=1;i<=5;i++){
    html += `<span class="${i<=n?'filled':''}">${ICON_STAR}</span>`;
  }
  return html;
}

function escapeHtml(str){
  const d = document.createElement('div');
  d.textContent = str || '';
  return d.innerHTML;
}

function renderReview(item){
  const [a1,a2,a3] = item.avatar || ['#eaf4fa','#6f9db8','#2c5170'];
  const isAdmin = CommentsStore.isAdmin();
  const liked = CommentsStore.isLiked(item.id);
  return `
  <div class="review-card reveal-el" data-id="${item.id}">
    <div class="review-body">
      <p>${escapeHtml(item.text)}</p>
      <div class="review-actions">
        <button class="like-btn ${liked?'liked':''}" data-action="like" data-id="${item.id}">${ICON_HEART}<span>${item.likes}</span></button>
        ${isAdmin ? `<button class="admin-reply-btn" data-action="toggle-reply" data-id="${item.id}">${ICON_REPLY}<span>پاسخ ادمین</span></button>` : `<span class="admin-reply-btn" style="opacity:.55; cursor:default;">${ICON_REPLY}<span>پاسخ ادمین</span></span>`}
      </div>
      ${item.adminReply ? `<div class="admin-reply-box"><b>پاسخ ادمین:</b> ${escapeHtml(item.adminReply)}</div>` : ''}
      ${isAdmin ? `
      <div class="admin-reply-form" id="reply-form-${item.id}" style="display:none;">
        <input type="text" placeholder="پاسخ ادمین را بنویسید..." id="reply-input-${item.id}">
        <button class="btn btn-primary" data-action="submit-reply" data-id="${item.id}" style="padding:8px 18px;">ارسال</button>
      </div>` : ''}
    </div>
    <div class="review-side">
      <div class="review-avatar" style="--av:${a2}; --av2:${a3};"></div>
      <div class="review-name">${escapeHtml(item.name)}</div>
      <div class="review-time">${escapeHtml(item.time)}</div>
      <div class="review-stars">${renderReviewStars(item.stars)}</div>
    </div>
  </div>`;
}

function renderListFromCache(){
  const container = document.getElementById('reviews-list');
  const slice = allComments.slice(0, visibleCount);
  container.innerHTML = slice.map(renderReview).join('');
  initScrollReveal('#reviews-list .reveal-el', 'reveal');
  const loadMoreWrap = document.getElementById('load-more-wrap');
  loadMoreWrap.style.display = allComments.length > visibleCount ? 'block' : 'none';
}

async function loadComments(showLoadingToast){
  const container = document.getElementById('reviews-list');
  if(showLoadingToast) container.innerHTML = '<p style="text-align:center;color:var(--muted);padding:30px 0;">در حال بارگذاری نظرات...</p>';
  try{
    allComments = await CommentsStore.getAll();
    renderListFromCache();
  }catch(err){
    console.error(err);
    container.innerHTML = '<p style="text-align:center;color:var(--muted);padding:30px 0;">نظرات لود نشدند. اتصال اینترنت یا توکن گیت‌هاب را چک کنید.</p>';
  }
}

function updateAdminUI(){
  const fab = document.getElementById('admin-fab');
  const isAdmin = CommentsStore.isAdmin();
  fab.classList.toggle('active', isAdmin);
  fab.title = isAdmin ? 'خروج از حالت ادمین' : 'ورود ادمین';
}

document.addEventListener('DOMContentLoaded', () => {
  const picker = document.getElementById('ask-star-picker');
  function drawPicker(){
    picker.innerHTML = '';
    for(let i=1;i<=5;i++){
      const span = document.createElement('span');
      span.innerHTML = ICON_STAR;
      if(i <= currentAskStars) span.classList.add('active');
      span.addEventListener('click', () => { currentAskStars = i; drawPicker(); });
      picker.appendChild(span);
    }
  }
  drawPicker();
  updateAdminUI();
  loadComments(true);

  document.getElementById('ask-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('ask-name').value;
    const text = document.getElementById('ask-text').value;
    if(!text.trim()){
      showToast('لطفاً متن نظر یا سوالت رو بنویس');
      return;
    }
    const submitBtn = e.target.querySelector('button[type=submit]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'در حال ارسال...';
    try{
      const newComment = await CommentsStore.add({ name, text, stars: currentAskStars });
      document.getElementById('ask-name').value = '';
      document.getElementById('ask-text').value = '';
      currentAskStars = 5;
      drawPicker();
      visibleCount = Math.max(visibleCount, 4);
      allComments.unshift(newComment);
      renderListFromCache();
      showToast('نظر شما با موفقیت ثبت شد ✨');
    }catch(err){
      console.error(err);
      showToast('ثبت نظر ناموفق بود، دوباره امتحان کن');
    }finally{
      submitBtn.disabled = false;
      submitBtn.textContent = 'ارسال نظر';
    }
  });

  document.getElementById('load-more-wrap').addEventListener('click', (e) => {
    if(e.target.closest('#load-more-btn')){
      visibleCount += 4;
      renderListFromCache();
    }
  });

  document.getElementById('reviews-list').addEventListener('click', async (e) => {
    const likeBtn = e.target.closest('[data-action="like"]');
    if(likeBtn){
      likeBtn.disabled = true;
      try{
        const updated = await CommentsStore.toggleLike(likeBtn.dataset.id);
        const idx = allComments.findIndex(c => String(c.id) === String(updated.id));
        if(idx !== -1) allComments[idx] = updated;
        renderListFromCache();
      }catch(err){ showToast('لایک ناموفق بود'); likeBtn.disabled = false; }
      return;
    }
    const toggleReply = e.target.closest('[data-action="toggle-reply"]');
    if(toggleReply){
      const form = document.getElementById('reply-form-' + toggleReply.dataset.id);
      if(form) form.style.display = form.style.display === 'none' ? 'flex' : 'none';
      return;
    }
    const submitReply = e.target.closest('[data-action="submit-reply"]');
    if(submitReply){
      const id = submitReply.dataset.id;
      const input = document.getElementById('reply-input-' + id);
      if(input && input.value.trim()){
        submitReply.disabled = true;
        try{
          const updated = await CommentsStore.reply(id, input.value);
          const idx = allComments.findIndex(c => String(c.id) === String(updated.id));
          if(idx !== -1) allComments[idx] = updated;
          renderListFromCache();
          showToast('پاسخ ادمین ثبت شد');
        }catch(err){ showToast('ثبت پاسخ ناموفق بود'); submitReply.disabled = false; }
      }
      return;
    }
  });

  const fab = document.getElementById('admin-fab');
  fab.innerHTML = ICON_ADMIN;
  fab.addEventListener('click', () => {
    if(CommentsStore.isAdmin()){
      CommentsStore.logoutAdmin();
      updateAdminUI();
      renderListFromCache();
      showToast('از حالت ادمین خارج شدید');
      return;
    }
    const pass = prompt('رمز ورود ادمین را وارد کنید:');
    if(pass === null) return;
    if(CommentsStore.loginAdmin(pass)){
      updateAdminUI();
      renderListFromCache();
      showToast('ورود موفق — حالا می‌توانید به نظرات پاسخ دهید');
    }else{
      showToast('رمز اشتباه است');
    }
  });
});
