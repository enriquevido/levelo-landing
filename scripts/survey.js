export function initSurvey() {
  const dots = document.getElementById("survey-dots");
  for (let i = 0; i < 40; i++) {
    const dot = document.createElement("span");
    if (i < 28) dot.className = "is-on";
    dot.style.setProperty("--n", String(i));
    dot.setAttribute("aria-hidden", "true");
    dots.appendChild(dot);
  }
  const legendButtons = [...document.querySelectorAll(".dot-legend button")];
  const evidenceMain = document.querySelector(".evidence-main");
  legendButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const group = button.dataset.highlight;
      const next = evidenceMain.dataset.highlight === group ? "" : group;
      evidenceMain.dataset.highlight = next;
      legendButtons.forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.highlight === next)),
      );
    });
  });
}
