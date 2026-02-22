# Categories Database Integration

This guide explains how the categories database integration works in your LyvoShop project.

## Overview

Categories are stored in a Neon PostgreSQL database and loaded once at the application root level. All categories are available throughout the app via React Context.

## Database Schema

The `categories` table has the following structure:

- **id**: Auto-incrementing primary key
- **name**: Category name (e.g., "Women's Clothing")
- **slug**: URL-friendly identifier (e.g., "womens-clothing")
- **description**: Optional description (default: empty string)
- **parentId**: Reference to parent category (null for root categories)
- **level**: Category depth level (1, 2, 3, etc.)
- **displayOrder**: Sort order within the same level
- **isActive**: Enable/disable categories
- **createdAt**: Timestamp
- **updatedAt**: Auto-updated timestamp

## Available Functions

### Server-side Functions (lib/categories.ts)

```typescript
import {
  getAllCategories,
  getCategoriesTreeSync,
  getCategoryBySlug,
} from "@/lib/categories";

// Get all active categories
const categories = await getAllCategories();

// Build tree structure from flat list
const tree = getCategoriesTreeSync(categories);

// Get a category by slug
const category = await getCategoryBySlug("womens-clothing");

// Get root level categories
const roots = await getRootCategories();

// Get children of a category
const children = await getCategoryChildren(categoryId);

// Get category breadcrumb path
const path = await getCategoryPath(categoryId);
```

### Client-side Hook (useCategoriesContext)

```typescript
'use client';
import { useCategoriesContext } from '@/contexts/Categories/CategoriesProvider';

export default function MyComponent() {
  const {
    categories,          // All categories (flat array)
    categoriesTree,      // Hierarchical tree structure
    getCategoryById,     // Find by ID
    getCategoryBySlug,   // Find by slug
    getRootCategories,   // Get level 1 categories
    getChildrenCategories, // Get children of a parent
  } = useCategoriesContext();

  // Example: Get all women's clothing items
  const womens = getCategoryBySlug('womens-clothing');
  const womensChildren = getChildrenCategories(womens?.id || 0);

  return (
    <div>
      {categoriesTree.map((cat) => (
        <div key={cat.id}>{cat.name}</div>
      ))}
    </div>
  );
}
```

## Database Management

### Viewing Data

```bash
# Open Prisma Studio to view/edit data
npx prisma studio
```

### Re-seeding Database

```bash
# Clear and re-populate categories
pnpm prisma:seed
```

### Adding New Categories

**Option 1: Via Prisma Studio**

1. Run `npx prisma studio`
2. Open Categories table
3. Add/edit records

**Option 2: Via Seed File**

1. Edit `prisma/seed.ts`
2. Run `pnpm prisma:seed`

**Option 3: Programmatically**

```typescript
import { prisma } from "@/lib/prisma";

await prisma.category.create({
  data: {
    name: "New Category",
    slug: "new-category",
    parentId: 2, // Optional parent
    level: 3,
    displayOrder: 10,
  },
});
```

## Example Usage

### Display Category Tree

```typescript
'use client';
import { useCategoriesContext } from '@/contexts/Categories/CategoriesProvider';

export default function CategoryMenu() {
  const { categoriesTree } = useCategoriesContext();

  return (
    <nav>
      {categoriesTree.map((rootCat) => (
        <div key={rootCat.id}>
          <h2>{rootCat.name}</h2>
          {rootCat.children?.map((child) => (
            <div key={child.id} className="ml-4">
              <h3>{child.name}</h3>
              {child.children?.map((grandchild) => (
                <a key={grandchild.id} href={`/category/${grandchild.slug}`}>
                  {grandchild.name}
                </a>
              ))}
            </div>
          ))}
        </div>
      ))}
    </nav>
  );
}
```

### Category Page

```typescript
// app/category/[slug]/page.tsx
import { getCategoryBySlug, getCategoryChildren } from '@/lib/categories';

export default async function CategoryPage({
  params
}: {
  params: { slug: string }
}) {
  const category = await getCategoryBySlug(params.slug);
  const children = category ? await getCategoryChildren(category.id) : [];

  return (
    <div>
      <h1>{category?.name}</h1>
      <p>{category?.description}</p>

      {children.length > 0 && (
        <div>
          <h2>Subcategories:</h2>
          {children.map((child) => (
            <a key={child.id} href={`/category/${child.slug}`}>
              {child.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Current Category Structure

```
Clothes (Level 1)
├── Women's Clothing (Level 2)
│   ├── Dresses (Level 3)
│   ├── Tops & T-Shirts (Level 3)
│   ├── Trousers & Jeans (Level 3)
│   ├── Skirts (Level 3)
│   └── Outerwear (Level 3)
├── Men's Clothing (Level 2)
│   ├── Shirts (Level 3)
│   ├── Trousers & Jeans (Level 3)
│   ├── Suits & Blazers (Level 3)
│   └── Outerwear (Level 3)
├── Kids' Clothing (Level 2)
│   ├── Baby Clothing (Level 3)
│   ├── Everyday Kidswear (Level 3)
│   └── Schoolwear (Level 3)
├── Underwear & Nightwear (Level 2)
│   ├── Underwear (Level 3)
│   ├── Sleepwear (Level 3)
│   └── Socks & Tights (Level 3)
├── Sportswear (Level 2)
│   ├── Training Apparel (Level 3)
│   ├── Running Apparel (Level 3)
│   └── Outdoor Apparel (Level 3)
└── Outerwear (Level 2)
    ├── Jackets & Parkas (Level 3)
    ├── Winter Wear (Level 3)
    └── Rainwear (Level 3)
```

## Performance Notes

- Categories are fetched **once** at the root layout level on the server
- All pages have immediate access to categories without additional database queries
- The flat array and tree structure are both available for different use cases
- Use the flat `categories` array for searching/filtering
- Use the `categoriesTree` for displaying hierarchical menus

## TypeScript Types

```typescript
import { Category } from "@prisma/client";
import { CategoryWithChildren } from "@/lib/categories";

// Category = Prisma-generated type
// CategoryWithChildren = Category with nested children array
```
