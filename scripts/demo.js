import { svg } from "./icons.js";
import { questions, challengeQuestion, skills } from "./demo-data.js";

const status =
  () => `<div class="app-status" aria-hidden="true"><span>9:41</span><span class="status-right">
  <svg viewBox="0 0 18 14" fill="currentColor">
  <rect x="1" y="8" width="3" height="5" rx=".8"/>
  <rect x="5" y="5" width="3" height="8" rx=".8"/>
  <rect x="9" y="2" width="3" height="11" rx=".8"/>
  <rect x="13" y="0" width="3" height="13" rx=".8"/></svg>
  <svg viewBox="0 0 18 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
  <path d="M2 4a11 11 0 0 1 14 0M5 7a6 6 0 0 1 8 0M7 10a3 3 0 0 1 4 0"/>
  <circle cx="9" cy="13" r=".5"/></svg>
  <svg class="battery" viewBox="0 0 27 14" fill="none" stroke="currentColor" stroke-width="1">
  <rect x=".5" y="1" width="23" height="12" rx="3"/>
  <rect x="2.1" y="2.7" width="19.3" height="8.6" rx="2" fill="currentColor" stroke="none"/>
  <path d="M26 5v4"/></svg></span>
  </div>`;
const indicator = () =>
  '<div class="app-home-indicator" aria-hidden="true"></div>';
const appNav = (current) => `<div class="app-nav" aria-hidden="true">
  <div class="app-nav-tabs">${[
    ["home", "Inicio"],
    ["book", "Practicar"],
    ["duel", "Competir"],
    ["progress", "Progreso"],
  ]
    .map(
      ([
        icon,
        label,
      ]) => `<div class="app-nav-item ${label === current ? "active" : ""}">${svg(icon)}<span>${label}</span>
  </div>`,
    )
    .join("")}</div>
  </div>`;
const closeButton = () =>
  `<button type="button" class="app-close" aria-label="Reiniciar esta demo" data-action="reset">${svg("close")}</button>`;
const quizHeader = (
  step,
  badge,
  p,
) => `<div class="app-exercise-head">${closeButton()}<span class="app-step">${step}</span><span class="app-chip">${badge}</span>
  </div>
  <div class="app-bar app-quiz-bar" style="--progress:${p}%"><i></i>
  </div>`;
const primary = (label, action, disabled = false, cls = "", extra = "") =>
  `<button type="button" class="app-primary ${cls}" data-action="${action}" ${disabled ? "disabled" : ""} ${extra}>${label}</button>`;
const main = (inner, nav = "") =>
  status() + `<div class="app-main">${inner}</div>` + nav + indicator();
const mixed = (ratio) =>
  `<div class="app-mixed-bar" style="--correct:${ratio}%" role="img" aria-label="${ratio}% de aciertos y ${100 - ratio}% por reforzar"><i></i><i></i></div>`;

export function createDemo({ app, reduceMotion, onNavigate }) {
  let mode = "practice";
  let practice, duel, skill;
  const resetPractice = () => ({
    index: 0,
    choice: -1,
    checked: false,
    score: 0,
    done: false,
  });
  const resetDuel = () => ({ stage: "invite", choice: -1 });
  practice = resetPractice();
  duel = resetDuel();
  skill = 1;

  function options(question, selected, checked, actionName) {
    return `<div class="app-options" role="group" aria-label="Opciones de respuesta">${question.answers
      .map((label, i) => {
        const isCorrect = checked && i === question.correct;
        const isWrong = checked && i === selected && i !== question.correct;
        const cls = isCorrect
          ? "correct"
          : isWrong
            ? "incorrect"
            : !checked && i === selected
              ? "selected"
              : "";
        return `<button type="button" class="app-choice ${cls}" data-action="${actionName}" data-index="${i}" aria-pressed="${i === selected}" ${checked ? "disabled" : ""}><span class="choice-letter">${"ABCD"[i]}</span><span>${label}</span>${isCorrect || isWrong ? `<span class="choice-result">${svg(isCorrect ? "check" : "close")}</span>` : ""}</button>`;
      })
      .join("")}</div>`;
  }

  function renderPractice() {
    if (practice.done) {
      const accuracy = Math.round((practice.score / questions.length) * 100);
      return main(`<div class="app-exercise-head">${closeButton()}<span></span><span class="app-chip green">SESIÓN COMPLETADA</span>
        </div>
        <div class="app-summary">
        <div class="app-success-circle">${svg("check")}</div>
        <h2>Buen trabajo.</h2>
        <p>Has completado la práctica de ejemplo.</p>
        </div>
        <div class="app-result-card"><span>PRECISIÓN</span><strong>${accuracy}%</strong>
        <p>${practice.score} de ${questions.length} respuestas correctas</p>${mixed(accuracy)}</div>
        <div class="app-feedback ${accuracy === 100 ? "good" : ""}"><strong>${accuracy === 100 ? "¡Todo correcto!" : "Sigue avanzando"}</strong>${accuracy === 100 ? "Continúa con una sesión nueva." : "Repasa tus respuestas y vuelve a intentarlo."}</div>
        <div class="app-bottom-actions">${primary("Volver a practicar", "reset")}${primary("Explorar progreso", "show-progress", false, "secondary")}</div>`);
    }
    const q = questions[practice.index];
    const checked = practice.checked;
    const correct = practice.choice === q.correct;
    return main(`${quizHeader(`${practice.index + 1} de ${questions.length}`, q.category, ((practice.index + 1) / questions.length) * 100)}<div class="app-quiz-title">${q.topic}</div>
      <div class="app-question-label">${q.instruction}</div>
      <div class="app-question">${q.question}</div>${options(q, practice.choice, checked, "choose")} ${checked ? `<div class="app-feedback ${correct ? "good" : "bad"}" role="status"><strong>${correct ? "¡Correcto!" : "Revisa esta respuesta"}</strong>${q.explanation}</div>` : ""}<div class="app-bottom-actions">${primary(checked ? (practice.index === questions.length - 1 ? "Ver resultado" : "Siguiente pregunta") : "Comprobar respuesta", checked ? "next" : "check", !checked && practice.choice < 0)}</div>`);
  }

  const scoreboard = (
    mine = "—",
    opponent = "—",
  ) => `<div class="app-scoreboard">
    <div class="app-score-top"><span>PRESENT PERFECT · B1</span><span class="app-chip green">AMISTOSO</span>
    </div>
    <div class="app-duel-players">
    <div class="app-player">
    <div class="app-duel-avatar">AM</div><strong>${mine}</strong><span>Andrea</span>
    </div><span class="app-vs">VS</span>
    <div class="app-player">
    <div class="app-duel-avatar opponent">DR</div><strong>${opponent}</strong><span>Diego</span>
    </div>
    </div>
    <div class="app-duel-track"><span><i style="--progress:${mine === "—" ? 0 : 100}%"></i></span><span><i style="--progress:0%"></i></span>
    </div>
    </div>`;
  function renderDuel() {
    if (duel.stage === "question") {
      return main(`${quizHeader("Reto de ejemplo", "B1 · GRAMÁTICA", 100)}<div class="app-quiz-title">${challengeQuestion.topic}</div>
        <div class="app-question-label">${challengeQuestion.instruction}</div>
        <div class="app-question">${challengeQuestion.question}</div>${options(challengeQuestion, duel.choice, false, "duel-choose")}<div class="app-feedback"><strong>Una competencia sin presión</strong>Tu oponente puede resolver el reto en otro momento.</div>
        <div class="app-bottom-actions">${primary("Entregar respuesta", "duel-submit", duel.choice < 0)}</div>`);
    }
    if (duel.stage === "sent") {
      const success = duel.choice === challengeQuestion.correct;
      return main(`<div class="app-exercise-head">${closeButton()}<span></span><span class="app-chip green">INTENTO REGISTRADO</span>
        </div>
        <div class="app-summary">
        <div class="app-success-circle">${svg("check")}</div>
        <h2>¡Reto entregado!</h2>
        <p>Tu parte está lista.</p>
        </div>
        <div class="app-result-card"><span>TU RESULTADO DE EJEMPLO</span><strong>${success ? "1 / 1" : "0 / 1"}</strong>
        <p>Respuesta correcta</p>${mixed(success ? 100 : 0)}</div>
        <div class="app-feedback"><strong>El marcador sigue abierto</strong>Diego todavía no ha terminado. En LEVELO, verás el resultado final cuando ambos respondan.</div>
        <div class="app-bottom-actions">${primary("Volver a competir", "reset")}${primary("Explorar progreso", "show-progress", false, "secondary")}</div>`);
    }
    return main(`<div class="app-exercise-head">${closeButton()}<span></span><span class="app-chip">RETO ASÍNCRONO</span>
      </div>
      <h2 class="app-play-title">Diego te retó.</h2>
      <p class="app-play-desc">Un desafío amistoso a tu nivel.</p>${scoreboard()}<div class="app-facts">
      <div class="app-fact"><strong>Gramática · Present perfect</strong><small>Nivel B1</small>
      </div>
      <div class="app-fact"><strong>8 preguntas · 48 horas</strong><small>Formato propuesto para los retos</small>
      </div>
      <div class="app-fact"><strong>Demo de una pregunta</strong><small>Prueba el funcionamiento</small>
      </div>
      </div>
      <div class="app-bottom-actions">${primary("Aceptar reto", "duel-accept")}${primary("Explorar otra vez", "show-practice", false, "secondary")}</div>`);
  }

  function renderProgress() {
    const active = skills[skill];
    return main(
      `<h2 class="app-play-title">Progreso</h2>
      <p class="app-play-desc">Tu constancia se refleja aquí.</p>
      <div class="app-progress-summary">
      <div class="app-progress-metrics">
      <div><strong>24</strong><small>prácticas completadas</small>
      </div>
      <div><strong>75%</strong><small>última sesión</small>
      </div>
      </div>
      <div class="app-progress-note"><span>Nivel B1 · Autoevaluado</span><span class="app-chip green">9 días</span>
      </div>
      </div>
      <div class="app-skill-heading"><strong>Precisión por habilidad</strong><span>Últimas 4 semanas</span>
      </div>
      <div class="app-skill-list">${skills.map((s, i) => `<button class="app-skill" type="button" data-action="skill" data-index="${i}" aria-pressed="${skill === i}"><span class="app-skill-top"><span>${s.name}</span><small>${s.accuracy}% / ${100 - s.accuracy}%</small></span>${mixed(s.accuracy)}</button>`).join("")}</div>
      <div class="app-skill-legend"><span><i></i>Aciertos</span><span><i></i>Por reforzar</span>
      </div><hr style="border:0;border-top:1px solid var(--line);margin:10px 0 18px">
      <h4>En qué enfocarte</h4>
      <div class="app-insight-card" role="status"><strong>${active.topic}</strong>
      <p>${active.insight}</p>
      <button type="button" data-action="show-practice">Explorar una práctica</button>
      </div>
      <p style="margin-top:12px;color:var(--muted);font-size:11px">Selecciona una habilidad para ver recomendaciones. Los datos son ilustrativos.</p>`,
      appNav("Progreso"),
    );
  }

  function render(animate = false) {
    app.classList.remove("has-transition");
    app.innerHTML =
      mode === "practice"
        ? renderPractice()
        : mode === "compete"
          ? renderDuel()
          : renderProgress();
    if (animate && !reduceMotion) {
      requestAnimationFrame(() => app.classList.add("has-transition"));
    }
  }

  function setMode(next) {
    if (next === mode) return;
    mode = next;
    render(true);
  }

  const resetDemo = () => {
    if (mode === "practice") practice = resetPractice();
    else if (mode === "compete") duel = resetDuel();
    else skill = 1;
    render(true);
  };

  app.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn || btn.disabled) return;
    const action = btn.dataset.action;
    const index = Number(btn.dataset.index);
    let animate = false;
    switch (action) {
      case "choose":
        if (!practice.checked) practice.choice = index;
        break;
      case "check":
        if (practice.choice < 0 || practice.checked) return;
        practice.checked = true;
        if (practice.choice === questions[practice.index].correct)
          practice.score++;
        break;
      case "next":
        if (!practice.checked) return;
        if (practice.index === questions.length - 1) practice.done = true;
        else {
          practice.index++;
          practice.choice = -1;
          practice.checked = false;
        }
        animate = true;
        break;
      case "duel-accept":
        duel.stage = "question";
        animate = true;
        break;
      case "duel-choose":
        duel.choice = index;
        break;
      case "duel-submit":
        if (duel.choice < 0) return;
        duel.stage = "sent";
        animate = true;
        break;
      case "skill":
        skill = index;
        break;
      case "show-progress":
        onNavigate("progress");
        return;
      case "show-practice":
        onNavigate("practice");
        return;
      case "reset":
        resetDemo();
        return;
      default:
        return;
    }
    render(animate);
    if (action === "choose" || action === "duel-choose" || action === "skill")
      app
        .querySelector(`[data-action="${action}"][data-index="${index}"]`)
        ?.focus({ preventScroll: true });
    else if (action === "check")
      app.querySelector('[data-action="next"]')?.focus({ preventScroll: true });
  });
  render(false);
  return { setMode };
}
