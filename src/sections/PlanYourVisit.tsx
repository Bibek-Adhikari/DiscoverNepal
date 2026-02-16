import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Download, 
  FileCheck, 
  Calendar, 
  Users, 
  Shield, 
  Plane, 
  Backpack, 
  CreditCard,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { NepaliCalendar } from '@/components/NepaliCalendar';

gsap.registerPlugin(ScrollTrigger);

interface PlanningItem {
  icon: React.ElementType;
  title: string;
  desc: string;
  details?: string;
}

const PLANNING_ITEMS: PlanningItem[] = [
  { 
    icon: FileCheck, 
    title: 'Visa Requirements', 
    desc: 'On arrival for most countries',
    details: '15-90 days available'
  },
  { 
    icon: Calendar, 
    title: 'Best Seasons', 
    desc: 'Spring & Autumn ideal',
    details: 'Mar-May, Sep-Nov'
  },
  { 
    icon: Users, 
    title: 'Local Guides', 
    desc: 'Certified experts',
    details: 'English speaking'
  },
  { 
    icon: Shield, 
    title: 'Travel Insurance', 
    desc: 'Highly recommended',
    details: 'Covers up to 6000m'
  },
  { 
    icon: Plane, 
    title: 'International Flights', 
    desc: 'Direct to Kathmandu',
    details: 'Tribhuvan Airport'
  },
  { 
    icon: Backpack, 
    title: 'Essential Packing', 
    desc: 'Layered clothing',
    details: 'Gear rental available'
  },
  { 
    icon: CreditCard, 
    title: 'Currency & Payment', 
    desc: 'NPR (1 USD ≈ 133 NPR)',
    details: 'Cash preferred'
  },
  { 
    icon: Download, 
    title: 'Required Permits', 
    desc: 'TIMS & National Park',
    details: 'Arranged by agencies'
  },
];

const STATS = [
  { value: '365', label: 'Days Accessible', suffix: '' },
  { value: '2', label: 'Peak Seasons', suffix: '' },
  { value: '130+', label: 'Nationalities', suffix: '' },
  { value: '150', label: 'Days Max Visa', suffix: '+' },
];

export function PlanYourVisit() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        '.plan-header',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Image parallax and reveal
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { y: 80, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: imageRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );

        // Subtle parallax on scroll
        gsap.to(imageRef.current.querySelector('img'), {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }

      // Cards staggered animation
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.plan-card');
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Stats counter animation
      if (statsRef.current) {
        const statValues = statsRef.current.querySelectorAll('.stat-value');
        
        gsap.fromTo(
          statsRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );

        // Animate numbers
        statValues.forEach((stat) => {
          const value = stat.getAttribute('data-value');
          const suffix = stat.getAttribute('data-suffix') || '';
          const numValue = parseInt(value?.replace(/\D/g, '') || '0');
          
          gsap.fromTo(
            { val: 0 },
            { val: numValue },
            {
              duration: 2,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: stat,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
              onUpdate: function() {
                const current = Math.round(this.targets()[0].val);
                stat.textContent = current + suffix;
              },
            }
          );
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const handleDownload = () => {
    // Simulate download action
    const link = document.createElement('a');
    link.href = '#'; // Replace with actual PDF URL
    link.download = 'nepal-travel-checklist.pdf';
    link.click();
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-20 lg:py-32 bg-background overflow-hidden"
      aria-labelledby="plan-visit-heading"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#FF5A3C]/5 to-transparent rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-500/5 to-transparent rounded-full blur-3xl opacity-60" />
      </div>

      <div className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="plan-header text-center mb-12 lg:mb-16">
          <span className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.25em] text-[#FF5A3C] uppercase mb-4">
            <span className="w-8 h-px bg-[#FF5A3C]" />
            Practical Guide
            <span className="w-8 h-px bg-[#FF5A3C]" />
          </span>
          <h2 
            id="plan-visit-heading"
            className="mt-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight font-space-grotesk"
          >
            Plan Your
            <span className="block sm:inline bg-gradient-to-r from-[#FF5A3C] via-orange-400 to-[#FF8C5A] bg-clip-text text-transparent">
              {' '}Visit
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Everything you need to know before traveling to Nepal. From visas to packing lists, 
            we&apos;ve got you covered for an unforgettable adventure.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left - Image with Overlay */}
          <div 
            ref={imageRef}
            className="relative aspect-[4/3] lg:aspect-[3/4] rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl group"
          >
            {!imageLoaded && (
              <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#FF5A3C]/20 border-t-[#FF5A3C] rounded-full animate-spin" />
              </div>
            )}
            
            <img
              src="/hero-city-sunrise.jpg"
              alt="Stunning Nepal mountain landscape at sunrise with traditional architecture"
              className={cn(
                "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            
            {/* Floating Badge */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
              <div className="flex items-center gap-2 bg-white/95 dark:bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                <MapPin className="w-4 h-4 text-[#FF5A3C]" />
                <span className="text-xs font-semibold">Kathmandu Valley</span>
              </div>
            </div>

            {/* Overlay Content Card */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
              <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-xl border border-white/20">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-[#FF5A3C]/10 rounded-lg flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-[#FF5A3C]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Ready to explore?</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Download our comprehensive travel checklist with packing lists, 
                      emergency contacts, and insider tips.
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={handleDownload}
                  className="w-full sm:w-auto bg-[#FF5A3C] hover:bg-[#E54D2F] text-white shadow-lg shadow-[#FF5A3C]/25 hover:shadow-xl hover:shadow-[#FF5A3C]/30 transition-all hover:-translate-y-0.5 group/btn"
                >
                  <Download className="w-4 h-4 mr-2 transition-transform group-hover/btn:animate-bounce" />
                  Download Checklist
                  <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right - Info Cards Grid */}
          <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {PLANNING_ITEMS.map((item, index) => {
              const Icon = item.icon;
              const isHovered = hoveredCard === index;
              
              return (
                <div
                  key={item.title}
                  className={cn(
                    "plan-card relative bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border transition-all duration-300 cursor-pointer group",
                    isHovered 
                      ? "border-[#FF5A3C]/50 shadow-lg shadow-[#FF5A3C]/10 -translate-y-1" 
                      : "border-border/50 shadow-sm hover:shadow-md hover:border-[#FF5A3C]/30"
                  )}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${item.title}: ${item.desc}`}
                >
                  {/* Hover Glow Effect */}
                  <div className={cn(
                    "absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#FF5A3C]/5 to-transparent opacity-0 transition-opacity duration-300",
                    isHovered && "opacity-100"
                  )} />

                  <div className="relative flex items-start gap-3 sm:gap-4">
                    <div className={cn(
                      "flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                      isHovered ? "bg-[#FF5A3C] text-white scale-110" : "bg-[#FF5A3C]/10 text-[#FF5A3C]"
                    )}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm sm:text-base mb-0.5 group-hover:text-[#FF5A3C] transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                      {item.details && (
                        <div className={cn(
                          "flex items-center gap-1 mt-2 text-[10px] sm:text-xs font-medium text-[#FF5A3C] transition-all duration-300",
                          isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
                        )}>
                          <Clock className="w-3 h-3" />
                          {item.details}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
 
         {/* Festivals Section */}
         <div className="mt-20 lg:mt-32">
           <NepaliCalendar />
         </div>
 
         {/* Bottom Stats Section */}
        <div 
          ref={statsRef}
          className="mt-12 lg:mt-20"
        >
          <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-gradient-to-br from-[#FF5A3C]/5 via-[#FF8C5A]/5 to-orange-50/50 dark:from-[#FF5A3C]/10 dark:via-[#FF8C5A]/10 dark:to-slate-900/50 border border-[#FF5A3C]/10 p-6 sm:p-8 lg:p-10">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5A3C]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
              {STATS.map((stat) => (
                <div 
                  key={stat.label} 
                  className="text-center group"
                >
                  <div className="relative inline-block">
                    <span 
                      className="stat-value block text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FF5A3C] font-space-grotesk tabular-nums"
                      data-value={stat.value}
                      data-suffix={stat.suffix}
                    >
                      0{stat.suffix}
                    </span>
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FF5A3C]/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-2 font-medium uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Info */}
            <div className="relative mt-8 pt-6 border-t border-[#FF5A3C]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Pro tip:</span> Book permits and guides 
                at least 2 weeks in advance for peak seasons.
              </p>
              <Button 
                variant="outline" 
                className="border-[#FF5A3C]/30 text-[#FF5A3C] hover:bg-[#FF5A3C]/10 hover:border-[#FF5A3C] transition-all"
              >
                View Full Guide
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}