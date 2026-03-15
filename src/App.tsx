import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { DataProvider } from '@/contexts/DataContext';
import { Header } from '@/components/Header';
import { HeroSection } from '@/sections/HeroSection';

import { TerritoryExplorer } from '@/sections/TerritoryExplorer';
import { ImpactDashboard } from '@/sections/ImpactDashboard';
import { InteractiveMap } from '@/sections/InteractiveMap';
import { DestinationHighlights } from '@/sections/DestinationHighlights';
import { PlanYourVisit } from '@/sections/PlanYourVisit';
import { RecentDiscoveries } from '@/sections/RecentDiscoveries';
import { AdminDashboard } from '@/sections/AdminDashboard';
import { TrekQuiz } from '@/sections/TrekQuiz';
import { Footer } from '@/sections/FooterSection';
import { Toaster } from '@/components/ui/sonner';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const territoryRef = useRef<HTMLElement>(null);
  const dashboardRef = useRef<HTMLElement>(null);
  const newsRef = useRef<HTMLElement>(null);
  const adminRef = useRef<HTMLElement>(null);

  const scrollToTerritory = () => {
    territoryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDashboard = () => {
    dashboardRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToNews = () => {
    newsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToAdmin = () => {
    const element = adminRef.current || document.getElementById('contribute-section');
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <ThemeProvider>
      <DataProvider>
        <div className="relative min-h-screen bg-background">
          {/* Grain Overlay */}
          <div className="grain-overlay" />

          {/* Header */}
          <Header 
            onExploreClick={scrollToTerritory} 
            onDashboardClick={scrollToDashboard} 
            onAdminClick={scrollToAdmin}
          />

          {/* Main Content */}
          <main className="relative">
            {/* Hero Section - z-10 */}
            <HeroSection onExploreClick={scrollToTerritory} onNewsClick={scrollToNews} />


            {/* Territory Explorer - z-20 */}
            <TerritoryExplorer sectionRef={territoryRef} />

            {/* Trek Quiz Discovery - z-15 */}
            <TrekQuiz />
            
            {/* Recent Discoveries - z-20 */}
            <RecentDiscoveries />

            {/* Impact Dashboard - z-20 */}
            <ImpactDashboard sectionRef={dashboardRef} />

            {/* Interactive Map - z-20 */}
            <InteractiveMap />

            {/* Admin Dashboard - z-20 */}
            <AdminDashboard sectionRef={adminRef} />

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
            richColors
            closeButton
            toastOptions={{
              style: {
                borderRadius: '16px',
                backdropFilter: 'blur(10px)',
              },
            }}
          />
        </div>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
