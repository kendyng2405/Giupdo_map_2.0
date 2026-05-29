import { getMe, updateProfile, uploadAvatar, updateEmail, getLeaderboard } from "../api/user.api.js";
import { Toast } from "../components/Toast.js";
import { EmailAuthProvider, reauthenticateWithCredential, updateEmail as updateAuthEmail } from "firebase/auth";
import { auth } from "../config/firebase.js";

const RANKS = [
  { name: "Đồng Lòng",     minPoints: 0,  color: "#CD7F32" },
  { name: "Tấm Lòng Bạc",  minPoints: 5,  color: "#A8B8C8" },
  { name: "Vàng Tâm",      minPoints: 15, color: "#FFD700" },
  { name: "Trái Tim Vàng", minPoints: 30, color: "#FF8C00" },
];

export const Profile = async ({ user, userData }) => {
  const app = document.getElementById("app");
  
  try {
    const res = await getLeaderboard();
    const leaderboard = res.data || [];
    const myRankIdx = leaderboard.findIndex(u => u.id === user.uid);
    const myRank = myRankIdx >= 0 ? myRankIdx + 1 : null;

    const isFounder = userData?.role === "founder";
    const isAdmin = userData?.role === "admin";
    const isPriv = isAdmin || isFounder;
    const roleLabel = isFounder ? "Người Sáng Lập" : isAdmin ? "Người Dẫn Lửa" : "Thành viên";
    const roleColor = isFounder ? "#7B2FBE" : isAdmin ? "var(--accent)" : "var(--text-muted)";

    const avatarContent = userData?.photoURL 
      ? `<img src="${userData.photoURL}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" alt="">`
      : `<span style="font-size:2rem;font-weight:800;">${(userData?.fullName || "U").charAt(0).toUpperCase()}</span>`;

    app.innerHTML = `
      <div class="container pt-120 pb-80 page-transition">
        <div class="profile-grid">
          <div>
            <div class="profile-hero stagger-item">
              <div class="profile-avatar-wrap">
                <div class="profile-avatar" id="avatar-preview">${avatarContent}</div>
                <button class="avatar-edit-btn" id="avatar-edit-btn" title="Đổi ảnh đại diện">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg> Đổi ảnh
                </button>
                <input type="file" id="avatar-input" accept="image/*" style="display:none">
              </div>
              <h1>${userData?.fullName || "Người dùng"}</h1>
              <div class="profile-rank-name" style="color:${isPriv ? roleColor : (userData?.rank?.color || "#CD7F32")}">
                ${isPriv ? roleLabel : (userData?.rank?.name || "Đồng Lòng")}
              </div>
              <div class="profile-role">
                ${roleLabel} ${myRank && !isPriv ? `&nbsp;&middot;&nbsp; Hạng #${myRank}` : ""}
              </div>
            </div>

            ${!isPriv ? `
              <div class="rank-card stagger-item">
                <div class="rank-pts-row">
                  <div><div class="rank-label">Tổng điểm</div><div class="rank-pts count-up">${userData?.points || 0}</div></div>
                  <div><div class="rank-label">Cấp bậc</div><div class="rank-name-sm" style="color:${userData?.rank?.color || "#CD7F32"}">${userData?.rank?.name || "Đồng Lòng"}</div></div>
                </div>
                ${userData?.rank?.next ? `
                  <div class="prog-info">Tiến trình lên <strong>${userData.rank.next.name}</strong> — ${userData.rank.progress}%</div>
                  <div class="prog-bar"><div class="prog-fill" style="width:0%" data-target="${userData.rank.progress}%"></div></div>
                  <div class="prog-sub">Cần thêm ${userData.rank.pointsToNext} điểm</div>
                ` : `<div style="text-align:center;color:var(--accent-gold);font-weight:600;padding:10px 0;">Bạn đã đạt cấp bậc cao nhất!</div>`}
              </div>
            ` : ""}

            <div class="card mb-24 stagger-item">
              <div class="card-header"><h3>Hệ thống cấp bậc thành viên</h3></div>
              <div class="card-body">
                ${RANKS.map((r) => {
                  const pts = userData?.points || 0;
                  const achieved = isPriv || pts >= r.minPoints;
                  const current = !isPriv && userData?.rank?.name === r.name;
                  return `
                    <div class="rank-journey-item">
                      <div class="rj-dot ${achieved ? "achieved" : ""}" style="${achieved ? `background:${r.color}` : ""}">
                        ${achieved 
                          ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>` 
                          : `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`
                        }
                      </div>
                      <div class="rj-info">
                        <div class="rj-name" style="color:${achieved ? r.color : "var(--text-muted)"}">
                          ${r.name} ${current ? `<span class="rj-current">Hiện tại</span>` : ""}
                        </div>
                        <div class="rj-pts">Từ ${r.minPoints} điểm</div>
                      </div>
                      <div style="font-size:.75rem;font-weight:700;color:${r.color};background:${r.color}20;padding:3px 10px;border-radius:999px;">${r.name}</div>
                    </div>`;
                }).join("")}
              </div>
            </div>

            <div class="card stagger-item">
              <div class="card-header"><h3>Chỉnh sửa hồ sơ</h3></div>
              <div class="card-body">
                <form id="profile-form">
                  <div class="form-row">
                    <div class="form-group"><label>Họ và tên</label><input type="text" name="fullName" class="form-control" value="${userData?.fullName || ""}" required></div>
                    <div class="form-group"><label>Số điện thoại</label><input type="tel" name="phone" class="form-control" value="${userData?.phone || ""}"></div>
                  </div>
                  <button type="submit" class="btn btn--primary">Lưu thay đổi</button>
                </form>

                <div class="divider">đổi email</div>
                <p class="form-hint" style="margin-bottom:10px;">Cần nhập mật khẩu hiện tại để xác thực.</p>
                
                <form id="email-form">
                  <div class="form-row">
                    <div class="form-group">
                      <label>Email mới</label>
                      <input type="email" name="newEmail" class="form-control" placeholder="${userData?.email || ""}" required>
                    </div>
                    <div class="form-group">
                      <label>Mật khẩu hiện tại</label>
                      <div class="input-pw-wrap">
                        <input type="password" name="currentPassword" class="form-control" placeholder="Nhập để xác thực" required>
                        <button type="button" class="pw-toggle" onclick="const i=this.previousElementSibling;i.type=i.type==='password'?'text':'password'">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <button type="submit" class="btn btn--ghost">Cập nhật email</button>
                </form>
              </div>
            </div>
          </div>

          <div>
            <div class="card sticky-top stagger-item" style="animation-delay: 0.1s;">
              <div class="card-header" style="display:flex;justify-content:space-between;align-items:center;">
                <h3>Bảng xếp hạng</h3>
                <span class="text-muted text-xs">Top 5</span>
              </div>
              <div class="card-body" style="padding:8px 16px;">
                ${leaderboard.map((m, i) => {
                  const av = m.photoURL 
                    ? `<img src="${m.photoURL}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" alt="">` 
                    : (m.fullName || "?").charAt(0).toUpperCase();
                  return `
                    <div class="lb-item ${m.id === user?.uid ? "lb-item--me" : ""}">
                      <div class="lb-rank ${i === 0 ? "lb-rank--top1" : i === 1 ? "lb-rank--top2" : i === 2 ? "lb-rank--top3" : ""}">${i + 1}</div>
                      <div class="lb-avatar" style="overflow:hidden">${av}</div>
                      <div class="lb-info">
                        <div class="lb-name">${m.fullName || "Ẩn danh"}${m.id === user?.uid ? ` <span style="font-size:.62rem;color:var(--accent)">(Bạn)</span>` : ""}</div>
                        <div class="lb-meta">${m.rank?.name || "Đồng Lòng"}</div>
                      </div>
                      <div class="lb-pts">${m.points || 0}</div>
                    </div>`;
                }).join("") || `<p class="text-muted" style="padding:16px;font-size:.82rem;">Chưa có dữ liệu</p>`}
              </div>
            </div>

            <div class="card stagger-item" style="margin-top:16px; animation-delay: 0.15s;">
              <div class="card-body">
                <div class="info-label">Thông tin tài khoản</div>
                <div class="info-row" style="align-items:flex-start;">
                  <span style="flex-shrink:0;padding-top:1px;">Email</span>
                  <strong style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:200px;display:block;" title="${userData?.email || ""}">${userData?.email || ""}</strong>
                </div>
                <div class="info-row"><span>Vai trò</span><strong style="color:${roleColor}">${roleLabel}</strong></div>
                ${!isPriv ? `<div class="info-row"><span>Hỗ trợ</span><strong>${userData?.supportedLocations?.length || 0} địa điểm</strong></div>` : ""}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Animate progress bar
    setTimeout(() => {
      const progFill = document.querySelector('.prog-fill');
      if (progFill) progFill.style.width = progFill.dataset.target;
    }, 100);

    // Event listeners
    const avatarInput = document.getElementById("avatar-input");
    document.getElementById("avatar-edit-btn")?.addEventListener("click", () => avatarInput.click());

    avatarInput?.addEventListener("change", async e => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) return Toast.show("Ảnh vượt quá 2MB", "error");

      const preview = document.getElementById("avatar-preview");
      preview.innerHTML = '<span class="spinner" style="border-top-color:var(--accent)"></span>';
      
      try {
        const formData = new FormData();
        formData.append("avatar", file);
        await uploadAvatar(formData);
        Toast.show("Cập nhật ảnh thành công!");
        window.location.reload();
      } catch (err) {
        console.error(err);
        Toast.show("Lỗi tải ảnh lên", "error");
        preview.innerHTML = avatarContent;
      }
    });

    document.getElementById("profile-form")?.addEventListener("submit", async e => {
      e.preventDefault();
      const btn = e.target.querySelector('button[type="submit"]');
      const prev = btn.innerHTML;
      btn.innerHTML = '<span class="spinner"></span> Đang lưu...';
      btn.disabled = true;

      const data = {
        fullName: e.target.fullName.value,
        phone: e.target.phone.value
      };

      try {
        await updateProfile(data);
        Toast.show("Đã lưu thông tin hồ sơ!");
        if (typeof window._updateNavbarUser === "function") {
          window._updateNavbarUser({ ...userData, ...data });
        }
      } catch (err) {
        Toast.show("Lỗi lưu hồ sơ", "error");
      } finally {
        btn.innerHTML = prev;
        btn.disabled = false;
      }
    });

    document.getElementById("email-form")?.addEventListener("submit", async e => {
      e.preventDefault();
      const btn = e.target.querySelector('button[type="submit"]');
      const email = e.target.newEmail.value;
      const pwd = e.target.currentPassword.value;

      if (!email || !pwd) return Toast.show("Vui lòng nhập đủ thông tin", "error");

      const prev = btn.innerHTML;
      btn.innerHTML = '<span class="spinner"></span> Đang cập nhật...';
      btn.disabled = true;

      try {
        const cred = EmailAuthProvider.credential(user.email, pwd);
        await reauthenticateWithCredential(user, cred);
        await updateAuthEmail(user, email);
        await updateEmail(email);
        Toast.show("Cập nhật email thành công!");
        e.target.reset();
      } catch (err) {
        console.error(err);
        let msg = "Lỗi cập nhật email.";
        if (err.code === "auth/invalid-credential") msg = "Mật khẩu không đúng.";
        if (err.code === "auth/email-already-in-use") msg = "Email đã được sử dụng.";
        Toast.show(msg, "error");
      } finally {
        btn.innerHTML = prev;
        btn.disabled = false;
      }
    });

  } catch (err) {
    console.error(err);
    app.innerHTML = `<div class="container pt-120"><p>Lỗi tải hồ sơ</p></div>`;
  }
};
