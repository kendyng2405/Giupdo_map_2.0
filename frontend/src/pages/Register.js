import { auth } from "../config/firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { registerUser } from "../api/auth.api.js";
import { Toast } from "../components/Toast.js";
import { router } from "../router.js";

export const Register = async () => {
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
        <h1 class="auth-title">Tạo tài khoản</h1>
        <p class="auth-sub">Tham gia cộng đồng, bắt đầu hành trình giúp đỡ.</p>
        
        <form id="register-form" novalidate>
          <div class="form-row stagger-item">
            <div class="form-group"><label>Họ và tên</label><input type="text" name="fullName" class="form-control" placeholder="Nguyễn Văn A" required></div>
            <div class="form-group"><label>Số điện thoại</label><input type="tel" name="phone" class="form-control" placeholder="0912 345 678" required></div>
          </div>
          <div class="form-group stagger-item"><label>Email</label><input type="email" name="email" class="form-control" placeholder="ten@email.com" required></div>
          <div class="form-group stagger-item">
            <label>Mật khẩu</label>
            <div class="input-pw-wrap">
              <input type="password" name="password" id="pw-reg" class="form-control" placeholder="Tối thiểu 6 ký tự" required>
              <button type="button" class="pw-toggle" onclick="const i=this.previousElementSibling;i.type=i.type==='password'?'text':'password'">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            </div>
          </div>
          <div style="height:4px;background:var(--border);border-radius:2px;margin-bottom:16px;overflow:hidden;" class="stagger-item">
            <div id="pwd-bar-fill" style="height:100%;width:0;transition:all .3s;"></div>
          </div>
          <button type="submit" class="btn btn--primary btn--full btn--lg stagger-item">Tạo tài khoản</button>
        </form>
        
        <div class="auth-divider stagger-item">đã có tài khoản?</div>
        <a href="/login" class="btn btn--ghost btn--full stagger-item">Đăng nhập</a>
        <div class="auth-back stagger-item"><a href="/home">&larr; Quay lại bản đồ</a></div>
      </div>
    </div>
  `;

  const pwReg = document.getElementById("pw-reg");
  const pwBar = document.getElementById("pwd-bar-fill");
  pwReg.addEventListener("input", e => {
    const len = e.target.value.length;
    if (len === 0) {
      pwBar.style.width = "0%";
      pwBar.style.background = "var(--border)";
    } else if (len < 6) {
      pwBar.style.width = "33%";
      pwBar.style.background = "#EF4444";
    } else if (len < 10) {
      pwBar.style.width = "66%";
      pwBar.style.background = "#EAB308";
    } else {
      pwBar.style.width = "100%";
      pwBar.style.background = "#22C55E";
    }
  });

  document.getElementById("register-form").addEventListener("submit", async e => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const email = e.target.email.value;
    const pwd = e.target.password.value;
    const fullName = e.target.fullName.value;
    const phone = e.target.phone.value;

    if (!email || !pwd || !fullName || !phone) {
      Toast.show("Vui lòng điền đầy đủ thông tin", "error");
      return;
    }
    if (pwd.length < 6) {
      Toast.show("Mật khẩu phải dài ít nhất 6 ký tự", "error");
      return;
    }

    const prev = btn.innerHTML;
    btn.innerHTML = '<span class="spinner"></span> Đang xử lý...';
    btn.disabled = true;

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, pwd);
      
      try {
        await registerUser(userCred.user.uid, { email, fullName, phone });
        Toast.show("Đăng ký thành công!");
        router.navigate("/home");
      } catch (apiErr) {
        // Rollback Firebase auth if backend fails
        console.error(apiErr);
        await userCred.user.delete();
        Toast.show(apiErr.message || "Lỗi lưu dữ liệu. Đã hoàn tác.", "error");
        btn.innerHTML = prev;
        btn.disabled = false;
      }
    } catch (err) {
      console.error(err);
      let msg = "Đăng ký thất bại.";
      if (err.code === "auth/email-already-in-use") msg = "Email đã được sử dụng.";
      if (err.code === "auth/weak-password") msg = "Mật khẩu quá yếu.";
      Toast.show(msg, "error");
      btn.innerHTML = prev;
      btn.disabled = false;
    }
  });
};
