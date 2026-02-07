import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { destinations, categoryColors, provinces, type Destination, type DestinationCategory } from '@/data/nepalData';
import { X, Mountain, Thermometer, Calendar, Wind, Navigation } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

// Simplified map coordinates (relative positions for visual representation)
const mapDestinations = destinations.map((dest) => ({
  ...dest,
  // Convert lat/lng to relative positions (simplified for visual map)
  relX: ((dest.coordinates.lng - 80) / 8.5) * 100, // Nepal longitude range ~80-88.5
  relY: 100 - ((dest.coordinates.lat - 26.5) / 3.5) * 100, // Nepal latitude range ~26.5-30
}));

interface InteractiveMapProps {
  sectionRef?: React.RefObject<HTMLElement | null>;
}

export function InteractiveMap({ sectionRef }: InteractiveMapProps) {
  const internalRef = useRef<HTMLElement>(null);
  const ref = sectionRef || internalRef;
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [activeCategory, setActiveCategory] = useState<DestinationCategory | 'all'>('all');
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMapLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const section = ref.current;
    const map = mapRef.current;

    if (!section || !map) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        map,
        { scale: 0.95, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [ref]);

  const filteredDestinations = activeCategory === 'all' 
    ? mapDestinations 
    : mapDestinations.filter(d => d.category === activeCategory);

  const categories: (DestinationCategory | 'all')[] = [
    'all',
    'Heritage Sites',
    'Trekking Routes',
    'Wildlife',
    'Spiritual Centers',
    'Adventure Sports',
    'Cultural Villages',
  ];

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative w-full py-20 lg:py-32 z-20 bg-background"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="font-mono text-xs tracking-[0.2em] text-[#FF5A3C] uppercase">
            Interactive Map
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight font-['Space_Grotesk']">
            Explore Nepal
            <span className="text-gradient-sunrise"> Geographically</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Navigate through Nepal&apos;s diverse destinations. Click on the pulsating markers to discover
            detailed information about each location.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full text-xs ${
                activeCategory === category
                  ? 'bg-[#FF5A3C] hover:bg-[#E54D2F] text-white'
                  : 'hover:bg-[#FF5A3C]/10 hover:text-[#FF5A3C]'
              }`}
            >
              {category === 'all' ? 'All Destinations' : category}
            </Button>
          ))}
        </div>

        {/* Map Container */}
        <div
          ref={mapRef}
          className="relative w-full aspect-[16/10] lg:aspect-[21/9] card-nepal overflow-hidden"
          style={{ opacity: 0 }}
        >
          {/* Stylized Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#e8f4f8] via-[#f0f8f0] to-[#f8f0e8] dark:from-[#1a2530] dark:via-[#1a3025] dark:to-[#302520]">
            {/* Mountain Range Silhouettes */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {/* Himalayan range (north) */}
              <path
                d="M0,20 Q10,15 20,18 Q30,10 40,16 Q50,8 60,14 Q70,12 80,17 Q90,13 100,19 L100,0 L0,0 Z"
                fill="rgba(200,220,230,0.4)"
                className="dark:fill-[rgba(40,60,80,0.4)]"
              />
              {/* Hill range (middle) */}
              <path
                d="M0,45 Q15,40 30,44 Q45,38 60,43 Q75,39 100,45 L100,20 L0,20 Z"
                fill="rgba(180,200,180,0.3)"
                className="dark:fill-[rgba(50,70,50,0.3)]"
              />
              {/* Terai plains (south) */}
              <path
                d="M0,70 Q25,68 50,70 Q75,68 100,70 L100,45 L0,45 Z"
                fill="rgba(200,190,170,0.3)"
                className="dark:fill-[rgba(60,55,45,0.3)]"
              />
            </svg>

            {/* Grid Lines */}
            <div className="absolute inset-0 opacity-10">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={`h-${i}`}
                  className="absolute w-full border-t border-foreground/20"
                  style={{ top: `${i * 10}%` }}
                />
              ))}
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={`v-${i}`}
                  className="absolute h-full border-l border-foreground/20"
                  style={{ left: `${i * 10}%` }}
                />
              ))}
            </div>

            {/* Region Labels */}
            <div className="absolute top-[8%] left-[5%] text-xs font-mono text-muted-foreground/60">
              HIMALAYAS
            </div>
            <div className="absolute top-[35%] left-[5%] text-xs font-mono text-muted-foreground/60">
              HILLS
            </div>
            <div className="absolute top-[62%] left-[5%] text-xs font-mono text-muted-foreground/60">
              TERAI
            </div>

            {/* Destination Markers */}
            {isMapLoaded && filteredDestinations.map((dest) => (
              <div
                key={dest.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{
                  left: `${dest.relX}%`,
                  top: `${dest.relY}%`,
                }}
                onClick={() => setSelectedDestination(dest)}
              >
                {/* Pulsing Rings */}
                <div className="marker-pulse absolute inset-0">
                  <div
                    className="w-4 h-4 rounded-full animate-ping opacity-40"
                    style={{ backgroundColor: categoryColors[dest.category] }}
                  />
                </div>
                
                {/* Marker Dot */}
                <div
                  className="relative w-4 h-4 rounded-full border-2 border-white shadow-lg transition-transform duration-300 group-hover:scale-150"
                  style={{ backgroundColor: categoryColors[dest.category] }}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-background/95 backdrop-blur-sm rounded-lg shadow-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {dest.name}
                  </div>
                </div>
              </div>
            ))}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 card-nepal-sm p-3 space-y-2">
              <div className="text-xs font-medium mb-2">Categories</div>
              {Object.entries(categoryColors).map(([category, color]) => (
                <div key={category} className="flex items-center gap-2 text-xs">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-muted-foreground">{category}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="absolute bottom-4 right-4 card-nepal-sm p-3">
              <div className="text-xs text-muted-foreground">Destinations</div>
              <div className="text-2xl font-bold font-['Space_Grotesk']">
                {filteredDestinations.length}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Destination Detail Panel */}
        {selectedDestination && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-lg card-nepal overflow-hidden animate-in fade-in zoom-in duration-300">
              {/* Close Button */}
              <button
                onClick={() => setSelectedDestination(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Image */}
              <div className="relative h-48">
                <img
                  src={selectedDestination.image}
                  alt={selectedDestination.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Category Badge */}
                <Badge
                  className="absolute top-4 left-4"
                  style={{
                    backgroundColor: `${categoryColors[selectedDestination.category]}20`,
                    color: categoryColors[selectedDestination.category],
                    borderColor: `${categoryColors[selectedDestination.category]}40`,
                  }}
                  variant="outline"
                >
                  {selectedDestination.category}
                </Badge>

                {/* Title */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white">{selectedDestination.name}</h3>
                  <p className="text-sm text-white/80">
                    {provinces.find(p => p.id === selectedDestination.provinceId)?.name} Province
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-muted-foreground mb-4">
                  {selectedDestination.description}
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {selectedDestination.elevation && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <Mountain className="w-4 h-4" />
                        Elevation
                      </div>
                      <div className="font-medium">{selectedDestination.elevation}</div>
                    </div>
                  )}
                  
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Thermometer className="w-4 h-4" />
                      Temperature
                    </div>
                    <div className="font-medium">{selectedDestination.temperature}°C</div>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Wind className="w-4 h-4" />
                      Weather
                    </div>
                    <div className="font-medium">{selectedDestination.weatherCondition}</div>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Calendar className="w-4 h-4" />
                      Best Time
                    </div>
                    <div className="font-medium text-sm">
                      {selectedDestination.bestMonths.slice(0, 3).join(', ')}
                    </div>
                  </div>
                </div>

                {/* Cultural Significance */}
                <div className="border-t border-border/50 pt-4">
                  <div className="text-xs text-muted-foreground mb-2">Cultural Significance</div>
                  <p className="text-sm">{selectedDestination.culturalSignificance}</p>
                </div>

                {/* Action Button */}
                <Button className="w-full mt-4 btn-coral">
                  <Navigation className="w-4 h-4 mr-2" />
                  Plan Visit
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}


