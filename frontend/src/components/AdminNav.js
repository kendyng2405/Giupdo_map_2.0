export const adminNav = (active, role = "admin") => {
  const isFounder = role === "founder";
  
  const items = [
      { id: "dashboard", href: "/admin/dashboard", label: "Bảng điều khiển", icon: `<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>` },
      { id: "new", href: "/admin/locations/new", label: "Thêm địa điểm", icon: `<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>` },
      { id: "suggestions", href: "/admin/suggestions", label: "Đề xuất", icon: `<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>` },
      ...(isFounder ? [{ id: "users", href: "/admin/users", label: "Quản lý người dùng", icon: `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>` }] : []),
      { id: "home-link", href: "/home", label: "Xem bản đồ", icon: `<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>` },
      { id: "profile-link", href: "/profile", label: "Hồ sơ", icon: `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>` },
  ];

  const navLabel = isFounder ? "Người Sáng Lập" : "Người Dẫn Lửa";

  return `<div class="admin-nav-label">${navLabel}</div>` + 
         items.map(item => `
             <a href="${item.href}" class="admin-nav-item ${active === item.id ? "active" : ""}">
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${item.icon}</svg>
                 ${item.label}
             </a>
         `).join("");
};
