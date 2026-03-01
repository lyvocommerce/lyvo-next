"use client";

import { useEffect } from "react";
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

const glassStyle = {
  background: "rgba(255,255,255,0.1)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
};

export default function SideMenu() {
  const pathname = usePathname();
  const { isMiniApp } = useTelegramAuth();
  const {
    getRootCategories,
    getChildrenCategories,
    getCategoryById,
  } = useCategoriesContext();
  const sideMenuContext = useSideMenu();
  if (!sideMenuContext) return null;
  const {
    isOpen,
    closeMenu,
    categoryStack,
    setCategoryStack,
  } = sideMenuContext;

  const currentParentId =
    categoryStack.length > 0 ? categoryStack[categoryStack.length - 1] : null;
  const currentCategories = currentParentId
    ? getChildrenCategories(currentParentId)
    : getRootCategories();
  const currentParent = currentParentId
    ? getCategoryById(currentParentId)
    : null;
  const rootCategories = getRootCategories();

  useEffect(() => {
    if (!isOpen) setCategoryStack([]);
  }, [isOpen, setCategoryStack]);

  const handleCategoryClick = (cat: Category) => {
    const children = getChildrenCategories(cat.id);
    if (children.length > 0) {
      setCategoryStack((prev) => [...prev, cat.id]);
    } else {
      closeMenu();
    }
  };

  const handleBackInMenu = () => {
    setCategoryStack((prev) => (prev.length > 0 ? prev.slice(0, -1) : []));
  };

  const itemBase =
    "flex items-center justify-between w-full px-4 py-3 rounded-xl text-left text-tg-text font-medium transition-colors bg-white hover:bg-gray-50";
  const itemActive = "bg-gray-50 text-tg-link";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", damping: 35, stiffness: 300 }}
          className="fixed z-40 flex flex-col rounded-2xl overflow-hidden shadow-xl"
          style={{
            top: "env(safe-area-inset-top, 0px)",
            bottom: "env(safe-area-inset-bottom, 0px)",
            left: `calc(${CARD_LEFT}px + env(safe-area-inset-left, 0px))`,
            right: `calc(${CARD_RIGHT}px + env(safe-area-inset-right, 0px))`,
          }}
        >
          {/* Glass header */}
          <div
            className="shrink-0 flex items-center justify-between min-h-[56px] border-b border-white/20"
            style={glassStyle}
          >
            <div
              className="flex items-center gap-2 flex-1 min-w-0"
              style={{
                paddingLeft: "max(1rem, env(safe-area-inset-left, 0px))",
              }}
            >
              {categoryStack.length > 0 ? (
                <button
                  type="button"
                  onClick={handleBackInMenu}
                  className="p-2 -ml-2 rounded-full bg-white/80 hover:bg-white transition-colors text-tg-text shrink-0"
                  aria-label="Back"
                >
                  <HugeiconsIcon icon={ArrowLeft01Icon} size={24} />
                </button>
              ) : (
                <span className="w-10 shrink-0" />
              )}
              <span className="text-tg-text font-semibold truncate">
                {currentParent ? currentParent.name : "Меню"}
              </span>
            </div>
            {!isMiniApp && (
              <button
                type="button"
                onClick={closeMenu}
                className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors text-tg-text shrink-0 mr-2"
                style={{
                  marginRight: "max(0.5rem, env(safe-area-inset-right, 0px))",
                }}
                aria-label="Close menu"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={24} />
              </button>
            )}
          </div>

          {/* Glass content area — only items are white */}
          <div
            className="flex-1 overflow-y-auto border-t border-white/10"
            style={{
              ...glassStyle,
              paddingTop: "env(safe-area-inset-top, 0px)",
              paddingBottom: "env(safe-area-inset-bottom, 0px)",
              paddingLeft: "max(1rem, env(safe-area-inset-left, 0px))",
              paddingRight: "max(1rem, env(safe-area-inset-right, 0px))",
            }}
          >
            <nav className="py-2">
              {categoryStack.length === 0 && (
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/"
                      onClick={closeMenu}
                      className={`${itemBase} ${pathname === "/" ? itemActive : ""}`}
                    >
                      Главная
                    </Link>
                  </li>
                  {rootCategories.length > 0 && (
                    <li className="pt-2">
                      <span className="block px-4 py-2 text-tg-hint text-xs font-semibold uppercase tracking-wider">
                        Категории
                      </span>
                      {rootCategories.map((cat) => {
                        const hasChildren =
                          getChildrenCategories(cat.id).length > 0;
                        return hasChildren ? (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleCategoryClick(cat)}
                            className={itemBase}
                          >
                            {cat.name}
                            <HugeiconsIcon
                              icon={ArrowRight01Icon}
                              size={20}
                              className="text-tg-hint"
                            />
                          </button>
                        ) : (
                          <Link
                            key={cat.id}
                            href={`/category/${cat.slug}`}
                            onClick={closeMenu}
                            className={`${itemBase} ${
                              pathname === `/category/${cat.slug}`
                                ? itemActive
                                : ""
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
                      className={`${itemBase} ${
                        pathname === "/user" ? itemActive : ""
                      }`}
                    >
                      Профиль
                    </Link>
                  </li>
                </ul>
              )}

              {categoryStack.length > 0 && (
                <ul className="space-y-1">
                  {currentCategories.map((cat) => {
                    const hasChildren =
                      getChildrenCategories(cat.id).length > 0;
                    return hasChildren ? (
                      <li key={cat.id}>
                        <button
                          type="button"
                          onClick={() => handleCategoryClick(cat)}
                          className={itemBase}
                        >
                          {cat.name}
                          <HugeiconsIcon
                            icon={ArrowRight01Icon}
                            size={20}
                            className="text-tg-hint"
                          />
                        </button>
                      </li>
                    ) : (
                      <li key={cat.id}>
                        <Link
                          href={`/category/${cat.slug}`}
                          onClick={closeMenu}
                          className={`${itemBase} ${
                            pathname === `/category/${cat.slug}`
                              ? itemActive
                              : ""
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
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
