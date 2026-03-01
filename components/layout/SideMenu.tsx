"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { useTelegramAuth } from "@/contexts/TelegramAuth/TelegramAuthContext";
import { useCategoriesContext } from "@/contexts/Categories/CategoriesProvider";
import { useSideMenu } from "@/contexts/SideMenu/SideMenuContext";
import type { Category } from "@prisma/client";

const CARD_LEFT = 4;
const CARD_RIGHT = 48;

export default function SideMenu() {
  const pathname = usePathname();
  const { isMiniApp } = useTelegramAuth();
  const {
    getRootCategories,
    getChildrenCategories,
    getCategoryById,
  } = useCategoriesContext();
  const { isOpen, closeMenu } = useSideMenu();

  // Stack of category ids: top = current level parent. [] = root level.
  const [categoryStack, setCategoryStack] = useState<number[]>([]);

  const rootCategories = getRootCategories();
  const currentParentId = categoryStack.length > 0 ? categoryStack[categoryStack.length - 1] : null;
  const currentCategories = currentParentId
    ? getChildrenCategories(currentParentId)
    : rootCategories;
  const currentParent = currentParentId ? getCategoryById(currentParentId) : null;

  // Reset stack when menu closes
  useEffect(() => {
    if (!isOpen) setCategoryStack([]);
  }, [isOpen]);

  const handleCategoryClick = (cat: Category) => {
    const children = getChildrenCategories(cat.id);
    if (children.length > 0) {
      setCategoryStack((prev) => [...prev, cat.id]);
    } else {
      closeMenu();
      // Navigate is done by Link
    }
  };

  const handleBackInMenu = () => {
    setCategoryStack((prev) => (prev.length > 0 ? prev.slice(0, -1) : []));
  };

  const safePad = {
    paddingLeft: "max(1rem, env(safe-area-inset-left))",
    paddingRight: "max(1rem, env(safe-area-inset-right))",
    paddingTop: "env(safe-area-inset-top, 0px)",
    paddingBottom: "env(safe-area-inset-bottom, 0px)",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", damping: 35, stiffness: 300 }}
          className="fixed top-0 bottom-0 z-40 flex flex-col"
          style={{
            left: CARD_LEFT,
            right: CARD_RIGHT,
          }}
        >
          <div className="h-full flex flex-col rounded-2xl overflow-hidden shadow-xl">
            {/* Glass header */}
            <div
              className="shrink-0 flex items-center justify-between min-h-[56px] bg-white/10 backdrop-blur-md border-b border-white/20"
              style={{
                ...safePad,
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
            >
              <div className="flex items-center gap-2">
                {categoryStack.length > 0 ? (
                  <button
                    type="button"
                    onClick={handleBackInMenu}
                    className="p-2 -ml-2 rounded-full hover:bg-white/20 transition-colors text-tg-text"
                    aria-label="Back"
                  >
                    <HugeiconsIcon icon={ArrowLeft01Icon} size={24} />
                  </button>
                ) : (
                  <span className="w-10" />
                )}
                <span className="text-tg-text font-semibold truncate max-w-[200px]">
                  {currentParent ? currentParent.name : "Меню"}
                </span>
              </div>
              {!isMiniApp && (
                <button
                  type="button"
                  onClick={closeMenu}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors text-tg-text"
                  aria-label="Close menu"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={24} />
                </button>
              )}
            </div>

            {/* White content area */}
            <div className="flex-1 overflow-y-auto bg-white">
              <nav className="py-2" style={safePad}>
                {/* Root level: Main + Categories + Profile */}
                {categoryStack.length === 0 && (
                  <ul className="space-y-0">
                    <li>
                      <Link
                        href="/"
                        onClick={closeMenu}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-tg-text font-medium hover:bg-gray-50 transition-colors ${
                          pathname === "/" ? "bg-gray-50 text-tg-link" : ""
                        }`}
                      >
                        Главная
                      </Link>
                    </li>
                    {rootCategories.length > 0 && (
                      <li className="pt-1">
                        <span className="block px-4 py-2 text-tg-hint text-xs font-semibold uppercase tracking-wider">
                          Категории
                        </span>
                        {rootCategories.map((cat) => {
                          const hasChildren = getChildrenCategories(cat.id).length > 0;
                          return hasChildren ? (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => handleCategoryClick(cat)}
                              className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-left text-tg-text font-medium hover:bg-gray-50 transition-colors"
                            >
                              {cat.name}
                              <HugeiconsIcon icon={ArrowRight01Icon} size={20} className="text-tg-hint" />
                            </button>
                          ) : (
                            <Link
                              key={cat.id}
                              href={`/category/${cat.slug}`}
                              onClick={closeMenu}
                              className={`flex items-center justify-between px-4 py-3 rounded-xl text-tg-text font-medium hover:bg-gray-50 transition-colors ${
                                pathname === `/category/${cat.slug}` ? "bg-gray-50 text-tg-link" : ""
                              }`}
                            >
                              {cat.name}
                            </Link>
                          );
                        })}
                      </li>
                    )}
                    <li>
                      <Link
                        href="/user"
                        onClick={closeMenu}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-tg-text font-medium hover:bg-gray-50 transition-colors ${
                          pathname === "/user" ? "bg-gray-50 text-tg-link" : ""
                        }`}
                      >
                        Профиль
                      </Link>
                    </li>
                  </ul>
                )}

                {/* Sublevel: list of children */}
                {categoryStack.length > 0 && (
                  <ul className="space-y-0">
                    {currentCategories.map((cat) => {
                      const hasChildren = getChildrenCategories(cat.id).length > 0;
                      return hasChildren ? (
                        <li key={cat.id}>
                          <button
                            type="button"
                            onClick={() => handleCategoryClick(cat)}
                            className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-left text-tg-text font-medium hover:bg-gray-50 transition-colors"
                          >
                            {cat.name}
                            <HugeiconsIcon icon={ArrowRight01Icon} size={20} className="text-tg-hint" />
                          </button>
                        </li>
                      ) : (
                        <li key={cat.id}>
                          <Link
                            href={`/category/${cat.slug}`}
                            onClick={closeMenu}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl text-tg-text font-medium hover:bg-gray-50 transition-colors ${
                              pathname === `/category/${cat.slug}` ? "bg-gray-50 text-tg-link" : ""
                            }`}
                          >
                            {cat.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </nav>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
