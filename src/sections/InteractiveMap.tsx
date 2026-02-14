import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { categoryColors } from '@/data/nepalData';
import type { Destination, DestinationCategory } from '@/types';
import { useData } from '@/contexts/DataContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, Mountain, Thermometer, Calendar, Wind, Navigation, MapPin, Globe, Compass, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import GoogleMap from '@/components/GoogleMap';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

// Helper for relative positions with bounds checking
const getRelativePosition = (dest: Destination) => {
  if (!dest.coordinates?.lng || !dest.coordinates?.lat) return null;
  
  const relX = ((dest.coordinates.lng - 80) / 8.5) * 100;
  const relY = 100 - ((dest.coordinates.lat - 26.5) / 3.5) * 100;
  
  // Clamp values to keep markers within bounds
  return {
    ...dest,
    relX: Math.max(2, Math.min(98, relX)),
    relY: Math.max(2, Math.min(98, relY)),
  };
};

interface InteractiveMapProps {
  sectionRef?: React.RefObject<HTMLElement | null>;
}

const CATEGORIES: (DestinationCategory | 'all')[] = [
  'all',
  'Heritage Sites',
  'Trekking Routes',
  'Wildlife',
  'Spiritual Centers',
  'Adventure Sports',
  'Cultural Villages',
];

export function InteractiveMap({ sectionRef }: InteractiveMapProps) {
  const internalRef = useRef<HTMLElement>(null);
  const ref = sectionRef || internalRef;
  const mapRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [activeCategory, setActiveCategory] = useState<DestinationCategory | 'all'>('all');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [activeProvince, setActiveProvince] = useState<string>('all');
  const [activeDistrict, setActiveDistrict] = useState<string>('all');
  const [isAnimating, setIsAnimating] = useState(false);

  const { provinces, destinations, isLoading } = useData();

  // Calculate relative positions dynamically with validation
  const mapDestinations = useMemo(() => {
    if (!destinations?.length) return [];
    
    return destinations
      .filter((dest) => 
        dest.coordinates && 
        typeof dest.coordinates.lat === 'number' && 
        typeof dest.coordinates.lng === 'number' &&
        !isNaN(dest.coordinates.lat) &&
        !isNaN(dest.coordinates.lng)
      )
      .map(getRelativePosition)
      .filter((dest): dest is NonNullable<typeof dest> => dest !== null);
  }, [destinations]);

  // Simulate map loading with cleanup
  useEffect(() => {
    const timer = setTimeout(() => setIsMapLoaded(true), 600);
    return () => clearTimeout(timer);
  }, []);

  // GSAP ScrollTrigger animation with cleanup
  useEffect(() => {
    const section = ref.current;
    const map = mapRef.current;

    if (!section || !map || isLoading) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        map,
        { scale: 0.92, opacity: 0, y: 30 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            end: 'top 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Animate markers staggered
      gsap.fromTo(
        '.destination-marker',
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          stagger: 0.05,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: map,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [ref, isLoading]);

  // Filter destinations with useMemo
  const filteredDestinations = useMemo(() => {
    return mapDestinations.filter((d) => {
      const categoryMatch = activeCategory === 'all' || d.category === activeCategory;
      const provinceMatch = activeProvince === 'all' || d.provinceId === activeProvince;
      const districtMatch = activeDistrict === 'all' || d.districtId === activeDistrict;
      return categoryMatch && provinceMatch && districtMatch;
    });
  }, [mapDestinations, activeCategory, activeProvince, activeDistrict]);

  // Get available districts for selected province
  const availableDistricts = useMemo(() => {
    if (activeProvince === 'all') return [];
    const province = provinces.find((p) => p.id === activeProvince);
    return province?.districts?.sort((a, b) => a.name.localeCompare(b.name)) || [];
  }, [provinces, activeProvince]);

  // Reset district when province changes
  useEffect(() => {
    setActiveDistrict('all');
  }, [activeProvince]);

  // Handle destination selection with animation lock
  const handleDestinationClick = useCallback((dest: Destination) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSelectedDestination(dest);
    
    // Focus management for accessibility
    setTimeout(() => {
      closeButtonRef.current?.focus();
      setIsAnimating(false);
    }, 100);
  }, [isAnimating]);

  // Handle modal close
  const handleCloseModal = useCallback(() => {
    setSelectedDestination(null);
  }, []);

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedDestination) {
        handleCloseModal();
      }
    };

    if (selectedDestination) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedDestination, handleCloseModal]);

  // Loading state
  if (isLoading) {
    return (
      <section
        ref={ref as React.RefObject<HTMLElement>}
        className="relative w-full py-20 lg:py-32 bg-background flex items-center justify-center min-h-[600px]"
      >
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF5A3C]" />
          <span className="text-sm font-medium">Loading map data...</span>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative w-full py-16 sm:py-20 lg:py-32 bg-background overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF5A3C]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 lg:mb-14">
          <span className="inline-block font-mono text-xs tracking-[0.25em] text-[#FF5A3C] uppercase mb-3">
            Interactive Map
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight font-space-grotesk">
            Explore Nepal
            <span className="block sm:inline bg-gradient-to-r from-[#FF5A3C] to-orange-400 bg-clip-text text-transparent">
              {' '}Geographically
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Navigate through Nepal&apos;s diverse destinations. Click on the pulsating markers to discover
            detailed information about each location.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 lg:mb-8">
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(category)}
              className={cn(
                "rounded-full text-xs sm:text-sm transition-all duration-300 border-2",
                activeCategory === category
                  ? 'bg-[#FF5A3C] hover:bg-[#E54D2F] text-white border-[#FF5A3C] shadow-lg shadow-[#FF5A3C]/25'
                  : 'border-border hover:border-[#FF5A3C]/50 hover:text-[#FF5A3C] bg-background'
              )}
            >
              {category === 'all' ? 'All Destinations' : category}
            </Button>
          ))}
        </div>

        {/* Geographic Filters */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-10 lg:mb-12">
          {/* Province Selector */}
          <Select value={activeProvince} onValueChange={setActiveProvince}>
            <SelectTrigger 
              className="w-[160px] sm:w-[200px] bg-background/80 backdrop-blur-sm border-2 border-border hover:border-[#FF5A3C]/30 transition-all shadow-sm hover:shadow-md"
              aria-label="Select province"
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#FF5A3C]/10 rounded-lg">
                  <Globe className="w-4 h-4 text-[#FF5A3C]" />
                </div>
                <div className="text-left overflow-hidden">
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-[#FF5A3C]/70 font-semibold leading-none mb-0.5">Province</span>
                  <SelectValue placeholder="All Nepal" className="truncate" />
                </div>
              </div>
            </SelectTrigger>
            <SelectContent className="bg-background/95 backdrop-blur-xl border-border/50 max-h-[300px]">
              <SelectItem value="all">All Nepal</SelectItem>
              {provinces.sort((a, b) => a.name.localeCompare(b.name)).map(p => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* District Selector */}
          <div className={cn(
            "transition-all duration-300",
            activeProvince === 'all' ? 'opacity-40 grayscale pointer-events-none' : 'opacity-100'
          )}>
            <Select value={activeDistrict} onValueChange={setActiveDistrict} disabled={activeProvince === 'all'}>
              <SelectTrigger 
                className="w-[160px] sm:w-[200px] bg-background/80 backdrop-blur-sm border-2 border-border hover:border-[#FF5A3C]/30 transition-all shadow-sm hover:shadow-md"
                aria-label="Select district"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-[#FF5A3C]/10 rounded-lg">
                    <Compass className="w-4 h-4 text-[#FF5A3C]" />
                  </div>
                  <div className="text-left overflow-hidden">
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-[#FF5A3C]/70 font-semibold leading-none mb-0.5">District</span>
                    <SelectValue placeholder="Whole Province" className="truncate" />
                  </div>
                </div>
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-xl border-border/50 max-h-[300px]">
                <SelectItem value="all">Whole Province</SelectItem>
                {availableDistricts.map(d => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Map Container */}
        <div
          ref={mapRef}
          className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[21/9] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-border/50 bg-muted/30"
          style={{ opacity: isLoading ? 0 : 1 }}
        >
          {/* Stylized Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-emerald-50/50 to-amber-50/30 dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900/80">
            {/* Mountain Range Silhouettes */}
            <svg
              className="absolute inset-0 w-full h-full opacity-60 dark:opacity-40"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {/* Himalayan range (north) */}
              <path
                d="M0,20 Q10,15 20,18 Q30,10 40,16 Q50,8 60,14 Q70,12 80,17 Q90,13 100,19 L100,0 L0,0 Z"
                className="fill-slate-300 dark:fill-slate-700"
              />
              {/* Hill range (middle) */}
              <path
                d="M0,45 Q15,40 30,44 Q45,38 60,43 Q75,39 100,45 L100,20 L0,20 Z"
                className="fill-emerald-200/50 dark:fill-emerald-900/30"
              />
              {/* Terai plains (south) */}
              <path
                d="M0,70 Q25,68 50,70 Q75,68 100,70 L100,45 L0,45 Z"
                className="fill-amber-100/50 dark:fill-amber-900/20"
              />
            </svg>

            {/* Grid Lines */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={`h-${i}`}
                  className="absolute w-full border-t border-foreground"
                  style={{ top: `${i * 10}%` }}
                />
              ))}
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={`v-${i}`}
                  className="absolute h-full border-l border-foreground"
                  style={{ left: `${i * 10}%` }}
                />
              ))}
            </div>

            {/* Region Labels */}
            <div className="absolute top-[8%] left-[4%] text-[10px] sm:text-xs font-mono font-semibold text-muted-foreground/40 uppercase tracking-widest">
              Himalayas
            </div>
            <div className="absolute top-[35%] left-[4%] text-[10px] sm:text-xs font-mono font-semibold text-muted-foreground/40 uppercase tracking-widest">
              Hills
            </div>
            <div className="absolute top-[62%] left-[4%] text-[10px] sm:text-xs font-mono font-semibold text-muted-foreground/40 uppercase tracking-widest">
              Terai
            </div>

            {/* Destination Markers */}
            {isMapLoaded && filteredDestinations.map((dest, index) => (
              <button
                key={dest.id}
                className="destination-marker absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A3C] focus-visible:ring-offset-2 rounded-full"
                style={{
                  left: `${dest.relX}%`,
                  top: `${dest.relY}%`,
                  zIndex: selectedDestination?.id === dest.id ? 50 : 10,
                }}
                onClick={() => handleDestinationClick(dest)}
                aria-label={`View details for ${dest.name}`}
              >
                {/* Pulsing Rings */}
                <div className="absolute inset-0 animate-ping opacity-20">
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full",
                      activeDistrict !== 'all' && dest.districtId === activeDistrict 
                        ? 'bg-[#FF5A3C]' 
                        : 'bg-current'
                    )}
                    style={{ 
                      backgroundColor: activeDistrict !== 'all' && dest.districtId === activeDistrict 
                        ? undefined 
                        : categoryColors[dest.category] 
                    }}
                  />
                </div>
                
                {/* Marker Dot */}
                <div
                  className={cn(
                    "relative w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white shadow-lg transition-all duration-300",
                    "group-hover:scale-150 group-hover:shadow-xl",
                    selectedDestination?.id === dest.id ? "scale-150 ring-2 ring-white ring-offset-2 ring-offset-background" : ""
                  )}
                  style={{ backgroundColor: categoryColors[dest.category] }}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-background/95 backdrop-blur-sm rounded-lg shadow-xl text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-20 border border-border/50">
                    {dest.name}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-background/95" />
                  </div>
                </div>
              </button>
            ))}

            {/* Empty state */}
            {isMapLoaded && filteredDestinations.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-6 bg-background/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg">
                  <MapPin className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground font-medium">No destinations found</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Try adjusting your filters</p>
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-background/90 backdrop-blur-md rounded-xl p-3 shadow-lg border border-border/50 max-w-[140px] sm:max-w-none">
              <div className="text-[10px] sm:text-xs font-semibold mb-2 text-foreground/80 uppercase tracking-wider">Categories</div>
              <div className="space-y-1.5">
                {Object.entries(categoryColors).map(([category, color]) => (
                  <div key={category} className="flex items-center gap-2 text-[10px] sm:text-xs">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-muted-foreground truncate">{category}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-background/90 backdrop-blur-md rounded-xl p-3 shadow-lg border border-border/50">
              <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">Destinations</div>
              <div className="text-xl sm:text-2xl font-bold font-space-grotesk text-foreground">
                {filteredDestinations.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Destination Detail Panel - Modal */}
      {selectedDestination && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="destination-title"
        >
          <div 
            ref={modalRef}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-background rounded-2xl sm:rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 border border-border/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              ref={closeButtonRef}
              onClick={handleCloseModal}
              className="absolute top-3 right-3 z-50 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-[#FF5A3C] hover:text-white hover:border-[#FF5A3C] transition-all shadow-lg group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A3C] focus-visible:ring-offset-2"
              aria-label="Close details"
            >
              <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>

            {/* Image */}
            <div className="relative h-48 sm:h-56">
              <img
                src={selectedDestination.image}
                alt={selectedDestination.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <Badge
                  className="shadow-lg"
                  style={{
                    backgroundColor: categoryColors[selectedDestination.category],
                    color: '#fff',
                  }}
                >
                  {selectedDestination.category}
                </Badge>
                
                {(activeDistrict === selectedDestination.districtId || activeProvince === selectedDestination.provinceId) && (
                  <Badge
                    className="bg-white/95 text-[#FF5A3C] border-[#FF5A3C]/20 shadow-lg animate-pulse"
                  >
                    <Navigation className="w-3 h-3 mr-1" />
                    Target Area
                  </Badge>
                )}
              </div>

              {/* Title */}
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                <h3 id="destination-title" className="text-2xl sm:text-3xl font-bold text-white mb-1 font-space-grotesk">
                  {selectedDestination.name}
                </h3>
                <div className="flex items-center gap-2 text-white/90 text-sm">
                  <MapPin className="w-4 h-4 text-[#FF5A3C]" />
                  <span>{provinces.find(p => p.id === selectedDestination.provinceId)?.name} Province</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6 space-y-5">
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                {selectedDestination.description}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {selectedDestination.elevation && (
                  <div className="bg-muted/40 hover:bg-muted/60 transition-colors rounded-xl p-3 sm:p-4 border border-border/50">
                    <div className="flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mb-1 font-semibold">
                      <Mountain className="w-3.5 h-3.5 text-[#FF5A3C]" />
                      Elevation
                    </div>
                    <div className="font-bold text-base sm:text-lg">{selectedDestination.elevation}</div>
                  </div>
                )}
                
                <div className="bg-muted/40 hover:bg-muted/60 transition-colors rounded-xl p-3 sm:p-4 border border-border/50">
                  <div className="flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mb-1 font-semibold">
                    <Thermometer className="w-3.5 h-3.5 text-[#FF5A3C]" />
                    Temperature
                  </div>
                  <div className="font-bold text-base sm:text-lg">{selectedDestination.temperature}°C</div>
                </div>
                
                <div className="bg-muted/40 hover:bg-muted/60 transition-colors rounded-xl p-3 sm:p-4 border border-border/50">
                  <div className="flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mb-1 font-semibold">
                    <Wind className="w-3.5 h-3.5 text-[#FF5A3C]" />
                    Weather
                  </div>
                  <div className="font-bold text-base sm:text-lg">{selectedDestination.weatherCondition}</div>
                </div>
                
                <div className="bg-muted/40 hover:bg-muted/60 transition-colors rounded-xl p-3 sm:p-4 border border-border/50">
                  <div className="flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mb-1 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-[#FF5A3C]" />
                    Best Time
                  </div>
                  <div className="font-bold text-xs sm:text-sm leading-tight">
                    {selectedDestination.bestMonths.join(', ')}
                  </div>
                </div>
              </div>

              {/* Google Map Integration */}
              <div className="rounded-xl overflow-hidden border border-border/50 h-40 sm:h-48 bg-muted">
                <GoogleMap 
                  lat={selectedDestination.coordinates.lat} 
                  lng={selectedDestination.coordinates.lng} 
                  zoom={12}
                  className="w-full h-full"
                />
              </div>

              {/* Cultural Significance */}
              <div className="bg-gradient-to-r from-amber-50/50 to-orange-50/30 dark:from-amber-950/20 dark:to-orange-900/10 rounded-xl p-4 border border-amber-200/50 dark:border-amber-800/30">
                <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mb-2 font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A3C]" />
                  Cultural Significance
                </div>
                <p className="text-sm leading-relaxed italic text-foreground/80">
                  &ldquo;{selectedDestination.culturalSignificance}&rdquo;
                </p>
              </div>

              {/* Action Button */}
              <Button 
                className="w-full py-5 sm:py-6 rounded-xl bg-[#FF5A3C] hover:bg-[#E54D2F] text-white text-base sm:text-lg font-bold shadow-lg shadow-[#FF5A3C]/25 hover:shadow-xl hover:shadow-[#FF5A3C]/30 transition-all hover:-translate-y-0.5"
              >
                <Navigation className="w-5 h-5 mr-2" />
                Plan Your Journey
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}