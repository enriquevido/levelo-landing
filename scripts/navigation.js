import { svg } from "./icons.js";

export function initNavigation() {
  const menuToggle = document.querySelector(".menu-toggle");
  const menu = document.getElementById("mobile-nav");
  const menuSet = (open) => {
    menu.hidden = !open;
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    menuToggle.innerHTML = open
      ? svg("close")
      : '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
  };
  menuToggle.addEventListener("click", () => menuSet(menu.hidden));
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) menuSet(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !menu.hidden) {
      menuSet(false);
      menuToggle.focus();
    }
  });
}
