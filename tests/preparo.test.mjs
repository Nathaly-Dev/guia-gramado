import { test } from "node:test";
import assert from "node:assert/strict";
import { PACKING, PEOPLE, PERSON_TIPS } from "../site/js/preparo.js";

test("ids da mala são únicos (as marcações salvas dependem deles)", () => {
  const ids = PACKING.flatMap((g) => g.items.map((i) => i.id));
  assert.equal(new Set(ids).size, ids.length);
});

test("cada pessoa tem lista própria e dicas", () => {
  const valid = new Set(["both", ...PEOPLE.map((p) => p.id)]);
  for (const g of PACKING) for (const i of g.items) assert.ok(valid.has(i.who), i.id);
  for (const p of PEOPLE) {
    assert.ok(PERSON_TIPS[p.id]?.length, p.id);
    assert.ok(PACKING.some((g) => g.items.some((i) => i.who === p.id)), `sem itens só de ${p.id}`);
  }
});
