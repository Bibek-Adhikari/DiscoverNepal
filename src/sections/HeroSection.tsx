import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ChevronDown, Play, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  onExploreClick?: () => void;
  onNewsClick?: () => void;
}

export function HeroSection({ onExploreClick, onNewsClick }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { image: '/hero-city-sunrise.jpg', title: 'NEPAL', subtitle: 'Land of the Himalayas' },
    { image: '/annapurna-trekker.jpg', title: 'ADVENTURE', subtitle: 'Trek the Highest Peaks' },
    { image: '/pokhara-lake.jpg', title: 'SERENITY', subtitle: 'Lakeside Paradise' },
    { image: '/kathmandu-stupa.jpg', title: 'HERITAGE', subtitle: 'Ancient Temples & Culture' },
  ];

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const bg = bgRef.current;

    if (!section || !content || !bg) return;

    const ctx = gsap.context(() => {
      // Auto-play entrance animation on load
      const loadTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Background fade in with scale
      loadTl.fromTo(bg, { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, duration: 1.5 }, 0);

      // Content entrance
      loadTl.fromTo(
        content.querySelector('.hero-badge'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        0.3
      );

      loadTl.fromTo(
        content.querySelector('.hero-title'),
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        0.5
      );

      loadTl.fromTo(
        content.querySelector('.hero-subtitle'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        0.7
      );

      loadTl.fromTo(
        content.querySelector('.hero-cta'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        0.9
      );

      loadTl.fromTo(
        content.querySelector('.hero-stats'),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        1.1
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen overflow-hidden z-10"
    >
      {/* Animated Background Slideshow */}
      <div ref={bgRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0 }}>
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.subtitle}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40" />
      </div>

      {/* Main Content */}
      <div
        ref={contentRef}
        className="relative z-20 flex flex-col min-h-screen px-4 sm:px-6 lg:px-8 pt-24 pb-8"
      >
        {/* Content Wrapper */}
        <div className="flex-1 flex flex-col items-center justify-center w-full mb-8">
          {/* Badge */}
          <div className="hero-badge mb-4 sm:mb-6" style={{ opacity: 0 }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-mono tracking-wider uppercase">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-[#FF5A3C]" />
              Discover the Himalayas
            </span>
          </div>

          {/* Title */}
          <h1
            className="hero-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tighter font-['Space_Grotesk'] text-center"
            style={{ opacity: 0 }}
          >
            <span className="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
              {slides[currentSlide].title}
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="hero-subtitle mt-4 sm:mt-6 text-lg sm:text-xl md:text-2xl text-muted-foreground text-center max-w-xl"
            style={{ opacity: 0 }}
          >
            {slides[currentSlide].subtitle}
          </p>

          {/* CTA Buttons */}
          <div
            className="hero-cta mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4"
            style={{ opacity: 0 }}
          >
            <Button
              size="lg"
              onClick={onExploreClick}
              className="btn-coral text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6 rounded-full group"
            >
              Explore Destinations
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onNewsClick}
              className="rounded-full border-2 border-foreground/20 hover:border-[#FF5A3C] hover:text-[#FF5A3C] text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6 bg-background/50 backdrop-blur-sm"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Latest News
            </Button>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="w-full flex justify-center gap-2 mb-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8 bg-[#FF5A3C]'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Stats Bar */}
        <div
          className="hero-stats w-full"
          style={{ opacity: 0 }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-black/10 backdrop-blur-md border border-white/10">
              {[
                { value: '7', label: 'Provinces' },
                { value: '77', label: 'Districts' },
                { value: '15+', label: 'Destinations' },
                { value: '8', label: 'World Heritage' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#FF5A3C] font-['Space_Grotesk']">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="flex flex-col items-center gap-2 text-muted-foreground/50 mt-4">
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
