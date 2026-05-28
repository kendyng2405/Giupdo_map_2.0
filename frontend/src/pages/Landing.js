export const Landing = async ({ user }) => {
  const app = document.getElementById("app");
  
  app.innerHTML = `
    <div class="landing-page">
      <section class="hero-section">
        <div class="hero-content">
          <div class="hero-badge fade-up" style="animation-delay: 0.1s">
            <span class="pulse-dot"></span> Sức mạnh của cộng đồng
          </div>
          <h1 class="hero-title fade-up" style="animation-delay: 0.2s">
            Lan tỏa yêu thương,<br>Kết nối <em>những mảnh đời</em>.
          </h1>
          <p class="hero-desc fade-up" style="animation-delay: 0.3s">
            Bản đồ Trái Tim Việt giúp người làm thiện nguyện tìm thấy và hỗ trợ trực tiếp những hoàn cảnh khó khăn xung quanh mình một cách nhanh chóng, minh bạch.
          </p>
          <div class="hero-actions fade-up" style="animation-delay: 0.4s">
            <a href="/home" class="btn btn--primary btn--lg hero-btn">
              Mở Bản Đồ Từ Thiện
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            ${!user ? `<a href="/register" class="btn btn--ghost btn--lg hero-btn">Tham gia ngay</a>` : ''}
          </div>
          
          <div class="hero-stats fade-up" style="animation-delay: 0.5s">
            <div class="stat-item">
              <h3 class="count-up" data-target="1500">1,500+</h3>
              <p>Hoàn cảnh được giúp</p>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <h3 class="count-up" data-target="3000">3,000+</h3>
              <p>Người dẫn lửa</p>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <h3 class="count-up" data-target="50">50+</h3>
              <p>Tỉnh thành</p>
            </div>
          </div>
        </div>
        
        <div class="hero-visual fade-up" style="animation-delay: 0.3s">
          <div class="map-mockup">
            <div class="mockup-header">
              <div class="dots"><span></span><span></span><span></span></div>
              <div class="url-bar">traitimviet.online/home</div>
            </div>
            <div class="mockup-body">
              <div class="pulse-marker" style="top:30%; left:40%;"></div>
              <div class="pulse-marker" style="top:60%; left:70%; animation-delay: 1s;"></div>
              <div class="pulse-marker" style="top:45%; left:20%; animation-delay: 2s;"></div>
            </div>
          </div>
        </div>
      </section>

      <section class="features-section">
        <div class="container">
          <h2 class="section-title fade-up">Hoạt động như thế nào?</h2>
          <div class="features-grid">
            <div class="feature-card fade-up" style="animation-delay: 0.1s">
              <div class="f-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <h3>Ghim địa điểm</h3>
              <p>Bất kỳ ai cũng có thể báo cáo và đề xuất một hoàn cảnh khó khăn lên hệ thống bản đồ.</p>
            </div>
            <div class="feature-card fade-up" style="animation-delay: 0.2s">
              <div class="f-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
              </div>
              <h3>Xác thực thông tin</h3>
              <p>Đội ngũ quản trị sẽ kiểm tra tính xác thực để đảm bảo tính minh bạch cho các nhà hảo tâm.</p>
            </div>
            <div class="feature-card fade-up" style="animation-delay: 0.3s">
              <div class="f-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </div>
              <h3>Kết nối trực tiếp</h3>
              <p>Nhà hảo tâm có thể tới tận nơi hỗ trợ trực tiếp không cần qua bất kỳ trung gian nào.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;

  // Animate count up
  const counters = document.querySelectorAll('.count-up');
  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    const increment = target / 100;
    
    const updateCount = () => {
      const c = +counter.innerText.replace(/,/g, '');
      if (c < target) {
        counter.innerText = Math.ceil(c + increment).toLocaleString();
        setTimeout(updateCount, 20);
      } else {
        counter.innerText = target.toLocaleString() + "+";
      }
    };
    
    // Intersection observer to start animation when visible
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        updateCount();
        observer.disconnect();
      }
    });
    observer.observe(counter);
  });
};
