import { auth } from "../config/firebase.js";
import { sendPasswordResetEmail } from "firebase/auth";
import { Toast } from "../components/Toast.js";

export const ForgotPassword = async () => {
  const app = document.getElementById("app");
  
  app.innerHTML = `
    <div class="auth-page">
      <div class="auth-card">
        <div style="text-align:center;margin-bottom:24px;" class="stagger-item">
          <div style="width:56px;height:56px;border-radius:50%;background:rgba(184,50,40,0.1);display:flex;align-items:center;justify-content:center;margin:0 auto 14px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h1 class="auth-title">Quên mật khẩu</h1>
          <p class="auth-sub">Nhập email và chúng tôi sẽ gửi link đặt lại mật khẩu.</p>
        </div>
        <form id="forgot-form">
          <div class="form-group stagger-item"><label>Email đăng ký</label><input type="email" name="email" class="form-control" placeholder="ten@email.com" required></div>
          <button type="submit" class="btn btn--primary btn--full btn--lg stagger-item">Gửi email đặt lại</button>
        </form>
        <div class="auth-back stagger-item" style="margin-top:20px;"><a href="/login">&larr; Quay lại đăng nhập</a></div>
      </div>
    </div>
  `;

  document.getElementById("forgot-form").addEventListener("submit", async e => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const email = e.target.email.value;

    if (!email) {
      Toast.show("Vui lòng nhập email", "error");
      return;
    }

    const prev = btn.innerHTML;
    btn.innerHTML = '<span class="spinner"></span> Đang gửi...';
    btn.disabled = true;

    try {
      await sendPasswordResetEmail(auth, email);
      Toast.show("Đã gửi email khôi phục. Vui lòng kiểm tra hộp thư.");
    } catch (err) {
      console.error(err);
      let msg = "Gửi email thất bại.";
      if (err.code === "auth/user-not-found") msg = "Không tìm thấy email này.";
      Toast.show(msg, "error");
    } finally {
      btn.innerHTML = prev;
      btn.disabled = false;
    }
  });
};
