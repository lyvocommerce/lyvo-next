"use client";

import { useCategoriesContext } from "@/contexts/Categories/CategoriesProvider";

export default function CategoriesExample() {
  const {
    categories,
    categoriesTree,
    getRootCategories,
    getChildrenCategories,
    getCategoryBySlug,
  } = useCategoriesContext();

  const rootCategories = getRootCategories();

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Categories</h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">
          Total Categories: {categories.length}
        </h3>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Category Tree:</h3>
        {categoriesTree.map((rootCategory) => (
          <div key={rootCategory.id} className="mb-4">
            <div className="font-bold text-lg">{rootCategory.name}</div>
            {rootCategory.children?.map((secondLevel) => (
              <div key={secondLevel.id} className="ml-4 mt-2">
                <div className="font-semibold">→ {secondLevel.name}</div>
                {secondLevel.children?.map((thirdLevel) => (
                  <div key={thirdLevel.id} className="ml-8 text-gray-600">
                    • {thirdLevel.name}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Example: Get Children</h3>
        <p>Women's Clothing children:</p>
        <ul className="list-disc ml-6">
          {getChildrenCategories(2).map((cat) => (
            <li key={cat.id}>{cat.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
