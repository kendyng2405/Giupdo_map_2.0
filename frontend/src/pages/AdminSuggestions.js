import { getSuggestions, approveSuggestion, rejectSuggestion, deleteSuggestion } from "../api/suggestion.api.js";
import { adminNav } from "../components/AdminNav.js";
import { Toast } from "../components/Toast.js";
import { router } from "../router.js";

export const AdminSuggestions = async ({ user, userData }) => {
  const app = document.getElementById("app");
  
  try {
    const res = await getSuggestions();
    const suggestions = res.data || [];
    
    const pending = suggestions.filter(s => s.status === 'pending');
    const approved = suggestions.filter(s => s.status === 'approved');
    const rejected = suggestions.filter(s => s.status === 'rejected');

    app.innerHTML = `
      <div class="admin-layout page-transition">
        <aside class="admin-sidebar">${adminNav("suggestions", userData?.role)}</aside>
        <main class="admin-main">
          <div class="admin-topbar stagger-item">
            <div>
              <h1>Đề xuất địa điểm</h1>
              <p class="text-muted">Xem xét và duyệt đề xuất từ thành viên cộng đồng</p>
            </div>
          </div>

          <div style="display:flex;gap:4px;margin-bottom:20px;border-bottom:1px solid var(--border);padding-bottom:0;" class="stagger-item">
            <button class="sug-tab active" data-tab="pending" style="padding:10px 18px;background:none;border:none;border-bottom:2px solid var(--accent);font-family:inherit;font-size:.875rem;font-weight:700;color:var(--accent);cursor:pointer;">
              Chờ duyệt <span style="background:var(--accent);color:white;font-size:.68rem;padding:1px 6px;border-radius:999px;margin-left:4px;">${pending.length}</span>
            </button>
            <button class="sug-tab" data-tab="approved" style="padding:10px 18px;background:none;border:none;border-bottom:2px solid transparent;font-family:inherit;font-size:.875rem;font-weight:500;color:var(--text-muted);cursor:pointer;">
              Đã duyệt (${approved.length})
            </button>
            <button class="sug-tab" data-tab="rejected" style="padding:10px 18px;background:none;border:none;border-bottom:2px solid transparent;font-family:inherit;font-size:.875rem;font-weight:500;color:var(--text-muted);cursor:pointer;">
              Từ chối (${rejected.length})
            </button>
          </div>

          <div id="suggestions-wrap">
            <div id="panel-pending" class="sug-panel">
              ${pending.length === 0
                ? `<div style="text-align:center;padding:48px;color:var(--text-muted);">
                    <div style="font-size:2.5rem;margin-bottom:12px;">📭</div>
                    <div style="font-weight:600;">Không có đề xuất nào đang chờ duyệt</div>
                  </div>`
                : `<div style="display:grid;gap:16px;">
                    ${pending.map((s, idx) => _suggestionCard(s, "pending", idx)).join("")}
                  </div>`}
            </div>

            <div id="panel-approved" class="sug-panel" style="display:none;">
              ${approved.length === 0
                ? `<div style="text-align:center;padding:48px;color:var(--text-muted);">Chưa có đề xuất nào được duyệt.</div>`
                : `<div style="display:grid;gap:16px;">${approved.map((s, idx) => _suggestionCard(s, "approved", idx)).join("")}</div>`}
            </div>

            <div id="panel-rejected" class="sug-panel" style="display:none;">
              ${rejected.length === 0
                ? `<div style="text-align:center;padding:48px;color:var(--text-muted);">Chưa có đề xuất nào bị từ chối.</div>`
                : `<div style="display:grid;gap:16px;">${rejected.map((s, idx) => _suggestionCard(s, "rejected", idx)).join("")}</div>`}
            </div>
          </div>
        </main>
      </div>

      <div class="modal-backdrop" id="reject-modal" style="display:none">
        <div class="modal-box">
          <div class="modal-header">
            <h3>Từ chối đề xuất</h3>
            <button class="modal-close" id="modal-close-btn">&times;</button>
          </div>
          <p style="font-size:.85rem;color:var(--text-muted);margin-bottom:16px;">
            Đề xuất: <strong id="reject-sug-title"></strong>
          </p>
          <div class="form-group">
            <label>Lý do từ chối (bắt buộc)</label>
            <textarea id="reject-reason" class="form-control" rows="3" placeholder="VD: Địa điểm không chính xác, ảnh không rõ ràng..."></textarea>
          </div>
          <div style="display:flex;gap:10px;margin-top:20px;">
            <button class="btn btn--danger" id="confirm-reject-btn" style="flex:1">Xác nhận từ chối</button>
            <button class="btn btn--ghost" id="cancel-reject-btn">Hủy</button>
          </div>
        </div>
      </div>
    `;

    // Tabs
    const tabs = document.querySelectorAll(".sug-tab");
    tabs.forEach(t => {
      t.addEventListener("click", () => {
        tabs.forEach(tab => {
          tab.classList.remove("active");
          tab.style.borderBottomColor = "transparent";
          tab.style.color = "var(--text-muted)";
          tab.style.fontWeight = "500";
        });
        t.classList.add("active");
        t.style.borderBottomColor = "var(--accent)";
        t.style.color = "var(--accent)";
        t.style.fontWeight = "700";
        
        document.querySelectorAll(".sug-panel").forEach(p => p.style.display = "none");
        document.getElementById(`panel-${t.dataset.tab}`).style.display = "block";
      });
    });

    // Approve
    document.querySelectorAll(".btn-approve").forEach(b => {
      b.addEventListener("click", async e => {
        const id = e.target.dataset.id;
        const prev = e.target.innerHTML;
        e.target.innerHTML = '<span class="spinner"></span>';
        e.target.disabled = true;
        try {
          await approveSuggestion(id);
          Toast.show("Đã duyệt đề xuất và tạo địa điểm mới!");
          router.navigate("/admin/suggestions");
        } catch(err) {
          Toast.show("Lỗi duyệt đề xuất", "error");
          e.target.innerHTML = prev;
          e.target.disabled = false;
        }
      });
    });

    // Reject Modal
    const rejectModal = document.getElementById("reject-modal");
    let currentRejectId = null;
    document.querySelectorAll(".btn-reject").forEach(b => {
      b.addEventListener("click", e => {
        currentRejectId = e.target.dataset.id;
        document.getElementById("reject-sug-title").textContent = e.target.dataset.title;
        document.getElementById("reject-reason").value = "";
        rejectModal.style.display = "flex";
      });
    });

    const closeReject = () => { rejectModal.style.display = "none"; currentRejectId = null; };
    document.getElementById("modal-close-btn")?.addEventListener("click", closeReject);
    document.getElementById("cancel-reject-btn")?.addEventListener("click", closeReject);

    document.getElementById("confirm-reject-btn")?.addEventListener("click", async e => {
      const reason = document.getElementById("reject-reason").value.trim();
      if (!reason) return Toast.show("Vui lòng nhập lý do", "error");
      
      const prev = e.target.innerHTML;
      e.target.innerHTML = '<span class="spinner"></span>';
      e.target.disabled = true;
      try {
        await rejectSuggestion(currentRejectId, reason);
        Toast.show("Đã từ chối đề xuất!");
        closeReject();
        router.navigate("/admin/suggestions");
      } catch(err) {
        Toast.show("Lỗi từ chối đề xuất", "error");
        e.target.innerHTML = prev;
        e.target.disabled = false;
      }
    });

    // Delete
    document.querySelectorAll(".btn-sug-delete").forEach(b => {
      b.addEventListener("click", async e => {
        if (!confirm("Bạn có chắc chắn muốn xóa đề xuất này?")) return;
        try {
          await deleteSuggestion(e.target.dataset.id);
          Toast.show("Đã xóa đề xuất!");
          router.navigate("/admin/suggestions");
        } catch(err) {
          Toast.show("Lỗi xóa đề xuất", "error");
        }
      });
    });

    // View Location
    document.querySelectorAll(".btn-check-nearby").forEach(b => {
      b.addEventListener("click", e => {
        const { lat, lng } = e.target.dataset;
        window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
      });
    });

  } catch (err) {
    console.error(err);
    app.innerHTML = `<div class="container pt-120"><p>Lỗi tải dữ liệu</p></div>`;
  }
};

function _suggestionCard(s, status, index) {
  const urgencyLabel = { normal: "Bình thường", urgent: "Khẩn cấp", critical: "Rất khẩn" };
  const urgencyColor = { normal: "#22C55E", urgent: "#EAB308", critical: "#EF4444" };
  const uc = urgencyColor[s.urgency] || "#22C55E";
  const time = new Date(s.createdAt).toLocaleDateString("vi-VN");

  const actionBtns = status === "pending" ? `
    <button class="btn btn--sm btn-check-nearby" data-lat="${s.lat}" data-lng="${s.lng}" data-title="${s.title}" style="background:var(--bg2);color:var(--text1);border:1px solid var(--border);">Xem vị trí</button>
    <button class="btn btn--primary btn--sm btn-approve" data-id="${s.id}" style="min-width:80px;">Duyệt</button>
    <button class="btn btn--ghost btn--sm btn-reject" data-id="${s.id}" data-title="${s.title}" data-uid="${s.submittedBy}">Từ chối</button>
    <button class="btn btn--sm btn-sug-delete" data-id="${s.id}" style="background:var(--bg2);color:var(--text-muted);border:1px solid var(--border);">Xóa</button>
  ` : status === "rejected" ? `
    <button class="btn btn--sm btn-sug-delete" data-id="${s.id}" style="background:var(--bg2);color:var(--text-muted);border:1px solid var(--border);">Xóa</button>
  ` : "";

  return `
    <div class="card stagger-item" style="overflow:hidden; animation-delay:${index * 0.05}s">
      <div style="display:grid;grid-template-columns:${s.imageUrl ? "200px 1fr" : "1fr"};gap:0;">
        ${s.imageUrl ? `<img src="${s.imageUrl}" style="width:200px;height:100%;min-height:160px;object-fit:cover;" alt="">` : ""}
        <div style="padding:18px 20px;">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:8px;">
            <h3 style="font-size:1rem;margin:0;">${s.title}</h3>
            <span class="badge" style="background:${uc}20;color:${uc};flex-shrink:0;">${urgencyLabel[s.urgency] || ""}</span>
          </div>
          <div style="font-size:.78rem;color:var(--text-muted);margin-bottom:8px;">
            Đề xuất bởi: <strong>${s.submitterName || "Ẩn danh"}</strong> · ${time}
            ${s.address ? ` · 📍 ${s.address}` : ""}
          </div>
          ${s.description ? `<p style="font-size:.82rem;color:var(--text2);margin-bottom:10px;line-height:1.6;">${s.description.substring(0, 200)}${s.description.length > 200 ? "..." : ""}</p>` : ""}
          ${status === "rejected" && s.rejectedReason ? `
            <div style="background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);border-radius:var(--radius);padding:8px 12px;margin-bottom:10px;font-size:.78rem;color:#DC2626;">
              Lý do từ chối: ${s.rejectedReason}
            </div>` : ""}
          ${status === "approved" ? `
            <div style="background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.2);border-radius:var(--radius);padding:6px 12px;margin-bottom:10px;font-size:.78rem;color:#16A34A;">
              ✅ Đã được duyệt và thêm lên bản đồ
            </div>` : ""}
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px;">
            ${actionBtns}
          </div>
        </div>
      </div>
    </div>`;
}
