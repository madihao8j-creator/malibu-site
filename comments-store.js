/* =========================================================
   MALIBU — Comments storage adapter (GitHub Issues backend)
   -----------------------------------------------------------
   Every comment is a GitHub Issue in GITHUB_OWNER/GITHUB_REPO.
   Reading is public; writing/liking/replying uses the token
   from github-config.js. This makes comments genuinely shared
   across every visitor, with no server of your own needed.
   ========================================================= */

const CommentsStore = (function(){
  const ADMIN_KEY = 'malibu_admin_session';
  // TODO: change this before sharing the site with anyone.
  const ADMIN_PASSWORD = 'malibu2026';

  const API_BASE = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`;
  const headers = {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github+json'
  };

  const palettes = [
    ['#eaf4fa','#6f9db8','#2c5170'],
    ['#f3e3ec','#c69bb0','#5c2c40'],
    ['#ece5f3','#a98fc9','#3a2c5c'],
    ['#dfece9','#7fa3a1','#2c4a48']
  ];

  function timeAgo(iso){
    const diffMs = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diffMs / 60000);
    if(mins < 1) return 'همین الان';
    if(mins < 60) return mins + ' دقیقه پیش';
    const hours = Math.floor(mins / 60);
    if(hours < 24) return hours + ' ساعت پیش';
    const days = Math.floor(hours / 24);
    if(days < 30) return days + ' روز پیش';
    return Math.floor(days / 30) + ' ماه پیش';
  }

  function parseIssue(issue){
    let data = {};
    try { data = JSON.parse(issue.body || '{}'); } catch(e){ data = {}; }
    return {
      id: issue.number,
      name: data.name || 'کاربر مهمان',
      avatar: data.avatar || ['#eaf4fa','#6f9db8','#2c5170'],
      stars: data.stars || 5,
      text: data.text || '',
      likes: data.likes || 0,
      adminReply: data.adminReply || null,
      time: timeAgo(issue.created_at)
    };
  }

  async function getIssueRaw(id){
    const res = await fetch(`${API_BASE}/issues/${id}`, { headers });
    if(!res.ok) throw new Error('GitHub API error: ' + res.status);
    return await res.json();
  }

  async function patchIssueBody(id, data){
    const res = await fetch(`${API_BASE}/issues/${id}`, {
      method: 'PATCH',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: JSON.stringify(data) })
    });
    if(!res.ok) throw new Error('GitHub API error: ' + res.status);
    return await res.json();
  }

  return {
    async getAll(){
      const res = await fetch(`${API_BASE}/issues?state=open&sort=created&direction=desc&per_page=50`, { headers });
      if(!res.ok) throw new Error('GitHub API error: ' + res.status);
      const issues = await res.json();
      return issues.filter(i => !i.pull_request).map(parseIssue);
    },

    async add({ name, text, stars }){
      const data = {
        name: name && name.trim() ? name.trim() : 'کاربر مهمان',
        avatar: palettes[Math.floor(Math.random() * palettes.length)],
        stars: stars || 5,
        text: (text || '').trim(),
        likes: 0,
        adminReply: null
      };
      const res = await fetch(`${API_BASE}/issues`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'نظر جدید', body: JSON.stringify(data) })
      });
      if(!res.ok) throw new Error('ثبت نظر ناموفق بود (کد ' + res.status + ')');
      const created = await res.json();
      return parseIssue(created);
    },

    async toggleLike(id){
      const likedKey = 'malibu_liked_' + id;
      const already = localStorage.getItem(likedKey) === '1';
      const issue = await getIssueRaw(id);
      let data = {};
      try { data = JSON.parse(issue.body || '{}'); } catch(e){}
      data.likes = (data.likes || 0) + (already ? -1 : 1);
      const updated = await patchIssueBody(id, data);
      localStorage.setItem(likedKey, already ? '0' : '1');
      return parseIssue(updated);
    },

    isLiked(id){
      return localStorage.getItem('malibu_liked_' + id) === '1';
    },

    async reply(id, replyText){
      const issue = await getIssueRaw(id);
      let data = {};
      try { data = JSON.parse(issue.body || '{}'); } catch(e){}
      data.adminReply = (replyText || '').trim();
      const updated = await patchIssueBody(id, data);
      return parseIssue(updated);
    },

    isAdmin(){
      return sessionStorage.getItem(ADMIN_KEY) === '1';
    },
    loginAdmin(password){
      if(password === ADMIN_PASSWORD){
        sessionStorage.setItem(ADMIN_KEY, '1');
        return true;
      }
      return false;
    },
    logoutAdmin(){
      sessionStorage.removeItem(ADMIN_KEY);
    }
  };
})();
