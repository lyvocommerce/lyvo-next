# Поисковый словарь (Search Dictionary)

Система автоматического обогащения поисковых терминов и синонимов для EN/FI.

## Компоненты

- **`en-fi-concepts.ts`** — статический маппинг: категории (slug → FI-термины) и продуктные концепты (chair, lamp, dress, wood, …).
- **`stopwords.ts`** — стоп-слова EN/FI и лимиты длины терминов.
- **`normalize.ts`** — нормализация и дедупликация терминов (word-boundary-совместимо).
- **`generate.ts`** — ядро: выборка категорий из БД + статические концепты → объединённый словарь.
- **`import-to-db.ts`** — upsert словаря в `search_concept_groups` и `search_concept_terms`.

## Скрипты

```bash
# Сгенерировать data/search-dictionary.json из БД и статики
npm run search-dictionary:generate

# Импортировать data/search-dictionary.json в БД
npm run search-dictionary:import

# Сгенерировать и сразу импортировать
npm run search-dictionary:refresh
```

## API

- **POST /api/admin/search-dictionary/regenerate** — пересобрать словарь из текущих категорий и статики и записать в БД (без тела запроса).

## Правила приоритизации

1. **Категории из БД** — для каждого slug создаётся группа с EN (name, slug, части slug) и FI из `CATEGORY_EN_TO_FI`.
2. **Статические продуктные концепты** — типы товаров, материалы, стили с EN+FI; при совпадении `code` объединяются с категорией.
3. Термины **нормализуются** (lowercase, trim), **фильтруются** стоп-словами и минимальной длиной, **дедуплицируются** в рамках группы.
4. Не добавляются случайные слова из описаний товаров без явного маппинга — только категории и статический словарь.

## Расширение

- **Новые категории** — после добавления в БД выполнить `search-dictionary:refresh` или POST `regenerate`.
- **Новые EN/FI концепты** — добавить в `STATIC_PRODUCT_CONCEPTS` или в `CATEGORY_EN_TO_FI` в `en-fi-concepts.ts`, затем перегенерировать.

## Формат data/search-dictionary.json

```json
{
  "version": "1.0",
  "generatedAt": "ISO8601",
  "groups": [
    { "code": "chair", "terms": [{"term": "chair", "lang": "en"}, {"term": "tuoli", "lang": "fi"}] }
  ]
}
```
