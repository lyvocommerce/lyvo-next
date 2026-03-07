"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTelegramAuth } from "@/contexts/TelegramAuth/TelegramAuthContext";
import { useSideMenu } from "@/contexts/SideMenu/SideMenuContext";
import { useOverlayBack } from "@/contexts/OverlayBack/OverlayBackContext";

/**
 * Syncs Telegram Mini App native header: shows "Back" when user is not on root, when side menu is open,
 * or when an overlay (e.g. search) is open. Back click: overlay close > menu back > router.back().
 */
export default function TelegramBackButton() {
  const pathname = usePathname();
  const router = useRouter();
  const { webApp, isMiniApp } = useTelegramAuth();
  const sideMenu = useSideMenu();
  const overlayBack = useOverlayBack();
  const handlerRef = useRef<() => void>(() => router.back());

  useEffect(() => {
    if (overlayBack?.overlayBack) {
      handlerRef.current = overlayBack.overlayBack;
    } else if (sideMenu?.isOpen) {
      handlerRef.current = sideMenu.goBackInMenu;
    } else {
      handlerRef.current = () => router.back();
    }
  }, [overlayBack?.overlayBack, sideMenu?.isOpen, sideMenu?.goBackInMenu, router]);

  useEffect(() => {
    if (!isMiniApp || !webApp) return;

    const handler = () => handlerRef.current();

    webApp.BackButton.onClick(handler);

    const showBack =
      !!overlayBack?.overlayBack || sideMenu?.isOpen || pathname !== "/";
    if (showBack) {
      webApp.BackButton.show();
    } else {
      webApp.BackButton.hide();
    }

    return () => {
      webApp.BackButton.offClick(handler);
      webApp.BackButton.hide();
    };
  }, [pathname, webApp, isMiniApp, sideMenu?.isOpen, overlayBack?.overlayBack]);

  return null;
}
