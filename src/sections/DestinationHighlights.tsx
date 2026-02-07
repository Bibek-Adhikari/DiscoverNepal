import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, MapPin, Mountain, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

interface Highlight {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  stats: { label: string; value: string }[];
  image: string;
  cta: string;
  layout: 'left' | 'right';
}

const highlights: Highlight[] = [
  {
    id: 'annapurna',
    title: 'Annapurna',
    subtitle: 'FEATURED STORY',
    description: 'High-altitude trails, teahouse warmth, and sunrise over the world\'s tenth-highest peak. The Annapurna Circuit offers one of the most diverse trekking experiences on Earth.',
    stats: [
      { label: 'Best Season', value: 'Mar–May, Oct–Nov' },
      { label: 'Difficulty', value: 'Moderate to Challenging' },
    ],
    image: '/annapurna-trekker.jpg',
    cta: 'Read the story',
    layout: 'left',
  },
  {
    id: 'kathmandu',
    title: 'Kathmandu Valley',
    subtitle: 'HERITAGE HIGHLIGHT',
    description: 'A living museum of temples, stupas, and carved wooden streets—where festivals turn alleys into processions. Seven UNESCO World Heritage Sites within 15 kilometers.',
    stats: [
      { label: 'UNESCO Sites', value: '7' },
      { label: 'Within', value: '15 km radius' },
    ],
    image: '/kathmandu-stupa.jpg',
    cta: 'Explore the valley',
    layout: 'right',
  },
  {
    id: 'pokhara',
    title: 'Pokhara',
    subtitle: 'ADVENTURE CAPITAL',
    description: 'Morning mists on Phewa Lake, paragliders above Sarangkot, and trails that lead straight to the Annapurna sanctuary. The city where mountains meet the water.',
    stats: [
      { label: 'Elevation', value: '822 m' },
      { label: 'Activities', value: '15+' },
    ],
    image: '/pokhara-lake.jpg',
    cta: 'See activities',
    layout: 'left',
  },
  {
    id: 'chitwan',
    title: 'Chitwan',
    subtitle: 'WILDLIFE SANCTUARY',
    description: 'Jungle safaris, river canoes, and the quiet thrill of spotting rhinos and elephants in the Terai grasslands. Home to the endangered Bengal tiger.',
    stats: [
      { label: 'Area', value: '932 sq km' },
      { label: 'Species', value: '700+' },
    ],
    image: '/chitwan-elephant.jpg',
    cta: 'Plan a safari',
    layout: 'right',
  },
  {
    id: 'everest',
    title: 'Everest',
    subtitle: 'THE ROOF OF THE WORLD',
    description: 'Whether you trek to base camp or fly over the range, the highest point on Earth changes your sense of scale. A journey that transforms perspectives.',
    stats: [
      { label: 'Elevation', value: '8,849 m' },
      { label: 'Summit Temp', value: '-20°C to -35°C' },
    ],
    image: '/everest-summit.jpg',
    cta: 'View routes',
    layout: 'left',
  },
  {
    id: 'langtang',
    title: 'Langtang',
    subtitle: 'HIDDEN VALLEY',
    description: 'A valley of glaciers, yak pastures, and Tamang villages—accessible, authentic, and less traveled. Experience the Himalayas without the crowds.',
    stats: [
      { label: 'Trek Duration', value: '4–7 days' },
      { label: 'Lodging', value: 'Tea-house' },
    ],
    image: '/langtang-valley.jpg',
    cta: 'See itinerary',
    layout: 'right',
  },
  {
    id: 'bhaktapur',
    title: 'Bhaktapur',
    subtitle: 'MEDIEVAL CITY',
    description: 'Pottery squares, hidden courtyards, and Newari architecture that survived centuries. The best-preserved medieval city in the Kathmandu Valley.',
    stats: [
      { label: 'Founded', value: '12th century' },
      { label: 'Palaces', value: '4' },
    ],
    image: '/bhaktapur-temple.jpg',
    cta: 'Explore heritage',
    layout: 'left',
  },
  {
    id: 'lumbini',
    title: 'Lumbini',
    subtitle: 'SPIRITUAL BIRTHPLACE',
    description: 'Walk the gardens where history and contemplation meet—monasteries, ponds, and the sacred Bodhi tree. The birthplace of Lord Buddha.',
    stats: [
      { label: 'Temples', value: '25+' },
      { label: 'Countries', value: '15' },
    ],
    image: '/lumbini-garden.jpg',
    cta: 'Plan a visit',
    layout: 'right',
  },
  {
    id: 'mustang',
    title: 'Mustang',
    subtitle: 'FORBIDDEN KINGDOM',
    description: 'Wind-carved canyons, cliff caves, and a landscape that feels like another planet—guarded by the Annapurna rain shadow. The last bastion of Tibetan culture.',
    stats: [
      { label: 'Region', value: 'Upper Mustang' },
      { label: 'Permit', value: 'Required' },
    ],
    image: '/mustang-canyon.jpg',
    cta: 'Check permits',
    layout: 'left',
  },
];

export function DestinationHighlights() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const sections = container.querySelectorAll('.highlight-section');
      
      sections.forEach((section) => {
        const photoCard = section.querySelector('.photo-card');
        const textCard = section.querySelector('.text-card');
        const statTile = section.querySelector('.stat-tile');
        const headline = section.querySelector('.headline');

        gsap.fromTo(
          [photoCard, textCard, statTile, headline],
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full z-20 bg-background">
      {/* Section Header */}
      <div className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 xl:px-12 text-center">
        <span className="font-mono text-xs tracking-[0.2em] text-[#FF5A3C] uppercase">
          Featured Destinations
        </span>
        <h2 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight font-['Space_Grotesk']">
          Explore Nepal&apos;s
          <span className="text-gradient-sunrise"> Treasures</span>
        </h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          From the world&apos;s highest peaks to ancient temples, discover the diverse landscapes and rich culture of Nepal.
        </p>
      </div>

      {/* Highlights */}
      {highlights.map((highlight) => (
        <section
          key={highlight.id}
          className="highlight-section relative w-full min-h-screen flex items-center justify-center py-12 lg:py-20 px-4 sm:px-6 lg:px-8 xl:px-12"
        >
          <div className={`relative w-full max-w-7xl flex flex-col ${highlight.layout === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-6 lg:gap-10`}>
            {/* Photo Card */}
            <div className="photo-card relative w-full lg:w-[55%] aspect-[4/3] lg:aspect-[16/10] rounded-[24px] lg:rounded-[28px] overflow-hidden shadow-2xl">
              <img
                src={highlight.image}
                alt={highlight.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* Micro Label */}
              <div className="absolute top-4 lg:top-6 left-4 lg:left-6">
                <span className="font-mono text-[9px] lg:text-[10px] tracking-[0.2em] text-white/80 uppercase">
                  {highlight.subtitle}
                </span>
              </div>

              {/* Stat Tile */}
              <div className="stat-tile absolute bottom-4 lg:bottom-6 left-4 lg:left-6 bg-white/95 dark:bg-black/80 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-4 max-w-[160px] lg:max-w-[200px]">
                <div className="space-y-1 lg:space-y-2">
                  {highlight.stats.map((stat, i) => (
                    <div key={i}>
                      <div className="text-[9px] lg:text-[10px] text-muted-foreground uppercase tracking-wider">
                        {stat.label}
                      </div>
                      <div className="text-xs lg:text-sm font-semibold">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Text Card */}
            <div className="text-card w-full lg:w-[45%] bg-card rounded-[24px] lg:rounded-[28px] p-6 lg:p-10 shadow-lg border border-border/50">
              <h2 className="headline text-2xl sm:text-3xl lg:text-5xl font-bold tracking-tight font-['Space_Grotesk'] mb-3 lg:mb-4">
                {highlight.title}
              </h2>

              <p className="text-muted-foreground text-sm lg:text-base leading-relaxed mb-4 lg:mb-6">
                {highlight.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 lg:gap-4 mb-5 lg:mb-6">
                <div className="flex items-center gap-1.5 lg:gap-2 text-xs text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                  <span>Nepal</span>
                </div>
                <div className="flex items-center gap-1.5 lg:gap-2 text-xs text-muted-foreground">
                  <Mountain className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                  <span>Himalayas</span>
                </div>
                <div className="flex items-center gap-1.5 lg:gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                  <span>Year-round</span>
                </div>
              </div>

              <Button className="btn-coral-outline text-sm">
                {highlight.cta}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
