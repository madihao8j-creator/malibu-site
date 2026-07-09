     /* =========================================================
   MALIBU — Comments storage adapter
   -----------------------------------------------------------
   Everything is saved in the visitor's own browser
   (localStorage), so it works instantly with zero setup —
   but each visitor only sees their OWN comments plus the
   starter examples below (not other visitors' comments).
   ========================================================= */

const CommentsStore = (function(){
  const KEY = 'malibu_comments_v1';
  const ADMIN_KEY = 'malibu_admin_session';

  // TODO: change this before sharing the site with anyone.
  const ADMIN_PASSWORD = 'malibu2026';

  const seed = [
    {
      id: 's1',
      name: 'سارا محمدی',
      avatar: ['#eaf4fa', '#6f9db8', '#2c5170'],
      time: '۲ روز پیش',
      stars: 5,
      text: 'برنامه غذایی که دریافت کردم خیلی متناسب با نیازم بود و نتیجه عالی گرفتم.',
      likes: 4,
      liked: false,
      adminReply: 'ممنون از اعتماد شما سارای عزیز! خوشحالیم که نتیجه گرفتید 💙'
    },
    {
      id: 's2',
      name: 'امیر رضایی',
      avatar: ['#eaf4fa', '#5f93b5', '#1f3d55'],
      time: '۱ هفته پیش',
      stars: 5,
      text: 'تمرینات واقعا کاربردی و موثر بودن، چند کیلو وزن کم کردم و انرژی‌ام خیلی بیشتر شده.',
      likes: 7,
      liked: false,
      adminReply: null
    },
    {
      id: 's3',
      name: 'نیلوفر کریمی',
      avatar: ['#f3e3ec', '#c69bb0', '#5c2c40'],
      time: '۲ هفته پیش',
      stars: 4,
      text: 'محتواهای سایت خیلی مفید و علمی هستن. از بخش مقالات و نکات تغذیه خیلی استفاده کردم.',
      likes: 3,
      liked: false,
      adminReply: null
    }
  ];

  function readAll(){
    try{
      const raw = localStorage.getItem(KEY);
      if(!raw){
        localStorage.setItem(KEY, JSON.stringify(seed));
        return [...seed];
      }
      return JSON.parse(raw);
    }catch(e){
      console.error('CommentsStore read error', e);
      return [...seed];
    }
  }

  function writeAll(list){
    try{
      localStorage.setItem(KEY, JSON.stringify(list));
    }catch(e){
      console.error('CommentsStore write error', e);
    }
  }

  return {
    getAll(){
      return readAll().sort((a,b) => (b.createdAt||0) - (a.createdAt||0));
    },
    add({name, text, stars}){
      const list = readAll();
      const palettes = [
        ['#eaf4fa','#6f9db8','#2c5170'],
        ['#f3e3ec','#c69bb0','#5c2c40'],
        ['#ece5f3','#a98fc9','#3a2c5c'],
        ['#dfece9','#7fa3a1','#2c4a48']
      ];
      const entry = {
        id: 'c' + Date.now(),
        name: name && name.trim() ? name.trim() : 'کاربر مهمان',
        avatar: palettes[Math.floor(Math.random()*palettes.length)],
        time: 'همین الان',
        stars: stars || 5,
        text: text.trim(),
        likes: 0,
        liked: false,
        adminReply: null,
        createdAt: Date.now()
      };
      list.push(entry);
      writeAll(list);
      return entry;
    },
    toggleLike(id){
      const list = readAll();
      const item = list.find(c => c.id === id);
      if(!item) return null;
      item.liked = !item.liked;
      item.likes += item.liked ? 1 : -1;
      writeAll(list);
      return item;
    },
    reply(id, replyText){
      const list = readAll();
      const item = list.find(c => c.id === id);
      if(!item) return null;
      item.adminReply = replyText.trim();
      writeAll(list);
      return item;
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
