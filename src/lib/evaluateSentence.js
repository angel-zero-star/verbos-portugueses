// Pure evaluator for Mode 2 sentence answers.
// Returns { result: "correct" | "close" | "wrong", note: string | null }
//
// Rules:
// 1. Normalize: lowercase, trim, collapse whitespace, strip terminal punctuation.
// 2. Accept variants where user prepends/omits a subject pronoun (eu, tu, ele, ela,
//    você, nós, eles, elas, vocês) relative to the target.
// 3. Exact match after normalization → correct.
// 4. Accent-insensitive match → correct (no note — accents optional on input).
// 5. Levenshtein distance ≤ max(2, floor(15% of target length)) → close (typo).
// 6. Otherwise → wrong.

const SUBJECT_PRONOUNS = [
  "eu", "tu", "você", "voce", "ele", "ela",
  "nós", "nos", "vocês", "voces", "eles", "elas",
];

function stripAccents(s) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normalize(s) {
  return (s || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.!?;,]+$/g, "")
    .trim();
}

function stripLeadingPronoun(s) {
  const parts = s.split(" ");
  if (parts.length > 1 && SUBJECT_PRONOUNS.includes(stripAccents(parts[0]))) {
    return parts.slice(1).join(" ");
  }
  return s;
}

function candidates(s) {
  const n = normalize(s);
  return [n, stripLeadingPronoun(n)];
}

function levenshtein(a, b) {
  if (a === b) return 0;
  const al = a.length, bl = b.length;
  if (!al) return bl;
  if (!bl) return al;
  const v0 = new Array(bl + 1);
  const v1 = new Array(bl + 1);
  for (let i = 0; i <= bl; i++) v0[i] = i;
  for (let i = 0; i < al; i++) {
    v1[0] = i + 1;
    for (let j = 0; j < bl; j++) {
      const cost = a[i] === b[j] ? 0 : 1;
      v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
    }
    for (let j = 0; j <= bl; j++) v0[j] = v1[j];
  }
  return v1[bl];
}

export function evaluateSentence(user, target, alternatives = []) {
  const targets = [target, ...(alternatives || [])].filter(Boolean);
  const userCands = candidates(user);

  // Build flat list of target candidates (normalized + pronoun-stripped)
  const targetCands = [];
  for (const t of targets) {
    for (const c of candidates(t)) targetCands.push(c);
  }

  // 1. Exact
  for (const u of userCands) {
    if (targetCands.includes(u)) return { result: "correct", note: null };
  }

  // 2. Accent-insensitive
  const userNoAcc = userCands.map(stripAccents);
  const targetNoAcc = targetCands.map(stripAccents);
  for (const u of userNoAcc) {
    if (targetNoAcc.includes(u)) return { result: "correct", note: "Sem acentos" };
  }

  // 3. Levenshtein on accent-stripped forms
  let best = Infinity;
  for (const u of userNoAcc) {
    for (const t of targetNoAcc) {
      const d = levenshtein(u, t);
      if (d < best) best = d;
    }
  }
  const primaryLen = stripAccents(normalize(target)).length;
  const threshold = Math.max(2, Math.floor(primaryLen * 0.15));
  if (best <= threshold) return { result: "close", note: "Quase — verifica a ortografia" };

  return { result: "wrong", note: null };
}
