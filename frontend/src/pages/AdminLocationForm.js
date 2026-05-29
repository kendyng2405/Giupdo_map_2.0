import { getLocation, createLocation, updateLocation } from "../api/location.api.js";
import { adminNav } from "../components/AdminNav.js";
import { Toast } from "../components/Toast.js";
import { router } from "../router.js";

const HELP_TYPES = [
  { value: "food", label: "Thực phẩm" },
  { value: "clothes", label: "Quần áo" },
  { value: "money", label: "Tiền mặt" },
  { value: "medical", label: "Y tế" },
  { value: "shelter", label: "Chỗ ở" },
  { value: "other", label: "Khác" }
];

const URGENCY = [
  { value: "normal", label: "Bình thường", color: "#22C55E" },
  { value: "urgent", label: "Khẩn cấp", color: "#EAB308" },
  { value: "critical", label: "Rất khẩn", color: "#EF4444" }
];

export const AdminLocationForm = async ({ user, userData, params }) => {
  const app = document.getElementById("app");
  const locId = params?.id;
  let location = null;
  
  if (locId) {
    try {
      const res = await getLocation(locId);
      location = res.data;
    } catch(err) {
      console.error(err);
      return Toast.show("Lỗi tải thông tin địa điểm", "error");
    }
  }

  app.innerHTML = `
    <div class="admin-layout page-transition">
      <aside class="admin-sidebar">${adminNav(location ? "edit" : "new", userData?.role)}</aside>
      <main class="admin-main">
        <div class="admin-topbar stagger-item">
          <div>
            <a href="/admin/dashboard" style="font-size:.82rem;color:var(--text-muted);display:inline-flex;align-items:center;gap:6px;margin-bottom:8px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg> Quay lại
            </a>
            <h1>${location ? "Chỉnh sửa địa điểm" : "Thêm địa điểm mới"}</h1>
          </div>
        </div>

        <form id="location-form">
          <div class="form-2col">
            <div>
              <div class="card mb-20 stagger-item" style="animation-delay:0.1s">
                <div class="card-header"><h3>Thông tin cơ bản</h3></div>
                <div class="card-body">
                  <div class="form-group"><label>Tên địa điểm *</label><input type="text" name="title" class="form-control" value="${location?.title || ""}" placeholder="VD: Khu vực cầu Thị Nghè" required></div>
                  <div class="form-group"><label>Mô tả</label><textarea name="description" class="form-control" rows="3" placeholder="Mô tả hoàn cảnh, nhu cầu...">${location?.description || ""}</textarea></div>
                  <div class="form-group"><label>Ghi chú</label><textarea name="note" class="form-control" rows="2" placeholder="Thông tin lưu ý khi đến hỗ trợ...">${location?.note || ""}</textarea></div>
                </div>
              </div>

              <div class="card mb-20 stagger-item" style="animation-delay:0.15s">
                <div class="card-header"><h3>Loại hỗ trợ cần thiết</h3></div>
                <div class="card-body">
                  <div class="help-types-grid">
                    ${HELP_TYPES.map(t => `
                      <label class="check-card ${location?.helpTypes?.includes(t.value) ? "checked" : ""}">
                        <input type="checkbox" name="helpTypes" value="${t.value}" ${location?.helpTypes?.includes(t.value) ? "checked" : ""}>
                        <span>${t.label}</span>
                      </label>
                    `).join("")}
                  </div>
                </div>
              </div>

              <div class="card stagger-item" style="animation-delay:0.2s">
                <div class="card-header"><h3>Hình ảnh</h3></div>
                <div class="card-body">
                  <div id="img-preview-wrap" style="display: ${location?.imageUrl ? 'block' : 'none'}; margin-bottom:12px;">
                    <img id="img-preview" src="${location?.imageUrl || ""}" style="width:100%;height:150px;object-fit:cover;border-radius:10px;border:1px solid var(--border);">
                  </div>
                  <label style="display:flex;align-items:center;gap:8px;padding:10px 16px;border:1.5px dashed var(--border);border-radius:var(--radius);cursor:pointer;font-size:.85rem;color:var(--text-muted);background:var(--bg2);" 
                         onmouseenter="this.style.borderColor='var(--accent)'" 
                         onmouseleave="this.style.borderColor='var(--border)'">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    ${location?.imageUrl ? "Thay ảnh mới" : "Chọn ảnh từ thiết bị"}
                    <input type="file" id="img-file-input" accept="image/*" style="display:none">
                  </label>
                  <div class="form-hint" style="margin-top:6px;">Ảnh tối đa 5MB. Hỗ trợ JPG, PNG, WEBP.</div>
                </div>
              </div>
            </div>

            <div>
              <div class="card mb-20 stagger-item" style="animation-delay:0.1s">
                <div class="card-header" style="display:flex;justify-content:space-between;align-items:center;">
                  <h3>Vị trí trên bản đồ *</h3>
                  <button type="button" id="picker-locate" class="btn btn--ghost btn--sm">Vị trí của tôi</button>
                </div>
                <div class="card-body">
                  <p style="font-size:.78rem;color:var(--text-muted);margin-bottom:10px;">Bấm vào bản đồ để chọn vị trí</p>
                  <div id="map-picker" style="height:280px;border-radius:10px;overflow:hidden;border:1.5px solid var(--border);"></div>
                  <div class="form-row" style="margin-top:10px;">
                    <div class="form-group" style="margin:0"><label>Vĩ độ</label><input type="text" id="input-lat" name="lat" class="form-control" value="${location?.lat || ""}" placeholder="10.7769" readonly required></div>
                    <div class="form-group" style="margin:0"><label>Kinh độ</label><input type="text" id="input-lng" name="lng" class="form-control" value="${location?.lng || ""}" placeholder="106.7009" readonly required></div>
                  </div>
                </div>
              </div>

              <div class="card mb-20 stagger-item" style="animation-delay:0.15s">
                <div class="card-header"><h3>Chi tiết</h3></div>
                <div class="card-body">
                  <div class="form-group"><label>Địa chỉ</label><input type="text" id="input-address" name="address" class="form-control" value="${location?.address || ""}" placeholder="Tự động điền khi chọn trên bản đồ"></div>
                  <div class="form-row">
                    <div class="form-group"><label>Từ giờ</label><input type="text" name="timeFrom" class="form-control" value="${location?.timeFrom || ""}" placeholder="18:00"></div>
                    <div class="form-group"><label>Đến giờ</label><input type="text" name="timeTo" class="form-control" value="${location?.timeTo || ""}" placeholder="22:00"></div>
                  </div>
                  <div class="form-group"><label>Số người</label><input type="number" name="peopleCount" class="form-control" value="${location?.peopleCount || 1}" min="1"></div>
                </div>
              </div>

              <div class="card mb-20 stagger-item" style="animation-delay:0.2s">
                <div class="card-header"><h3>Mức độ khẩn cấp</h3></div>
                <div class="card-body">
                  ${URGENCY.map(u => `
                    <label class="radio-card ${(location?.urgency || "normal") === u.value ? "checked" : ""}">
                      <input type="radio" name="urgency" value="${u.value}" ${(location?.urgency || "normal") === u.value ? "checked" : ""}>
                      <span class="radio-dot" style="background:${u.color}"></span>
                      <span>${u.label}</span>
                    </label>
                  `).join("")}
                </div>
              </div>

              <div style="display:flex;gap:12px;" class="stagger-item" style="animation-delay:0.25s">
                <button type="submit" class="btn btn--primary btn--lg" style="flex:1">${location ? "Lưu thay đổi" : "Thêm địa điểm"}</button>
                <a href="/admin/dashboard" class="btn btn--ghost btn--lg">Hủy</a>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  `;

  // Init Map
  let smap, smarker;
  setTimeout(() => {
    smap = L.map("map-picker").setView([location?.lat || 16.047079, location?.lng || 108.206230], location ? 15 : 5);
    L.tileLayer("https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
      attribution: "Google Maps"
    }).addTo(smap);

    if (location) {
      smarker = L.marker([location.lat, location.lng]).addTo(smap);
    }

    smap.on("click", async e => {
      if (smarker) smap.removeLayer(smarker);
      smarker = L.marker(e.latlng).addTo(smap);
      document.getElementById("input-lat").value = e.latlng.lat;
      document.getElementById("input-lng").value = e.latlng.lng;
      
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`);
        const data = await res.json();
        if (data && data.display_name) {
          document.getElementById("input-address").value = data.display_name;
        }
      } catch (err) {}
    });

    document.getElementById("picker-locate")?.addEventListener("click", () => {
      if (!navigator.geolocation) return Toast.show("Trình duyệt không hỗ trợ.", "error");
      navigator.geolocation.getCurrentPosition(pos => {
        const latlng = [pos.coords.latitude, pos.coords.longitude];
        smap.setView(latlng, 15);
        if (smarker) smap.removeLayer(smarker);
        smarker = L.marker(latlng).addTo(smap);
        document.getElementById("input-lat").value = latlng[0];
        document.getElementById("input-lng").value = latlng[1];
      });
    });
  }, 100);

  // Bindings
  document.querySelectorAll("input[type=checkbox]").forEach(cb => {
    cb.addEventListener("change", function() {
      this.closest(".check-card").classList.toggle("checked", this.checked);
    });
  });

  document.querySelectorAll("input[type=radio]").forEach(rd => {
    rd.addEventListener("change", function() {
      document.querySelectorAll('.radio-card').forEach(c=>c.classList.remove('checked'));
      this.closest('.radio-card').classList.add('checked');
    });
  });

  let currentFile = null;
  document.getElementById("img-file-input")?.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return Toast.show("Ảnh tối đa 5MB", "error");
    currentFile = file;
    const reader = new FileReader();
    reader.onload = ev => {
      const img = document.getElementById("img-preview");
      img.src = ev.target.result;
      document.getElementById("img-preview-wrap").style.display = "block";
    };
    reader.readAsDataURL(file);
  });

  document.getElementById("location-form")?.addEventListener("submit", async e => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    
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
    if (currentFile) fd.append("image", currentFile);

    const prev = btn.innerHTML;
    btn.innerHTML = '<span class="spinner"></span> Đang xử lý...';
    btn.disabled = true;

    try {
      if (locId) {
        await updateLocation(locId, fd);
        Toast.show("Cập nhật địa điểm thành công!");
      } else {
        await createLocation(fd);
        Toast.show("Đã thêm địa điểm thành công!");
      }
      router.navigate("/admin/dashboard");
    } catch(err) {
      Toast.show(err.message || "Lỗi xử lý địa điểm", "error");
      btn.innerHTML = prev;
      btn.disabled = false;
    }
  });
};
