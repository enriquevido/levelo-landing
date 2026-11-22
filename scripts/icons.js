const icons = {
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5h4"/>',
  book: '<path d="M4 4h5a3 3 0 0 1 3 3v14a4 4 0 0 0-4-3H4zM20 4h-5a3 3 0 0 0-3 3v14a4 4 0 0 1 4-3h4z"/>',
  duel: '<path d="m5 4 14 16M19 4 5 20M4 4h6M4 4v6M20 4h-6M20 4v6M4 20h6M20 20h-6"/>',
  progress: '<path d="M4 20V4M4 20h16M8 15l4-4 3 2 5-6M17 7h3v3"/>',
  home: '<path d="m3 10 9-7 9 7v10h-6v-6H9v6H3z"/>',
  bolt: '<path d="m13 2-9 12h7l-1 8 10-12h-7Z"/>',
  history: '<path d="M3 12a9 9 0 1 0 3-7M3 4v8h8M12 7v6l4 2"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>',
  refresh: '<path d="M4 12a8 8 0 1 1 3 6M4 5v7h7"/>',
  school: '<path d="m2 10 10-6 10 6-10 6zM6 13v5c3 3 9 3 12 0v-5M22 10v7"/>',
  message: '<path d="M4 5h16v11H9l-5 4zM8 9h8M8 12h6"/>',
  arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
  back: '<path d="m14 6-6 6 6 6M8 12h12"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 1 1 8 0v3"/>',
};
export const svg = (name) =>
  `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icons[name] || ""}</svg>`;
export function initIcons() {
  document.querySelectorAll("[data-icon]").forEach((el) => {
    el.innerHTML = svg(el.dataset.icon);
  });
  document
    .querySelectorAll("[data-check]")
    .forEach((el) => el.insertAdjacentHTML("afterbegin", svg("check")));
}
