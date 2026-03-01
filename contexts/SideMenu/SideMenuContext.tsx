"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

export interface SideMenuContextType {
  isOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  /** When menu is open: go one level back (or close if at root). For native Back. */
  goBackInMenu: () => void;
  categoryStack: number[];
  setCategoryStack: React.Dispatch<React.SetStateAction<number[]>>;
}

const SideMenuContext = createContext<SideMenuContextType | undefined>(
  undefined
);

export function useSideMenu() {
  const ctx = useContext(SideMenuContext);
  return ctx;
}

interface SideMenuProviderProps {
  children: ReactNode;
}

export function SideMenuProvider({ children }: SideMenuProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [categoryStack, setCategoryStack] = useState<number[]>([]);

  const openMenu = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setCategoryStack([]);
  }, []);

  const goBackInMenu = useCallback(() => {
    setCategoryStack((prev) => {
      if (prev.length > 0) return prev.slice(0, -1);
      setIsOpen(false);
      return [];
    });
  }, []);

  return (
    <SideMenuContext.Provider
      value={{
        isOpen,
        openMenu,
        closeMenu,
        goBackInMenu,
        categoryStack,
        setCategoryStack,
      }}
    >
      {children}
    </SideMenuContext.Provider>
  );
}
