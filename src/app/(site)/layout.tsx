import UtilityStrip from "@/components/site/UtilityStrip";
import BreakingBar from "@/components/site/BreakingBar";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { LeaderboardSlot } from "@/components/site/LeaderboardSlot";
import { StickyBottomAd } from "@/components/site/StickyBottomAd";
import MobileShell from "@/components/mobile/MobileShell";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Utility strip: hidden on mobile */}
      <div className="hidden lg:block">
        <UtilityStrip />
      </div>

      <BreakingBar text="Operação conjunta PF/PY apreende 1,2 tonelada de mercadoria sem nota na Ponte Amizade" />
      <Header />

      {/* Leaderboard only desktop */}
      <div className="hidden lg:block">
        <LeaderboardSlot />
      </div>

      <main
        className="pb-32 md:pb-[130px]"
        style={{ paddingBottom: "calc(130px + env(safe-area-inset-bottom))" }}
      >
        {children}
      </main>

      {/* Desktop sticky ad only */}
      <div className="hidden md:block">
        <StickyBottomAd />
      </div>

      <Footer />

      {/* Mobile UI: sticky ad + bottom nav + drawer + PWA prompt */}
      <MobileShell />
    </>
  );
}
