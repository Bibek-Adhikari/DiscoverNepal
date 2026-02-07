import { useState } from 'react';
import { Mountain, Mail, Phone, Clock, Send, Instagram, Twitter, Facebook, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success('Successfully subscribed to our newsletter!');
    setEmail('');
    setIsSubmitting(false);
  };

  const footerLinks = {
    places: [
      { label: 'Kathmandu Valley', href: '#' },
      { label: 'Pokhara', href: '#' },
      { label: 'Chitwan', href: '#' },
      { label: 'Everest Region', href: '#' },
      { label: 'Annapurna', href: '#' },
      { label: 'Lumbini', href: '#' },
    ],
    stories: [
      { label: 'Trekking Guides', href: '#' },
      { label: 'Cultural Insights', href: '#' },
      { label: 'Wildlife Encounters', href: '#' },
      { label: 'Local Cuisine', href: '#' },
      { label: 'Festival Calendar', href: '#' },
    ],
    practical: [
      { label: 'Visa Information', href: '#' },
      { label: 'Best Time to Visit', href: '#' },
      { label: 'Packing Lists', href: '#' },
      { label: 'Health & Safety', href: '#' },
      { label: 'Responsible Travel', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="relative w-full bg-[#0B0F17] text-white z-50">
      {/* Main Footer Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Column - CTA */}
          <div>
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight font-['Space_Grotesk'] mb-6">
              Let&apos;s plan
              <br />
              <span className="text-[#FF5A3C]">your trip.</span>
            </h2>
            <p className="text-white/60 text-lg mb-8 max-w-md">
              Tell us what you love—mountains, culture, wildlife—and we&apos;ll suggest a route.
            </p>

            {/* Contact Card */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#FF5A3C]/20 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-[#FF5A3C]" />
                  </div>
                  <div>
                    <div className="text-sm text-white/60">Email</div>
                    <div className="font-medium">hello@discovernepal.studio</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#FF5A3C]/20 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-[#FF5A3C]" />
                  </div>
                  <div>
                    <div className="text-sm text-white/60">Phone</div>
                    <div className="font-medium">+977 1 XXXX XXXX</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#FF5A3C]/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[#FF5A3C]" />
                  </div>
                  <div>
                    <div className="text-sm text-white/60">Response Time</div>
                    <div className="font-medium">Within 24 hours</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Newsletter & Links */}
          <div>
            {/* Newsletter */}
            <div className="mb-12">
              <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
              <p className="text-white/60 text-sm mb-4">
                One email a month. No noise.
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-full px-5"
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-coral rounded-full"
                >
                  {isSubmitting ? (
                    '...'
                  ) : (
                    <>
                      Subscribe
                      <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Links Grid */}
            <div className="grid grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold text-sm mb-4 text-white/80">Places</h4>
                <ul className="space-y-2">
                  {footerLinks.places.map((link) => (
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

              <div>
                <h4 className="font-semibold text-sm mb-4 text-white/80">Stories</h4>
                <ul className="space-y-2">
                  {footerLinks.stories.map((link) => (
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

              <div>
                <h4 className="font-semibold text-sm mb-4 text-white/80">Practical</h4>
                <ul className="space-y-2">
                  {footerLinks.practical.map((link) => (
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
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Mountain className="w-6 h-6 text-[#FF5A3C]" />
              <span className="font-bold tracking-tight font-['Space_Grotesk']">
                Discover NEPAL
              </span>
            </div>

            {/* Copyright */}
            <div className="text-sm text-white/40">
              © {new Date().getFullYear()} Discover NEPAL Studio. All rights reserved.
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
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
