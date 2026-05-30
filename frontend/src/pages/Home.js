import { getLocations, supportLocation } from "../api/location.api.js";
import { getLeaderboard } from "../api/user.api.js";
import { Toast } from "../components/Toast.js";

let mapInstance = null;
let markersLayer = [];
let userLocationLayer = null; 

export const Home = async ({ user, userData }) => {
  const app = document.getElementById("app");
  
  app.innerHTML = `
    <div class="map-wrap">
      ${!user ? `
        <div class="map-welcome marker-entrance" id="welcome-banner">
          <h2>Bản đồ từ thiện</h2>
          <p>Đăng nhập để hỗ trợ và tích lũy điểm</p>
          <a href="/login" class="btn btn--primary btn--sm">Đăng nhập</a>
        </div>
      ` : ""}
      
      <div class="map-controls marker-entrance">
        <button class="btn btn--white shadow-soft" id="locate-btn" title="Vị trí của tôi" style="padding:10px 14px; border-radius:12px; display:flex; align-items:center;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
      </div>
      
      <div id="map"></div>
      
      <div class="map-filter-bar marker-entrance">
        <span class="map-count-badge" id="map-count-badge" style="position:static;background:transparent;border:none;box-shadow:none;padding:4px 6px;font-size:.78rem;color:var(--text-muted);white-space:nowrap;">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:3px;">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span id="map-count-badge-text">0 địa điểm</span>
        </span>
        <div style="width:1px;height:16px;background:var(--border);margin:0 4px;"></div>
        
        <button class="filter-chip active" data-filter="all">Tất cả</button>
        <button class="filter-chip" data-filter="critical"><span class="dot" style="background:#EF4444"></span>Rất khẩn</button>
        <button class="filter-chip" data-filter="urgent"><span class="dot" style="background:#EAB308"></span>Khẩn cấp</button>
        <button class="filter-chip" data-filter="normal"><span class="dot" style="background:#22C55E"></span>Bình thường</button>

        <select id="radius-filter" class="radius-select">
          <option value="0">Khắp cả nước</option>
          <option value="1">Quanh đây 1km</option>
          <option value="3">Quanh đây 3km</option>
          <option value="5">Quanh đây 5km</option>
          <option value="10">Quanh đây 10km</option>
        </select>
      </div>
      
      <div id="radius-results" class="radius-results-panel">
        <div class="radius-header">
           <h3 id="radius-title">Gần bạn</h3>
           <button id="radius-close" class="radius-close">×</button>
        </div>
        <div id="radius-list" class="radius-list"></div>
      </div>

      <div class="map-sidebar" id="map-sidebar"></div>
    </div>
  `;

  try {
    const [locationsRes, leaderboardRes] = await Promise.all([
      getLocations(true),
      getLeaderboard()
    ]);
    const locations = locationsRes.data || [];
    _initFilterAndLocate(locations, user, userData);
    _initMapWhenReady(locations, user, userData);
  } catch (err) {
    console.error("Home error:", err);
    Toast.show("Lỗi tải dữ liệu bản đồ.", "error");
  }
};

let watchId = null;

function _initFilterAndLocate(locations, user, userData) {
  document.querySelectorAll(".filter-chip").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-chip").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      if (!mapInstance || !window.markerClusterGroup) return;
      window.markerClusterGroup.clearLayers();
      markersLayer.forEach(({ marker, loc }) => {
        const show = f === "all" || loc.urgency === f;
        if (show) window.markerClusterGroup.addLayer(marker);
      });
    });
  });

  const locateBtn = document.getElementById("locate-btn");
  if (locateBtn) {
    locateBtn.addEventListener("click", () => {
      if (userLocationLayer && mapInstance) {
        mapInstance.flyTo(userLocationLayer.getLatLng(), 16, { animate: true });
      } else {
        Toast.show("Đang tìm vị trí của bạn...", "info");
      }
    });
  }

  // Automatically track user location
  if (navigator.geolocation) {
    if (watchId) navigator.geolocation.clearWatch(watchId);
    let isFirstPan = true;

    watchId = navigator.geolocation.watchPosition(pos => {
      if (!mapInstance) return;
      
      const latlng = [pos.coords.latitude, pos.coords.longitude];
      
      if (!userLocationLayer) {
        const icon = L.divIcon({
          html: `<div class="user-pulse-dot-wrap"><div class="user-pulse-dot"></div><div class="user-pulse-ring"></div></div>`,
          className: "", iconSize: [24, 24], iconAnchor: [12, 12]
        });
        userLocationLayer = L.marker(latlng, { icon, zIndexOffset: 1000 }).addTo(mapInstance);
      } else {
        userLocationLayer.setLatLng(latlng);
      }
      
      // Only pan automatically on the very first GPS hit so we don't annoy the user
      if (isFirstPan) {
        mapInstance.setView(latlng, 14, { animate: true });
        isFirstPan = false;
      }
    }, err => {
      console.warn("Geolocation tracking failed or denied.", err);
    }, { enableHighAccuracy: true });
  }

  const radiusSelect = document.getElementById("radius-filter");
  const radiusPanel = document.getElementById("radius-results");
  const radiusList = document.getElementById("radius-list");
  const radiusTitle = document.getElementById("radius-title");

  document.getElementById("radius-close")?.addEventListener("click", () => {
    radiusPanel.classList.remove("open");
    radiusSelect.value = "0";
    // Reset markers to show all
    if (window.markerClusterGroup) {
      window.markerClusterGroup.clearLayers();
      markersLayer.forEach(({ marker }) => window.markerClusterGroup.addLayer(marker));
    }
  });

  radiusSelect?.addEventListener("change", (e) => {
    const km = parseFloat(e.target.value);
    if (km === 0) {
      radiusPanel.classList.remove("open");
      if (window.markerClusterGroup) {
        window.markerClusterGroup.clearLayers();
        markersLayer.forEach(({ marker }) => window.markerClusterGroup.addLayer(marker));
      }
      return;
    }

    radiusPanel.classList.add("open");
    radiusList.innerHTML = '<div style="text-align:center;padding:20px;"><span class="spinner"></span><p>Đang tìm vị trí của bạn...</p></div>';

    if (!navigator.geolocation) {
      radiusList.innerHTML = '<div style="padding:20px;color:var(--text-muted);">Không hỗ trợ định vị</div>';
      return;
    }

    navigator.geolocation.getCurrentPosition(pos => {
      const userLat = pos.coords.latitude;
      const userLng = pos.coords.longitude;
      
      const nearby = locations.map(loc => {
        const dist = _haversineKm(userLat, userLng, loc.lat, loc.lng);
        return { ...loc, dist };
      }).filter(l => l.dist <= km).sort((a, b) => a.dist - b.dist);

      radiusTitle.textContent = `${nearby.length} địa điểm (<${km}km)`;
      
      // Update map markers
      if (window.markerClusterGroup) {
        window.markerClusterGroup.clearLayers();
        markersLayer.forEach(({ marker, loc }) => {
          const d = _haversineKm(userLat, userLng, loc.lat, loc.lng);
          if (d <= km) window.markerClusterGroup.addLayer(marker);
        });
      }

      if (nearby.length === 0) {
        radiusList.innerHTML = '<div style="padding:20px;color:var(--text-muted);">Không có trường hợp nào trong bán kính này.</div>';
        return;
      }

      radiusList.innerHTML = nearby.map(loc => {
        const distStr = loc.dist < 1 ? Math.round(loc.dist * 1000) + 'm' : loc.dist.toFixed(1) + 'km';
        return `
          <div class="radius-item" data-id="${loc.id}">
            <h4>${loc.title}</h4>
            <p>${loc.address || 'Không rõ địa chỉ'}</p>
            <span class="radius-item-dist">Cách đây ${distStr}</span>
          </div>
        `;
      }).join("");

      radiusList.querySelectorAll(".radius-item").forEach(item => {
        item.addEventListener("click", () => {
          const loc = locations.find(l => l.id === item.dataset.id);
          if (loc && mapInstance) {
            mapInstance.flyTo([loc.lat, loc.lng], 16, { animate: true, duration: 0.8 });
            _openSidebar(loc, user, userData, document.getElementById("map-sidebar"));
            if(window.innerWidth < 768) radiusPanel.classList.remove("open");
          }
        });
      });

    }, () => {
      radiusList.innerHTML = '<div style="padding:20px;color:var(--text-muted);">Từ chối hoặc không thể định vị.</div>';
    }, { maximumAge: 600000, timeout: 8000, enableHighAccuracy: false });
  });
}

function _initMapWhenReady(locations, user, userData) {
  requestAnimationFrame(() => {
    setTimeout(() => {
      const mapEl = document.getElementById("map");
      if (!mapEl) {
        setTimeout(() => _initMapWhenReady(locations, user, userData), 200);
        return;
      }
      if (typeof L === "undefined") {
        Toast.show("Lỗi tải bản đồ. Vui lòng tải lại trang.", "error");
        return;
      }
      if (mapInstance) {
        try { mapInstance.off(); mapInstance.remove(); } catch(e) {}
        mapInstance = null;
        markersLayer = [];
        userLocationLayer = null;
        if (window.markerClusterGroup) window.markerClusterGroup = null;
      }
      mapInstance = L.map(mapEl, {
        center: [16.047079, 108.206230],
        zoom: 6,
        zoomControl: false,
        preferCanvas: true,
      });
      L.control.zoom({ position: "topright" }).addTo(mapInstance);
      L.tileLayer("https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
        attribution: '&copy; <a href="https://www.google.com/maps">Google Maps</a>',
        maxZoom: 20,
      }).addTo(mapInstance);
      mapInstance.invalidateSize();
      markersLayer = [];
      _plotMarkers(locations, user, userData);
      const badge = document.getElementById("map-count-badge-text");
      if (badge) badge.textContent = `${locations.length} địa điểm`;
      if (locations.length > 0 && markersLayer.length > 0) {
        try {
          const group = L.featureGroup(markersLayer.map(m => m.marker));
          if (group.getBounds().isValid()) mapInstance.fitBounds(group.getBounds().pad(0.3));
        } catch(e) {}
      }
    }, 100);
  });
}

function _plotMarkers(locations, user, userData) {
  if (!mapInstance) return;
  const urgencyColors = { normal: "#22C55E", urgent: "#EAB308", critical: "#EF4444" };
  const sidebar = document.getElementById("map-sidebar");

  if (!document.getElementById("pulse-style")) {
    const style = document.createElement("style");
    style.id = "pulse-style";
    style.textContent = `
      .marker-dot-wrap { position: relative; width: 28px; height: 28px; cursor: pointer; }
      .marker-dot { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 14px; height: 14px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); transition: transform 0.18s cubic-bezier(.34,1.56,.64,1); z-index: 2; }
      .marker-dot-wrap:hover .marker-dot { transform: translate(-50%, -50%) scale(1.35); }
      .marker-ring { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(1); width: 14px; height: 14px; border-radius: 50%; opacity: 0; animation: dotPulse 2.4s ease-out infinite; z-index: 1; }
      .marker-ring-2 { animation-delay: 0.8s; }
      .marker-ring-3 { animation-delay: 1.6s; }
      @keyframes dotPulse { 0% { transform: translate(-50%, -50%) scale(1); opacity: 0.65; } 100% { transform: translate(-50%, -50%) scale(3.8); opacity: 0; } }
      .marker-cluster-custom { background-clip: padding-box; border-radius: 20px; }
      .marker-cluster-custom div { width: 30px; height: 30px; margin-left: 5px; margin-top: 5px; text-align: center; border-radius: 15px; font: 12px "Helvetica Neue", Arial, Helvetica, sans-serif; display:flex; align-items:center; justify-content:center; font-weight: bold; color: white; background-color: var(--accent); box-shadow: 0 2px 6px rgba(0,0,0,0.3); }
    `;
    document.head.appendChild(style);
  }

  if (window.markerClusterGroup) {
    mapInstance.removeLayer(window.markerClusterGroup);
  }
  
  window.markerClusterGroup = L.markerClusterGroup({
    chunkedLoading: true,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    iconCreateFunction: function (cluster) {
      return L.divIcon({
        html: '<div><span>' + cluster.getChildCount() + '</span></div>',
        className: 'marker-cluster-custom',
        iconSize: L.point(40, 40)
      });
    }
  });

  locations.forEach(loc => {
    const color = urgencyColors[loc.urgency] || "#22C55E";
    const html = `
      <div class="marker-dot-wrap marker-entrance">
        <div class="marker-dot" style="background:${color}"></div>
        <div class="marker-ring" style="background:${color}"></div>
        <div class="marker-ring marker-ring-2" style="background:${color}"></div>
        <div class="marker-ring marker-ring-3" style="background:${color}"></div>
      </div>`;

    const icon = L.divIcon({
      html, className: "",
      iconSize: [28, 28], iconAnchor: [14, 14], popupAnchor: [0, -16]
    });
    const marker = L.marker([loc.lat, loc.lng], { icon });
    marker.on("click", e => {
      L.DomEvent.stopPropagation(e);
      mapInstance.flyTo([loc.lat, loc.lng], 16, { animate: true, duration: 0.8 });
      _openSidebar(loc, user, userData, sidebar);
    });
    window.markerClusterGroup.addLayer(marker);
    markersLayer.push({ marker, loc });
  });

  mapInstance.addLayer(window.markerClusterGroup);
  mapInstance.on("click", () => sidebar?.classList.remove("open"));
}

function _haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function _openSidebar(loc, user, userData, sidebar) {
  if (!sidebar) return;

  const HL = { food: "Thực phẩm", clothes: "Quần áo", money: "Tiền mặt", medical: "Y tế", shelter: "Chỗ ở", other: "Khác" };
  const UL = { normal: "Bình thường", urgent: "Khẩn cấp", critical: "Rất khẩn" };
  const uc = { normal: "#22C55E", urgent: "#EAB308", critical: "#EF4444" }[loc.urgency] || "#22C55E";

  const isPriv = userData?.role === "admin" || userData?.role === "founder";
  const actionBtn = user && userData?.role === "member"
    ? `<button class="btn btn--primary btn--full" id="checkin-btn" data-id="${loc.id}">Xác nhận hỗ trợ tại đây</button>`
    : user && isPriv
    ? `<a href="/admin/locations/${loc.id}/edit" class="btn btn--ghost btn--full">Chỉnh sửa địa điểm</a>`
    : `<a href="/login" class="btn btn--primary btn--full">Đăng nhập để hỗ trợ</a>`;

  sidebar.innerHTML = `
    <div class="sidebar-header">
      <h3 class="sidebar-title">Chi tiết địa điểm</h3>
      <button class="sidebar-close" id="sidebar-close">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
    <div class="urgency-strip" style="background:${uc}"></div>
    ${loc.imageUrl
      ? `<img src="${loc.imageUrl}" class="sidebar-img" alt="${loc.title}" loading="lazy">`
      : `<div class="sidebar-img-placeholder">Chưa có ảnh</div>`}
    <h2 class="sidebar-loc-title">${loc.title}</h2>
    <div class="sidebar-badges">
      <span class="badge" style="background:${uc}20;color:${uc};">${UL[loc.urgency] || ""}</span>
      <span class="badge badge--muted">${loc.peopleCount || 1} người</span>
    </div>
    <div class="sidebar-help-types">
      ${(loc.helpTypes || []).map(t => `<span class="chip stagger-item">${HL[t] || t}</span>`).join("")}
    </div>
    ${loc.description ? `<p class="sidebar-desc">${loc.description}</p>` : ""}
    <div class="sidebar-meta-grid">
      <div class="meta-box stagger-item">
        <div class="meta-label">Thời gian</div>
        <div class="meta-val">${loc.timeFrom || "?"} — ${loc.timeTo || "?"}</div>
      </div>
      <div class="meta-box stagger-item">
        <div class="meta-label">Hỗ trợ</div>
        <div class="meta-val" style="color:var(--accent)">${loc.supportCount || 0} lượt</div>
      </div>
    </div>
    ${loc.address ? `
    <div class="sidebar-address">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
      </svg>
      ${loc.address}
    </div>` : ""}
    ${loc.note ? `<div class="sidebar-note">${loc.note}</div>` : ""}
    <div class="sidebar-actions">
      ${actionBtn}
      <a href="https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}" target="_blank" rel="noopener" class="btn btn--gmaps btn--full stagger-item">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0">
          <polygon points="3 11 22 2 13 21 11 13 3 11"/>
        </svg>
        Chỉ đường trên Google Maps
      </a>
    </div>`;

  sidebar.classList.add("open");
  document.getElementById("sidebar-close")?.addEventListener("click", () => sidebar.classList.remove("open"));

  document.getElementById("checkin-btn")?.addEventListener("click", async e => {
    const btn = e.currentTarget;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Đang lấy vị trí...';
    if (!navigator.geolocation) {
      Toast.show("Trình duyệt không hỗ trợ định vị.", "error");
      btn.disabled = false; btn.textContent = "Xác nhận hỗ trợ tại đây";
      return;
    }
    navigator.geolocation.getCurrentPosition(async pos => {
      try {
        const dist = _haversineKm(pos.coords.latitude, pos.coords.longitude, loc.lat, loc.lng);
        if (dist > 0.5) {
          Toast.show(`Bạn cách ${Math.round(dist * 1000)}m. Cần đến gần hơn (trong 500m).`, "error");
          btn.disabled = false; btn.textContent = "Xác nhận hỗ trợ tại đây";
          return;
        }
        
        const res = await supportLocation(loc.id, pos.coords.latitude, pos.coords.longitude);
        if (res.alreadySupported) {
          Toast.show("Bạn đã hỗ trợ địa điểm này rồi!");
          btn.disabled = false; return;
        }
        Toast.show(`Cảm ơn bạn! +1 điểm — Tổng: ${res.points} điểm`);
        btn.textContent = "Đã hỗ trợ";
        btn.style.opacity = "0.6";
      } catch(err) {
        console.error(err);
        Toast.show("Lỗi ghi nhận hỗ trợ.", "error");
        btn.disabled = false; btn.textContent = "Xác nhận hỗ trợ tại đây";
      }
    }, () => {
      Toast.show("Không thể lấy vị trí. Hãy cho phép truy cập vị trí.", "error");
      btn.disabled = false; btn.textContent = "Xác nhận hỗ trợ tại đây";
    });
  });
}
