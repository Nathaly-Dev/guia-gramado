import { test } from "node:test";
import assert from "node:assert/strict";
import {
  toMin, fmtH, nowInSP, statusFor, leaveTime, uberRange, liveState, daysUntil, stopKey,
  parseForecast, weatherAlerts, wearAdvice, describeCode,
} from "../site/js/core.js";
import { DAYS } from "../site/js/roteiro.js";

const day = (stops, endAt = "22:00") => ({ date: "2026-11-25", endAt, stops });

test("formata horário", () => {
  assert.equal(fmtH("09:30"), "9h30");
  assert.equal(fmtH("10:00"), "10h");
  assert.equal(toMin("17:15"), 1035);
});

test("usa o horário de Brasília mesmo com o celular em outro fuso", () => {
  // 13:30 UTC = 10:30 em Brasília
  assert.deepEqual(nowInSP(new Date("2026-11-25T13:30:00Z")), { date: "2026-11-25", min: 630 });
  // 02:00 UTC do dia 25 = 23:00 do dia 24 em Brasília (virada de dia)
  assert.deepEqual(nowInSP(new Date("2026-11-25T02:00:00Z")), { date: "2026-11-24", min: 1380 });
});

test("status: segue a ordem, marcado à mão, fixo passa sozinho", () => {
  const d = day([
    { t: "07:00", end: "09:00", title: "Café" },
    { title: "Lago" },
    { title: "Praça" },
    { t: "12:30", title: "Almoço" },
    { title: "Igreja" },
  ]);
  const at = (min, marks = {}, date = d.date) => d.stops.map((_, i) => statusFor(d, i, { date, min }, marks));
  const k = (i) => stopKey(d, d.stops[i]);
  // café ainda valendo: é o próximo
  assert.deepEqual(at(toMin("08:00")), ["next", "", "", "", ""]);
  // café passou sozinho; o lago é o próximo mesmo sem horário
  assert.deepEqual(at(toMin("10:00")), ["done", "next", "", "", ""]);
  // marcou o lago: a praça vira a próxima
  assert.deepEqual(at(toMin("10:30"), { [k(1)]: true }), ["done", "done", "next", "", ""]);
  // pulou a praça e marcou o almoço: a praça fica em aberto e a igreja é a próxima
  assert.deepEqual(at(toMin("13:00"), { [k(1)]: true, [k(3)]: true }), ["done", "done", "open", "done", "next"]);
  // almoço passou sozinho (1 h depois) sem marcar
  assert.deepEqual(at(toMin("13:31"), { [k(1)]: true, [k(2)]: true }), ["done", "done", "done", "done", "next"]);
  // desmarcar reabre até parada fixa que já passou
  assert.deepEqual(at(toMin("10:00"), { [k(0)]: false }), ["next", "", "", "", ""]);
  assert.deepEqual(at(0, {}, "2026-11-24"), ["", "", "", "", ""]);
  assert.deepEqual(at(0, {}, "2026-11-26"), ["done", "done", "done", "done", "done"]);
});

test("hora de sair usa o maior tempo do trajeto", () => {
  assert.equal(leaveTime({ t: "10:00", leg: { mode: "walk", min: [15, 20] } }), "09:40");
  assert.equal(leaveTime({ t: "15:00", leg: { mode: "walk", min: [15, 15], leaveAt: "14:25" } }), "14:25");
  assert.equal(leaveTime({ t: "17:15", trip: { mode: "uber", min: [10, 15] } }), "17:15");
  assert.equal(leaveTime({ t: "10:10", leg: { mode: "bus", label: "Rota amarela" } }), null);
  assert.equal(leaveTime({ t: "07:00" }), null);
  assert.equal(leaveTime({ title: "sem horário", leg: { mode: "walk", min: [5, 10] } }), null);
});

test("soma o Uber previsto do dia", () => {
  const d = day([
    { t: "10:00", leg: { mode: "uber", price: [10, 15] } },
    { t: "11:00", trip: { mode: "uber", price: [20, 30] } },
    { t: "12:00", leg: { mode: "walk", min: [5, 5] } },
  ]);
  assert.deepEqual(uberRange(d), [30, 45]);
  assert.equal(uberRange(day([{ t: "10:00" }])), null);
});

test("cartão ao vivo antes, durante e depois da viagem", () => {
  assert.deepEqual(liveState(DAYS, { date: "2026-11-12", min: 600 }), { phase: "before", days: 12 });
  assert.deepEqual(liveState(DAYS, { date: "2026-11-29", min: 600 }), { phase: "after" });
  const s = liveState(DAYS, { date: "2026-11-27", min: toMin("17:00") });
  assert.equal(s.phase, "during");
  assert.equal(DAYS[s.di].stops[s.fixedIdx].title, "Uber até o Gatzz");
  assert.deepEqual(s.leave, { at: "17:15", inMin: 15 });
  // na quarta, depois do café, sem nada marcado: o primeiro passeio é o lago mais perto do hotel
  const q = liveState(DAYS, { date: "2026-11-25", min: toMin("10:15") });
  assert.equal(DAYS[q.di].stops[q.nextIdx].title, "Lago Joaquina Rita Bier");
  assert.equal(DAYS[q.di].stops[q.fixedIdx].title, "Naro Sushi");
});

test("todo dia tem café, almoço, lanche e jantar, nessa ordem", () => {
  for (const d of DAYS) {
    const meals = d.stops.filter((s) => s.meal).map((s) => s.meal);
    assert.deepEqual(meals, ["cafe", "almoco", "lanche", "jantar"], `refeições de ${d.date}: ${meals.join(", ")}`);
  }
});

test("cada parada é um lugar só (sem listas de vários pontos no título)", () => {
  for (const d of DAYS) {
    for (const s of d.stops) {
      assert.ok(!/ e (a |o )?(Praça|Igreja|Museu|Rua|Casa|Vila|Catedral|Fonte|Lago)/.test(s.title), `parada misturada: ${d.date} ${s.t} ${s.title}`);
    }
  }
});

test("dias até a viagem atravessam o mês", () => {
  assert.equal(daysUntil("2026-10-31", "2026-11-24"), 24);
  assert.equal(daysUntil("2026-11-24", "2026-11-24"), 0);
});

test("o roteiro está consistente", () => {
  const modes = new Set(["walk", "uber", "car", "bus", "flight"]);
  for (const d of DAYS) {
    assert.match(d.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(d.stops.length > 0, d.date);
    assert.equal(d.welcome?.length, 3, `boas-vindas: ${d.date}`);
    assert.ok(d.magic, `frase do dia: ${d.date}`);
    let prev = -1;
    for (const s of d.stops) {
      const where = `${d.date} ${s.t} ${s.title}`;
      if (s.t) {
        assert.match(s.t, /^\d{2}:\d{2}$/, where);
        assert.ok(toMin(s.t) > prev, `horário fixo fora de ordem: ${where}`);
        prev = toMin(s.t);
        if (s.end) assert.ok(toMin(s.end) > toMin(s.t), `fim antes do começo: ${where}`);
      }
      assert.ok(s.title && s.desc, `sem título ou descrição: ${where}`);
      assert.ok(!(s.leg && s.trip), `leg e trip juntos: ${where}`);
      const mv = s.leg || s.trip;
      if (mv) {
        assert.ok(modes.has(mv.mode), `modo inválido: ${where}`);
        if (mv.price) assert.ok(mv.price[0] <= mv.price[1], `preço invertido: ${where}`);
        if (mv.min) assert.ok(mv.min[0] <= mv.min[1], `tempo invertido: ${where}`);
      }
    }
    assert.ok(toMin(d.endAt) > prev, `fim do dia antes da última parada: ${d.date}`);
    const titles = d.stops.map((s) => s.title);
    assert.equal(new Set(titles).size, titles.length, `título repetido no dia (a marcação de feito usa o título): ${d.date}`);
  }
  for (let i = 1; i < DAYS.length; i++) assert.ok(DAYS[i].date > DAYS[i - 1].date);
});

const sample = {
  daily: {
    time: ["2026-11-24", "2026-11-25"],
    weather_code: [61, 1],
    temperature_2m_min: [7.6, 15.2],
    temperature_2m_max: [16.4, 29.1],
    precipitation_probability_max: [80, 10],
    precipitation_sum: [12.34, 0],
    wind_speed_10m_max: [45, 12],
  },
  hourly: {
    time: ["2026-11-24T21:00", "2026-11-25T20:00", "2026-11-25T21:00"],
    temperature_2m: [8.4, 19, 17.6],
  },
};

test("lê a previsão do Open-Meteo", () => {
  const f = parseForecast(sample);
  assert.deepEqual(f["2026-11-24"], { code: 61, min: 8, max: 16, rainPct: 80, rainMm: 12.3, wind: 45, night: 8 });
  assert.equal(f["2026-11-25"].night, 18);
  assert.deepEqual(parseForecast(null), {});
  assert.deepEqual(parseForecast({ error: true }), {});
});

test("alertas de frio, chuva, calor e vento", () => {
  const f = parseForecast(sample);
  const cold = weatherAlerts(f["2026-11-24"]).map((a) => `${a.kind}:${a.level}`);
  assert.deepEqual(cold, ["cold:danger", "rain:danger", "wind:notice"]);
  assert.deepEqual(weatherAlerts(f["2026-11-25"]).map((a) => a.kind), ["hot"]);
  assert.deepEqual(weatherAlerts(null), []);
  const night = weatherAlerts({ min: 15, max: 22, night: 13, rainPct: 45, rainMm: 1, wind: 10 });
  assert.match(night[0].text, /Noite fria/);
  assert.equal(night[1].level, "notice");
});

test("limites exatos dos alertas contam como alerta", () => {
  const base = { max: 20, night: 16, rainPct: 0, rainMm: 0, wind: 0 };
  assert.equal(weatherAlerts({ ...base, min: 12 })[0].level, "notice");
  assert.equal(weatherAlerts({ ...base, min: 8 })[0].level, "danger");
  assert.deepEqual(weatherAlerts({ ...base, min: 13 }), []);
  assert.equal(weatherAlerts({ ...base, min: 15, rainPct: 60 })[0].level, "danger");
  assert.equal(weatherAlerts({ ...base, min: 15, rainMm: 5 })[0].level, "danger");
  assert.equal(weatherAlerts({ ...base, min: 15, rainPct: 40 })[0].level, "notice");
  assert.equal(weatherAlerts({ ...base, min: 15, max: 28 })[0].kind, "hot");
  assert.equal(weatherAlerts({ ...base, min: 15, wind: 40 })[0].kind, "wind");
  assert.match(wearAdvice({ min: 12, max: 20 }), /segunda pele/);
});

test("sugestão de roupa e descrição do tempo", () => {
  assert.match(wearAdvice({ min: 10, max: 18 }), /segunda pele/);
  assert.match(wearAdvice({ min: 17, max: 30 }), /Roupa leve/);
  assert.equal(wearAdvice(null), null);
  assert.equal(describeCode(95).label, "Temporal");
  assert.equal(describeCode(999).label, "Tempo variável");
});
