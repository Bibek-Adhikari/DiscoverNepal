import { useState, useRef, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Plus, 
  MapPin, 
  Send, 
  Image as ImageIcon, 
  TrendingUp,
  Globe,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { addDestination, addNewsArticle, uploadImage } from '@/hooks/useNepalData';
import { toast } from 'sonner';

gsap.registerPlugin(ScrollTrigger);

interface AdminDashboardProps {
  sectionRef?: React.RefObject<HTMLElement | null>;
}

export function AdminDashboard({ sectionRef }: AdminDashboardProps) {
  const internalRef = useRef<HTMLElement>(null);
  const ref = sectionRef || internalRef;
  const contentRef = useRef<HTMLDivElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  // Place Form State
  const [placeName, setPlaceName] = useState('');
  const [provinceId, setProvinceId] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [description, setDescription] = useState('');
  const [category] = useState<string>('Heritage Sites');
  const [lat, setLat] = useState<string>('27.7'); // Default to Kathmandu
  const [lng, setLng] = useState<string>('85.3'); // Default to Kathmandu

  // Reset district when province changes
  useEffect(() => {
    setDistrictId('');
  }, [provinceId]);

  // Article Form State
  const [articleTitle, setArticleTitle] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [articleSource, setArticleSource] = useState('');
  const [articleDestinationId, setArticleDestinationId] = useState('');

  // Image states
  const [placeImage, setPlaceImage] = useState<File | null>(null);
  const [placePreview, setPlacePreview] = useState<string | null>(null);
  const [articleImage, setArticleImage] = useState<File | null>(null);
  const [articlePreview, setArticlePreview] = useState<string | null>(null);

  useEffect(() => {
    const section = ref.current;
    const content = contentRef.current;
    if (!section || !content) return;

    let ctx: gsap.Context;
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        // Ensure content is visible as a safety measure
        gsap.set(content, { visibility: 'visible', opacity: 1 });

        gsap.from(content, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }, section);
    }, 100);

    return () => {
      clearTimeout(timer);
      ctx?.revert();
    };
  }, [ref]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'place' | 'article') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'place') {
        setPlaceImage(file);
        setPlacePreview(URL.createObjectURL(file));
      } else {
        setArticleImage(file);
        setArticlePreview(URL.createObjectURL(file));
      }
    }
  };

  const handleAddPlace = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Normalize inputs
    const normalizedProvince = provinceId.toLowerCase().trim();
    const normalizedDistrict = districtId.toLowerCase().trim();

    // Validate inputs
    const isValidProvince = PROVINCES.includes(normalizedProvince);
    const isValidDistrict = DISTRICTS.includes(normalizedDistrict);

    if (!isValidProvince) {
      toast.error(`Invalid Province: "${provinceId}"`, {
        description: `Did you mean "${PROVINCES.find(p => p.startsWith(normalizedProvince.charAt(0))) || 'Bagmati'}"? Please check spelling.`
      });
      return;
    }

    if (!isValidDistrict) {
      toast.error(`Invalid District: "${districtId}"`, {
        description: `Did you mean "${DISTRICTS.find(d => d.startsWith(normalizedDistrict.charAt(0))) || 'Kathmandu'}"? Please check spelling.`
      });
      return;
    }

    console.log('Submitting new place:', { placeName, province: normalizedProvince, district: normalizedDistrict, category });
    setIsSubmitting(true);
    try {
      let imageUrl = '/placeholder-destination.jpg';
      if (placeImage) {
        console.log('Uploading place image...');
        imageUrl = await uploadImage(placeImage, 'destinations');
        console.log('Image uploaded successfully:', imageUrl);
      }

      const newPlace = {
        id: placeName.toLowerCase().replace(/\s+/g, '-'),
        name: placeName,
        province_id: normalizedProvince,
        district_id: normalizedDistrict,
        description,
        category,
        image: imageUrl,
        coordinates: { 
          lat: parseFloat(lat) || 27.7, 
          lng: parseFloat(lng) || 85.3 
        },
        best_months: ['March', 'April', 'October', 'November'],
        cultural_significance: 'Newly added community destination.',
      };

      await addDestination(newPlace);
      
      // Invalidate queries to show new data immediately
      queryClient.invalidateQueries({ queryKey: ['destinations'] });
      queryClient.invalidateQueries({ queryKey: ['recent-destinations'] });
      
      console.log('Destination added successfully!');
      toast.success('Destination added successfully! It will appear on the map in real-time.');
      setPlaceName('');
      setProvinceId('');
      setDistrictId('');
      setDescription('');
      setPlaceImage(null);
      setPlacePreview(null);
      setLat('27.7');
      setLng('85.3');
    } catch (error: any) {
      console.error('Error adding destination:', error);
      if (error.code === '23505') {
        toast.error('This destination already exists!');
      } else {
        toast.error('Failed to add destination: ' + error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting new article:', { articleTitle, articleSource });
    setIsSubmitting(true);
    try {
      let imageUrl = null;
      if (articleImage) {
        console.log('Uploading article image...');
        imageUrl = await uploadImage(articleImage, 'articles');
        console.log('Image uploaded successfully:', imageUrl);
      }

      const newArticle = {
        title: articleTitle,
        description: articleContent,
        source: articleSource,
        published_at: new Date().toISOString(),
        url: '#',
        category: 'Community',
        image_url: imageUrl,
        destination_id: articleDestinationId || null
      };

      await addNewsArticle(newArticle);
      
      // Invalidate news query
      queryClient.invalidateQueries({ queryKey: ['news'] });
      
      console.log('Article shared successfully!');
      toast.success('Opinion shared! Other travelers will see it instantly.');
      setArticleTitle('');
      setArticleContent('');
      setArticleSource('');
      setArticleDestinationId('');
      setArticleImage(null);
      setArticlePreview(null);
    } catch (error: any) {
      console.error('Error sharing opinion:', error);
      toast.error('Failed to share opinion: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contribute-section"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative w-full py-20 lg:py-32 z-20 bg-muted/30 border-t border-border/50"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12" ref={contentRef}>
        <div className="max-w-4xl mx-auto text-center mb-12">
          <span className="font-mono text-xs tracking-[0.2em] text-[#FF5A3C] uppercase">
            Community Contribution
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight font-['Space_Grotesk']">
            Expand the <span className="text-gradient-sunrise">Discovery</span>
          </h2>
          <p className="mt-4 text-muted-foreground mb-8">
            Share hidden gems or your travel experiences with the world. 
            All contributions are synced in real-time.
          </p>

          {/* Sync Data Button */}
          <div className="flex justify-center mb-8">
            <Button 
              variant="outline" 
              size="sm"
              onClick={async () => {
                const { seedSupabaseData } = await import('@/lib/seedData');
                toast.promise(seedSupabaseData(), {
                  loading: 'Syncing static data to Supabase...',
                  success: (data: any) => data.success ? 'Data synced successfully!' : 'Sync failed: ' + data.error,
                  error: 'Error syncing data',
                });
                queryClient.invalidateQueries();
              }}
              className="rounded-full border-[#FF5A3C]/30 text-[#FF5A3C] hover:bg-[#FF5A3C]/10"
            >
              <Globe className="w-4 h-4 mr-2" />
              Sync Static Data to Cloud
            </Button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="place" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-background/50 backdrop-blur-md rounded-2xl border border-border/50 h-auto">
              <TabsTrigger value="place" className="rounded-xl py-3 data-[state=active]:!bg-[#FF5A3C] data-[state=active]:!text-white">
                <MapPin className="w-4 h-4 mr-2" />
                Add a Place
              </TabsTrigger>
              <TabsTrigger value="article" className="rounded-xl py-3 data-[state=active]:!bg-[#FF5A3C] data-[state=active]:!text-white">
                <MessageSquare className="w-4 h-4 mr-2" />
                Share Opinion
              </TabsTrigger>
            </TabsList>

            <TabsContent value="place">
              <div className="card-nepal p-8">
                <form onSubmit={handleAddPlace} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Place Name</label>
                      <Input 
                        placeholder="e.g. Satakshi Dham" 
                        value={placeName}
                        onChange={(e) => setPlaceName(e.target.value)}
                        required
                        className="rounded-xl bg-muted/50 border-0"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Province</label>
                      <Input 
                        placeholder="e.g. Koshi" 
                        value={provinceId}
                        onChange={(e) => setProvinceId(e.target.value)}
                        required
                        className="rounded-xl bg-muted/50 border-0"
                      />
                      <p className="text-xs text-muted-foreground">Type name (e.g. "Bagmati")</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">District</label>
                      <Input 
                        placeholder="e.g. Jhapa" 
                        value={districtId}
                        onChange={(e) => setDistrictId(e.target.value)}
                        required
                        className="rounded-xl bg-muted/50 border-0"
                      />
                      <p className="text-xs text-muted-foreground">Type name (e.g. "Kathmandu")</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Latitude</label>
                      <Input 
                        type="number"
                        step="0.0001"
                        placeholder="27.7000" 
                        value={lat}
                        onChange={(e) => setLat(e.target.value)}
                        required
                        className="rounded-xl bg-muted/50 border-0"
                      />
                      <p className="text-xs text-muted-foreground">e.g. 26.65 for Satakshi</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Longitude</label>
                      <Input 
                        type="number"
                        step="0.0001"
                        placeholder="85.3000" 
                        value={lng}
                        onChange={(e) => setLng(e.target.value)}
                        required
                        className="rounded-xl bg-muted/50 border-0"
                      />
                      <p className="text-xs text-muted-foreground">e.g. 87.85 for Satakshi</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea 
                      placeholder="What makes this place special?" 
                      className="min-h-[120px] rounded-xl bg-muted/50 border-0"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-[#FF5A3C]/5 rounded-xl border border-[#FF5A3C]/10">
                    <div className="space-y-3">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-[#FF5A3C]" />
                        Place Photo
                      </label>
                      <div className="flex items-center gap-4">
                        {placePreview && (
                          <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-[#FF5A3C]/20 shrink-0">
                            <img src={placePreview} className="w-full h-full object-cover" alt="Preview" />
                          </div>
                        )}
                        <Input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleImageChange(e, 'place')}
                          className="rounded-xl bg-background border-border/50 text-xs py-1"
                        />
                      </div>
                    </div>
                    <div className="flex items-end">
                      <Button type="submit" className="w-full btn-coral h-11" disabled={isSubmitting}>
                        {isSubmitting ? 'Adding Place...' : 'Add Destination'}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="article">
              <div className="card-nepal p-8">
                <form onSubmit={handleAddArticle} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Headlines</label>
                    <Input 
                      placeholder="What's the latest news?" 
                      value={articleTitle}
                      onChange={(e) => setArticleTitle(e.target.value)}
                      required
                      className="rounded-xl bg-muted/50 border-0"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Story / Opinion</label>
                    <Textarea 
                      placeholder="Share your experience or news..." 
                      className="min-h-[120px] rounded-xl bg-muted/50 border-0"
                      value={articleContent}
                      onChange={(e) => setArticleContent(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Your Name / Source</label>
                    <Input 
                      placeholder="e.g. Bibek Adhikari" 
                      value={articleSource}
                      onChange={(e) => setArticleSource(e.target.value)}
                      required
                      className="rounded-xl bg-muted/50 border-0"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Related Destination (Optional)</label>
                    <select 
                      className="w-full px-3 py-2 rounded-xl bg-muted/50 border-0 focus:ring-2 focus:ring-[#FF5A3C]/20"
                      value={articleDestinationId}
                      onChange={(e) => setArticleDestinationId(e.target.value)}
                    >
                      <option value="">General Community News</option>
                      <option value="mount-everest">Mount Everest</option>
                      <option value="kathmandu-valley">Kathmandu Valley</option>
                      <option value="pokhara-lake">Pokhara</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#FF5A3C]/5 p-6 rounded-xl border border-[#FF5A3C]/10">
                    <div className="space-y-3">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-[#FF5A3C]" />
                        Article Image
                      </label>
                      <div className="flex items-center gap-4">
                        {articlePreview && (
                          <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-[#FF5A3C]/20 shrink-0">
                            <img src={articlePreview} className="w-full h-full object-cover" alt="Preview" />
                          </div>
                        )}
                        <Input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleImageChange(e, 'article')}
                          className="rounded-xl bg-background border-border/50 text-xs py-1"
                        />
                      </div>
                    </div>
                    <div className="flex items-end">
                      <Button type="submit" className="w-full btn-coral h-11" disabled={isSubmitting}>
                        {isSubmitting ? 'Publishing...' : 'Publish Opinion'}
                        <Send className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </TabsContent>
          </Tabs>

          {/* Real-time Stats Footer */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span className="text-sm">Real-time Data Sync</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">Live Community Updates</span>
            </div>
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span className="text-sm">Moderation Active</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const PROVINCES = [
  "bagmati", "gandaki", "karnali", "koshi", 
  "lumbini", "madhesh", "sudurpashchim"
];

const DISTRICTS = [
  "bardiya", "bhaktapur", "chitwan", "dailekh", "darchula", "dhankuta", 
  "dhanusha", "dolakha", "dolpa", "doti", "gorkha", "gulmi", "humla", 
  "ilam", "jhapa", "jumla", "kailali", "kanchanpur", "kaski", "kathmandu", 
  "kavrepalanchok", "khotang", "lalitpur", "lamjung", "manang", "mugu", 
  "mustang", "myagdi", "nuwakot", "palpa", "pyuthan", "rasuwa", 
  "rupandehi", "sankhuwasabha", "solukhumbu", "sunsari", "surkhet", 
  "tanahun", "taplejung"
];