import { useState, useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  categoryColors,
  type Destination,
  type DestinationCategory,
  type District,
} from '@/data/nepalData';
import { useData } from '@/contexts/DataContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  MapPin,
  Mountain,
  Compass,
  Tent,
  Palmtree,
  Church,
  Bike,
  Home,
  Thermometer,
  Calendar,
  Wind,
  X,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const categoryIcons: Record<DestinationCategory, typeof MapPin> = {
  'Heritage Sites': Church,
  'Trekking Routes': Mountain,
  'Wildlife': Palmtree,
  'Spiritual Centers': Compass,
  'Adventure Sports': Bike,
  'Cultural Villages': Home,
};

interface TerritoryExplorerProps {
  sectionRef?: React.RefObject<HTMLElement | null>;
}

export function TerritoryExplorer({ sectionRef }: TerritoryExplorerProps) {
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hoveredDestination, setHoveredDestination] = useState<Destination | null>(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  // Get data from centralized DataContext
  const { provinces, destinations, isLoading } = useData();

  const internalRef = useRef<HTMLElement>(null);
  const ref = sectionRef || internalRef;

  // Get districts based on selected province
  const availableDistricts = useMemo<District[]>(() => {
    if (selectedProvince === 'all') {
      return provinces.flatMap((p) => p.districts || []);
    }
    const province = provinces.find((p) => p.id === selectedProvince);
    return province?.districts || [];
  }, [selectedProvince, provinces]);

  // Filter destinations
  const filteredDestinations = useMemo(() => {
    return destinations.filter((dest) => {
      const provinceMatch = selectedProvince === 'all' || dest.provinceId === selectedProvince;
      const districtMatch = selectedDistrict === 'all' || dest.districtId === selectedDistrict;
      const categoryMatch = selectedCategory === 'all' || dest.category === selectedCategory;
      return provinceMatch && districtMatch && categoryMatch;
    });
  }, [selectedProvince, selectedDistrict, selectedCategory]);

  // Reset district when province changes
  useEffect(() => {
    setSelectedDistrict('all');
  }, [selectedProvince]);

  // Scroll animation
  useEffect(() => {
    const section = ref.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const animateElements = section.querySelectorAll('.animate-in');
      
      gsap.fromTo(
        animateElements,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
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

  const handleMouseEnter = (dest: Destination, e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setPopupPosition({
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
    setHoveredDestination(dest);
  };

  const handleMouseLeave = () => {
    setHoveredDestination(null);
  };

  const categories: DestinationCategory[] = [
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
      className="relative w-full min-h-screen py-20 lg:py-32 z-20 bg-background"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <div className="text-center mb-12 animate-in">
          <span className="font-mono text-xs tracking-[0.2em] text-[#FF5A3C] uppercase">
            Territory Explorer
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight font-['Space_Grotesk']">
            Find Your Next
            <span className="text-gradient-sunrise"> Adventure</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Explore Nepal&apos;s diverse landscapes and cultures through our interactive territory filter.
            Select a province, district, or category to discover your perfect destination.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-10 animate-in">
          {/* Province Select */}
          <Select value={selectedProvince} onValueChange={setSelectedProvince}>
            <SelectTrigger className="w-[160px] sm:w-[200px] card-nepal-sm border-0">
              <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="All Provinces" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Provinces</SelectItem>
              {provinces.map((province) => (
                <SelectItem key={province.id} value={province.id}>
                  {province.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* District Select */}
          <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
            <SelectTrigger className="w-[160px] sm:w-[200px] card-nepal-sm border-0">
              <Compass className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="All Districts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Districts</SelectItem>
              {availableDistricts.filter(Boolean).map((district) => (
                <SelectItem key={district.id} value={district.id}>
                  {district.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Category Select */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[160px] sm:w-[200px] card-nepal-sm border-0">
              <Tent className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {(selectedProvince !== 'all' || selectedDistrict !== 'all' || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                setSelectedProvince('all');
                setSelectedDistrict('all');
                setSelectedCategory('all');
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-[#FF5A3C] transition-colors"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="text-center mb-8 animate-in">
          <span className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredDestinations.length}</span> destinations
          </span>
        </div>

        {/* Destination Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card-nepal overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))
            : filteredDestinations.map((destination) => {
                const CategoryIcon = categoryIcons[destination.category];
                return (
                  <div
                    key={destination.id}
                    className="group relative card-nepal overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] animate-in"
                    onMouseEnter={(e) => handleMouseEnter(destination, e)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {/* Image */}
                    <div className="relative h-44 sm:h-48 overflow-hidden">
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Category Badge */}
                      <Badge
                        className="absolute top-3 left-3 text-[10px] sm:text-xs"
                        style={{
                          backgroundColor: `${categoryColors[destination.category]}20`,
                          color: categoryColors[destination.category],
                          borderColor: `${categoryColors[destination.category]}40`,
                        }}
                        variant="outline"
                      >
                        <CategoryIcon className="w-3 h-3 mr-1" />
                        {destination.category}
                      </Badge>

                      {/* Temperature */}
                      <div className="absolute top-3 right-3 flex items-center gap-1 text-white text-[10px] sm:text-xs bg-black/30 backdrop-blur-sm rounded-full px-2 py-1">
                        <Thermometer className="w-3 h-3" />
                        {destination.temperature}°C
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-base sm:text-lg mb-1 group-hover:text-[#FF5A3C] transition-colors">
                        {destination.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {destination.description}
                      </p>
                      
                      {/* Elevation */}
                      {destination.elevation && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                          <Mountain className="w-3 h-3" />
                          <span>{destination.elevation}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
        </div>

        {/* Empty State */}
        {!isLoading && filteredDestinations.length === 0 && (
          <div className="text-center py-16 animate-in">
            <div className="w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <MapPin className="w-6 sm:w-8 h-6 sm:h-8 text-muted-foreground" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">No destinations found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters to see more results.
            </p>
          </div>
        )}
      </div>

      {/* Holographic Popup */}
      {hoveredDestination && (
        <div
          className="fixed z-[100] holographic-popup rounded-2xl shadow-2xl p-4 sm:p-5 w-72 sm:w-80 pointer-events-none"
          style={{
            left: Math.min(Math.max(popupPosition.x - 144, 16), window.innerWidth - 320),
            top: Math.max(popupPosition.y - 260, 16),
          }}
        >
          <div className="relative z-10">
            <h4 className="font-semibold text-base sm:text-lg mb-2">{hoveredDestination.name}</h4>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
              {hoveredDestination.elevation && (
                <div className="bg-muted/50 rounded-lg p-2">
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground mb-1">
                    <Mountain className="w-3 h-3" />
                    Elevation
                  </div>
                  <div className="text-xs sm:text-sm font-medium">{hoveredDestination.elevation}</div>
                </div>
              )}
              
              <div className="bg-muted/50 rounded-lg p-2">
                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground mb-1">
                  <Thermometer className="w-3 h-3" />
                  Temperature
                </div>
                <div className="text-xs sm:text-sm font-medium">{hoveredDestination.temperature}°C</div>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-2">
                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground mb-1">
                  <Wind className="w-3 h-3" />
                  Weather
                </div>
                <div className="text-xs sm:text-sm font-medium">{hoveredDestination.weatherCondition}</div>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-2">
                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground mb-1">
                  <Calendar className="w-3 h-3" />
                  Best Time
                </div>
                <div className="text-xs sm:text-sm font-medium">
                  {hoveredDestination.bestMonths.slice(0, 2).join(', ')}
                </div>
              </div>
            </div>
            
            {/* Cultural Significance */}
            <div className="border-t border-border/50 pt-2 sm:pt-3">
              <div className="text-[10px] sm:text-xs text-muted-foreground mb-1">Cultural Significance</div>
              <p className="text-xs sm:text-sm line-clamp-3">{hoveredDestination.culturalSignificance}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
