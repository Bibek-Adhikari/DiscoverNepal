import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
import { Button } from '@/components/ui/button';
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
  Filter,
  Grid3X3,
  List,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

const categoryIcons: Record<DestinationCategory, typeof MapPin> = {
  'Heritage Sites': Church,
  'Trekking Routes': Mountain,
  'Wildlife': Palmtree,
  'Spiritual Centers': Compass,
  'Adventure Sports': Bike,
  'Cultural Villages': Home,
};

const CATEGORIES: DestinationCategory[] = [
  'Heritage Sites',
  'Trekking Routes',
  'Wildlife',
  'Spiritual Centers',
  'Adventure Sports',
  'Cultural Villages',
];

interface TerritoryExplorerProps {
  sectionRef?: React.RefObject<HTMLElement | null>;
}

export function TerritoryExplorer({ sectionRef }: TerritoryExplorerProps) {
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hoveredDestination, setHoveredDestination] = useState<Destination | null>(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const { provinces, destinations, isLoading } = useData();

  const internalRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const ref = sectionRef || internalRef;
  const popupRef = useRef<HTMLDivElement>(null);

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
  }, [selectedProvince, selectedDistrict, selectedCategory, destinations]);

  // Check if any filters are active
  const hasActiveFilters = selectedProvince !== 'all' || selectedDistrict !== 'all' || selectedCategory !== 'all';

  // Reset district when province changes
  useEffect(() => {
    setSelectedDistrict('all');
  }, [selectedProvince]);

  // Scroll animation with staggered grid items
  useEffect(() => {
    const section = ref.current;
    if (!section || isLoading) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        '.explorer-header',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Filters animation
      gsap.fromTo(
        '.explorer-filters',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: 0.2,
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
  }, [ref, isLoading]);

  // Animate grid items when they change
  useEffect(() => {
    if (!gridRef.current || isLoading) return;

    const items = gridRef.current.querySelectorAll('.destination-card');
    
    gsap.fromTo(
      items,
      { y: 30, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power2.out',
      }
    );
  }, [filteredDestinations, isLoading, viewMode]);

  // Handle mouse enter with debounced popup positioning
  const handleMouseEnter = useCallback((dest: Destination, e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const popupWidth = 320;
    const popupHeight = 280;
    
    // Calculate position to keep popup within viewport
    let x = rect.left + rect.width / 2 - popupWidth / 2;
    let y = rect.top - popupHeight - 16;
    
    // Boundary checks
    x = Math.max(16, Math.min(x, window.innerWidth - popupWidth - 16));
    y = Math.max(16, y);
    
    setPopupPosition({ x, y });
    setHoveredDestination(dest);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredDestination(null);
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSelectedProvince('all');
    setSelectedDistrict('all');
    setSelectedCategory('all');
  }, []);

  // Get active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedProvince !== 'all') count++;
    if (selectedDistrict !== 'all') count++;
    if (selectedCategory !== 'all') count++;
    return count;
  }, [selectedProvince, selectedDistrict, selectedCategory]);

  // Selected province name for display
  const selectedProvinceName = useMemo(() => {
    if (selectedProvince === 'all') return null;
    return provinces.find(p => p.id === selectedProvince)?.name;
  }, [selectedProvince, provinces]);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative w-full min-h-screen py-20 lg:py-32 bg-background overflow-hidden"
      aria-label="Territory Explorer"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF5A3C]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="explorer-header text-center mb-10 lg:mb-14">
          <span className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.25em] text-[#FF5A3C] uppercase mb-4">
            <Sparkles className="w-4 h-4" />
            Territory Explorer
            <Sparkles className="w-4 h-4" />
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight font-space-grotesk">
            Find Your Next
            <span className="block sm:inline bg-gradient-to-r from-[#FF5A3C] via-orange-400 to-[#FF8C5A] bg-clip-text text-transparent">
              {' '}Adventure
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Explore Nepal&apos;s diverse landscapes and cultures through our interactive territory filter.
            Select a province, district, or category to discover your perfect destination.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="explorer-filters mb-8">
          {/* Desktop Filters */}
          <div className="hidden md:flex flex-wrap items-center justify-center gap-3">
            {/* Province Select */}
            <Select value={selectedProvince} onValueChange={setSelectedProvince}>
              <SelectTrigger className="w-[200px] bg-background/80 backdrop-blur-sm border-2 border-border hover:border-[#FF5A3C]/30 transition-all">
                <MapPin className="w-4 h-4 mr-2 text-[#FF5A3C]" />
                <SelectValue placeholder="All Provinces" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="all">All Provinces</SelectItem>
                {provinces.map((province) => (
                  <SelectItem key={province.id} value={province.id}>
                    {province.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* District Select */}
            <Select value={selectedDistrict} onValueChange={setSelectedDistrict} disabled={selectedProvince === 'all'}>
              <SelectTrigger className={cn(
                "w-[200px] bg-background/80 backdrop-blur-sm border-2 transition-all",
                selectedProvince === 'all' ? 'opacity-50' : 'hover:border-[#FF5A3C]/30'
              )}>
                <Compass className="w-4 h-4 mr-2 text-[#FF5A3C]" />
                <SelectValue placeholder="All Districts" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
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
              <SelectTrigger className="w-[200px] bg-background/80 backdrop-blur-sm border-2 border-border hover:border-[#FF5A3C]/30 transition-all">
                <Tent className="w-4 h-4 mr-2 text-[#FF5A3C]" />
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-[#FF5A3C] hover:bg-[#FF5A3C]/10"
              >
                <X className="w-4 h-4 mr-2" />
                Clear {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </Button>
            )}

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 ml-4 border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 w-8 p-0"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8 w-8 p-0"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Filters */}
          <div className="md:hidden">
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            >
              <span className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="bg-[#FF5A3C] text-white text-xs rounded-full px-2 py-0.5">
                    {activeFiltersCount}
                  </span>
                )}
              </span>
              <span className="text-xs text-muted-foreground">
                {filteredDestinations.length} results
              </span>
            </Button>

            {isFiltersOpen && (
              <div className="mt-4 space-y-3 p-4 bg-muted/50 rounded-xl border border-border/50">
                <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                  <SelectTrigger>
                    <MapPin className="w-4 h-4 mr-2 text-[#FF5A3C]" />
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

                <Select value={selectedDistrict} onValueChange={setSelectedDistrict} disabled={selectedProvince === 'all'}>
                  <SelectTrigger className={selectedProvince === 'all' ? 'opacity-50' : ''}>
                    <Compass className="w-4 h-4 mr-2 text-[#FF5A3C]" />
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

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <Tent className="w-4 h-4 mr-2 text-[#FF5A3C]" />
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    className="w-full text-[#FF5A3C]"
                    onClick={clearFilters}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear All Filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            {selectedProvince !== 'all' && (
              <Badge variant="secondary" className="gap-1 pl-3 pr-2 py-1.5">
                {selectedProvinceName}
                <button onClick={() => setSelectedProvince('all')} className="ml-1 hover:bg-muted rounded-full p-0.5">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {selectedDistrict !== 'all' && (
              <Badge variant="secondary" className="gap-1 pl-3 pr-2 py-1.5">
                {availableDistricts.find(d => d.id === selectedDistrict)?.name}
                <button onClick={() => setSelectedDistrict('all')} className="ml-1 hover:bg-muted rounded-full p-0.5">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {selectedCategory !== 'all' && (
              <Badge 
                variant="secondary" 
                className="gap-1 pl-3 pr-2 py-1.5"
                style={{ 
                  backgroundColor: `${categoryColors[selectedCategory as DestinationCategory]}15`,
                  color: categoryColors[selectedCategory as DestinationCategory],
                  borderColor: `${categoryColors[selectedCategory as DestinationCategory]}30`,
                }}
              >
                {selectedCategory}
                <button onClick={() => setSelectedCategory('all')} className="ml-1 hover:bg-muted/50 rounded-full p-0.5">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="text-center mb-6">
          <span className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground text-lg">{filteredDestinations.length}</span> destination{filteredDestinations.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Destination Grid */}
        <div 
          ref={gridRef}
          className={cn(
            "grid gap-4 sm:gap-6",
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1 max-w-3xl mx-auto'
          )}
        >
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-border/50 bg-card">
                  <Skeleton className="w-full h-48" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))
            : filteredDestinations.map((destination) => {
                const CategoryIcon = categoryIcons[destination.category] || MapPin;
                const isHovered = hoveredDestination?.id === destination.id;
                
                return (
                  <div
                    key={destination.id}
                    className={cn(
                      "destination-card group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300",
                      "border border-border/50 bg-card hover:border-[#FF5A3C]/30 hover:shadow-xl",
                      viewMode === 'grid' ? 'hover:-translate-y-1' : 'flex flex-row items-center',
                      isHovered && "ring-2 ring-[#FF5A3C]/20"
                    )}
                    onMouseEnter={(e) => handleMouseEnter(destination, e)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {/* Image */}
                    <div className={cn(
                      "relative overflow-hidden",
                      viewMode === 'grid' ? 'h-44 sm:h-48' : 'w-32 sm:w-48 h-32 sm:h-40 flex-shrink-0'
                    )}>
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Category Badge */}
                      <Badge
                        className="absolute top-3 left-3 text-[10px] sm:text-xs font-medium"
                        style={{
                          backgroundColor: `${categoryColors[destination.category]}20`,
                          color: categoryColors[destination.category],
                          borderColor: `${categoryColors[destination.category]}40`,
                        }}
                        variant="outline"
                      >
                        <CategoryIcon className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">{destination.category}</span>
                      </Badge>

                      {/* Temperature */}
                      <div className="absolute top-3 right-3 flex items-center gap-1 text-white text-[10px] sm:text-xs bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
                        <Thermometer className="w-3 h-3" />
                        {destination.temperature}°C
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1">
                      <h3 className="font-semibold text-base sm:text-lg mb-1 group-hover:text-[#FF5A3C] transition-colors line-clamp-1">
                        {destination.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {destination.description}
                      </p>
                      
                      {/* Meta Info */}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {destination.elevation && (
                          <div className="flex items-center gap-1">
                            <Mountain className="w-3 h-3" />
                            <span>{destination.elevation}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{destination.bestMonths[0]}</span>
                        </div>
                      </div>

                      {/* List View Extra */}
                      {viewMode === 'list' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="mt-3 text-[#FF5A3C] hover:bg-[#FF5A3C]/10 p-0 h-auto font-medium"
                        >
                          Explore Details
                          <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
        </div>

        {/* Empty State */}
        {!isLoading && filteredDestinations.length === 0 && (
          <div className="text-center py-16 px-4">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center relative">
              <MapPin className="w-8 h-8 text-muted-foreground" />
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-muted-foreground/30 animate-spin-slow" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No destinations found</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
              We couldn&apos;t find any destinations matching your current filters. 
              Try adjusting your criteria or clear all filters to see everything.
            </p>
            <Button 
              onClick={clearFilters}
              variant="outline"
              className="border-[#FF5A3C]/30 text-[#FF5A3C] hover:bg-[#FF5A3C]/10"
            >
              <X className="w-4 h-4 mr-2" />
              Clear All Filters
            </Button>
          </div>
        )}
      </div>

      {/* Enhanced Popup */}
      {hoveredDestination && (
        <div
          ref={popupRef}
          className="fixed z-[100] rounded-2xl shadow-2xl overflow-hidden pointer-events-none animate-in fade-in zoom-in-95 duration-200"
          style={{
            left: popupPosition.x,
            top: popupPosition.y,
            width: '280px',
          }}
        >
          {/* Popup Image */}
          <div className="relative h-32 overflow-hidden">
            <img
              src={hoveredDestination.image}
              alt={hoveredDestination.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <Badge
              className="absolute top-2 left-2 text-[10px]"
              style={{
                backgroundColor: categoryColors[hoveredDestination.category],
                color: '#fff',
              }}
            >
              {hoveredDestination.category}
            </Badge>
            <h4 className="absolute bottom-2 left-3 right-3 text-white font-semibold text-lg truncate">
              {hoveredDestination.name}
            </h4>
          </div>

          {/* Popup Content */}
          <div className="p-4 bg-card border-x border-b border-border/50 rounded-b-2xl">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              {hoveredDestination.elevation && (
                <div className="bg-muted/50 rounded-lg p-2.5">
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1">
                    <Mountain className="w-3 h-3 text-[#FF5A3C]" />
                    Elevation
                  </div>
                  <div className="text-sm font-semibold">{hoveredDestination.elevation}</div>
                </div>
              )}
              
              <div className="bg-muted/50 rounded-lg p-2.5">
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1">
                  <Thermometer className="w-3 h-3 text-[#FF5A3C]" />
                  Temperature
                </div>
                <div className="text-sm font-semibold">{hoveredDestination.temperature}°C</div>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-2.5">
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1">
                  <Wind className="w-3 h-3 text-[#FF5A3C]" />
                  Weather
                </div>
                <div className="text-sm font-semibold">{hoveredDestination.weatherCondition}</div>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-2.5">
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1">
                  <Calendar className="w-3 h-3 text-[#FF5A3C]" />
                  Best Time
                </div>
                <div className="text-sm font-semibold truncate">
                  {hoveredDestination.bestMonths.slice(0, 2).join(', ')}
                </div>
              </div>
            </div>
            
            {/* Cultural Significance */}
            <div className="border-t border-border/50 pt-3">
              <div className="text-[10px] text-[#FF5A3C] uppercase tracking-wider font-semibold mb-1.5">
                Cultural Significance
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                {hoveredDestination.culturalSignificance}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}