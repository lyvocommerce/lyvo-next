/**
 * Стоп-слова для фильтрации при извлечении терминов из title/description.
 * Не создаём концепты для этих слов — они не несут поисковой ценности.
 */
export const STOPWORDS_EN = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by",
  "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did",
  "will", "would", "could", "should", "may", "might", "must", "shall", "can", "need", "dare",
  "this", "that", "these", "those", "it", "its", "as", "from", "into", "through", "during",
  "before", "after", "above", "below", "between", "under", "again", "further", "then", "once",
  "here", "there", "when", "where", "why", "how", "all", "each", "few", "more", "most",
  "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too",
  "very", "just", "also", "now", "new", "one", "two", "us", "use", "used", "using", "size", "s",
]);

export const STOPWORDS_FI = new Set([
  "ja", "tai", "mutta", "että", "on", "ei", "se", "hän", "me", "te", "he", "ne",
  "olla", "olla", "voida", "voida", "tulla", "tulla", "pitää", "pitää", "saada",
  "tämä", "tuo", "nämä", "nuo", "joka", "jotka", "mitä", "kuka", "kun", "kuin",
  "vain", "myös", "vielä", "jo", "nyt", "sitten", "koska", "jos", "vaan", "kuitenkin",
  "koko", "eri", "oma", "sama", "itse", "hyvin", "paljon", "vähän", "liian",
]);

/** Минимальная длина токена для автоматического извлечения (исключает мусор). */
export const MIN_TERM_LENGTH = 2;

/** Максимальная длина одного термина (длинные фразы не создаём как один термин). */
export const MAX_TERM_LENGTH = 50;
