import { createDemo } from "./demo.js";

export function initScrollTour(reduceMotion) {
  const tabs = [...document.querySelectorAll(".story-steps .experience-tab")];
  const story = document.getElementById("story-track");
  const sticky = document.getElementById("story-sticky");
  const hero = document.querySelector(".launch-hero");
  const mobileCopy = document.getElementById("story-mobile-copy");
  const demoPhone = document.querySelector(".phone-demo");
  const panel = document.getElementById("demo-panel");
  const stage = panel;
  const app = document.getElementById("demo-app");
  const sectionIds = ["experiencia", "investigacion", "propuesta"];
  let mode = "practice";
  const demo = createDemo({ app, reduceMotion, onNavigate: goToMode });

  const clamp = (value, min = 0, max = 1) =>
    Math.min(max, Math.max(min, value));
  function storyGeometry() {
    const rect = story.getBoundingClientRect();
    const stickyHeight = sticky.getBoundingClientRect().height;
    const top = parseFloat(getComputedStyle(sticky).top) || 0;
    return { rect, top, travel: Math.max(1, rect.height - stickyHeight) };
  }
  function goToMode(next) {
    const n = tabs.findIndex((step) => step.dataset.mode === next);
    if (n < 0) return;
    const { rect, top, travel } = storyGeometry();
    const target =
      window.scrollY + rect.top - top + (travel * (n + 0.16)) / tabs.length;
    window.scrollTo({
      top: Math.max(0, target),
      behavior: reduceMotion ? "instant" : "smooth",
    });
  }
  function fitDevice() {
    const rect = stage.getBoundingClientRect();
    if (!rect.height || !rect.width) return;
    const bezel =
      parseFloat(
        getComputedStyle(demoPhone).getPropertyValue("--phone-bezel"),
      ) || 12;
    const maxScale = window.matchMedia("(max-width:720px)").matches
      ? 0.76
      : 0.86;
    const scale = clamp(
      Math.min(
        (rect.height - 46 - 2 * bezel) / 852,
        (rect.width - 30 - 2 * bezel) / 393,
      ),
      0.3,
      maxScale,
    );
    demoPhone.style.setProperty("--phone-scale", scale.toFixed(4));
  }
  let queued = false;
  function updateScroll() {
    queued = false;
    const { rect, top, travel } = storyGeometry();
    const progress = clamp((top - rect.top) / travel);
    sticky.style.setProperty("--story-progress", String(progress));
    const index = Math.min(tabs.length - 1, Math.floor(progress * tabs.length));
    const next = tabs[index].dataset.mode;
    if (next !== mode) {
      mode = next;
      tabs.forEach((step) => {
        if (step.dataset.mode === mode) {
          step.setAttribute("aria-current", "step");
          panel.setAttribute("aria-labelledby", step.id);
          mobileCopy.textContent = step.querySelector(
            "span:nth-child(2) > span",
          ).textContent;
        } else {
          step.removeAttribute("aria-current");
        }
      });
      demo.setMode(mode);
    }
    if (!reduceMotion) {
      const heroRect = hero.getBoundingClientRect();
      const visual = clamp(-heroRect.top / Math.max(1, heroRect.height * 0.65));
      hero.style.setProperty("--hero-progress", String(visual));
    }
    const navPoint =
      (document.querySelector(".site-header").offsetHeight || 64) + 28;
    let active = "";
    sectionIds.forEach((id) => {
      const s = document.getElementById(id);
      if (s.getBoundingClientRect().top <= navPoint) active = id;
    });
    document
      .querySelectorAll(".desktop-nav a,.mobile-nav > a:not(.button)")
      .forEach((a) => {
        if (a.hash === "#" + active) a.setAttribute("aria-current", "location");
        else a.removeAttribute("aria-current");
      });
  }
  function scheduleScroll() {
    if (!queued) {
      queued = true;
      requestAnimationFrame(updateScroll);
    }
  }
  window.addEventListener("scroll", scheduleScroll, { passive: true });
  window.addEventListener(
    "resize",
    () => {
      fitDevice();
      scheduleScroll();
    },
    { passive: true },
  );
  if ("ResizeObserver" in window) {
    new ResizeObserver(() => {
      fitDevice();
      scheduleScroll();
    }).observe(stage);
  }
  fitDevice();
  scheduleScroll();
}
