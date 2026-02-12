import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { DataProvider } from '@/contexts/DataContext';
import { Header } from '@/components/Header';
import { HeroSection } from '@/sections/HeroSection';
import { NewsExplorer } from '@/sections/NewsExplorer';
import { TerritoryExplorer } from '@/sections/TerritoryExplorer';
import { ImpactDashboard } from '@/sections/ImpactDashboard';
import { InteractiveMap } from '@/sections/InteractiveMap';
import { DestinationHighlights } from '@/sections/DestinationHighlights';
import { PlanYourVisit } from '@/sections/PlanYourVisit';
import { Footer } from '@/sections/Footer';
import { Toaster } from '@/components/ui/sonner';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    console.log('App initialized.');
  }, []);

  const territoryRef = useRef<HTMLElement>(null);
  const dashboardRef = useRef<HTMLElement>(null);
  const newsRef = useRef<HTMLElement>(null);

  // Global scroll snap for pinned sections
  useEffect(() => {
    let ctx = gsap.context(() => {
      // Wait for all ScrollTriggers to be created
      const timeout = setTimeout(() => {
        const pinned = ScrollTrigger.getAll()
          .filter((st) => st.vars.pin)
          .sort((a, b) => a.start - b.start);

        const maxScroll = ScrollTrigger.maxScroll(window);

        if (!maxScroll || pinned.length === 0) return;

        // Build ranges and snap targets from pinned sections
        const pinnedRanges = pinned.map((st) => ({
          start: st.start / maxScroll,
          end: (st.end ?? st.start) / maxScroll,
          center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
        }));

        // Create global snap
        ScrollTrigger.create({
          snap: {
            snapTo: (value: number) => {
              // Check if within any pinned range (with small buffer)
              const inPinned = pinnedRanges.some(
                (r) => value >= r.start - 0.02 && value <= r.end + 0.02
              );

              if (!inPinned) return value; // Flowing section: free scroll

              // Find nearest pinned center
              const target = pinnedRanges.reduce(
                (closest, r) =>
                  Math.abs(r.center - value) < Math.abs(closest - value)
                    ? r.center
                    : closest,
                pinnedRanges[0]?.center ?? 0
              );

              return target;
            },
            duration: { min: 0.15, max: 0.35 },
            delay: 0,
            ease: 'power2.out',
          },
        });
      }, 100);

      return () => clearTimeout(timeout);
    });

    return () => ctx.revert();
  }, []);

  const scrollToTerritory = () => {
    territoryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDashboard = () => {
    dashboardRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToNews = () => {
    newsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <ThemeProvider>
      <DataProvider>
        <div className="relative min-h-screen bg-background">
          {/* Grain Overlay */}
          <div className="grain-overlay" />

          {/* Header */}
          <Header onExploreClick={scrollToTerritory} onDashboardClick={scrollToDashboard} />

          {/* Main Content */}
          <main className="relative">
            {/* Hero Section - z-10 */}
            <HeroSection onExploreClick={scrollToTerritory} onNewsClick={scrollToNews} />

            {/* News Explorer - z-15 */}
            <NewsExplorer sectionRef={newsRef} />

            {/* Territory Explorer - z-20 */}
            <TerritoryExplorer sectionRef={territoryRef} />

            {/* Impact Dashboard - z-20 */}
            <ImpactDashboard sectionRef={dashboardRef} />

            {/* Interactive Map - z-20 */}
            <InteractiveMap />

            {/* Destination Highlights - z-30+ */}
            <DestinationHighlights />

            {/* Plan Your Visit - z-40 */}
            <PlanYourVisit />

            {/* Footer - z-50 */}
            <Footer />
          </main>

          {/* Toast Notifications */}
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '16px',
              },
            }}
          />
        </div>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
