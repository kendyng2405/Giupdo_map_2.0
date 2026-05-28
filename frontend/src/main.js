import { router } from './router.js';
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
});

router.init();
