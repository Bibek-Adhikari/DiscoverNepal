import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRecentDestinations } from '@/hooks/useNepalData';
import { 
  MapPin, 
  Calendar, 
  Mountain, 
  ArrowRight,
  Clock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

export function RecentDiscoveries() {
  const { data: recentDestinations, isLoading, error } = useRecentDestinations(4);
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('RecentDiscoveries state:', { isLoading, error, dataCount: recentDestinations?.length });
  }, [isLoading, error, recentDestinations]);

  useEffect(() => {
    if (isLoading || !recentDestinations || recentDestinations.length === 0) return;

    let ctx: gsap.Context;
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        // First, clear any existing ScrollTriggers to avoid duplicates
        ScrollTrigger.getAll().forEach(t => {
          if (t.trigger === sectionRef.current || t.trigger === cardsRef.current) {
            t.kill();
          }
        });

        // Ensure things are visible if they were hidden by CSS
        gsap.set(['.recent-title', '.recent-card'], { visibility: 'visible', opacity: 1 });

        // Title animation
        gsap.from('.recent-title', {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        });

        // Cards stagger animation
        const cards = gsap.utils.toArray('.recent-card');
        if (cards.length > 0) {
          gsap.from(cards, {
            y: 50,
            opacity: 0,
            scale: 0.95,
            duration: 0.7,
            stagger: 0.1,
            ease: 'back.out(1.2)',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            }
          });
        }

        ScrollTrigger.refresh();
      }, sectionRef);
    }, 100);

    return () => {
      clearTimeout(timer);
      ctx?.revert();
    };
  }, [isLoading, recentDestinations]);

  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 lg:py-32 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton 
                key={i} 
                className="h-[320px] sm:h-[380px] lg:h-[400px] rounded-2xl sm:rounded-3xl" 
                style={{ backgroundColor: 'rgba(100, 116, 139, 0.1)' }} 
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error('Failed to load recent discoveries:', error);
    return null;
  }

  if (!recentDestinations || recentDestinations.length === 0) {
    console.log('No recent discoveries found.');
    return (
      <section className="py-20 bg-muted/20 text-center border-t border-border/50">
        <div className="max-w-2xl mx-auto px-4">
          <Clock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-2xl font-bold font-space-grotesk mb-2">No New Discoveries Yet</h2>
          <p className="text-muted-foreground mb-6">
            We haven't found any new hidden gems recently. Be the first to add one!
          </p>
          <Button 
            className="btn-coral"
            onClick={() => document.getElementById('contribute-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Add a Destination
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={sectionRef}
      className="relative py-16 sm:py-20 lg:py-32 bg-muted/20 overflow-hidden"
    >
      {/* Decorative background element - scaled for mobile */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[600px] lg:h-[600px] bg-[#FF5A3C]/5 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section - Improved mobile layout */}
        <div className="recent-title flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-12 lg:mb-16">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs tracking-[0.25em] text-[#FF5A3C] uppercase mb-3 sm:mb-4">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              Latest Additions
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight font-space-grotesk">
              Newest <span className="text-[#FF5A3C]">Discoveries</span>
            </h2>
            <p className="mt-3 sm:mt-4 text-muted-foreground text-base sm:text-lg max-w-xl">
              Freshly added by our community. Be the first to explore these newly documented hidden gems of Nepal.
            </p>
          </div>
          
          {/* Desktop CTA */}
          <Button 
            variant="ghost" 
            className="hidden md:flex group text-[#FF5A3C] hover:bg-[#FF5A3C]/10 shrink-0"
          >
            View All Destinations
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Cards Grid - Responsive columns and spacing */}
        <div 
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6"
        >
          {recentDestinations.map((dest) => (
            <div 
              key={dest.id}
              className="recent-card group relative h-[380px] sm:h-[420px] lg:h-[450px] rounded-2xl sm:rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden bg-card border border-border/50 hover:border-[#FF5A3C]/30 transition-all duration-500 shadow-md hover:shadow-lg hover:shadow-[#FF5A3C]/10"
            >
              {/* Image Container */}
              <div className="absolute inset-0">
                <img 
                  src={dest.image} 
                  alt={dest.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 sm:via-black/40 to-transparent" />
              </div>

              {/* Content Overlay - Adjusted padding for mobile */}
              <div className="absolute inset-0 p-5 sm:p-6 lg:p-8 flex flex-col justify-end">
                <div className="space-y-3 sm:space-y-4">
                  {/* Badge Row */}
                  <div className="flex items-center justify-between gap-2">
                    <Badge 
                      variant="outline"
                      className="backdrop-blur-md bg-white/10 text-white border-white/20 text-[10px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1"
                    >
                      {dest.category}
                    </Badge>
                    <span className="text-[9px] sm:text-[10px] font-mono text-white/60 tracking-wider whitespace-nowrap">
                      JUST ADDED
                    </span>
                  </div>

                  {/* Title - Responsive text size */}
                  <h3 className="text-xl sm:text-2xl font-bold text-white font-space-grotesk group-hover:text-[#FF5A3C] transition-colors line-clamp-2">
                    {dest.name}
                  </h3>

                  {/* Info Stack - Optimized for mobile touch */}
                  <div className="flex flex-col gap-1.5 sm:gap-2 pt-1 sm:pt-2">
                    <div className="flex items-center gap-2 text-white/80 text-xs sm:text-sm">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF5A3C] shrink-0" />
                      <span className="capitalize truncate">{dest.provinceId} Province</span>
                    </div>
                    
                    {dest.elevation && (
                      <div className="flex items-center gap-2 text-white/80 text-xs sm:text-sm">
                        <Mountain className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF5A3C] shrink-0" />
                        <span className="truncate">{dest.elevation}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-white/80 text-xs sm:text-sm">
                      <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF5A3C] shrink-0" />
                      <span className="truncate">Best: {dest.bestMonths[0]}</span>
                    </div>
                  </div>

                  {/* CTA Button - Always visible on mobile, hover on desktop */}
                  {/* CTA Button - Always visible on mobile, hover reveal on desktop */}
                  <div className="pt-3 sm:pt-4 opacity-100 sm:opacity-0 sm:-translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    <Button 
                      variant="secondary" 
                      className="w-full rounded-xl sm:rounded-2xl bg-white hover:bg-[#FF5A3C] hover:text-white border-0 transition-colors text-sm sm:text-base h-10 sm:h-11"
                    >
                      Explore Place
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile CTA - Full width button */}
        <div className="mt-8 sm:mt-10 text-center md:hidden">
          <Button 
            variant="outline" 
            className="w-full h-12 rounded-2xl border-[#FF5A3C]/30 text-[#FF5A3C] hover:bg-[#FF5A3C]/10"
          >
            View All Destinations
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}