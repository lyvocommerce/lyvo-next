# Search Dictionary

System for automatic enrichment of search terms and synonyms for EN/FI.

## Components

- **`en-fi-concepts.ts`** — static mapping: categories (slug → FI terms) and product concepts (chair, lamp, dress, wood, …).
- **`stopwords.ts`** — EN/FI stopwords and term length limits.
- **`normalize.ts`** — term normalization and deduplication (word-boundary compatible).
- **`generate.ts`** — core: fetch categories from DB + static concepts → combined dictionary.
- **`import-to-db.ts`** — upsert dictionary into `search_concept_groups` and `search_concept_terms`.

## Scripts

```bash
# Generate data/search-dictionary.json from DB and static data
npm run search-dictionary:generate

# Import data/search-dictionary.json into DB
npm run search-dictionary:import

# Generate and import in one step
npm run search-dictionary:refresh
```

## API

- **POST /api/admin/search-dictionary/regenerate** — rebuild the dictionary from current categories and static data and write to DB (no request body).

## Prioritization rules

1. **Categories from DB** — for each slug a group is created with EN (name, slug, slug parts) and FI from `CATEGORY_EN_TO_FI`.
2. **Static product concepts** — product types, materials, styles with EN+FI; when `code` matches they are merged with the category.
3. Terms are **normalized** (lowercase, trim), **filtered** by stopwords and minimum length, **deduplicated** within each group.
4. Random words from product descriptions are not added without an explicit mapping — only categories and the static dictionary.

## Extending

- **New categories** — after adding to DB run `search-dictionary:refresh` or POST `regenerate`.
- **New EN/FI concepts** — add to `STATIC_PRODUCT_CONCEPTS` or `CATEGORY_EN_TO_FI` in `en-fi-concepts.ts`, then regenerate.

## data/search-dictionary.json format

```json
{
  "version": "1.0",
  "generatedAt": "ISO8601",
  "groups": [
    { "code": "chair", "terms": [{"term": "chair", "lang": "en"}, {"term": "tuoli", "lang": "fi"}] }
  ]
}
```
