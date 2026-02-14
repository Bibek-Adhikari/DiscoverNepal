import { useState } from 'react';
import { Mountain, Mail, Phone, Clock, Send, Instagram, Twitter, Facebook, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const isValidEmail = (email: string) => 
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !isValidEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call - replace with actual endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Successfully subscribed to our newsletter!');
      setEmail('');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const footerLinks = {
    places: [
      { label: 'Kathmandu Valley', href: '/places/kathmandu' },
      { label: 'Pokhara', href: '/places/pokhara' },
      { label: 'Chitwan', href: '/places/chitwan' },
      { label: 'Everest Region', href: '/places/everest' },
      { label: 'Annapurna', href: '/places/annapurna' },
      { label: 'Lumbini', href: '/places/lumbini' },
    ],
    stories: [
      { label: 'Trekking Guides', href: '/stories/trekking' },
      { label: 'Cultural Insights', href: '/stories/culture' },
      { label: 'Wildlife Encounters', href: '/stories/wildlife' },
      { label: 'Local Cuisine', href: '/stories/food' },
      { label: 'Festival Calendar', href: '/stories/festivals' },
    ],
    practical: [
      { label: 'Visa Information', href: '/guide/visa' },
      { label: 'Best Time to Visit', href: '/guide/seasons' },
      { label: 'Packing Lists', href: '/guide/packing' },
      { label: 'Health & Safety', href: '/guide/safety' },
      { label: 'Responsible Travel', href: '/guide/responsible' },
    ],
  };

  const socialLinks = [
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
  ];

  return (
    <footer className="relative w-full bg-[#0B0F17] text-white z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Column */}
          <div>
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight font-['Space_Grotesk'] mb-6">
              Let&apos;s plan
              <br />
              <span className="text-[#FF5A3C]">your trip.</span>
            </h2>
            <p className="text-white/60 text-lg mb-8 max-w-md">
              Tell us what you love—mountains, culture, wildlife—and we&apos;ll suggest a route.
            </p>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="space-y-4">
                <ContactItem icon={Mail} label="Email" value="hello@discovernepal.studio" />
                <ContactItem icon={Phone} label="Phone" value="+977 1 XXXX XXXX" />
                <ContactItem icon={Clock} label="Response Time" value="Within 24 hours" />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div className="mb-12">
              <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
              <p className="text-white/60 text-sm mb-4">
                One email a month. No noise.
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-full px-5 h-12"
                  aria-label="Email address for newsletter"
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#FF5A3C] hover:bg-[#E54D2E] text-white rounded-full h-12 px-6 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    <>
                      Subscribe
                      <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              <FooterColumn title="Places" links={footerLinks.places} />
              <FooterColumn title="Stories" links={footerLinks.stories} />
              <FooterColumn title="Practical" links={footerLinks.practical} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Mountain className="w-6 h-6 text-[#FF5A3C]" />
              <span className="font-bold tracking-tight font-['Space_Grotesk']">
                Discover NEPAL
              </span>
            </div>

            <div className="text-sm text-white/40 text-center">
              © {new Date().getFullYear()} Discover NEPAL Studio. All rights reserved.
            </div>

            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#FF5A3C]/20 hover:text-[#FF5A3C] transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Extracted sub-components for cleaner code
function ContactItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-[#FF5A3C]/20 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-[#FF5A3C]" />
      </div>
      <div className="min-w-0">
        <div className="text-sm text-white/60">{label}</div>
        <div className="font-medium truncate">{value}</div>
      </div>
    </div>
  );
}

function FooterColumn({ title, links }: { title: string, links: { label: string, href: string }[] }) {
  return (
    <div>
      <h4 className="font-semibold text-sm mb-4 text-white/80">{title}</h4>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-sm text-white/50 hover:text-[#FF5A3C] transition-colors"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}