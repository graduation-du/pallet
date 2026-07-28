"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Smartphone, X } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function PwaInstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissedAt, setDismissedAt] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const installedKey = "pwa-install-installed";
    if (window.localStorage.getItem(installedKey) === "1") return;

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);

    if (isStandalone) {
      window.localStorage.setItem(installedKey, "1");
      return;
    }

    const showPrompt = () => {
      if (dismissedAt && Date.now() - dismissedAt < 5 * 60 * 1000) return;
      setVisible(true);
    };

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      showPrompt();
    };

    const handleAppInstalled = () => {
      setVisible(false);
      window.localStorage.setItem(installedKey, "1");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    const firstTimer = window.setTimeout(showPrompt, 1500);
    const reminderTimer = window.setInterval(showPrompt, 5 * 60 * 1000);

    return () => {
      window.clearTimeout(firstTimer);
      window.clearInterval(reminderTimer);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  if (!visible) return null;

  const dismissReminder = () => {
    setVisible(false);
    setDismissedAt(Date.now());
  };

  async function handleInstall() {
    if (!deferredPrompt) {
      setVisible(false);
      return;
    }

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      window.localStorage.setItem("pwa-install-installed", "1");
      setVisible(false);
    } else {
      setVisible(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="fixed bottom-3 left-3 z-[1200] max-w-[320px] sm:left-4"
      >
        <div className="rounded-2xl border border-slate-200 bg-white/95 px-3 py-2.5 text-slate-900 shadow-[0_10px_30px_rgba(15,23,42,0.14)] backdrop-blur">
          <div className="flex items-start gap-2">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
              <Smartphone size={15} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-slate-900">
                Install PalletTrack Pro
              </p>
              <p className="mt-0.5 text-[11px] leading-4 text-slate-600">
                Add it to your home screen for quicker access.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleInstall}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-blue-600 px-2.5 py-1 text-[11px] font-semibold text-white transition hover:bg-blue-500"
                >
                  <Download size={12} /> Install
                </button>
                <button
                  type="button"
                  onClick={dismissReminder}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
                  aria-label="Dismiss install reminder"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
