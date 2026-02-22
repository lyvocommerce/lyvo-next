"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { Category } from "@prisma/client";

export type CategoryWithChildren = Category & {
  children?: CategoryWithChildren[];
};

interface CategoriesContextType {
  categories: Category[];
  categoriesTree: CategoryWithChildren[];
  getCategoryById: (id: number) => Category | undefined;
  getCategoryBySlug: (slug: string) => Category | undefined;
  getRootCategories: () => Category[];
  getChildrenCategories: (parentId: number) => Category[];
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(
  undefined,
);

export function useCategoriesContext() {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error(
      "useCategoriesContext must be used within a CategoriesProvider",
    );
  }
  return context;
}

interface CategoriesProviderProps {
  children: ReactNode;
  categories: Category[];
  categoriesTree: CategoryWithChildren[];
}

export function CategoriesProvider({
  children,
  categories,
  categoriesTree,
}: CategoriesProviderProps) {
  const getCategoryById = (id: number) => {
    return categories.find((cat) => cat.id === id);
  };

  const getCategoryBySlug = (slug: string) => {
    return categories.find((cat) => cat.slug === slug);
  };

  const getRootCategories = () => {
    return categories.filter((cat) => cat.level === 1);
  };

  const getChildrenCategories = (parentId: number) => {
    return categories.filter((cat) => cat.parentId === parentId);
  };

  const value: CategoriesContextType = {
    categories,
    categoriesTree,
    getCategoryById,
    getCategoryBySlug,
    getRootCategories,
    getChildrenCategories,
  };

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
}
