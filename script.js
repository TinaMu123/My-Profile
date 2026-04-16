const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function setYear() {
  const el = document.querySelector("[data-year]");
  if (el) el.textContent = String(new Date().getFullYear());
}

function setupMobileNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const menu = document.querySelector("[data-nav-menu]");
  const links = $$("[data-nav-link]");
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
  };

  toggle.addEventListener("click", () => {
    const open = !menu.classList.contains("is-open");
    setOpen(open);
  });

  links.forEach((a) => {
    a.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 760px)").matches) setOpen(false);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });

  document.addEventListener("click", (e) => {
    if (!menu.classList.contains("is-open")) return;
    if (menu.contains(e.target) || toggle.contains(e.target)) return;
    setOpen(false);
  });
}

function setupToTop() {
  const btn = document.querySelector("[data-to-top]");
  if (!btn) return;

  const onScroll = () => {
    const show = window.scrollY > 500;
    btn.classList.toggle("is-show", show);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function setupActiveNav() {
  const links = $$("[data-nav-link]");
  if (!links.length) return;

  const map = new Map();
  links.forEach((a) => {
    const id = (a.getAttribute("href") || "").replace("#", "");
    if (!id) return;
    const sec = document.getElementById(id);
    if (sec) map.set(sec, a);
  });

  const clear = () => links.forEach((a) => a.classList.remove("is-active"));
  const setActive = (sec) => {
    clear();
    const a = map.get(sec);
    if (a) a.classList.add("is-active");
  };

  const sections = Array.from(map.keys());
  const obs = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target) setActive(visible.target);
    },
    { rootMargin: "-20% 0px -70% 0px", threshold: [0.02, 0.08, 0.14] }
  );

  sections.forEach((s) => obs.observe(s));
}

function setupReveal() {
  const els = $$(".reveal");
  if (!els.length) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        obs.unobserve(e.target);
      });
    },
    { threshold: 0.12 }
  );

  els.forEach((el) => obs.observe(el));
}

function setupHeroTyping() {
  const prefixEl = document.querySelector("[data-type-prefix]");
  const nameEl = document.querySelector("[data-type-name]");
  if (!prefixEl || !nameEl) return;

  const reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    prefixEl.textContent = "您好，我是";
    nameEl.classList.add("is-in");
    return;
  }

  const full = "您好，我是";
  prefixEl.textContent = "";
  prefixEl.classList.add("is-caret");
  nameEl.classList.remove("is-in");

  let i = 0;
  const tick = () => {
    i += 1;
    prefixEl.textContent = full.slice(0, i);
    if (i >= full.length) {
      prefixEl.classList.remove("is-caret");
      nameEl.classList.add("is-in");
      return;
    }
    window.setTimeout(tick, 80);
  };
  window.setTimeout(tick, 220);
}

let toastTimer = null;
function toast(msg) {
  const root = $(".toast");
  const inner = $("[data-toast-inner]");
  if (!root || !inner) return;

  inner.textContent = msg;
  root.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    root.hidden = true;
  }, 1500);
}

function setupToasts() {
  $$("[data-toast]").forEach((el) => {
    el.addEventListener("click", () => toast(el.getAttribute("data-toast")));
  });

  $$("[data-download]").forEach((el) => {
    el.addEventListener("click", () => toast("正在下载简历…"));
  });
}

function setupKeyboardNavFocus() {
  // Improve visible focus in mouse use vs keyboard use.
  const body = document.body;
  const onKey = (e) => {
    if (e.key === "Tab") body.classList.add("is-tabbing");
  };
  const onMouse = () => body.classList.remove("is-tabbing");
  document.addEventListener("keydown", onKey);
  document.addEventListener("mousedown", onMouse);
}

function setupRuntimeGuard() {
  window.addEventListener("error", () => {
    toast("页面加载失败，请刷新重试");
  });
}

setYear();
setupMobileNav();
setupToTop();
setupActiveNav();
setupReveal();
setupHeroTyping();
setupToasts();
setupKeyboardNavFocus();
setupRuntimeGuard();

