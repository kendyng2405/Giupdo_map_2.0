import { createSuggestion } from "../api/suggestion.api.js";
import { Toast } from "../components/Toast.js";
import { router } from "../router.js";

const HELP_TYPES = [
  { value: "food", label: "Thực phẩm", color: "#3B82F6" },
  { value: "clothes", label: "Quần áo", color: "#8B5CF6" },
  { value: "money", label: "Tiền mặt", color: "#10B981" },
  { value: "medical", label: "Y tế", color: "#EF4444" },
  { value: "shelter", label: "Chỗ ở", color: "#F59E0B" },
  { value: "other", label: "Khác", color: "#6B7280" }
];

const URGENCY = [
  { value: "normal", label: "Bình thường" },
  { value: "urgent", label: "Khẩn cấp" },
  { value: "critical", label: "Rất khẩn" }
];

export const SuggestForm = async ({ user, userData }) => {
  const app = document.getElementById("app");
  
  app.innerHTML = `
    <div class="container pt-120 pb-80" style="max-width:820px;">
      <div style="margin-bottom:24px;" class="stagger-item">
        <h1 style="font-size:1.6rem;">Đề xuất địa điểm cần hỗ trợ</h1>
        <p style="color:var(--text-muted);font-size:.85rem;margin-top:6px;">
          Đề xuất sẽ được admin xem xét và đưa lên bản đồ sau khi duyệt.
        </p>
      </div>

      <form id="suggest-form">
        <div class="form-2col">
          <div>
            <div class="card mb-20 stagger-item">
              <div class="card-header"><h3>Thông tin cơ bản</h3></div>
              <div class="card-body">
                <div class="form-group">
                  <label>Tiêu đề <span style="color:var(--accent)">*</span></label>
                  <input type="text" name="title" class="form-control" placeholder="Ví dụ: Cụ ông vô gia cư tại..." required>
                </div>
                <div class="form-group">
                  <label>Mô tả tình huống</label>
                  <textarea name="description" class="form-control" placeholder="Mô tả chi tiết về người cần giúp..."></textarea>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>Số người <span style="color:var(--accent)">*</span></label>
                    <input type="number" name="peopleCount" class="form-control" value="1" min="1">
                  </div>
                  <div class="form-group">
                    <label>Mức độ khẩn</label>
                    <select name="urgency" class="form-control">
                      ${URGENCY.map(u => `<option value="${u.value}">${u.label}</option>`).join("")}
                    </select>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group"><label>Từ giờ</label><input type="text" name="timeFrom" class="form-control" placeholder="18:00"></div>
                  <div class="form-group"><label>Đến giờ</label><input type="text" name="timeTo" class="form-control" placeholder="22:00"></div>
                </div>
              </div>
            </div>

            <div class="card mb-20 stagger-item">
              <div class="card-header"><h3>Loại hỗ trợ cần thiết</h3></div>
              <div class="card-body">
                <div class="help-types-grid">
                  ${HELP_TYPES.map(ht => `
                    <label class="check-card">
                      <input type="checkbox" name="helpTypes" value="${ht.value}">
                      <span style="width:8px;height:8px;border-radius:50%;background:${ht.color};flex-shrink:0;"></span>
                      ${ht.label}
                    </label>`).join("")}
                </div>
              </div>
            </div>

            <div class="card stagger-item">
              <div class="card-header"><h3>Ghi chú thêm</h3></div>
              <div class="card-body">
                <textarea name="note" class="form-control" placeholder="Thông tin bổ sung, lưu ý cho tình nguyện viên..."></textarea>
              </div>
            </div>
          </div>

          <div>
            <div class="card mb-20 stagger-item">
              <div class="card-header" style="display:flex;justify-content:space-between;align-items:center;">
                <h3>Vị trí trên bản đồ <span style="color:var(--accent)">*</span></h3>
                <button type="button" id="suggest-locate" class="btn btn--ghost btn--sm">Vị trí của tôi</button>
              </div>
              <div id="suggest-map" style="height:240px;"></div>
              <div class="card-body" style="padding-top:12px;">
                <div class="form-group" style="margin-bottom:0;">
                  <label>Địa chỉ</label>
                  <input type="text" name="address" id="suggest-address" class="form-control" placeholder="Tự động điền khi chọn trên bản đồ">
                </div>
              </div>
              <input type="hidden" id="suggest-lat" name="lat">
              <input type="hidden" id="suggest-lng" name="lng">
            </div>

            <div class="card stagger-item">
              <div class="card-header"><h3>Ảnh địa điểm <span style="color:var(--accent)">*</span></h3></div>
              <div class="card-body">
                <img id="suggest-img-preview" style="display:none;width:100%;height:150px;object-fit:cover;border-radius:var(--radius);margin-bottom:12px;" alt="Preview">
                <label style="display:flex;align-items:center;gap:8px;padding:12px 16px;border:1.5px dashed var(--border);border-radius:var(--radius);cursor:pointer;font-size:.82rem;color:var(--text-muted);background:var(--bg2);"
                       onmouseenter="this.style.borderColor='var(--accent)'" onmouseleave="this.style.borderColor='var(--border)'">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  Chọn ảnh từ thiết bị (bắt buộc)
                  <input type="file" id="suggest-img-input" accept="image/*" style="display:none">
                </label>
                <p style="font-size:.74rem;color:var(--text-muted);margin-top:8px;line-height:1.5;">
                  Ảnh phải thể hiện rõ địa điểm thực tế để admin có thể xác minh. Tối đa 5MB.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div style="display:flex;gap:12px;margin-top:20px;" class="stagger-item">
          <button type="submit" class="btn btn--primary btn--lg" style="flex:1">Gửi đề xuất</button>
          <a href="/home" class="btn btn--ghost btn--lg">Hủy</a>
        </div>
      </form>
    </div>
  `;

  // Init map
  let smap, smarker;
  setTimeout(() => {
    smap = L.map("suggest-map").setView([16.047079, 108.206230], 5);
    L.tileLayer("https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
      attribution: "Google Maps"
    }).addTo(smap);

    smap.on("click", async e => {
      if (smarker) smap.removeLayer(smarker);
      smarker = L.marker(e.latlng).addTo(smap);
      document.getElementById("suggest-lat").value = e.latlng.lat;
      document.getElementById("suggest-lng").value = e.latlng.lng;
      
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`);
        const data = await res.json();
        if (data && data.display_name) {
          document.getElementById("suggest-address").value = data.display_name;
        }
      } catch (err) {}
    });

    document.getElementById("suggest-locate").addEventListener("click", () => {
      if (!navigator.geolocation) return Toast.show("Trình duyệt không hỗ trợ.", "error");
      navigator.geolocation.getCurrentPosition(async pos => {
        const latlng = [pos.coords.latitude, pos.coords.longitude];
        smap.setView(latlng, 15);
        if (smarker) smap.removeLayer(smarker);
        smarker = L.marker(latlng).addTo(smap);
        document.getElementById("suggest-lat").value = latlng[0];
        document.getElementById("suggest-lng").value = latlng[1];
      });
    });
  }, 100);

  // Handle checkboxes
  document.querySelectorAll("input[type=checkbox]").forEach(cb => {
    cb.addEventListener("change", function() {
      this.closest(".check-card").classList.toggle("checked", this.checked);
    });
  });

  // Handle image upload
  let currentFile = null;
  document.getElementById("suggest-img-input").addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return Toast.show("Ảnh tối đa 5MB", "error");
    currentFile = file;
    const reader = new FileReader();
    reader.onload = ev => {
      const img = document.getElementById("suggest-img-preview");
      img.src = ev.target.result;
      img.style.display = "block";
    };
    reader.readAsDataURL(file);
  });

  document.getElementById("suggest-form").addEventListener("submit", async e => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    
    if (!currentFile) return Toast.show("Vui lòng tải lên 1 tấm ảnh", "error");
    if (!e.target.lat.value || !e.target.lng.value) return Toast.show("Vui lòng chọn vị trí trên bản đồ", "error");
    
    const hts = Array.from(e.target.querySelectorAll('input[name="helpTypes"]:checked')).map(cb => cb.value);
    
    const fd = new FormData();
    fd.append("title", e.target.title.value);
    fd.append("description", e.target.description.value);
    fd.append("peopleCount", e.target.peopleCount.value);
    fd.append("urgency", e.target.urgency.value);
    fd.append("timeFrom", e.target.timeFrom.value);
    fd.append("timeTo", e.target.timeTo.value);
    fd.append("note", e.target.note.value);
    fd.append("lat", e.target.lat.value);
    fd.append("lng", e.target.lng.value);
    fd.append("address", e.target.address.value);
    fd.append("helpTypes", JSON.stringify(hts));
    fd.append("image", currentFile);

    const prev = btn.innerHTML;
    btn.innerHTML = '<span class="spinner"></span> Đang gửi...';
    btn.disabled = true;

    try {
      await createSuggestion(fd);
      Toast.show("Đã gửi đề xuất! Vui lòng chờ duyệt.");
      router.navigate("/home");
    } catch(err) {
      Toast.show(err.message || "Lỗi gửi đề xuất", "error");
      btn.innerHTML = prev;
      btn.disabled = false;
    }
  });
};
