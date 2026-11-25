// Lógica pura do guia (sem DOM): horários, status das paradas, custos e clima.
// Tudo aqui é testado em tests/core.test.mjs.

export const TZ = "America/Sao_Paulo";

// Limites dos alertas de clima (°C, %, mm, km/h). Um lugar só para ajustar.
export const WEATHER_LIMITS = {
  cold: 12,
  veryCold: 8,
  coldNight: 14,
  hot: 28,
  rainLikely: 60,
  rainMaybe: 40,
  rainMm: 5,
  wind: 40,
};

export const toMin = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

export const fromMin = (n) => {
  const h = Math.floor(n / 60);
  const m = n % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

// "09:30" -> "9h30", "10:00" -> "10h"
export const fmtH = (t) => {
  const [h, m] = t.split(":");
  return `${Number(h)}h${m === "00" ? "" : m}`;
};

// Data e minuto do dia no horário de Brasília, independente do fuso do celular.
export function nowInSP(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type).value;
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    min: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

// Parada com horário marcado (ingresso, show, voo, café do hotel) tem `t`.
// As outras seguem o ritmo de vocês: sem horário, só a ordem do caminho.
export const isFixed = (s) => Boolean(s.t);
export const stopKey = (day, s) => `${day.date}|${s.title}`;

// Parada fixa sem marcação vira "feita" sozinha depois que passa (padrão: 1 hora).
export const fixedEnd = (s) => s.end || fromMin(toMin(s.t) + 60);

// marks: { chave: true (feito) | false (reaberto à mão) }. Sem chave: automático.
export function isDone(day, i, now, marks = {}) {
  if (now.date < day.date) return false;
  const s = day.stops[i];
  const m = marks[stopKey(day, s)];
  if (m === true) return true;
  if (m === false) return false;
  if (now.date > day.date) return true;
  return isFixed(s) && now.min >= toMin(fixedEnd(s));
}

// Próxima parada: a primeira pendente depois da última feita (segue o caminho);
// se não houver, a primeira pendente do dia.
export function nextPending(day, now, marks = {}) {
  if (now.date !== day.date) return now.date < day.date ? 0 : -1;
  const done = day.stops.map((_, i) => isDone(day, i, now, marks));
  const last = done.lastIndexOf(true);
  const after = done.findIndex((d, i) => !d && i > last);
  return after >= 0 ? after : done.indexOf(false);
}

// "" (depois), "next" (próxima), "open" (pulada, em aberto), "done" (feita).
export function statusFor(day, i, now, marks = {}) {
  if (now.date < day.date) return "";
  if (isDone(day, i, now, marks)) return "done";
  const next = nextPending(day, now, marks);
  if (i === next) return "next";
  return i < next ? "open" : "";
}

const TIMED_MODES = new Set(["walk", "uber", "car"]);

// Horário em que é preciso sair para chegar a tempo na parada.
export function leaveTime(stop) {
  if (!isFixed(stop)) return null;
  if (stop.trip) return stop.t;
  const leg = stop.leg;
  if (!leg) return null;
  if (leg.leaveAt) return leg.leaveAt;
  if (leg.min && TIMED_MODES.has(leg.mode)) return fromMin(toMin(stop.t) - leg.min[1]);
  return null;
}

export const moveOf = (stop) => stop.trip || stop.leg || null;

// Refeições do dia, na ordem em que acontecem: [{ meal, t, i }].
export const MEALS = ["cafe", "almoco", "lanche", "jantar"];
export const mealsOf = (day) =>
  day.stops.map((s, i) => ({ meal: s.meal, t: s.t, i })).filter((m) => m.meal);

// Soma das faixas de preço de Uber previstas no dia: [mínimo, máximo] ou null.
export function uberRange(day) {
  let lo = 0;
  let hi = 0;
  for (const s of day.stops) {
    const mv = moveOf(s);
    if (mv && mv.mode === "uber" && mv.price) {
      lo += mv.price[0];
      hi += mv.price[1];
    }
  }
  return hi ? [lo, hi] : null;
}

export const paidCount = (day) => day.stops.filter((s) => s.paid).length;

export function daysUntil(nowDate, targetDate) {
  const a = Date.UTC(...nowDate.split("-").map((n, i) => (i === 1 ? n - 1 : +n)));
  const b = Date.UTC(...targetDate.split("-").map((n, i) => (i === 1 ? n - 1 : +n)));
  return Math.round((b - a) / 86400000);
}

export function durationLabel(minutes) {
  if (minutes <= 0) return "agora";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m} min`;
  return m ? `${h}h${String(m).padStart(2, "0")}` : `${h}h`;
}

// Estado do cartão "ao vivo": antes, durante ou depois da viagem.
export function liveState(days, now, marks = {}) {
  const first = days[0].date;
  const last = days[days.length - 1].date;
  if (now.date < first) return { phase: "before", days: daysUntil(now.date, first) };
  if (now.date > last) return { phase: "after" };
  const di = days.findIndex((d) => d.date === now.date);
  if (di < 0) return { phase: "after" };
  const day = days[di];
  const nextIdx = nextPending(day, now, marks);
  const doneCount = day.stops.filter((_, i) => isDone(day, i, now, marks)).length;
  // Próximo compromisso com horário ainda não feito.
  const fixedIdx = day.stops.findIndex((s, i) => isFixed(s) && !isDone(day, i, now, marks));
  let leave = null;
  if (fixedIdx >= 0) {
    const lt = leaveTime(day.stops[fixedIdx]);
    if (lt) leave = { at: lt, inMin: toMin(lt) - now.min };
  }
  return {
    phase: "during", di, nextIdx, fixedIdx, leave, doneCount,
    fixedInMin: fixedIdx >= 0 ? toMin(day.stops[fixedIdx].t) - now.min : null,
  };
}

// ---------- clima (Open-Meteo, códigos WMO) ----------

const WMO = [
  [[0], "Céu limpo", "sun"],
  [[1, 2], "Sol entre nuvens", "cloud-sun"],
  [[3], "Nublado", "cloud"],
  [[45, 48], "Neblina", "fog"],
  [[51, 53, 55, 56, 57], "Garoa", "rain"],
  [[61, 63, 65, 66, 67, 80, 81, 82], "Chuva", "rain"],
  [[71, 73, 75, 77, 85, 86], "Neve ou granizo", "snow"],
  [[95, 96, 99], "Temporal", "storm"],
];

export function describeCode(code) {
  const hit = WMO.find(([codes]) => codes.includes(code));
  return hit ? { label: hit[1], icon: hit[2] } : { label: "Tempo variável", icon: "cloud" };
}

// Converte a resposta da API em { "AAAA-MM-DD": { min, max, rainPct, rainMm, wind, night, code } }.
export function parseForecast(json) {
  const out = {};
  const d = json && json.daily;
  if (!d || !Array.isArray(d.time)) return out;
  const nightTemp = {};
  const h = json.hourly;
  if (h && Array.isArray(h.time)) {
    h.time.forEach((t, i) => {
      if (t.endsWith("T21:00")) nightTemp[t.slice(0, 10)] = h.temperature_2m[i];
    });
  }
  d.time.forEach((date, i) => {
    out[date] = {
      code: d.weather_code[i],
      min: Math.round(d.temperature_2m_min[i]),
      max: Math.round(d.temperature_2m_max[i]),
      rainPct: d.precipitation_probability_max[i] ?? 0,
      rainMm: Math.round((d.precipitation_sum[i] ?? 0) * 10) / 10,
      wind: Math.round(d.wind_speed_10m_max[i] ?? 0),
      night: nightTemp[date] != null ? Math.round(nightTemp[date]) : null,
    };
  });
  return out;
}

// Alertas do dia: { kind: cold|rain|hot|wind, level: danger|notice, text }.
export function weatherAlerts(f, L = WEATHER_LIMITS) {
  if (!f) return [];
  const out = [];
  if (f.min <= L.veryCold) out.push({ kind: "cold", level: "danger", text: `Muito frio: mínima de ${f.min} °C. Segunda pele, casaco pesado, cachecol e meia grossa.` });
  else if (f.min <= L.cold) out.push({ kind: "cold", level: "notice", text: `Frio: mínima de ${f.min} °C. Casaco pesado e cachecol para a noite.` });
  else if (f.night != null && f.night <= L.coldNight) out.push({ kind: "cold", level: "notice", text: `Noite fria: ${f.night} °C às 21h. Levem casaco para os shows.` });
  if (f.rainPct >= L.rainLikely || f.rainMm >= L.rainMm) out.push({ kind: "rain", level: "danger", text: `Chuva provável (${f.rainPct}%, ${String(f.rainMm).replace(".", ",")} mm). Guarda-chuva, corta-vento e calçado que aguente água.` });
  else if (f.rainPct >= L.rainMaybe) out.push({ kind: "rain", level: "notice", text: `Pode chover (${f.rainPct}%). Guarda-chuva na mochila.` });
  if (f.max >= L.hot) out.push({ kind: "hot", level: "notice", text: `Calor: máxima de ${f.max} °C. Protetor solar, boné e água.` });
  if (f.wind >= L.wind) out.push({ kind: "wind", level: "notice", text: `Vento forte (até ${f.wind} km/h). Corta-vento; guarda-chuva pode virar.` });
  return out;
}

// Sugestão do que vestir a partir da previsão.
export function wearAdvice(f, L = WEATHER_LIMITS) {
  if (!f) return null;
  if (f.min <= L.cold) return "Camadas: segunda pele, malha e casaco pesado. Calça e meia grossa.";
  if (f.min <= 16) return "Camiseta e malha de dia; casaco à noite.";
  if (f.max >= L.hot) return "Roupa leve de dia; casaco leve na mochila para a noite.";
  return "Camiseta de dia e casaco leve à noite.";
}
