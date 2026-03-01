"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface SideMenuContextType {
  isOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
}

const SideMenuContext = createContext<SideMenuContextType | undefined>(undefined);

export function useSideMenu() {
  const ctx = useContext(SideMenuContext);
  return ctx;
}

interface SideMenuProviderProps {
  children: ReactNode;
}

export function SideMenuProvider({ children }: SideMenuProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const openMenu = useCallback(() => setIsOpen(true), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  return (
    <SideMenuContext.Provider value={{ isOpen, openMenu, closeMenu }}>
      {children}
    </SideMenuContext.Provider>
  );
}
