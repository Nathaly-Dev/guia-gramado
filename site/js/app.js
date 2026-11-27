// Interface do guia: navegação, roteiro ao vivo, tempo, voo, mala e dicas.
import { DAYS, BEFORE } from "./roteiro.js";
import * as P from "./preparo.js";
import {
  toMin, fmtH, nowInSP, statusFor, leaveTime, moveOf, uberRange, paidCount, isFixed, stopKey, isDone, openFromPast,
  liveState, durationLabel, daysUntil, describeCode, parseForecast, weatherAlerts, wearAdvice,
  MEALS, mealsOf,
} from "./core.js";

const $ = (s, el = document) => el.querySelector(s);
const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ESC[c]);
const icon = (name, cls = "") => `<svg class="i ${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;

// localStorage pode falhar (aba anônima, bloqueio): o guia funciona sem ele.
const store = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v == null ? fallback : JSON.parse(v);
    } catch (_) {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (_) {
      // sem armazenamento: só não lembra a escolha
    }
  },
};

const enc = encodeURIComponent;
const mapsSearch = (q) => `https://www.google.com/maps/search/?api=1&query=${enc(q)}`;
const mapsRoute = (q, mode) =>
  `https://www.google.com/maps/dir/?api=1&destination=${enc(q)}&travelmode=${mode === "walk" ? "walking" : "driving"}`;
const uberLink = (q) =>
  `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[formatted_address]=${enc(q)}`;
const ext = 'target="_blank" rel="noopener noreferrer"';

const brl = (n) => `R$ ${n}`;
const range = ([a, b], unit = "") => (a === b ? `${a}${unit}` : `${a} a ${b}${unit}`);

function fmtDate(iso) {
  const d = new Date(`${iso}T12:00:00Z`);
  const wd = new Intl.DateTimeFormat("pt-BR", { weekday: "short", timeZone: "UTC" }).format(d).replace(".", "");
  return `${wd} ${iso.slice(8, 10)}/${iso.slice(5, 7)}`;
}

// ---------- relógio (real ou simulado) ----------
let SIM = null;
const now = () => SIM || nowInSP();

// ---------- paradas feitas (marcadas à mão, guardadas no celular) ----------
const MARKS_KEY = "feito:v1";
let MARKS = store.get(MARKS_KEY, {});

function toggleDone(key, nowDone) {
  // nowDone: o estado que a parada tem agora (feita ou não); o clique inverte.
  MARKS = { ...MARKS, [key]: !nowDone };
  store.set(MARKS_KEY, MARKS);
}

// ---------- deslocamentos ----------
const MODE = {
  walk: { icon: "walk", name: "A pé" },
  uber: { icon: "car", name: "Uber" },
  car: { icon: "car", name: "Carro" },
  bus: { icon: "bus", name: "Bustour" },
  flight: { icon: "plane", name: "Voo" },
};

function moveText(mv) {
  const parts = [mv.label || MODE[mv.mode].name];
  if (mv.min) parts.push(mv.min[1] >= 60 ? `cerca de ${durationLabel(mv.min[1])}` : range(mv.min, " min"));
  if (mv.dist) parts.push(mv.dist);
  if (mv.price) parts.push(`${brl(mv.price[0])} a ${mv.price[1]}`);
  return parts.join(" · ");
}

function moveHTML(mv, cls = "move") {
  return `<p class="${cls}">${icon(MODE[mv.mode].icon)}<span class="tnum">${esc(moveText(mv))}</span>${
    mv.alt ? `<span class="alt">${esc(mv.alt)}</span>` : ""
  }</p>`;
}

const wantsUber = (s) => {
  const mv = moveOf(s);
  return Boolean(s.uberTo || (mv && (mv.mode === "uber" || /uber/i.test(mv.alt || ""))));
};
const uberDest = (s) => s.uberTo || s.addr || s.place;

// ---------- clima ----------
const WX_KEY = "wx:v1";
const WX_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=-29.3788&longitude=-50.8739" +
  "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max" +
  "&hourly=temperature_2m&timezone=America%2FSao_Paulo&forecast_days=16";
const WX_MAX_AGE = 60 * 60 * 1000;

let WX = store.get(WX_KEY, null); // { at, days }
let wxState = "idle"; // idle | loading | error

async function loadWeather(force = false) {
  if (!force && WX && Date.now() - WX.at < WX_MAX_AGE) return;
  wxState = "loading";
  renderWeatherViews();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(WX_URL, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const days = parseForecast(await res.json());
    if (!Object.keys(days).length) throw new Error("previsão vazia");
    WX = { at: Date.now(), days };
    store.set(WX_KEY, WX);
    wxState = "idle";
  } catch (_) {
    wxState = "error";
  } finally {
    clearTimeout(timer);
  }
  renderWeatherViews();
}

const ALERT_ICON = { rain: "rain", cold: "thermo", wind: "wind", hot: "sun" };
const alertHTML = (a) => `<p class="note note-${a.level}">${icon(ALERT_ICON[a.kind])}<span>${esc(a.text)}</span></p>`;

const forecastFor = (date) => (WX && WX.days[date]) || null;

function renderWeatherViews() {
  renderDay();
  if (currentTab === "tempo") renderTempo();
}

// ---------- navegação ----------
const TABS = ["roteiro", "tempo", "mala", "voo", "dicas"];
let currentTab = "roteiro";

function route() {
  const id = location.hash.slice(1);
  const tab = TABS.includes(id) ? id : "roteiro";
  const changed = tab !== currentTab;
  currentTab = tab;
  for (const t of TABS) $(`#${t}`).hidden = t !== tab;
  document.querySelectorAll(".nav a").forEach((a) => {
    if (a.dataset.tab === tab) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  if (tab === "roteiro") renderRoteiro();
  if (tab === "tempo") renderTempo();
  if (tab === "voo") renderVoo();
  if (tab === "mala") renderMala();
  if (tab === "dicas") renderDicas();
  if (changed) window.scrollTo(0, 0);
}

// ---------- tema ----------
function syncThemeButton() {
  const dark = document.documentElement.dataset.theme === "dark";
  const btn = $("#themeBtn");
  btn.setAttribute("aria-pressed", String(dark));
  btn.setAttribute("aria-label", dark ? "Usar tema claro" : "Usar tema escuro");
  const bg = getComputedStyle(document.documentElement).getPropertyValue("--night").trim();
  $('meta[name="theme-color"]').setAttribute("content", bg);
}

function toggleTheme() {
  const dark = document.documentElement.dataset.theme !== "dark";
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  try {
    localStorage.setItem("theme", dark ? "dark" : "light");
  } catch (_) {
    // sem armazenamento: vale só nesta visita
  }
  syncThemeButton();
}

// ---------- roteiro ----------
let dayIdx = null;
let lastSignature = "";

function defaultDay(n) {
  const i = DAYS.findIndex((d) => d.date === n.date);
  if (i >= 0) return i;
  return n.date < DAYS[0].date ? 0 : DAYS.length - 1;
}

function renderRoteiro() {
  const n = now();
  if (dayIdx === null) dayIdx = defaultDay(n);
  renderLive(n);
  renderDays(n);
  renderDay(n);
}

function stateTag(st) {
  if (st === "now") return `<span class="state state-now">${icon("now")}Agora</span>`;
  if (st === "next") return `<span class="state state-next">${icon("clock")}Próximo</span>`;
  if (st === "done") return `<span class="state state-done">${icon("check")}Feito</span>`;
  if (st === "open") return `<span class="state state-danger">${icon("alert")}Em aberto</span>`;
  return "";
}

const greeting = (min) => (min < 720 ? "Bom dia" : min < 1080 ? "Boa tarde" : "Boa noite");
const SKY = `<svg class="skyline" aria-hidden="true" focusable="false"><rect width="100%" height="100%"/></svg>`;
const ornament = (text) => `<p class="day-end"><span class="orn" aria-hidden="true">${icon("star")}</span><span>${esc(text)}</span></p>`;
const welcomeHTML = ([pre, em, post]) => `${esc(pre)}<em>${esc(em)}</em>${esc(post)}`;

function renderLive(n) {
  const s = liveState(DAYS, n, MARKS);
  let html = "";
  if (s.phase === "before") {
    const tasks = BEFORE.map((t) => {
      const done = n.date > t.date || (n.date === t.date && n.min >= toMin(t.t) + 60);
      return `<li class="${done ? "is-done" : ""}">${icon(done ? "check" : "clock")}<span>${esc(t.text)}</span><span class="when num">${esc(fmtDate(t.date))} · ${fmtH(t.t)}</span></li>`;
    }).join("");
    const count = s.days === 1 ? "Falta <em>1 dia</em>" : `Faltam <em class="num">${s.days} dias</em>`;
    html = `
      <section class="live band" aria-labelledby="live-t">
        <p class="eyebrow">${icon("star")}Contagem regressiva</p>
        <h2 class="live-title" id="live-t">${count} para a magia do Natal Luz</h2>
        <p class="live-sub">Vem viver essa aventura de Natal! Saída ter 24/11 às 9h30, voo às 12h55.</p>
        <ul class="todo">${tasks}</ul>
        <div class="actions"><a class="btn gold" href="#mala">${icon("bag")}Conferir a mala</a></div>
        ${SKY}
      </section>`;
  } else if (s.phase === "after") {
    html = `
      <section class="live band" aria-labelledby="live-t">
        <p class="eyebrow">${icon("star")}Viagem concluída</p>
        <h2 class="live-title" id="live-t">Que viagem <em>mágica</em>!</h2>
        <p class="live-sub">Obrigada, Gramado. Agora é hora de rever as fotos.</p>
        ${SKY}
      </section>`;
  } else {
    const day = DAYS[s.di];
    const total = day.stops.length;
    let status;
    if (s.nextIdx >= 0) {
      const pct = Math.round((s.doneCount / total) * 100);
      status = `<p class="live-now">${icon("check")}<span><strong class="num">${s.doneCount} de ${total}</strong> paradas feitas. No ritmo de vocês!</span></p>
        <div class="live-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" aria-label="Paradas feitas hoje"><span style="width:${pct}%"></span></div>`;
    } else {
      const tomorrow = DAYS[s.di + 1];
      status = `<p class="live-now">${icon("moon")}<span>Dia concluído. Bons sonhos!${tomorrow ? ` Amanhã: <strong>${esc(tomorrow.name)}</strong>` : ""}</span></p>`;
    }
    // Compromisso com horário marcado (ingresso, show, café do hotel).
    let fixed = "";
    if (s.fixedIdx >= 0 && s.fixedIdx !== s.nextIdx) {
      const fx = day.stops[s.fixedIdx];
      const when = s.fixedInMin > 0 ? `em ${durationLabel(s.fixedInMin)}` : "já começou";
      const leave = s.leave
        ? s.leave.inMin <= 0
          ? ` · <span class="state state-danger">${icon("alert")}Hora de ir</span>`
          : ` · saiam às <strong class="num">${fmtH(s.leave.at)}</strong>${s.leave.inMin <= 20 ? ` <span class="state state-next">${icon("alert")}em ${s.leave.inMin} min</span>` : ""}`
        : "";
      fixed = `<p class="live-now">${icon("clock")}<span>Horário marcado: <strong>${esc(fx.title)}</strong> às <span class="num">${fmtH(fx.t)}</span> (${when})${leave}</span></p>`;
    }
    let next = "";
    if (s.nextIdx >= 0) {
      const st = day.stops[s.nextIdx];
      const mv = moveOf(st);
      const key = stopKey(day, st);
      const timeTxt = s.fixedIdx === s.nextIdx ? ` · <span class="num">${fmtH(st.t)}</span> · <span class="num">${s.fixedInMin > 0 ? `em ${durationLabel(s.fixedInMin)}` : "agora"}</span>` : "";
      const leave = s.fixedIdx === s.nextIdx && s.leave
        ? `<p class="leave">${
            s.leave.inMin <= 0
              ? `<span class="state state-danger">${icon("alert")}Hora de sair</span>`
              : `<span>Saiam às</span><strong class="num">${fmtH(s.leave.at)}</strong><span class="num">em ${durationLabel(s.leave.inMin)}</span>`
          }</p>`
        : "";
      const go = st.place && (!mv || mv.mode !== "bus")
        ? `<a class="btn gold" href="${mapsRoute(st.place, mv ? mv.mode : "walk")}" ${ext}>${icon("map")}Como chegar</a>`
        : st.place ? `<a class="btn gold" href="${mapsSearch(st.place)}" ${ext}>${icon("map")}Ver no mapa</a>` : "";
      const uber = wantsUber(st) ? `<a class="btn ghost" href="${uberLink(uberDest(st))}" ${ext}>${icon("car")}Chamar Uber</a>` : "";
      next = `
        <div class="glass">
          <p class="eyebrow">Próximo${timeTxt}</p>
          <p class="glass-title">${esc(st.title)}</p>
          ${leave}
          ${mv ? moveHTML(mv) : ""}
          <div class="actions"><button class="btn gold" type="button" data-toggle="${esc(key)}" data-was="0">${icon("check")}Feito</button>${go}${uber}<button class="btn ghost" type="button" data-goto="${s.di}-${s.nextIdx}">Ver no roteiro</button></div>
        </div>`;
    }
    html = `
      <section class="live band live-during" aria-labelledby="live-t">
        <p class="eyebrow">${icon("star")}${greeting(n.min)} · ${esc(fmtDate(day.date))}</p>
        <h2 class="live-title" id="live-t">${welcomeHTML(day.welcome)}</h2>
        ${status}
        ${fixed}
        ${next}
        ${SKY}
      </section>`;
  }
  $("#live").innerHTML = html;
}

function renderDays(n) {
  $("#days").innerHTML = DAYS.map((d, i) => {
    const open = n.date > d.date ? d.stops.filter((_, j) => !isDone(d, j, n, MARKS)).length : 0;
    const sub = d.date === n.date ? "Hoje" : n.date > d.date ? (open ? `${open} em aberto` : "Feito") : `${d.stops.length} paradas`;
    const [wd, dn] = d.tab.split(" ");
    return `<button class="day-btn" type="button" role="tab" aria-selected="${i === dayIdx}" data-day="${i}" aria-label="${esc(d.tab)}, ${sub}">
      <span class="wd">${esc(wd)}</span><span class="dn num">${esc(dn)}</span><span class="st">${sub}</span></button>`;
  }).join("");
}

function weatherFact(date) {
  const f = forecastFor(date);
  if (!f) return "";
  const c = describeCode(f.code);
  const rain = f.rainPct >= 40 ? ` · chuva ${f.rainPct}%` : "";
  return `<a class="fact num" href="#tempo">${icon(c.icon)}${f.min}° a ${f.max}°${rain}</a>`;
}

function stopBody(s, di, si, extra = "") {
  const mv = moveOf(s);
  const meta = [
    s.tip && `<li>${icon("bulb")}<span>Dica: ${esc(s.tip)}</span></li>`,
    s.cost && !s.paid && `<li>${icon("coin")}<span>Valor: ${esc(s.cost)}</span></li>`,
    s.photo && `<li>${icon("camera")}<span>Foto: ${esc(s.photo)}</span></li>`,
  ].filter(Boolean).join("");
  const actions = [
    s.place && `<a class="btn" href="${mapsSearch(s.place)}" ${ext}>${icon("map")}Mapa</a>`,
    wantsUber(s) && `<a class="btn" href="${uberLink(uberDest(s))}" ${ext}>${icon("car")}Uber</a>`,
    extra,
  ].filter(Boolean).join("");
  return `
    <h3 class="stop-title" id="t-${di}-${si}">${esc(s.title)}</h3>
    <p class="stop-desc">${esc(s.desc)}</p>
    ${s.addr ? `<p class="addr">${icon("pin")}<span>${esc(s.addr)}</span></p>` : ""}
    ${s.trip ? moveHTML(mv) : ""}
    ${meta ? `<ul class="stop-meta">${meta}</ul>` : ""}
    ${actions ? `<div class="actions">${actions}</div>` : ""}`;
}

function renderDay(n = now()) {
  if (dayIdx === null) return;
  const d = DAYS[dayIdx];
  const uber = uberRange(d);
  const paid = paidCount(d);
  const rank = { danger: 0, notice: 1 };
  const alerts = weatherAlerts(forecastFor(d.date)).sort((a, b) => rank[a.level] - rank[b.level]).map(alertHTML).join("");
  const notes = (d.notes || []).map((t) => `<p class="note note-info">${icon("info")}<span>${esc(t)}</span></p>`).join("");
  const statuses = d.stops.map((_, i) => statusFor(d, i, n, MARKS));
  const canMark = n.date >= d.date;
  const timeOf = (s) => (isFixed(s) ? fmtH(s.t) : "");
  const toggleBtn = (s, done, strong = false) => canMark
    ? `<button class="btn${strong ? " gold" : ""}" type="button" data-toggle="${esc(stopKey(d, s))}" data-was="${done ? 1 : 0}">${icon(done ? "refresh" : "check")}${done ? "Desmarcar" : "Marcar como feito"}</button>`
    : "";

  // Hoje: o que ficou sem fazer nos dias anteriores, para encaixar se der.
  const backlog = n.date === d.date ? openFromPast(DAYS, n, MARKS) : [];
  const backlogHTML = backlog.length
    ? `<details class="stop backlog">
        <summary>${icon("alert")}<span class="t">${backlog.length} ${backlog.length === 1 ? "passeio ficou" : "passeios ficaram"} em aberto em outros dias</span>${icon("chevron", "chev")}</summary>
        <ul class="backlog-list">${backlog.map(({ di, i }) => {
          const bd = DAYS[di], bs = bd.stops[i];
          return `<li><div><strong>${esc(bs.title)}</strong> <span class="muted">· ${esc(bd.tab)}</span></div>
            <div class="actions">${bs.place ? `<a class="btn" href="${mapsSearch(bs.place)}" ${ext}>${icon("map")}Mapa</a>` : ""}<button class="btn" type="button" data-toggle="${esc(stopKey(bd, bs))}" data-was="0">${icon("check")}Já fizemos</button></div></li>`;
        }).join("")}</ul>
      </details>`
    : "";

  // Paradas já feitas no começo do dia viram um grupo fechado: a atual fica no alto.
  let doneLead = 0;
  while (doneLead < statuses.length && statuses[doneLead] === "done") doneLead++;
  const doneDetails = (s, i) => `<details class="stop" aria-labelledby="t-${dayIdx}-${i}" id="stop-${dayIdx}-${i}">
      <summary><span class="num">${timeOf(s)}</span><span class="t">${esc(s.title)}</span>${stateTag("done")}${icon("chevron", "chev")}</summary>
      <div class="stop-body">${stopBody(s, dayIdx, i, toggleBtn(s, true))}</div>
    </details>`;
  const grouped = doneLead >= 2;
  const doneGroup = grouped
    ? `<li class="tl-item is-done"><div class="tl-row"><span class="tl-mark"></span>
        <details class="stop done-group">
          <summary>${icon("check")}<span class="t">${doneLead === d.stops.length ? "Dia concluído" : `${doneLead} paradas feitas`}</span>${icon("chevron", "chev")}</summary>
          <div class="done-list">${d.stops.slice(0, doneLead).map(doneDetails).join("")}</div>
        </details></div></li>`
    : "";

  const items = d.stops.map((s, i) => {
    if (grouped && i < doneLead) return "";
    const st = statuses[i];
    const leg = s.leg ? `<div class="tl-leg">${icon(MODE[s.leg.mode].icon)}<span class="tnum">${esc(moveText(s.leg))}</span>${s.leg.alt ? `<span>${esc(s.leg.alt)}</span>` : ""}</div>` : "";
    const lt = leaveTime(s);
    const leaveTag = st !== "done" && lt && !s.trip && lt !== s.t ? `<span class="state state-paid num">${icon("walk")}Sair ${fmtH(lt)}</span>` : "";
    const fixedTag = isFixed(s) && st !== "done" ? `<span class="state state-paid">${icon("clock")}Horário marcado</span>` : "";
    const paidTag = s.paid ? `<span class="state state-paid">${icon("ticket")}Já pago</span>` : "";
    const mark = st === "next" ? "now" : st === "done" ? "check" : st === "open" ? "alert" : "pin";
    const card = st === "done"
      ? `<details class="stop" aria-labelledby="t-${dayIdx}-${i}">
          <summary><span class="num">${timeOf(s)}</span><span class="t">${esc(s.title)}</span>${stateTag(st)}${icon("chevron", "chev")}</summary>
          <div class="stop-body">${stopBody(s, dayIdx, i, toggleBtn(s, true))}</div>
        </details>`
      : `<article class="stop" aria-labelledby="t-${dayIdx}-${i}">
          <div class="stop-head">${isFixed(s) ? `<span class="stop-time num">${fmtH(s.t)}</span>` : ""}${stateTag(st)}${fixedTag}${paidTag}${leaveTag}</div>
          ${stopBody(s, dayIdx, i, toggleBtn(s, false, st === "next"))}
        </article>`;
    return `<li class="tl-item is-${st || "later"}" id="stop-${dayIdx}-${i}">${leg}<div class="tl-row"><span class="tl-mark">${icon(mark)}</span>${card}</div></li>`;
  }).join("");

  const isToday = d.date === n.date;
  const doneCount = statuses.filter((st) => st === "done").length;
  const progress = isToday
    ? `<div class="progress"><div class="progress-row"><span>Paradas de hoje</span><span class="num">${doneCount} de ${d.stops.length} feitas</span></div>
       <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="${d.stops.length}" aria-valuenow="${doneCount}" aria-label="Paradas feitas hoje"><span style="width:${Math.round((doneCount / d.stops.length) * 100)}%"></span></div></div>`
    : "";

  const MEAL_INFO = { cafe: ["cup", "Café"], almoco: ["plate", "Almoço"], lanche: ["candy", "Lanche"], jantar: ["plate", "Jantar"] };
  const meals = mealsOf(d);
  const mealRow = MEALS.map((m) => {
    const hit = meals.find((x) => x.meal === m);
    const [ico, label] = MEAL_INFO[m];
    return hit
      ? `<button class="fact meal num" type="button" data-goto="${dayIdx}-${hit.i}">${icon(ico)}${label}${hit.t ? ` ${fmtH(hit.t)}` : ""}</button>`
      : `<span class="state state-danger">${icon("alert")}Sem ${label.toLowerCase()}</span>`;
  }).join("");

  $("#day").innerHTML = `
    <div class="day-head">
      <p class="eyebrow">${icon("star")}Dia ${dayIdx + 1} de ${DAYS.length}</p>
      <h2 class="day-name">${esc(d.name)}</h2>
      <p class="day-magic">${esc(d.magic)}</p>
      <p class="day-hint">${esc(d.hint)}</p>
      <p class="day-hint">Sem horário = no ritmo de vocês: sigam a ordem e marquem "feito". Tempos a pé sem contar as paradas para foto.</p>
    </div>
    ${alerts ? `<div class="block">${alerts}</div>` : ""}
    <div class="day-facts">
      <div class="facts">
        ${weatherFact(d.date)}
        ${isToday ? "" : `<span class="fact num">${icon("pin")}${d.stops.length} paradas</span>`}
        ${uber ? `<span class="fact num">${icon("car")}Uber previsto ${brl(uber[0])} a ${uber[1]}</span>` : ""}
        ${paid ? `<span class="fact num">${icon("ticket")}${paid} já ${paid === 1 ? "pago" : "pagos"}</span>` : ""}
      </div>
      <div class="meals" aria-label="Refeições do dia"><span class="meals-label">Refeições</span>${mealRow}</div>
      ${progress}
    </div>
    ${notes ? `<div class="block">${notes}</div>` : ""}
    ${backlogHTML ? `<div class="block">${backlogHTML}</div>` : ""}
    <ol class="tl">${doneGroup}${items}</ol>
    ${ornament("Fim do dia. Bons sonhos!")}`;
  lastSignature = signature(n);
}

// Só redesenha a linha do tempo quando algum status muda (preserva paradas abertas).
const signature = (n) => `${dayIdx}|${n.date}|${DAYS[dayIdx].stops.map((_, i) => statusFor(DAYS[dayIdx], i, n, MARKS)).join(",")}`;

function tick() {
  if (SIM || currentTab !== "roteiro") return;
  const n = now();
  renderLive(n);
  if (signature(n) !== lastSignature) {
    renderDays(n);
    renderDay(n);
  }
}

function goToStop(di, si) {
  dayIdx = di;
  renderRoteiro();
  const el = document.getElementById(`stop-${di}-${si}`);
  if (el) el.closest(".done-group")?.setAttribute("open", "");
  if (el) el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
}

// ---------- tempo ----------
function renderTempo() {
  const n = now();
  const updated = WX ? new Date(WX.at) : null;
  const updatedTxt = updated
    ? `Atualizada às ${new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" }).format(updated)} de ${new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", timeZone: "America/Sao_Paulo" }).format(updated)}`
    : "Ainda sem previsão salva";
  const status = wxState === "loading"
    ? `<p class="note note-info">${icon("refresh")}<span>Buscando a previsão…</span></p>`
    : wxState === "error"
      ? `<p class="note note-notice">${icon("alert")}<span>Sem conexão com o serviço de previsão. ${WX ? "Mostrando a última previsão salva." : "Tentem de novo quando tiver internet."}</span></p>`
      : "";

  const ahead = DAYS.filter((d) => d.date >= n.date);
  const cards = (ahead.length ? ahead : DAYS).map((d) => {
    const f = forecastFor(d.date);
    if (!f) {
      const from = new Date(`${d.date}T12:00:00Z`);
      from.setUTCDate(from.getUTCDate() - 15);
      const fromIso = from.toISOString().slice(0, 10);
      return `<article class="panel wx">
        <div class="wx-top">${icon("clock", "wx-icon")}<div><p class="wx-day">${esc(fmtDate(d.date))}</p><p class="wx-cond">${esc(d.name)}</p></div></div>
        <p class="source">${daysUntil(n.date, fromIso) > 0 ? `Previsão a partir de ${esc(fmtDate(fromIso))}.` : "Previsão indisponível no momento."}</p>
      </article>`;
    }
    const c = describeCode(f.code);
    const alerts = weatherAlerts(f).map(alertHTML).join("");
    return `<article class="panel wx" aria-label="${esc(fmtDate(d.date))}">
      <div class="wx-top">${icon(c.icon, "wx-icon")}
        <div><p class="wx-day">${esc(fmtDate(d.date))}${d.date === n.date ? ` <span class="state state-now">${icon("now")}Hoje</span>` : ""}</p><p class="wx-cond">${esc(c.label)}</p></div>
        <p class="wx-temp num">${f.max}°<small> / ${f.min}°</small></p>
      </div>
      <div class="wx-facts">
        <span class="fact num">${icon("rain")}Chuva ${f.rainPct}% · ${String(f.rainMm).replace(".", ",")} mm</span>
        ${f.night != null ? `<span class="fact num">${icon("moon")}${f.night}° às 21h</span>` : ""}
        <span class="fact num">${icon("wind")}Vento ${f.wind} km/h</span>
      </div>
      ${alerts}
      <p class="wx-wear">${icon("shirt")}<span>${esc(wearAdvice(f))}</span></p>
    </article>`;
  }).join("");

  $("#tempo").innerHTML = `
    <header class="sec-head band">
      <p class="eyebrow">${icon("cloud-sun")}Gramado e Canela</p>
      <h1 class="sec-title" id="h-tempo">Previsão do <em>tempo</em></h1>
      <p class="sec-lead">Bem agasalhadas, cada luz fica ainda mais bonita. A previsão de cada dia, com alertas de frio, chuva e vento.</p>
      ${SKY}
    </header>
    <div class="wx-status">
      <p class="source">${esc(updatedTxt)}</p>
      <button class="btn" type="button" id="wxRefresh" ${wxState === "loading" ? "disabled" : ""}>${icon("refresh")}Atualizar</button>
    </div>
    ${status}
    <div class="wx-grid">${cards}</div>
    <section class="block" aria-labelledby="h-clima">
      <h2 class="block-title" id="h-clima">${icon("thermo")}Como costuma ser em novembro</h2>
      <div class="panel clima">
        <div><strong class="num">14 °C</strong><span>mínima média</span></div>
        <div><strong class="num">24 °C</strong><span>máxima média</span></div>
        <div><strong class="num">160 mm</strong><span>chuva no mês</span></div>
      </div>
      <p class="source">Médias de 30 anos (Climatempo). Previsão: <a href="https://open-meteo.com/" ${ext}>Open-Meteo</a> (CC BY 4.0), atualizada a cada hora quando há internet.</p>
    </section>`;
}

// ---------- voo ----------
function renderVoo() {
  const flights = P.FLIGHTS.map((f) => `
    <article class="panel flight">
      <p class="eyebrow">${esc(f.dir)} · ${esc(f.date)}</p>
      <p class="flight-times num">${fmtH(f.dep)}${icon("plane")}${f.arr ? fmtH(f.arr) : "—"}</p>
      <p class="flight-route">${esc(f.from)} → ${esc(f.to)}${f.arr ? "" : ". Chegada no cartão de embarque."}</p>
    </article>`).join("");
  const steps = P.FLIGHT_STEPS.map((s) => `
    <li class="step"><div class="block">
      <h3>${esc(s.title)}</h3>
      <ul class="bullets">${s.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
    </div></li>`).join("");
  const rights = P.PASSENGER_RIGHTS.map((r) => `<div><dt class="num">${esc(r.after)}</dt><dd>${esc(r.right)}</dd></div>`).join("");

  $("#voo").innerHTML = `
    <header class="sec-head band">
      <p class="eyebrow">${icon("plane")}Azul · só bagagem de mão</p>
      <h1 class="sec-title" id="h-voo">Primeiro <em>voo</em></h1>
      <p class="sec-lead">Vocês vão voar juntas pela primeira vez. Aqui está cada passo, para viver tudo sem susto.</p>
      ${SKY}
    </header>
    <div class="flights">${flights}</div>
    <section class="block" aria-labelledby="h-passos">
      <h2 class="block-title" id="h-passos">${icon("route")}Passo a passo</h2>
      <ol class="steps">${steps}</ol>
    </section>
    <section class="block" aria-labelledby="h-direitos">
      <h2 class="block-title" id="h-direitos">${icon("shield")}Se o voo atrasar</h2>
      <dl class="panel rights">${rights}</dl>
      <p class="source">Direitos da Resolução 400 da ANAC. Peçam no balcão da Azul.</p>
    </section>
    <p class="note note-info">${icon("info")}<span>Regras conferidas em 12/11/2026. Confirmem no app da Azul antes de sair de casa.</span></p>`;
}

// ---------- mala ----------
let person = store.get("mala:person", "nathaly");

function packItems(who) {
  return P.PACKING.map((g) => ({ ...g, items: g.items.filter((i) => i.who === "both" || i.who === who) }))
    .filter((g) => g.items.length);
}

// Grupo recolhível: só o próximo grupo a completar abre sozinho; depois vale o que a pessoa abriu ou fechou.
const groupOpen = {};
function groupBlock(key, ico, title, done, total, body, openByDefault) {
  const complete = done === total;
  const open = key in groupOpen ? groupOpen[key] : openByDefault;
  const tag = complete
    ? `<span class="state state-now num">${icon("check")}${done}/${total}</span>`
    : `<span class="state state-paid num">${done}/${total}</span>`;
  return `<details class="group" data-group="${esc(key)}" ${open ? "open" : ""}>
    <summary><span class="block-title">${icon(ico)}${esc(title)}</span>${tag}${icon("chevron", "chev")}</summary>
    <fieldset class="check-group"><legend class="sr-only">${esc(title)}</legend>${body}</fieldset>
  </details>`;
}

function renderMala() {
  const groups = packItems(person);
  const checked = store.get(`mala:${person}`, {});
  const all = groups.flatMap((g) => g.items);
  const done = all.filter((i) => checked[i.id]).length;
  const pct = all.length ? Math.round((done / all.length) * 100) : 0;
  const who = P.PEOPLE.find((p) => p.id === person);
  const ofWho = person === "mae" ? "da Fatima" : "da Nathaly";

  const firstOpen = groups.find((g) => g.items.some((i) => !checked[i.id]));
  const groupHTML = groups.map((g) => groupBlock(`${person}:${g.id}`, g.icon, g.title,
    g.items.filter((i) => checked[i.id]).length, g.items.length,
    g.items.map((i) => `
        <label class="check">
          <input type="checkbox" data-check="${esc(i.id)}" ${checked[i.id] ? "checked" : ""}>
          <span class="check-text">${esc(i.text)}</span>
          ${i.note ? `<span class="check-note">${esc(i.note)}</span>` : ""}
        </label>`).join(""), g === firstOpen)).join("");

  const out = store.get("mala:checkout", {});
  const checkout = groupBlock("checkout", "bed", "Antes de sair do hotel (sáb 28)",
    P.CHECKOUT.filter((_, i) => out[i]).length, P.CHECKOUT.length,
    P.CHECKOUT.map((t, i) => `
    <label class="check">
      <input type="checkbox" data-out="${i}" ${out[i] ? "checked" : ""}>
      <span class="check-text">${esc(t)}</span>
    </label>`).join(""), now().date === DAYS[DAYS.length - 1].date);

  $("#mala").innerHTML = `
    <header class="sec-head band">
      <p class="eyebrow">${icon("bag")}10 kg + mochila para cada uma</p>
      <h1 class="sec-title" id="h-mala">Mala <em>pronta</em></h1>
      <p class="sec-lead">Tudo o que vai com vocês nessa aventura. Cada celular guarda as próprias marcações.</p>
      ${SKY}
    </header>
    <div class="seg" role="tablist" aria-label="De quem é a lista">
      ${P.PEOPLE.map((p) => `<button type="button" role="tab" aria-selected="${p.id === person}" data-person="${p.id}">${esc(p.name)}</button>`).join("")}
    </div>
    <div class="progress" aria-live="polite">
      <div class="progress-row"><span>Lista ${ofWho}</span><span class="num">${done} de ${all.length} na mala</span></div>
      <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" aria-label="Progresso da mala"><span style="width:${pct}%"></span></div>
    </div>
    <section class="block" aria-label="Dicas ${ofWho}">
      <h2 class="block-title">${icon("heart")}Para ${person === "mae" ? "a Fatima" : "a Nathaly"}</h2>
      <ul class="panel bullets">${P.PERSON_TIPS[person].map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
    </section>
    <div class="groups">${groupHTML}</div>
    <section class="block" aria-labelledby="h-proibido">
      <h2 class="block-title" id="h-proibido">${icon("x")}Não pode levar</h2>
      <ul class="panel x-list">${P.FORBIDDEN.map((f) => `<li>${icon("x")}<strong>${esc(f.title)}</strong><span>${esc(f.text)}</span></li>`).join("")}</ul>
    </section>
    <section class="block" aria-labelledby="h-arrumar">
      <h2 class="block-title" id="h-arrumar">${icon("bag")}Como arrumar a mala</h2>
      <ul class="panel bullets">${P.PACK_TIPS.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
    </section>
    <section class="block" aria-labelledby="h-compras">
      <h2 class="block-title" id="h-compras">${icon("coin")}Compras para trazer</h2>
      <ul class="panel bullets">${P.SHOPPING.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
    </section>
    <div class="groups">${checkout}</div>
    <div class="actions"><button class="btn" type="button" id="resetMala">Desmarcar a lista ${ofWho}</button></div>`;
}

// ---------- dicas ----------
function renderDicas() {
  const tips = P.TIPS.map((t) => `
    <article class="panel tip">${icon(t.icon)}<h3>${esc(t.title)}</h3><p>${esc(t.text)}</p></article>`).join("");
  const sos = P.EMERGENCY.map((e) => `<a class="btn" href="tel:${e.tel}"><strong class="num">${e.tel}</strong><span>${esc(e.label)}</span></a>`).join("");
  $("#dicas").innerHTML = `
    <header class="sec-head band">
      <p class="eyebrow">${icon("bulb")}Para não rodar à toa</p>
      <h1 class="sec-title" id="h-dicas">Dicas de <em>Gramado</em></h1>
      <p class="sec-lead">Para aproveitar cada cantinho da cidade com calma e segurança.</p>
      ${SKY}
    </header>
    <section class="block" aria-labelledby="h-sos">
      <h2 class="block-title" id="h-sos">${icon("phone")}Emergência</h2>
      <div class="sos">${sos}</div>
      <a class="btn" href="${mapsSearch(P.HOSPITAL.place)}" ${ext}>${icon("map")}${esc(P.HOSPITAL.name)}, no mapa</a>
    </section>
    <div class="tips">${tips}</div>`;
}

// ---------- eventos ----------
function bind() {
  window.addEventListener("hashchange", route);
  document.addEventListener("toggle", (e) => {
    const g = e.target instanceof HTMLDetailsElement ? e.target.closest("[data-group]") : null;
    if (g === e.target) groupOpen[g.dataset.group] = g.open;
  }, true);
  $("#themeBtn").addEventListener("click", toggleTheme);

  document.addEventListener("click", (e) => {
    const dayBtn = e.target.closest("[data-day]");
    if (dayBtn) {
      dayIdx = Number(dayBtn.dataset.day);
      renderDays(now());
      renderDay(now());
      return;
    }
    const tg = e.target.closest("[data-toggle]");
    if (tg) {
      toggleDone(tg.dataset.toggle, tg.dataset.was === "1");
      const y = window.scrollY;
      renderRoteiro();
      window.scrollTo(0, y);
      return;
    }
    const go = e.target.closest("[data-goto]");
    if (go) {
      const [di, si] = go.dataset.goto.split("-").map(Number);
      goToStop(di, si);
      return;
    }
    const p = e.target.closest("[data-person]");
    if (p) {
      person = p.dataset.person;
      store.set("mala:person", person);
      renderMala();
      return;
    }
    if (e.target.closest("#resetMala")) {
      store.set(`mala:${person}`, {});
      renderMala();
      return;
    }
    if (e.target.closest("#wxRefresh")) loadWeather(true);
  });

  document.addEventListener("change", (e) => {
    const c = e.target.closest("[data-check]");
    if (c) {
      const key = `mala:${person}`;
      const state = store.get(key, {});
      state[c.dataset.check] = c.checked;
      store.set(key, state);
      renderMala();
      $(`[data-check="${c.dataset.check}"]`)?.focus();
      return;
    }
    const o = e.target.closest("[data-out]");
    if (o) {
      const state = store.get("mala:checkout", {});
      state[o.dataset.out] = o.checked;
      store.set("mala:checkout", state);
    }
  });

  const sel = $("#simDay");
  sel.innerHTML = DAYS.map((d) => `<option value="${d.date}">${esc(d.tab)}</option>`).join("");
  $("#simGo").addEventListener("click", () => {
    const t = $("#simTime").value || "11:00";
    SIM = { date: sel.value, min: toMin(t) };
    dayIdx = DAYS.findIndex((d) => d.date === sel.value);
    renderRoteiro();
    window.scrollTo(0, 0);
  });
  $("#simOff").addEventListener("click", () => {
    SIM = null;
    dayIdx = null;
    renderRoteiro();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      tick();
      loadWeather();
    }
  });
  setInterval(tick, 30000);
}

bind();
syncThemeButton();
route();
loadWeather();

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("sw.js").catch(() => {
    // sem modo offline: o guia segue funcionando online
  });
}

