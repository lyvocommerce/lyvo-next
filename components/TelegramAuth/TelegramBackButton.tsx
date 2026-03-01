"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTelegramAuth } from "@/contexts/TelegramAuth/TelegramAuthContext";

/**
 * Syncs Telegram Mini App native header: shows "Back" when user is not on root,
 * hides it on "/". Back click calls router.back(). No UI — only WebApp.BackButton API.
 */
export default function TelegramBackButton() {
  const pathname = usePathname();
  const router = useRouter();
  const { webApp, isMiniApp } = useTelegramAuth();
  const handlerRef = useRef<() => void>(() => router.back());

  useEffect(() => {
    handlerRef.current = () => router.back();
  }, [router]);

  useEffect(() => {
    if (!isMiniApp || !webApp) return;

    const handler = () => handlerRef.current();

    webApp.BackButton.onClick(handler);

    if (pathname === "/") {
      webApp.BackButton.hide();
    } else {
      webApp.BackButton.show();
    }

    return () => {
      webApp.BackButton.offClick(handler);
      webApp.BackButton.hide();
    };
  }, [pathname, webApp, isMiniApp]);

  return null;
}
