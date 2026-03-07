export type ConceptTerm = { term: string; lang: string };
export type ConceptGroup = { code: string; terms: ConceptTerm[] };

export type SearchDictionaryExport = {
  version: string;
  generatedAt: string;
  groups: ConceptGroup[];
};
