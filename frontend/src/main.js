import { router } from './router.js';
import { Landing } from './pages/Landing.js';
import { Home } from './pages/Home.js';
import { Login } from './pages/Login.js';
import { Register } from './pages/Register.js';
import { ForgotPassword } from './pages/ForgotPassword.js';
import { Profile } from './pages/Profile.js';
import { SuggestForm } from './pages/SuggestForm.js';
import { AdminDashboard } from './pages/AdminDashboard.js';
import { AdminLocationForm } from './pages/AdminLocationForm.js';
import { AdminSuggestions } from './pages/AdminSuggestions.js';
import { AdminUsers } from './pages/AdminUsers.js';
import { getAuth, signOut } from 'firebase/auth';
import { auth } from './config/firebase.js';

router
  .register('/',                         (ctx) => Landing(ctx))
  .register('/home',                     (ctx) => Home(ctx))
  .register('/login',                    (ctx) => Login(ctx))
  .register('/register',                 (ctx) => Register(ctx))
  .register('/forgot-password',          (ctx) => ForgotPassword(ctx))
  .register('/profile',                  router.requireAuth((ctx) => Profile(ctx)))
  .register('/suggest',                  router.requireAuth((ctx) => SuggestForm(ctx)))
  .register('/admin/dashboard',          router.requireAdmin((ctx) => AdminDashboard(ctx)))
  .register('/admin/locations/new',      router.requireAdmin((ctx) => AdminLocationForm(ctx)))
  .register('/admin/locations/:id/edit', router.requireAdmin((ctx) => AdminLocationForm(ctx)))
  .register('/admin/suggestions',        router.requireAdmin((ctx) => AdminSuggestions(ctx)))
  .register('/admin/users',              router.requireFounder((ctx) => AdminUsers(ctx)));

window._updateNavbarUser = (userData) => {
  const g = document.getElementById('nav-guest');
  const u = document.getElementById('nav-user');
  const mg = document.getElementById('mob-nav-guest');
  const mu = document.getElementById('mob-nav-user');
  
  const a = document.getElementById('nav-admin');
  const up = document.getElementById('nav-user-link');
  const ap = document.getElementById('nav-admin-profile');

  if (!userData) {
    if(g) g.style.display = 'flex';
    if(u) u.style.display = 'none';
    if(mg) mg.style.display = 'block';
    if(mu) mu.style.display = 'none';
    if(a) a.style.display = 'none';
    if(up) up.style.display = 'none';
    if(ap) ap.style.display = 'none';
    return;
  }

  if(g) g.style.display = 'none';
  if(u) u.style.display = 'flex';
  if(mg) mg.style.display = 'none';
  if(mu) mu.style.display = 'block';

  const isPriv = userData.role === 'admin' || userData.role === 'founder';
  if(a) a.style.display = isPriv ? 'inline' : 'none';
  if(up) up.style.display = !isPriv ? 'inline' : 'none';
  if(ap) ap.style.display = isPriv ? 'inline' : 'none';

  const name = userData.fullName || 'User';
  const avatarHtml = userData.photoURL 
    ? `<img src="${userData.photoURL}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`
    : name.charAt(0).toUpperCase();

  const rankName = isPriv ? (userData.role === 'founder' ? 'Người Sáng Lập' : 'Người Dẫn Lửa') : (userData.rank?.name || 'Đồng Lòng');

  ['nav-avatar', 'mob-nav-avatar'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.innerHTML = avatarHtml;
  });
  ['nav-username', 'mob-nav-username'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.textContent = name;
  });
  ['nav-rank', 'mob-nav-rank'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.textContent = rankName;
  });
};

document.addEventListener('click', async (e) => {
  if (e.target.closest('#logout-btn') || e.target.closest('#mob-logout-btn')) {
    e.preventDefault();
    try {
      await signOut(auth);
      router.navigate('/login');
    } catch(err) {
      console.error(err);
    }
  }

  // Theme toggle
  const themeBtn = e.target.closest('#theme-btn');
  if (themeBtn) {
    const root = document.documentElement;
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('ttv_theme', next);
  }

  // Notification bell
  const notifBell = e.target.closest('#notif-bell');
  if (notifBell) {
    import('./components/Toast.js').then(({ Toast }) => {
      Toast.show("Chức năng thông báo đang được phát triển.", "success");
    });
  }

  // Burger menu toggle
  const burgerBtn = e.target.closest('#burger-btn');
  if (burgerBtn) {
    const navLinks = document.getElementById('main-nav');
    if (navLinks) {
      navLinks.classList.toggle('open');
    }
  } else {
    // Close burger menu if clicked outside
    const navLinks = document.getElementById('main-nav');
    if (navLinks && navLinks.classList.contains('open') && !e.target.closest('#main-nav')) {
      navLinks.classList.remove('open');
    }
  }
});

router.init();
