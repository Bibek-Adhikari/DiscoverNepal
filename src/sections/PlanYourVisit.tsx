import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Download, FileCheck, Calendar, Users, Shield, Plane, Backpack, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

export function PlanYourVisit() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const elements = section.querySelectorAll('.animate-in');
      
      gsap.fromTo(
        elements,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const planningItems = [
    { icon: FileCheck, title: 'Visa', desc: 'On arrival for most countries' },
    { icon: Calendar, title: 'Best Time', desc: 'Spring & Autumn' },
    { icon: Users, title: 'Guides', desc: 'Local experts available' },
    { icon: Shield, title: 'Insurance', desc: 'Travel insurance recommended' },
    { icon: Plane, title: 'Flights', desc: 'Direct to Kathmandu' },
    { icon: Backpack, title: 'Packing', desc: 'Layered clothing essential' },
    { icon: CreditCard, title: 'Currency', desc: 'NPR (1 USD ≈ 133 NPR)' },
    { icon: Download, title: 'Permits', desc: 'TIMS & National Park' },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-20 lg:py-32 z-30 bg-background"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16 animate-in">
          <span className="font-mono text-xs tracking-[0.2em] text-[#FF5A3C] uppercase">
            Practical Guide
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight font-['Space_Grotesk']">
            Plan Your
            <span className="text-gradient-sunrise"> Visit</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know before traveling to Nepal. From visas to packing lists, we&apos;ve got you covered.
          </p>
        </div>

        {/* Content Grid */}
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left - Image */}
          <div className="animate-in relative aspect-[4/3] lg:aspect-auto lg:min-h-[500px] rounded-[24px] lg:rounded-[28px] overflow-hidden shadow-xl">
            <img
              src="/hero-city-sunrise.jpg"
              alt="Nepal landscape"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Overlay Content */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-white/95 dark:bg-black/80 backdrop-blur-sm rounded-2xl p-5">
                <h3 className="font-semibold text-lg mb-2">Ready to explore?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Download our comprehensive travel checklist and start planning your adventure.
                </p>
                <Button className="btn-coral w-full sm:w-auto">
                  <Download className="w-4 h-4 mr-2" />
                  Download Checklist
                </Button>
              </div>
            </div>
          </div>

          {/* Right - Info Cards */}
          <div className="animate-in grid grid-cols-2 gap-4">
            {planningItems.map((item, i) => (
              <div
                key={i}
                className="bg-card rounded-2xl p-4 lg:p-5 shadow-sm border border-border/50 hover:shadow-md hover:border-[#FF5A3C]/30 transition-all duration-300"
              >
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-[#FF5A3C]/10 flex items-center justify-center mb-3">
                  <item.icon className="w-5 h-5 lg:w-6 lg:h-6 text-[#FF5A3C]" />
                </div>
                <h4 className="font-semibold text-sm lg:text-base mb-1">{item.title}</h4>
                <p className="text-xs lg:text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="animate-in mt-12 lg:mt-16 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 lg:p-8 rounded-2xl lg:rounded-3xl bg-gradient-to-r from-[#FF5A3C]/5 to-[#FF8C5A]/5 border border-[#FF5A3C]/10">
            {[
              { value: '365', label: 'Days Open' },
              { value: '2', label: 'Peak Seasons' },
              { value: '30+', label: 'Nationalities' },
              { value: '15', label: 'Days Visa' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-[#FF5A3C] font-['Space_Grotesk']">
                  {stat.value}
                </div>
                <div className="text-xs lg:text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
