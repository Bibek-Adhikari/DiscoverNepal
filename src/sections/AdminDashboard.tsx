import { useState, useRef, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Send, 
  Image as ImageIcon, 
  TrendingUp,
  Globe,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { addNewsArticle, uploadImage } from '@/hooks/useNepalData';
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

  // Article Form State
  const [articleTitle, setArticleTitle] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [articleSource, setArticleSource] = useState('');
  const [articleDestinationId, setArticleDestinationId] = useState('');

  // Image states
  const [articleImage, setArticleImage] = useState<File | null>(null);
  const [articlePreview, setArticlePreview] = useState<string | null>(null);

  useEffect(() => {
    const section = ref.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.set(content, { opacity: 0, y: 30 });

      gsap.to(content, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, [ref]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArticleImage(file);
      setArticlePreview(URL.createObjectURL(file));
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
        </div>

        <div className="max-w-4xl mx-auto">
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
                      onChange={(e) => handleImageChange(e)}
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