"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTelegramAuth } from "@/contexts/TelegramAuth/TelegramAuthContext";
import { useSideMenu } from "@/contexts/SideMenu/SideMenuContext";

/**
 * Syncs Telegram Mini App native header: shows "Back" when user is not on root or when side menu is open.
 * Hides it on "/" when menu is closed. Back click: closes menu if open, else router.back().
 */
export default function TelegramBackButton() {
  const pathname = usePathname();
  const router = useRouter();
  const { webApp, isMiniApp } = useTelegramAuth();
  const sideMenu = useSideMenu();
  const handlerRef = useRef<() => void>(() => router.back());

  useEffect(() => {
    if (sideMenu?.isOpen) {
      handlerRef.current = sideMenu.goBackInMenu;
    } else {
      handlerRef.current = () => router.back();
    }
  }, [router, sideMenu?.isOpen, sideMenu?.goBackInMenu]);

  useEffect(() => {
    if (!isMiniApp || !webApp) return;

    const handler = () => handlerRef.current();

    webApp.BackButton.onClick(handler);

    const showBack = sideMenu?.isOpen || pathname !== "/";
    if (showBack) {
      webApp.BackButton.show();
    } else {
      webApp.BackButton.hide();
    }

    return () => {
      webApp.BackButton.offClick(handler);
      webApp.BackButton.hide();
    };
  }, [pathname, webApp, isMiniApp, sideMenu?.isOpen]);

  return null;
}
