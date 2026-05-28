import { auth } from "../config/firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Toast } from "../components/Toast.js";
import { router } from "../router.js";

export const Login = async () => {
  const app = document.getElementById("app");
  
  app.innerHTML = `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-brand">
          <div class="brand-logo"></div>
          <div>
            <div class="brand-name">Trái Tim Việt</div>
            <div class="brand-sub">Bản đồ từ thiện</div>
          </div>
        </div>
        <h1 class="auth-title">Đăng nhập</h1>
        <p class="auth-sub">Chào mừng trở lại. Tiếp tục hành trình yêu thương.</p>
        
        <form id="login-form" novalidate>
          <div class="form-group stagger-item">
            <label>Email</label>
            <input type="email" name="email" class="form-control" placeholder="ten@email.com" required>
          </div>
          <div class="form-group stagger-item">
            <label>Mật khẩu</label>
            <div class="input-pw-wrap">
              <input type="password" name="password" class="form-control" placeholder="Nhập mật khẩu" required>
              <button type="button" class="pw-toggle" onclick="const i=this.previousElementSibling;i.type=i.type==='password'?'text':'password'">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="form-footer-link stagger-item"><a href="/forgot-password">Quên mật khẩu?</a></div>
          <button type="submit" class="btn btn--primary btn--full btn--lg stagger-item">Đăng nhập</button>
        </form>
        
        <div class="auth-divider stagger-item">hoặc</div>
        <div class="auth-switch stagger-item">Chưa có tài khoản? <a href="/register">Đăng ký ngay</a></div>
        <div class="auth-back stagger-item"><a href="/home">&larr; Quay lại bản đồ</a></div>
      </div>
    </div>
  `;

  document.getElementById("login-form").addEventListener("submit", async e => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const email = e.target.email.value;
    const pwd = e.target.password.value;

    if (!email || !pwd) {
      Toast.show("Vui lòng nhập đủ email và mật khẩu", "error");
      return;
    }

    const prev = btn.innerHTML;
    btn.innerHTML = '<span class="spinner"></span> Đang đăng nhập...';
    btn.disabled = true;

    try {
      await signInWithEmailAndPassword(auth, email, pwd);
      router.navigate("/home");
    } catch (err) {
      console.error(err);
      let msg = "Đăng nhập thất bại.";
      if (err.code === "auth/invalid-credential") msg = "Email hoặc mật khẩu không đúng.";
      Toast.show(msg, "error");
      btn.innerHTML = prev;
      btn.disabled = false;
    }
  });
};
