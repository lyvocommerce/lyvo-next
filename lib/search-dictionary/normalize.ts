import { STOPWORDS_EN, STOPWORDS_FI, MIN_TERM_LENGTH, MAX_TERM_LENGTH } from "./stopwords";

/** Нормализация термина для поиска: lowercase, trim, одна пробельная подстрока. */
export function normalizeTerm(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .slice(0, MAX_TERM_LENGTH);
}

/** Проверка, что термин не стоп-слово и не слишком короткий. */
export function isMeaningfulTerm(term: string, lang?: string): boolean {
  const t = normalizeTerm(term);
  if (t.length < MIN_TERM_LENGTH || t.length > MAX_TERM_LENGTH) return false;
  if (lang === "fi" && STOPWORDS_FI.has(t)) return false;
  return !STOPWORDS_EN.has(t);
}

/** Уникальные нормализованные термины без стоп-слов и дублей. */
export function dedupeTerms(terms: { term: string; lang: string }[]): { term: string; lang: string }[] {
  const seen = new Set<string>();
  const out: { term: string; lang: string }[] = [];
  for (const { term, lang } of terms) {
    const n = normalizeTerm(term);
    if (!n || seen.has(n)) continue;
    if (!isMeaningfulTerm(n, lang)) continue;
    seen.add(n);
    out.push({ term: n, lang });
  }
  return out;
}
