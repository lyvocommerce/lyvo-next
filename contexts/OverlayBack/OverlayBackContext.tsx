"use client";

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";

export interface OverlayBackContextType {
  /** Current overlay back handler (e.g. close search). When set, Telegram Back should call it. */
  overlayBack: (() => void) | null;
  /** Register a back handler; returns unregister function. */
  registerOverlayBack: (onBack: () => void) => () => void;
}

const OverlayBackContext = createContext<OverlayBackContextType | undefined>(undefined);

export function useOverlayBack() {
  const ctx = useContext(OverlayBackContext);
  return ctx;
}

interface OverlayBackProviderProps {
  children: ReactNode;
}

export function OverlayBackProvider({ children }: OverlayBackProviderProps) {
  const [overlayBack, setOverlayBack] = useState<(() => void) | null>(null);

  const registerOverlayBack = useCallback((onBack: () => void) => {
    setOverlayBack(() => onBack);
    return () => setOverlayBack(null);
  }, []);

  const value = useMemo(
    () => ({ overlayBack, registerOverlayBack }),
    [overlayBack, registerOverlayBack]
  );

  return (
    <OverlayBackContext.Provider value={value}>
      {children}
    </OverlayBackContext.Provider>
  );
}
