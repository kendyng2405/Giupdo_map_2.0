import { getLocations, deleteLocation, toggleLocation } from "../api/location.api.js";
import { getAllUsers } from "../api/user.api.js";
import { adminNav } from "../components/AdminNav.js";
import { Toast } from "../components/Toast.js";
import { router } from "../router.js";

const URGENCY_COLOR = { normal: "#22C55E", urgent: "#EAB308", critical: "#EF4444" };
const URGENCY_LABEL = { normal: "Bình thường", urgent: "Khẩn cấp", critical: "Rất khẩn" };

export const AdminDashboard = async ({ user, userData }) => {
  const app = document.getElementById("app");
  
  try {
    const locRes = await getLocations(true); // admin gets all
    const locations = locRes.data || [];
    
    // We only need member count. We can either fetch all users if founder, or have an endpoint for stats.
    // For now, let's just use what we have or a placeholder for member count.
    let membersCount = 0;
    if (userData.role === "founder") {
      const usersRes = await getAllUsers();
      membersCount = usersRes.data?.length || 0;
    } else {
      // Just a mock for admin since they can't get all users
      membersCount = 10;
    }

    const stats = {
      total: locations.length,
      active: locations.filter(l => l.isActive).length,
      critical: locations.filter(l => l.urgency === 'critical').length,
      members: membersCount
    };

    app.innerHTML = `
      <div class="admin-layout page-transition">
        <aside class="admin-sidebar">${adminNav("dashboard", userData?.role)}</aside>
        <main class="admin-main">
          <div class="admin-topbar stagger-item">
            <div><h1>Bảng điều khiển</h1><p class="text-muted">Quản lý địa điểm và thành viên</p></div>
            <a href="/admin/locations/new" class="btn btn--primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg> Thêm địa điểm
            </a>
          </div>

          <div class="stats-grid stagger-item" style="animation-delay:0.1s">
            ${[
              ["Tổng địa điểm", stats.total, "var(--accent)"],
              ["Đang hoạt động", stats.active, "#22C55E"],
              ["Rất khẩn", stats.critical, "#EF4444"],
              ["Thành viên", stats.members, "#FFD700"],
            ].map(([l, v, c]) => `
              <div class="stat-card">
                <div class="stat-val count-up" style="color:${c}">${v}</div>
                <div class="stat-label">${l}</div>
              </div>
            `).join("")}
          </div>

          <div class="card stagger-item" style="animation-delay:0.2s">
            <div class="card-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
              <h3>Danh sách địa điểm</h3>
              <input id="loc-search" type="text" class="form-control" style="width:220px;" placeholder="Tìm kiếm...">
            </div>
            <div style="overflow-x:auto;">
              <table class="data-table">
                <thead><tr><th>Tên</th><th>Mức độ</th><th>Người</th><th>Hỗ trợ</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
                <tbody id="locations-tbody">
                  ${locations.length === 0 
                    ? `<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:40px;">Chưa có địa điểm nào</td></tr>` 
                    : locations.map((loc, idx) => `
                      <tr class="loc-row stagger-item" style="animation-delay:${idx*0.05}s">
                        <td><div class="td-title"><a href="javascript:void(0)" onclick="router.navigate('/location/${loc.id}')">${loc.title}</a></div><div class="td-sub">${(loc.address || "").substring(0, 40)}</div></td>
                        <td><span class="badge" style="background:${URGENCY_COLOR[loc.urgency]}20;color:${URGENCY_COLOR[loc.urgency]}">${URGENCY_LABEL[loc.urgency] || ""}</span></td>
                        <td>${loc.peopleCount || 1}</td>
                        <td style="font-weight:700;color:var(--accent)">${loc.supportCount || 0}</td>
                        <td><span style="font-size:.75rem;font-weight:600;color:${loc.isActive ? "#22C55E" : "var(--text-muted)"}">${loc.isActive ? "Hoạt động" : "Đã ẩn"}</span></td>
                        <td>
                          <div style="display:flex;gap:6px;flex-wrap:wrap;">
                            <button onclick="router.navigate('/admin/locations/${loc.id}/edit')" class="btn btn--ghost btn--sm">Sửa</button>
                            <button class="btn btn--ghost btn--sm" data-action="toggle" data-id="${loc.id}">${loc.isActive ? "Ẩn" : "Hiện"}</button>
                            <button class="btn btn--danger btn--sm" data-action="delete" data-id="${loc.id}">Xóa</button>
                          </div>
                        </td>
                      </tr>
                    `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    `;

    // Add search listener
    document.getElementById("loc-search")?.addEventListener("input", e => {
      const v = e.target.value.toLowerCase();
      document.querySelectorAll(".loc-row").forEach(r => {
        r.style.display = r.textContent.toLowerCase().includes(v) ? "" : "none";
      });
    });

    // Add action listeners
    document.querySelectorAll('button[data-action="toggle"]').forEach(b => {
      b.addEventListener("click", async e => {
        const id = e.target.dataset.id;
        const currentIsActive = e.target.textContent === "Ẩn";
        try {
          await toggleLocation(id, !currentIsActive);
          Toast.show("Đã thay đổi trạng thái!");
          router.navigate("/admin/dashboard");
        } catch(err) {
          Toast.show("Lỗi đổi trạng thái", "error");
        }
      });
    });

    document.querySelectorAll('button[data-action="delete"]').forEach(b => {
      b.addEventListener("click", async e => {
        if (!confirm("Bạn có chắc chắn muốn xóa địa điểm này?")) return;
        const id = e.target.dataset.id;
        try {
          await deleteLocation(id);
          Toast.show("Đã xóa địa điểm!");
          router.navigate("/admin/dashboard");
        } catch(err) {
          Toast.show("Lỗi xóa địa điểm", "error");
        }
      });
    });

  } catch (err) {
    console.error(err);
    app.innerHTML = `<div class="container pt-120"><p>Lỗi tải trang quản trị</p></div>`;
  }
};
