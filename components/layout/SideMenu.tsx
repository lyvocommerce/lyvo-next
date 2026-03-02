"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  ArrowLeft02Icon,
  ArrowRight01Icon,
  Home01Icon,
  UserIcon,
  Folder01Icon,
} from "@hugeicons/core-free-icons";
import { useTelegramAuth } from "@/contexts/TelegramAuth/TelegramAuthContext";
import { useCategoriesContext } from "@/contexts/Categories/CategoriesProvider";
import { useSideMenu } from "@/contexts/SideMenu/SideMenuContext";
import type { Category } from "@prisma/client";

const GRID_COLUMN_GAP = 8;
const GRID_ROW_GAP = 24;

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

  // Lock body scroll when menu is open; only the menu content scrolls
  useEffect(() => {
    if (!isOpen) return;
    const scrollY = window.scrollY ?? window.pageYOffset;
    const body = document.body;
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.overflow = "hidden";
    body.style.width = "100%";
    return () => {
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.overflow = "";
      body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

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

  // Safe area: bottom and sides on aside; top safe area and title alignment in header
  const safePad = {
    paddingBottom: "env(safe-area-inset-bottom, 0px)",
    paddingLeft: "env(safe-area-inset-left, 0px)",
    paddingRight: "env(safe-area-inset-right, 0px)",
  };

  const listItemBase =
    "side-menu-list-item flex items-center justify-between w-full px-4 py-3 text-left text-tg-text font-medium transition-colors bg-gray-50 hover:bg-gray-100";
  const listItemActive = "bg-gray-100 text-tg-link";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ x: 0 }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", damping: 35, stiffness: 300 }}
          className={
            isMiniApp
              ? "side-menu-bg fixed inset-0 z-40 flex flex-col bg-white"
              : "side-menu-bg fixed inset-0 md:inset-y-0 md:left-0 md:right-auto md:w-[360px] md:max-w-[80vw] z-40 flex flex-col bg-white"
          }
          style={safePad}
        >
          {/* Header: 80px total height (Safe Area + bar); no top border; buttons start below */}
          <header
            className="shrink-0 relative flex items-center justify-between px-4"
            style={{
              paddingTop: "env(safe-area-inset-top, 0px)",
              height: "80px",
              minHeight: "80px",
            }}
          >
            {/* Left: Back button (web only, not in Telegram Mini App) */}
            <div className="flex items-center justify-start min-w-[40px] z-10">
              {!isMiniApp && categoryStack.length > 0 ? (
                <button
                  type="button"
                  onClick={handleBackInMenu}
                  className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors text-tg-text"
                  aria-label="Back"
                >
                  <HugeiconsIcon icon={ArrowLeft02Icon} size={24} />
                </button>
              ) : null}
            </div>

            {/* Center: title */}
            {isMiniApp ? (
              // In Telegram Mini App: show title only on nested levels; hide "Меню" on level 1
              currentParent ? (
                <span
                  className="fixed left-0 right-0 text-center text-tg-text font-semibold truncate pointer-events-none z-0 px-12"
                  style={{
                    top: "calc(env(safe-area-inset-top, 0px) - 2px)",
                    height: "56px",
                    lineHeight: "56px",
                  }}
                >
                  {currentParent.name}
                </span>
              ) : null
            ) : (
              // In web version: center title within the side menu header only
              <span className="flex-1 text-center text-tg-text font-semibold truncate px-4">
                {currentParent ? currentParent.name : "Меню"}
              </span>
            )}

            {/* Right: Close button (web only) */}
            <div className="flex items-center justify-end min-w-[40px] z-10">
              {!isMiniApp && (
                <button
                  type="button"
                  onClick={closeMenu}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-tg-text"
                  aria-label="Close menu"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={24} />
                </button>
              )}
            </div>
          </header>

          {/* Content: only vertical scroll inside menu */}
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain">
            {categoryStack.length === 0 ? (
              /* First level: container 16px from edges; between buttons 8px horizontal, 24px vertical */
              <nav
                style={{
                  paddingTop: 24,
                  paddingBottom: 24,
                  paddingLeft: 16,
                  paddingRight: 16,
                }}
              >
                <div
                  className="grid grid-cols-3"
                  style={{
                    columnGap: GRID_COLUMN_GAP,
                    rowGap: GRID_ROW_GAP,
                  }}
                >
                  {/* Главная */}
                  <Link
                    href="/"
                    onClick={closeMenu}
                    className="flex flex-col items-start w-full"
                  >
                    <div
                      className="side-menu-tile-bg w-full aspect-square rounded-[18px] bg-[#F5F7FA] flex items-center justify-center overflow-hidden"
                    >
                      <HugeiconsIcon
                        icon={Home01Icon}
                        size={40}
                        className="text-tg-text"
                      />
                    </div>
                    <span
                      className={`mt-2 w-full text-left text-sm font-normal text-tg-text line-clamp-2 ${
                        pathname === "/" ? "text-tg-link" : ""
                      }`}
                    >
                      Главная
                    </span>
                  </Link>

                  {/* Root categories */}
                  {rootCategories.map((cat) => {
                    const hasChildren =
                      getChildrenCategories(cat.id).length > 0;
                    const content = (
                      <>
                        <div className="side-menu-tile-bg w-full aspect-square rounded-[18px] bg-[#F5F7FA] flex items-center justify-center overflow-hidden">
                          <HugeiconsIcon
                            icon={Folder01Icon}
                            size={40}
                            className="text-tg-text"
                          />
                        </div>
                        <span className="mt-2 w-full text-left text-sm font-normal text-tg-text line-clamp-2">
                          {cat.name}
                        </span>
                      </>
                    );
                    return hasChildren ? (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategoryClick(cat)}
                        className="flex flex-col items-start w-full text-left"
                      >
                        {content}
                      </button>
                    ) : (
                      <Link
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        onClick={closeMenu}
                        className={`flex flex-col items-start w-full ${
                          pathname === `/category/${cat.slug}`
                            ? "[&_span]:text-tg-link"
                            : ""
                        }`}
                      >
                        {content}
                      </Link>
                    );
                  })}

                  {/* Профиль */}
                  <Link
                    href="/user"
                    onClick={closeMenu}
                    className="flex flex-col items-start w-full"
                  >
                    <div className="side-menu-tile-bg w-full aspect-square rounded-[18px] bg-[#F5F7FA] flex items-center justify-center overflow-hidden">
                      <HugeiconsIcon
                        icon={UserIcon}
                        size={40}
                        className="text-tg-text"
                      />
                    </div>
                    <span
                      className={`mt-2 w-full text-left text-sm font-normal text-tg-text line-clamp-2 ${
                        pathname === "/user" ? "text-tg-link" : ""
                      }`}
                    >
                      Профиль
                    </span>
                  </Link>
                </div>
              </nav>
            ) : (
              /* Sublevels: list — same top offset as level 1 (24px), 8px horizontal; slide-in animation */
              <motion.div
                key={currentParentId}
                initial={{ x: "20%" }}
                animate={{ x: 0 }}
                transition={{ type: "spring", damping: 35, stiffness: 300 }}
                className="h-full"
              >
                <ul
                  style={{
                    paddingTop: 24,
                    paddingBottom: 24,
                    paddingLeft: 16,
                    paddingRight: 16,
                  }}
                >
                  {currentCategories.map((cat) => {
                  const hasChildren =
                    getChildrenCategories(cat.id).length > 0;
                  return hasChildren ? (
                    <li key={cat.id} className="mb-1">
                      <button
                        type="button"
                        onClick={() => handleCategoryClick(cat)}
                        className={`${listItemBase} rounded-xl`}
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
                    <li key={cat.id} className="mb-1">
                      <Link
                        href={`/category/${cat.slug}`}
                        onClick={closeMenu}
                        className={`${listItemBase} rounded-xl ${
                          pathname === `/category/${cat.slug}`
                            ? listItemActive
                            : ""
                        }`}
                      >
                        {cat.name}
                      </Link>
                    </li>
                  );
                })}
                </ul>
              </motion.div>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
