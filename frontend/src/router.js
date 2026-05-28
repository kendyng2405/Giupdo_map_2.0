import { auth } from "./config/firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import { getMe } from "./api/auth.api.js";

class Router {
  constructor() {
    this.routes = {};
    this.currentUser = null;
    this.currentUserData = null;
    this._authReady = false;
    this._authReadyResolve = null;
    this.authReady = new Promise(r => this._authReadyResolve = r);
    this._renderGen = 0; 
  }

  register(path, handler) {
    this.routes[path] = handler;
    return this;
  }

  async init() {
    const redirect = sessionStorage.getItem("spa_redirect");
    if (redirect) {
      sessionStorage.removeItem("spa_redirect");
      const url = new URL(redirect);
      const path = url.pathname + url.search + url.hash;
      window.history.replaceState(null, "", path);
    }

    onAuthStateChanged(auth, async (user) => {
      this.currentUser = user;
      if (user) {
        try {
          const res = await getMe();
          this.currentUserData = res.data;
        } catch(e) {
          this.currentUserData = null;
        }
      } else {
        this.currentUserData = null;
      }
      this._updateNavbar();
      if (!this._authReady) {
        this._authReady = true;
        this._authReadyResolve();
      } else {
        this._renderCurrent();
      }
    });

    window.addEventListener("popstate", () => this._renderCurrent());

    document.addEventListener("click", (e) => {
      const a = e.target.closest("a[href]");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("/") || href.startsWith("//")) return;
      if (a.target === "_blank") return;
      e.preventDefault();
      this.navigate(href);
    });

    await this.authReady;
    this._updateNavbar();
    this._renderCurrent();
  }

  navigate(path) {
    if (window.location.pathname === path) {
      this._renderCurrent();
    } else {
      window.history.pushState(null, "", path);
      this._renderCurrent();
    }
  }

  _getCurrentPath() {
    const path = window.location.pathname;
    if (path === "/" || path === "") return "/home";
    return path;
  }

  async _renderCurrent() {
    const gen = ++this._renderGen; 
    const path = this._getCurrentPath();
    let handler = this.routes[path];
    let params = {};

    if (!handler) {
      for (const [route, h] of Object.entries(this.routes)) {
        if (route.includes(":")) {
          const regex = new RegExp("^" + route.replace(/:[^/]+/g, "([^/]+)") + "$");
          const match = path.match(regex);
          if (match) {
            handler = h;
            const keys = [...route.matchAll(/:([^/]+)/g)].map(m => m[1]);
            keys.forEach((k, i) => params[k] = match[i + 1]);
            break;
          }
        }
      }
    }

    const app = document.getElementById("app");

    if (!handler) {
      if (app) app.innerHTML = `<div style="text-align:center;padding:120px 24px;">
        <h1 style="font-family:'Playfair Display',serif;font-size:5rem;color:var(--border);">404</h1>
        <p style="margin-bottom:24px;color:var(--text-muted);">Trang không tìm thấy</p>
        <a href="/home" class="btn btn--primary">Về bản đồ</a>
      </div>`;
      return;
    }

    if (gen !== this._renderGen) return;

    document.querySelectorAll("[data-nav]").forEach(el => {
      el.classList.toggle("active", el.dataset.nav === path);
    });

    // Animate transition out
    if (app && app.innerHTML.trim() !== '') {
      app.style.opacity = '0';
      app.style.transition = 'opacity 0.2s';
      await new Promise(r => setTimeout(r, 200));
    }
    
    await handler({ user: this.currentUser, userData: this.currentUserData, params });
    
    // Animate transition in
    if (app) {
      app.style.opacity = '1';
      app.style.transition = 'opacity 0.4s';
    }
  }

  _updateNavbar() {
    if (typeof window._updateNavbarUser === "function") {
      window._updateNavbarUser(this.currentUserData);
    }
  }

  requireAuth(handler) {
    return async (ctx) => {
      if (!ctx.user) { this.navigate("/login"); return; }
      await handler(ctx);
    };
  }

  requireAdmin(handler) {
    return async (ctx) => {
      if (!ctx.user) { this.navigate("/login"); return; }
      if (ctx.userData?.role !== "admin" && ctx.userData?.role !== "founder") {
        this.navigate("/home"); return;
      }
      await handler(ctx);
    };
  }

  requireFounder(handler) {
    return async (ctx) => {
      if (!ctx.user) { this.navigate("/login"); return; }
      if (ctx.userData?.role !== "founder") { this.navigate("/home"); return; }
      await handler(ctx);
    };
  }
}

export const router = new Router();
