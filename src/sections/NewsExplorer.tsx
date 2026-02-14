import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Search, 
  Calendar, 
  ExternalLink, 
  Newspaper, 
  Loader2,
  Filter,
  TrendingUp,
  MapPin,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { destinations } from '@/data/nepalData';
// Theme context not needed currently

gsap.registerPlugin(ScrollTrigger);

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
  imageUrl?: string;
  category?: string;
}

interface NewsExplorerProps {
  sectionRef?: React.RefObject<HTMLElement | null>;
}

// Simulated news data for Nepal destinations
const mockNewsData: Record<string, NewsArticle[]> = {
  'everest': [
    {
      title: 'New Route Opened to Everest Base Camp for 2024 Season',
      description: 'Nepal Tourism Board announces improved trekking infrastructure with new eco-friendly lodges along the popular route.',
      url: '#',
      publishedAt: '2024-01-15',
      source: 'Nepal Tourism News',
      category: 'Trekking'
    },
    {
      title: 'Record Number of Climbers Summit Everest This Spring',
      description: 'Over 500 climbers from 45 countries successfully reached the world\'s highest peak this season.',
      url: '#',
      publishedAt: '2024-01-12',
      source: 'Himalayan Times',
      category: 'Adventure'
    },
    {
      title: 'Everest Region Implements New Waste Management System',
      description: 'Sagarmatha National Park introduces mandatory waste carry-back policy for all expeditions.',
      url: '#',
      publishedAt: '2024-01-08',
      source: 'Eco Nepal',
      category: 'Environment'
    }
  ],
  'annapurna': [
    {
      title: 'Annapurna Circuit Named World\'s Best Trek by Travel Magazine',
      description: 'The iconic trek receives international recognition for its diverse landscapes and cultural experiences.',
      url: '#',
      publishedAt: '2024-01-14',
      source: 'Travel Weekly',
      category: 'Awards'
    },
    {
      title: 'New Tea Houses Open on Annapurna Trail',
      description: 'Local entrepreneurs invest in sustainable accommodation options for trekkers.',
      url: '#',
      publishedAt: '2024-01-10',
      source: 'Nepal Business Review',
      category: 'Business'
    },
    {
      title: 'Annapurna Conservation Area Reports Increased Wildlife Sightings',
      description: 'Snow leopard and red panda populations show positive growth trends.',
      url: '#',
      publishedAt: '2024-01-05',
      source: 'Wildlife Nepal',
      category: 'Wildlife'
    }
  ],
  'kathmandu': [
    {
      title: 'Kathmandu Valley Heritage Sites Receive UNESCO Funding',
      description: 'Major restoration projects announced for earthquake-damaged monuments in the valley.',
      url: '#',
      publishedAt: '2024-01-16',
      source: 'Heritage Today',
      category: 'Heritage'
    },
    {
      title: 'New Direct Flights Connect Kathmandu to European Cities',
      description: 'Nepal Airlines expands international routes with direct connections to Frankfurt and Paris.',
      url: '#',
      publishedAt: '2024-01-11',
      source: 'Aviation Nepal',
      category: 'Transport'
    },
    {
      title: 'Kathmandu\'s Thamel District Transforms into Pedestrian Zone',
      description: 'Major urban renewal project creates vehicle-free zone in tourist hub.',
      url: '#',
      publishedAt: '2024-01-07',
      source: 'City News',
      category: 'Urban'
    }
  ],
  'pokhara': [
    {
      title: 'Pokhara International Airport Completes Expansion',
      description: 'New terminal increases capacity to handle 2 million passengers annually.',
      url: '#',
      publishedAt: '2024-01-13',
      source: 'Infrastructure Nepal',
      category: 'Development'
    },
    {
      title: 'Paragliding World Cup Returns to Pokhara',
      description: 'International competition draws pilots from 30 countries to the adventure capital.',
      url: '#',
      publishedAt: '2024-01-09',
      source: 'Sports Nepal',
      category: 'Sports'
    },
    {
      title: 'Phewa Lake Cleanup Drive Removes 50 Tons of Waste',
      description: 'Community-led initiative restores water quality in iconic lake.',
      url: '#',
      publishedAt: '2024-01-04',
      source: 'Environment Nepal',
      category: 'Environment'
    }
  ],
  'chitwan': [
    {
      title: 'Chitwan National Park Celebrates 50 Years of Conservation',
      description: 'Golden jubilee events highlight success in protecting endangered species.',
      url: '#',
      publishedAt: '2024-01-15',
      source: 'Conservation Nepal',
      category: 'Conservation'
    },
    {
      title: 'Tiger Population in Chitwan Reaches 128',
      description: 'Latest census shows 15% increase in Bengal tiger numbers.',
      url: '#',
      publishedAt: '2024-01-11',
      source: 'Wildlife Today',
      category: 'Wildlife'
    },
    {
      title: 'New Elephant Breeding Center Opens in Chitwan',
      description: 'Facility aims to support conservation of Asian elephants in Nepal.',
      url: '#',
      publishedAt: '2024-01-06',
      source: 'Animal Welfare Nepal',
      category: 'Wildlife'
    }
  ],
  'lumbini': [
    {
      title: 'Lumbini Master Plan 2040 Unveiled',
      description: 'Ambitious development plan aims to make Lumbini a global spiritual destination.',
      url: '#',
      publishedAt: '2024-01-14',
      source: 'Buddhist News',
      category: 'Development'
    },
    {
      title: 'International Buddhist Conference to be Held in Lumbini',
      description: 'Over 5,000 delegates expected at the week-long spiritual gathering.',
      url: '#',
      publishedAt: '2024-01-10',
      source: 'Religion Today',
      category: 'Events'
    },
    {
      title: 'New Monastery Inaugurated in Lumbini Sacred Garden',
      description: 'Vietnamese Buddhist community donates $2M for temple construction.',
      url: '#',
      publishedAt: '2024-01-05',
      source: 'Sacred Sites',
      category: 'Religion'
    }
  ],
  'mustang': [
    {
      title: 'Upper Mustang Opens for Independent Trekkers',
      description: 'Nepal government relaxes permit requirements for restricted area.',
      url: '#',
      publishedAt: '2024-01-13',
      source: 'Trekking Nepal',
      category: 'Trekking'
    },
    {
      title: 'Ancient Caves in Mustang Reveal New Buddhist Artifacts',
      description: 'Archaeological survey discovers 1,000-year-old manuscripts.',
      url: '#',
      publishedAt: '2024-01-08',
      source: 'Archaeology Today',
      category: 'Heritage'
    },
    {
      title: 'Mustang Apple Festival Attracts Record Visitors',
      description: 'Annual harvest celebration showcases region\'s organic produce.',
      url: '#',
      publishedAt: '2024-01-03',
      source: 'Rural Nepal',
      category: 'Culture'
    }
  ],
  'langtang': [
    {
      title: 'Langtang Valley Trail Fully Restored After Earthquake',
      description: 'Reconstruction completes eight years after devastating 2015 earthquake.',
      url: '#',
      publishedAt: '2024-01-12',
      source: 'Reconstruction Nepal',
      category: 'Infrastructure'
    },
    {
      title: 'New Research Station Opens in Langtang National Park',
      description: 'Facility will study climate change impacts on Himalayan glaciers.',
      url: '#',
      publishedAt: '2024-01-07',
      source: 'Science Nepal',
      category: 'Research'
    },
    {
      title: 'Langtang Trekking Permits Increase by 40%',
      description: 'Growing popularity of quieter alternative to Everest and Annapurna routes.',
      url: '#',
      publishedAt: '2024-01-02',
      source: 'Tourism Stats',
      category: 'Tourism'
    }
  ],
  'bhaktapur': [
    {
      title: 'Bhaktapur Durbar Square Restoration Wins International Award',
      description: 'UNESCO recognizes excellence in heritage conservation efforts.',
      url: '#',
      publishedAt: '2024-01-16',
      source: 'Heritage Awards',
      category: 'Awards'
    },
    {
      title: 'Pottery Square in Bhaktapur Gets Modern Kiln Facility',
      description: 'New technology helps preserve traditional Newari pottery craft.',
      url: '#',
      publishedAt: '2024-01-09',
      source: 'Craft Nepal',
      category: 'Culture'
    },
    {
      title: 'Bhaktapur Implements Tourist Entry Management System',
      description: 'Digital ticketing reduces queues at heritage site entrances.',
      url: '#',
      publishedAt: '2024-01-04',
      source: 'Smart City Nepal',
      category: 'Technology'
    }
  ],
  'default': [
    {
      title: 'Nepal Tourism Reaches Pre-Pandemic Levels',
      description: 'Over 1 million international tourists visited Nepal in 2023.',
      url: '#',
      publishedAt: '2024-01-15',
      source: 'Nepal Tourism Board',
      category: 'Tourism'
    },
    {
      title: 'Nepal Government Announces New Tourism Strategy',
      description: 'Focus on sustainable tourism and community-based initiatives.',
      url: '#',
      publishedAt: '2024-01-12',
      source: 'Government News',
      category: 'Policy'
    },
    {
      title: 'Himalayan Airlines Adds New International Routes',
      description: 'Direct flights to Tokyo, Seoul, and Sydney announced for 2024.',
      url: '#',
      publishedAt: '2024-01-10',
      source: 'Aviation News',
      category: 'Transport'
    },
    {
      title: 'Nepal\'s Community Homestay Program Wins Global Recognition',
      description: 'Initiative empowers rural communities through tourism.',
      url: '#',
      publishedAt: '2024-01-08',
      source: 'Rural Development',
      category: 'Community'
    },
    {
      title: 'New Trekking Trails Discovered in Eastern Nepal',
      description: 'Unexplored routes offer alternative to popular tourist circuits.',
      url: '#',
      publishedAt: '2024-01-05',
      source: 'Adventure Nepal',
      category: 'Trekking'
    },
    {
      title: 'Nepal\'s First Cable Car in Remote District Begins Operation',
      description: 'New infrastructure improves access to mountain communities.',
      url: '#',
      publishedAt: '2024-01-03',
      source: 'Infrastructure Nepal',
      category: 'Development'
    }
  ]
};

export function NewsExplorer({ sectionRef }: NewsExplorerProps) {
  const internalRef = useRef<HTMLElement>(null);
  const ref = sectionRef || internalRef;
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>(mockNewsData.default);

  // Scroll animation
  useEffect(() => {
    const section = ref.current;
    const content = contentRef.current;

    if (!section || !content) return;

    let ctx: gsap.Context;
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        // Clear existing ScrollTriggers
        ScrollTrigger.getAll().forEach(t => {
          if (t.trigger === section) t.kill();
        });

        // Forced visibility safety catch - select all elements that should be animated
        const animElements = [
          '.news-header',
          '.news-search',
          '.news-results-count',
          '.news-grid',
          '.news-load-more'
        ];
        gsap.set(animElements, { visibility: 'visible', opacity: 1 });

        gsap.from(content.children, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });

        ScrollTrigger.refresh();
      }, section);
    }, 100);

    return () => {
      clearTimeout(timer);
      ctx?.revert();
    };
  }, [ref]);

  // Filter articles based on search and filters
  useEffect(() => {
    let articles = [...mockNewsData.default];

    if (selectedDestination !== 'all') {
      const destNews = mockNewsData[selectedDestination];
      if (destNews) {
        articles = [...destNews, ...articles];
      }
    }

    if (selectedCategory !== 'all') {
      articles = articles.filter(a => a.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      articles = articles.filter(
        a =>
          a.title.toLowerCase().includes(query) ||
          a.description.toLowerCase().includes(query)
      );
    }

    // Remove duplicates
    const unique = articles.filter(
      (item, index, self) => index === self.findIndex(t => t.title === item.title)
    );

    setFilteredArticles(unique);
  }, [searchQuery, selectedDestination, selectedCategory]);

  const handleSearch = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  const categories = ['Tourism', 'Trekking', 'Wildlife', 'Heritage', 'Development', 'Environment', 'Culture'];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative w-full py-20 lg:py-32 z-20 bg-background"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12" ref={contentRef}>
        {/* Header */}
        <div className="news-header text-center mb-12">
          <span className="font-mono text-xs tracking-[0.2em] text-[#FF5A3C] uppercase">
            Stay Informed
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight font-['Space_Grotesk']">
            Nepal Travel
            <span className="text-gradient-sunrise"> News</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Search for the latest news about Nepal&apos;s destinations. Stay updated on trekking routes, 
            heritage sites, wildlife, and travel developments.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="news-search max-w-4xl mx-auto mb-10">
          <div className="card-nepal p-4 sm:p-6">
            {/* Search Input */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search news about Nepal destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-12 h-12 rounded-xl border-0 bg-muted/50 focus:bg-background focus:ring-2 focus:ring-[#FF5A3C]/20"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={isLoading}
                className="btn-coral h-12 px-6"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="w-4 h-4" />
                <span>Filter by:</span>
              </div>

              {/* Destination Filter */}
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="px-3 py-2 rounded-lg bg-muted/50 text-sm border-0 focus:ring-2 focus:ring-[#FF5A3C]/20 cursor-pointer"
              >
                <option value="all">All Destinations</option>
                {destinations.map((dest) => (
                  <option key={dest.id} value={dest.id}>
                    {dest.name}
                  </option>
                ))}
              </select>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-lg bg-muted/50 text-sm border-0 focus:ring-2 focus:ring-[#FF5A3C]/20 cursor-pointer"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Clear Filters */}
              {(selectedDestination !== 'all' || selectedCategory !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedDestination('all');
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="flex items-center gap-1 text-sm text-[#FF5A3C] hover:underline"
                >
                  <X className="w-3 h-3" />
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="news-results-count max-w-4xl mx-auto mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Found <span className="font-semibold text-foreground">{filteredArticles.length}</span> articles
            </span>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span>Trending Now</span>
            </div>
          </div>
        </div>

        {/* News Grid */}
        <div className="news-grid max-w-4xl mx-auto grid gap-4">
          {isLoading ? (
            // Loading Skeletons
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card-nepal p-5 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-muted rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))
          ) : filteredArticles.length > 0 ? (
            filteredArticles.map((article, index) => (
              <article
                key={index}
                className="group card-nepal p-5 hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => window.open(article.url, '_blank')}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Image Placeholder */}
                  <div className="w-full sm:w-32 h-32 bg-gradient-to-br from-[#FF5A3C]/10 to-[#FF8C5A]/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:from-[#FF5A3C]/20 group-hover:to-[#FF8C5A]/20 transition-colors">
                    <Newspaper className="w-10 h-10 text-[#FF5A3C]/40" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge
                        variant="outline"
                        className="text-[10px] border-[#FF5A3C]/30 text-[#FF5A3C]"
                      >
                        {article.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(article.publishedAt)}
                      </span>
                    </div>

                    <h3 className="font-semibold text-lg mb-2 group-hover:text-[#FF5A3C] transition-colors line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {article.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {article.source}
                      </span>
                      <span className="text-xs text-[#FF5A3C] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Read More
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))
          ) : (
            // Empty State
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Newspaper className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters to find more results.
              </p>
            </div>
          )}
        </div>

        {/* Load More Button */}
        {!isLoading && filteredArticles.length > 0 && (
          <div className="news-load-more text-center mt-8">
            <Button variant="outline" className="rounded-full px-8">
              Load More Articles
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
