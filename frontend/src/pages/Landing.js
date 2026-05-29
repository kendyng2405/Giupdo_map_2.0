import { getLocations } from "../api/location.api.js";
import { getLeaderboard } from "../api/user.api.js";

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
              <h3 class="count-up" id="loc-count" data-target="0">0</h3>
              <p>Hoàn cảnh khó khăn</p>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <h3 class="count-up" id="user-count" data-target="0">0</h3>
              <p>Người dẫn lửa</p>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <h3 class="count-up" data-target="1">0</h3>
              <p>Đang trực tuyến</p>
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

      <section class="stories-section" style="padding: 100px 0; background: var(--bg2);">
        <div class="container">
          <h2 class="section-title fade-up">Câu chuyện truyền cảm hứng</h2>
          <div class="features-grid" style="margin-top: 40px;">
            <div class="feature-card fade-up" style="padding: 30px; text-align: left; background: var(--card);">
              <p style="font-style: italic; color: var(--text-muted); margin-bottom: 20px;">"Nhờ có bản đồ Trái Tim Việt, tôi đã tìm được chú Ba chạy xe ôm ở đầu ngõ để trao tặng chiếc xe lăn mới. Ánh mắt vui mừng của chú là động lực để tôi tiếp tục hành trình."</p>
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 40px; height: 40px; background: var(--accent); border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold;">M</div>
                <div>
                  <h4 style="margin:0; font-size: 1rem;">Minh Tuấn</h4>
                  <p style="margin:0; font-size: 0.85rem; color: var(--text-muted);">Người Dẫn Lửa - TP.HCM</p>
                </div>
              </div>
            </div>
            <div class="feature-card fade-up" style="padding: 30px; text-align: left; background: var(--card); animation-delay: 0.15s;">
              <p style="font-style: italic; color: var(--text-muted); margin-bottom: 20px;">"Không ngờ những xóm trọ công nhân nghèo ngay sát công ty mình lại đang thiếu thốn đến vậy. Giờ cuối tuần nào nhóm mình cũng tổ chức nấu ăn phát cơm tại đây."</p>
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 40px; height: 40px; background: var(--border); border-radius: 50%; color: var(--text); display: flex; align-items: center; justify-content: center; font-weight: bold;">H</div>
                <div>
                  <h4 style="margin:0; font-size: 1rem;">Hoàng Oanh</h4>
                  <p style="margin:0; font-size: 0.85rem; color: var(--text-muted);">Nhân viên văn phòng - Hà Nội</p>
                </div>
              </div>
            </div>
            <div class="feature-card fade-up" style="padding: 30px; text-align: left; background: var(--card); animation-delay: 0.3s;">
              <p style="font-style: italic; color: var(--text-muted); margin-bottom: 20px;">"Chỉ với một cú click ghim vị trí, trại trẻ mồ côi xã nhà đã nhận được sự trợ giúp từ những nhà hảo tâm tận miền Nam gửi ra. Vô cùng biết ơn cộng đồng!"</p>
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 40px; height: 40px; background: #EAB308; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold;">T</div>
                <div>
                  <h4 style="margin:0; font-size: 1rem;">Trần Thanh</h4>
                  <p style="margin:0; font-size: 0.85rem; color: var(--text-muted);">Tình nguyện viên - Đà Nẵng</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="about-section" style="padding: 100px 0;">
        <div class="container">
          <div class="about-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center;">
            <div class="about-visual fade-up">
              <img src="https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Việt Nam" style="width: 100%; border-radius: 24px; box-shadow: var(--shadow-lg); object-fit: cover; height: 350px;">
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
      <section class="scroll-anim-section" id="scroll-anim-section">
        <div class="scroll-anim-sticky">
          <h1 class="scroll-anim-text" id="scroll-anim-text">KẾT NỐI YÊU THƯƠNG</h1>
        </div>
      </section>

      <section class="contact-section" style="padding: 100px 0; background: var(--bg2); position: relative; overflow: hidden;">
        <!-- Contact Background Landscape -->
        <div style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; background-image: url('https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1920&q=80'); background-size: cover; background-position: center; opacity: 0.15; filter: grayscale(50%);"></div>
        
        <div class="container" style="position: relative; z-index: 2;">
          <div class="auth-card" style="margin: 0 auto; max-width: 600px;">
            <h2 class="section-title" style="margin-bottom: 24px;">Liên hệ với chúng tôi</h2>
            <p style="text-align:center; color: var(--text-muted); margin-bottom: 32px;">Nếu bạn có thắc mắc hoặc muốn hợp tác, hãy gửi tin nhắn cho chúng tôi.</p>
            <form id="contact-form">
              <div class="form-group">
                <label>Họ và tên</label>
                <input type="text" name="name" class="form-control" required placeholder="Nhập họ và tên">
              </div>
              <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" class="form-control" required placeholder="Nhập địa chỉ email">
              </div>
              <div class="form-group">
                <label>Nội dung</label>
                <textarea class="form-control" name="message" required placeholder="Nội dung liên hệ..."></textarea>
              </div>
              <button type="submit" class="btn btn--primary btn--full btn--lg">Gửi lời nhắn</button>
            </form>
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
  const runCount = (counter) => {
    const target = +counter.getAttribute('data-target');
    if (target === 0) return; // Wait for data
    const increment = target / 100;
    
    const updateCount = () => {
      const c = +counter.innerText.replace(/,/g, '');
      if (c < target) {
        counter.innerText = Math.ceil(c + increment).toLocaleString();
        setTimeout(updateCount, 20);
      } else {
        counter.innerText = target.toLocaleString() + (target === 1 ? "" : "+");
      }
    };
    updateCount();
  };

  const counters = document.querySelectorAll('.count-up');
  counters.forEach(counter => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        counter.dataset.started = "true";
        runCount(counter);
        observer.disconnect();
      }
    });
    observer.observe(counter);
  });

  // Fetch stats asynchronously so it doesn't block UI load
  Promise.all([getLocations(true), getLeaderboard()]).then(([locRes, leadRes]) => {
    const locCount = (locRes.data || []).length;
    const userCount = (leadRes.data || []).length;
    
    const elLoc = document.getElementById("loc-count");
    const elUser = document.getElementById("user-count");
    
    if (elLoc) {
      elLoc.setAttribute("data-target", locCount);
      if (elLoc.dataset.started === "true") runCount(elLoc);
    }
    if (elUser) {
      elUser.setAttribute("data-target", userCount);
      if (elUser.dataset.started === "true") runCount(elUser);
    }
  }).catch(e => console.error(e));

  // --- Liquid/Fluid Mouse Effect ---
  // The user requested to remove the canvas mouse trail completely.

  // --- Scroll Scrub Animation ---
  const animSection = document.getElementById('scroll-anim-section');
  const animText = document.getElementById('scroll-anim-text');
  
  const handleScrollAnim = () => {
    if (!animSection || !animText) return;
    const rect = animSection.getBoundingClientRect();
    
    // Total scrollable distance is height - viewport
    const totalScroll = rect.height - window.innerHeight;
    
    // We start when rect.top <= window.innerHeight and finish when rect.bottom <= window.innerHeight
    if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
      let progress = Math.abs(rect.top) / totalScroll;
      
      // Enhance the animation curve
      const scale = 0.5 + progress * 1.5; // Scales from 0.5 to 2.0
      // Opacity fades in early and fades out very late
      let opacity = progress * 3;
      if (progress > 0.8) opacity = (1 - progress) * 5; // fade out at end
      
      // translateY to make it float up slightly
      const translateY = 20 - (progress * 20); // 20vh to 0vh
      
      animText.style.transform = `scale(${scale}) translateY(${translateY}vh)`;
      animText.style.opacity = Math.min(Math.max(opacity, 0), 1);
    } else if (rect.top > 0) {
      animText.style.transform = `scale(0.5) translateY(20vh)`;
      animText.style.opacity = 0;
    } else if (rect.bottom < window.innerHeight) {
      animText.style.opacity = 0;
    }
  };
  
  window.addEventListener('scroll', handleScrollAnim, { passive: true });
  handleScrollAnim(); // init state

  // --- Contact Form Logic ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button');
      const prev = btn.innerHTML;
      btn.innerHTML = '<span class="spinner"></span> Đang gửi...';
      btn.disabled = true;
      
      const formData = {
        name: contactForm.name.value,
        email: contactForm.email.value,
        message: contactForm.message.value
      };

      try {
        const { sendContact } = await import('../api/contact.api.js');
        const { Toast } = await import('../components/Toast.js');
        
        await sendContact(formData);
        
        Toast.show("Đã gửi tin nhắn! Cảm ơn bạn đã liên hệ.", "success");
        contactForm.reset();
      } catch (err) {
        import('../components/Toast.js').then(({ Toast }) => {
          Toast.show(err.message || "Lỗi khi gửi liên hệ", "error");
        });
      } finally {
        btn.innerHTML = prev;
        btn.disabled = false;
      }
    });
  }

  // Cleanup canvas when navigating away from landing
  const cleanup = () => {
    window.removeEventListener('scroll', handleScrollAnim);
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
