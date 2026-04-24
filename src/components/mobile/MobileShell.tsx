"use client";
import { useEffect, useState } from "react";
import BottomNav from "./BottomNav";
import MobileDrawer from "./MobileDrawer";
import MobileStickyAd from "./MobileStickyAd";
import PWAInstallPrompt from "./PWAInstallPrompt";

export default function MobileShell() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("mobile-drawer-open", handler);
    return () => window.removeEventListener("mobile-drawer-open", handler);
  }, []);

  return (
    <>
      <MobileStickyAd />
      <BottomNav onMoreClick={() => setOpen(true)} />
      <MobileDrawer open={open} onClose={() => setOpen(false)} />
      <PWAInstallPrompt />
    </>
  );
}
