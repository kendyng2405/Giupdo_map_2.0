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
              <h3><span style="font-family:'Playfair Display',serif;font-weight:700;font-size:2.2rem;color:var(--text);">100%</span></h3>
              <p>Phủ sóng toàn quốc</p>
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
              <p>Bất kỳ ai cũng có thể báo cáo và đề xuất một hoàn cảnh khó khăn lên hệ thống bản đồ trực tuyến.</p>
            </div>
            <div class="feature-card fade-up" style="animation-delay: 0.2s">
              <div class="f-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
              </div>
              <h3>Xác thực thông tin</h3>
              <p>Đội ngũ quản trị và cộng đồng sẽ kiểm tra chéo tính xác thực để đảm bảo tính minh bạch tuyệt đối.</p>
            </div>
            <div class="feature-card fade-up" style="animation-delay: 0.3s">
              <div class="f-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </div>
              <h3>Kết nối trực tiếp</h3>
              <p>Nhà hảo tâm có thể tới tận nơi hỗ trợ trực tiếp hoàn cảnh khó khăn mà không cần qua bất kỳ trung gian nào.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="about-section" style="padding: 100px 0;">
        <div class="container">
          <div class="about-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center;">
            <div class="about-visual fade-up">
              <img src="https://images.unsplash.com/photo-1593113589914-07553f1a0e88?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Từ thiện" style="width: 100%; border-radius: 24px; box-shadow: var(--shadow-lg);">
            </div>
            <div class="about-content fade-up" style="animation-delay: 0.2s">
              <h2 class="section-title" style="text-align: left; margin-bottom: 24px;">Sứ mệnh của chúng tôi</h2>
              <p style="font-size: 1.1rem; color: var(--text-muted); line-height: 1.8; margin-bottom: 20px;">
                Trái Tim Việt được sinh ra với mong muốn xóa bỏ khoảng cách giữa những người cần giúp đỡ và những nhà hảo tâm. Bằng cách áp dụng công nghệ bản đồ số hoá, chúng tôi giúp mọi nguồn lực thiện nguyện đi đến đúng nơi, đúng lúc và hoàn toàn minh bạch.
              </p>
              <p style="font-size: 1.1rem; color: var(--text-muted); line-height: 1.8; margin-bottom: 30px;">
                Với mạng lưới phủ sóng khắp các tỉnh thành trên toàn quốc, mọi đề xuất của bạn đều có thể thay đổi một cuộc đời. Hãy cùng nhau xây dựng một cộng đồng tử tế và vững mạnh.
              </p>
              <a href="/register" class="btn btn--primary btn--lg">Trở thành Người dẫn lửa</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;

  // Setup sequential scroll animations
  const fadeElements = document.querySelectorAll('.fade-up');
  
  // Remove animation from CSS to control via JS class
  fadeElements.forEach(el => {
    el.style.animation = 'none';
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
  });

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = `fadeUpAnim 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards`;
        // Keep the inline animation-delay if it exists
        scrollObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  fadeElements.forEach(el => scrollObserver.observe(el));

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
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        updateCount();
        observer.disconnect();
      }
    });
    observer.observe(counter);
  });

  // --- Liquid/Fluid Mouse Effect ---
  const canvas = document.createElement('canvas');
  canvas.id = 'fluid-canvas';
  Object.assign(canvas.style, {
    position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
    pointerEvents: 'none', zIndex: '-1', opacity: '0.6'
  });
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  let width, height, particles = [];
  const mouse = { x: -1000, y: -1000 };

  const resize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', resize);
  resize();

  const handleMouseMove = e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    for(let i=0; i<3; i++) {
      particles.push({
        x: mouse.x, y: mouse.y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 15 + 5,
        life: 1
      });
    }
  };

  window.addEventListener('mousemove', handleMouseMove);

  const render = () => {
    if (!document.getElementById('fluid-canvas')) return; // Cleanup on unmount
    ctx.clearRect(0, 0, width, height);
    
    // Draw liquid particles
    particles.forEach((p, index) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.02;
      p.size *= 0.95;
      
      if (p.life <= 0) {
        particles.splice(index, 1);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(184, 50, 40, ${p.life * 0.3})`;
        ctx.fill();
      }
    });
    requestAnimationFrame(render);
  };
  render();

  // Cleanup canvas when navigating away from landing
  const cleanup = () => {
    const c = document.getElementById('fluid-canvas');
    if (c) c.remove();
    window.removeEventListener('resize', resize);
    window.removeEventListener('mousemove', handleMouseMove);
  };
  
  // Bind cleanup to router changes (rough implementation)
  const appObserver = new MutationObserver(() => {
    if (!document.querySelector('.landing-page')) {
      cleanup();
      appObserver.disconnect();
    }
  });
  appObserver.observe(app, { childList: true });
};
