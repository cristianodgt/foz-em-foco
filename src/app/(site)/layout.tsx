import UtilityStrip from "@/components/site/UtilityStrip";
import BreakingBar from "@/components/site/BreakingBar";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import RotatingAd from "@/components/site/RotatingAd";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <UtilityStrip />
      <BreakingBar text="Operação conjunta PF/PY apreende 1,2 tonelada de mercadoria sem nota na Ponte Amizade" />
      <Header />
      <div style={{ background: "var(--paper-2)", borderBottom: "1px solid var(--border)", padding: "8px 0" }}>
        <div className="container">
          <RotatingAd height={80} />
        </div>
      </div>
      <main style={{ flex: 1, paddingBottom: 60 }}>{children}</main>
      <Footer />
    </div>
  );
}
