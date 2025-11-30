"use client";

import { useEffect, useState, useRef } from "react";
import { TelegramUser } from "@/types/telegram";
import {
  TelegramAuthContext,
  TelegramAuthProviderProps,
} from "./TelegramAuthContext";
import {
  MOCK_TELEGRAM_USER,
  applyDefaultTelegramTheme,
  TEST_MODE_CONFIG,
} from "@/mocks/telegram-test-data";
import { applyTelegramTheme } from "@/lib/telegram-theme";
import LoadingState from "@/components/TelegramAuth/LoadingState";
import ErrorState from "@/components/TelegramAuth/ErrorState";
import type WebAppType from "@twa-dev/sdk";

export default function TelegramAuthProvider({
  children,
  testMode: testModeProp,
}: TelegramAuthProviderProps) {
  // Check for test mode from prop, URL parameter (?testMode=true), or environment variable
  // You can set NEXT_PUBLIC_TELEGRAM_TEST_MODE=true in .env.local
  const urlTestMode =
    typeof window !== "undefined" &&
    window.location.search.includes("testMode=true");
  const envTestMode = process.env.NEXT_PUBLIC_TELEGRAM_TEST_MODE === "true";
  const testMode = testModeProp ?? urlTestMode ?? envTestMode ?? false;
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [platform, setPlatform] = useState<string>("");
  const [version, setVersion] = useState<string>("");
  const webAppRef = useRef<typeof WebAppType | null>(null);

  useEffect(() => {
    // If test mode is enabled, skip Telegram auth and use mock data
    if (testMode) {
      applyDefaultTelegramTheme();
      setUser(MOCK_TELEGRAM_USER);
      setPlatform(TEST_MODE_CONFIG.platform);
      setVersion(TEST_MODE_CONFIG.version);
      setIsReady(true);
      setIsLoading(false);
      return;
    }

    // Normal Telegram authentication flow
    // Dynamically import WebApp to avoid SSR issues
    import("@twa-dev/sdk")
      .then(({ default: WebApp }) => {
        // Store WebApp in ref for use throughout the app
        webAppRef.current = WebApp;

        // Initialize Telegram Web App
        WebApp.ready();
        WebApp.expand();

        // Enable closing confirmation to show prompt when user tries to close
        WebApp.enableClosingConfirmation();

        // Lock vertical swipes to prevent closing the app
        WebApp.isVerticalSwipesEnabled = false;

        // Get user data from Telegram Web App
        const initData = WebApp.initData;
        const userData = WebApp.initDataUnsafe?.user;

        if (userData) {
          // User data is available directly from WebApp
          setUser({
            id: userData.id,
            firstName: userData.first_name,
            lastName: userData.last_name || "",
            username: userData.username || "",
            languageCode: userData.language_code || "",
            isPremium: userData.is_premium || false,
            photoUrl: userData.photo_url || "",
          });
          setIsReady(true);
          setIsLoading(false);
        } else if (initData) {
          // If we have initData but no user, validate via API
          fetch("/api/auth/telegram", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ initData }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.success && data.user) {
                setUser({
                  id: data.user.id,
                  firstName: data.user.first_name,
                  lastName: data.user.last_name || "",
                  username: data.user.username || "",
                  languageCode: data.user.language_code || "",
                  isPremium: data.user.is_premium || false,
                  photoUrl: data.user.photo_url || "",
                });
                setIsReady(true);
              } else {
                setError(data.error || "Authentication failed");
              }
              setIsLoading(false);
            })
            .catch((err) => {
              console.error("Auth error:", err);
              setError("Authentication validation failed");
              setIsLoading(false);
            });
        } else {
          setError("No initialization data found");
          setIsLoading(false);
        }

        // Set up Telegram theme colors
        applyTelegramTheme(WebApp.themeParams);

        // Handle back button
        WebApp.BackButton.onClick(() => {
          WebApp.BackButton.hide();
          // Handle navigation or close
        });

        // Set platform and version info
        setPlatform(WebApp.platform || "unknown");
        setVersion(WebApp.version || "unknown");
      })
      .catch((err) => {
        console.error("Failed to load Telegram Web App SDK:", err);
        setError("Failed to initialize Telegram Web App");
        setIsLoading(false);
      });

    // Cleanup function
    return () => {
      if (!testMode && webAppRef.current) {
        webAppRef.current.BackButton.offClick(() => {});
      }
    };
  }, [testMode]);

  const value = {
    user,
    isReady,
    isLoading,
    error,
    webApp: webAppRef.current,
    platform,
    version,
    testMode,
  };

  // Show loading state while authenticating
  if (isLoading) {
    return <LoadingState />;
  }

  // Show error state if authentication failed
  if (error && !isReady) {
    return <ErrorState error={error} />;
  }

  // Render children once authentication is complete
  return (
    <TelegramAuthContext.Provider value={value}>
      {children}
    </TelegramAuthContext.Provider>
  );
}
