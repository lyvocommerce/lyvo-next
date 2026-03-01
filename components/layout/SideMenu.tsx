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
  Home01Icon,
  UserIcon,
  Folder01Icon,
} from "@hugeicons/core-free-icons";
import { useTelegramAuth } from "@/contexts/TelegramAuth/TelegramAuthContext";
import { useCategoriesContext } from "@/contexts/Categories/CategoriesProvider";
import { useSideMenu } from "@/contexts/SideMenu/SideMenuContext";
import type { Category } from "@prisma/client";

const GRID_GAP = 16;

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

  const safePad = {
    paddingTop: "env(safe-area-inset-top, 0px)",
    paddingBottom: "env(safe-area-inset-bottom, 0px)",
    paddingLeft: "env(safe-area-inset-left, 0px)",
    paddingRight: "env(safe-area-inset-right, 0px)",
  };

  const listItemBase =
    "flex items-center justify-between w-full px-4 py-3 text-left text-tg-text font-medium transition-colors bg-gray-50 hover:bg-gray-100";
  const listItemActive = "bg-gray-100 text-tg-link";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ x: 0 }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", damping: 35, stiffness: 300 }}
          className="fixed inset-0 z-40 flex flex-col bg-white"
          style={safePad}
        >
          {/* Header: Back (when in sublevel) + Title + Close (web only) */}
          <div className="shrink-0 flex items-center justify-between min-h-[56px] border-b border-gray-200">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {categoryStack.length > 0 ? (
                <button
                  type="button"
                  onClick={handleBackInMenu}
                  className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors text-tg-text shrink-0"
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
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-tg-text shrink-0"
                aria-label="Close menu"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={24} />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {categoryStack.length === 0 ? (
              /* First level: grid of tiles, 3 columns, 16px gap */
              <nav
                className="p-4"
                style={{ padding: GRID_GAP }}
              >
                <div
                  className="grid grid-cols-3 gap-4"
                  style={{ gap: GRID_GAP }}
                >
                  {/* Главная */}
                  <Link
                    href="/"
                    onClick={closeMenu}
                    className="flex flex-col items-start w-full"
                  >
                    <div
                      className="w-full aspect-square rounded-[18px] bg-[#F5F7FA] flex items-center justify-center overflow-hidden"
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
                        <div className="w-full aspect-square rounded-[18px] bg-[#F5F7FA] flex items-center justify-center overflow-hidden">
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
                    <div className="w-full aspect-square rounded-[18px] bg-[#F5F7FA] flex items-center justify-center overflow-hidden">
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
              /* Sublevels: list — with slide-in animation */
              <motion.div
                key={currentParentId}
                initial={{ x: "20%" }}
                animate={{ x: 0 }}
                transition={{ type: "spring", damping: 35, stiffness: 300 }}
                className="h-full"
              >
                <ul
                  className="py-2 px-4"
                  style={{
                    paddingLeft: "max(1rem, env(safe-area-inset-left, 0px))",
                    paddingRight: "max(1rem, env(safe-area-inset-right, 0px))",
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
