import { initIcons } from "./icons.js";
import { initNavigation } from "./navigation.js";
import { initSurvey } from "./survey.js";
import { initReveals } from "./reveal.js";
import { initScrollTour } from "./scroll-tour.js";

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

initIcons();
initNavigation();
initSurvey();
initReveals(reduceMotion);
initScrollTour(reduceMotion);
