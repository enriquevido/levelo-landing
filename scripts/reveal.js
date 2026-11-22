function animateMetric(card) {
  if (card.dataset.animated) return;
  card.dataset.animated = "true";
  const numbers = [...card.querySelectorAll("[data-count]")].map((el) => ({
    el,
    value: Number(el.dataset.count),
    decimals: el.dataset.count.includes(".") ? 1 : 0,
  }));
  if (!numbers.length) return;
  const dots = [...card.querySelectorAll(".dot-grid span.is-on")];
  const started = performance.now();
  numbers.forEach((n) => {
    n.el.textContent = n.decimals ? "0.0" : "0";
  });
  function frame(now) {
    const t = Math.min(1, (now - started) / 1450);
    const e = 1 - Math.pow(1 - t, 3);
    numbers.forEach((n) => {
      n.el.textContent = (n.value * e).toFixed(n.decimals);
    });
    card.style.setProperty("--stat-progress", String(e));
    dots.forEach((dot, i) => {
      if (i < Math.floor(e * dots.length + 0.001)) dot.classList.add("filled");
    });
    if (t < 1) requestAnimationFrame(frame);
    else {
      numbers.forEach((n) => {
        n.el.textContent = n.el.dataset.count;
      });
      dots.forEach((dot) => dot.classList.add("filled"));
      card.style.setProperty("--stat-progress", "1");
    }
  }
  requestAnimationFrame(frame);
}

export function initReveals(reduceMotion) {
  if (reduceMotion || !("IntersectionObserver" in window)) return;
  document.documentElement.classList.add("js", "motion-ready");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          if (entry.target.classList.contains("metric-animate"))
            animateMetric(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -5% 0px", threshold: 0.08 },
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}
