import { getAllUsers, updateUser, deleteUser, setRole } from "../api/user.api.js";
import { adminNav } from "../components/AdminNav.js";
import { Toast } from "../components/Toast.js";
import { router } from "../router.js";

export const AdminUsers = async ({ user, userData }) => {
  const app = document.getElementById("app");
  
  if (userData?.role !== "founder") {
    app.innerHTML = `<div class="container pt-120"><p>Không có quyền truy cập</p></div>`;
    return;
  }

  try {
    const res = await getAllUsers();
    const users = res.data || [];

    app.innerHTML = `
      <div class="admin-layout page-transition">
        <aside class="admin-sidebar">${adminNav("users", userData?.role)}</aside>
        <main class="admin-main">
          <div class="admin-topbar stagger-item">
            <div>
              <h1>Quản lý người dùng</h1>
              <p class="text-muted">${users.length} tài khoản trong hệ thống</p>
            </div>
          </div>

          <div class="card stagger-item" style="animation-delay:0.1s">
            <div class="card-header" style="display:flex;justify-content:space-between;align-items:center;">
              <h3>Danh sách thành viên</h3>
              <input type="text" id="user-search" class="form-control" style="width:220px" placeholder="Tìm theo tên, email...">
            </div>
            <div style="overflow-x:auto;">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Người dùng</th>
                    <th>Email</th>
                    <th>Vai trò</th>
                    <th>Điểm</th>
                    <th>Hỗ trợ</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody id="users-tbody">
                  ${users.map((u, idx) => {
                    const roleColor = u.role === "founder" ? "#7B2FBE" : u.role === "admin" ? "var(--accent)" : "var(--text-muted)";
                    const av = u.photoURL 
                      ? `<img src="${u.photoURL}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;" alt="">` 
                      : `<div class="lb-avatar" style="width:32px;height:32px;font-size:.8rem;flex-shrink:0">${(u.fullName || "?").charAt(0).toUpperCase()}</div>`;

                    return `
                      <tr class="user-row stagger-item" style="animation-delay:${idx*0.02}s" data-search="${(u.fullName || "") + " " + (u.email || "")}">
                        <td>
                          <div style="display:flex;align-items:center;gap:10px;">
                            ${av}
                            <div>
                              <div style="font-weight:600;font-size:.875rem">${u.fullName || "Ẩn danh"}</div>
                              <div style="font-size:.72rem;color:var(--text-muted)">${u.phone || ""}</div>
                            </div>
                          </div>
                        </td>
                        <td style="font-size:.82rem">${u.email || ""}</td>
                        <td>
                          <select class="form-control form-control--sm role-select" data-uid="${u.id}" style="width:auto;padding:4px 8px;font-size:.78rem">
                            <option value="member" ${u.role === "member" ? "selected" : ""}>Thành viên</option>
                            <option value="admin" ${u.role === "admin" ? "selected" : ""}>Người Dẫn Lửa</option>
                            <option value="founder" ${u.role === "founder" ? "selected" : ""}>Người Sáng Lập</option>
                          </select>
                        </td>
                        <td style="font-weight:700;color:var(--accent)">${u.points || 0}</td>
                        <td>${u.supportedLocations?.length || 0}</td>
                        <td>
                          <div style="display:flex; gap: 6px;">
                            <button class="btn btn--ghost btn--sm edit-user-btn" data-uid="${u.id}" data-name="${u.fullName || ""}" data-email="${u.email || ""}" data-phone="${u.phone || ""}" data-points="${u.points || 0}">Sửa</button>
                            <button class="btn btn--danger btn--sm delete-user-btn" data-uid="${u.id}">Xóa</button>
                          </div>
                        </td>
                      </tr>`;
                  }).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <div class="modal-backdrop" id="edit-user-modal" style="display:none">
        <div class="modal-box">
          <div class="modal-header">
            <h3>Chỉnh sửa thành viên</h3>
            <button class="modal-close" id="modal-close-btn">&times;</button>
          </div>
          <form id="edit-user-form">
            <input type="hidden" name="uid" id="edit-uid">
            <div class="form-group"><label>Họ và tên</label><input type="text" name="fullName" id="edit-fullname" class="form-control" required></div>
            <div class="form-group"><label>Email</label><input type="email" name="email" id="edit-email" class="form-control" disabled style="opacity:.6"></div>
            <div class="form-group"><label>Số điện thoại</label><input type="tel" name="phone" id="edit-phone" class="form-control"></div>
            <div class="form-group"><label>Điểm hỗ trợ</label><input type="number" name="points" id="edit-points" class="form-control" min="0" placeholder="0"></div>
            <div style="display:flex;gap:10px;margin-top:16px;">
              <button type="submit" class="btn btn--primary" style="flex:1">Lưu</button>
              <button type="button" class="btn btn--ghost" id="modal-cancel-btn">Hủy</button>
            </div>
          </form>
        </div>
      </div>
    `;

    // Search
    document.getElementById("user-search")?.addEventListener("input", e => {
      const v = e.target.value.toLowerCase();
      document.querySelectorAll(".user-row").forEach(r => {
        r.style.display = r.dataset.search.toLowerCase().includes(v) ? "" : "none";
      });
    });

    // Role select
    document.querySelectorAll(".role-select").forEach(sel => {
      sel.addEventListener("change", async e => {
        const uid = e.target.dataset.uid;
        const role = e.target.value;
        try {
          await setRole(uid, role);
          Toast.show("Đã thay đổi vai trò");
        } catch(err) {
          Toast.show("Lỗi đổi vai trò", "error");
          e.target.value = e.target.querySelector("option[selected]").value;
        }
      });
    });

    // Delete
    document.querySelectorAll(".delete-user-btn").forEach(b => {
      b.addEventListener("click", async e => {
        if (!confirm("Xóa vĩnh viễn người dùng này khỏi hệ thống?")) return;
        try {
          await deleteUser(e.target.dataset.uid);
          Toast.show("Đã xóa người dùng");
          router.navigate("/admin/users");
        } catch(err) {
          Toast.show("Lỗi xóa người dùng", "error");
        }
      });
    });

    // Edit Modal
    const editModal = document.getElementById("edit-user-modal");
    const closeEdit = () => { editModal.style.display = "none"; };
    
    document.querySelectorAll(".edit-user-btn").forEach(b => {
      b.addEventListener("click", e => {
        const { uid, name, email, phone, points } = e.target.dataset;
        document.getElementById("edit-uid").value = uid;
        document.getElementById("edit-fullname").value = name;
        document.getElementById("edit-email").value = email;
        document.getElementById("edit-phone").value = phone;
        document.getElementById("edit-points").value = points;
        editModal.style.display = "flex";
      });
    });

    document.getElementById("modal-close-btn")?.addEventListener("click", closeEdit);
    document.getElementById("modal-cancel-btn")?.addEventListener("click", closeEdit);

    document.getElementById("edit-user-form")?.addEventListener("submit", async e => {
      e.preventDefault();
      const uid = document.getElementById("edit-uid").value;
      const data = {
        fullName: document.getElementById("edit-fullname").value,
        phone: document.getElementById("edit-phone").value,
        points: parseInt(document.getElementById("edit-points").value || "0")
      };

      const btn = e.target.querySelector('button[type="submit"]');
      const prev = btn.innerHTML;
      btn.innerHTML = '<span class="spinner"></span> Lên...';
      btn.disabled = true;

      try {
        await updateUser(uid, data);
        Toast.show("Đã cập nhật thông tin người dùng!");
        closeEdit();
        router.navigate("/admin/users");
      } catch(err) {
        Toast.show("Lỗi cập nhật", "error");
        btn.innerHTML = prev;
        btn.disabled = false;
      }
    });

  } catch (err) {
    console.error(err);
    app.innerHTML = `<div class="container pt-120"><p>Lỗi tải trang</p></div>`;
  }
};
