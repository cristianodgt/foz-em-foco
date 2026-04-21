import UtilityStrip from "@/components/site/UtilityStrip";
import BreakingBar from "@/components/site/BreakingBar";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { LeaderboardSlot } from "@/components/site/LeaderboardSlot";
import { StickyBottomAd } from "@/components/site/StickyBottomAd";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UtilityStrip />
      <BreakingBar text="Operação conjunta PF/PY apreende 1,2 tonelada de mercadoria sem nota na Ponte Amizade" />
      <Header />
      <LeaderboardSlot />
      <main style={{ paddingBottom: 130 }}>
        {children}
      </main>
      <Footer />
      <StickyBottomAd />
    </>
  );
}
