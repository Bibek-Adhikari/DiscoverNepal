import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, Menu, X, Mountain, MapPin, Compass, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onExploreClick?: () => void;
  onDashboardClick?: () => void;
  onAdminClick?: () => void;
}

export function Header({ onExploreClick, onDashboardClick, onAdminClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Explore', icon: MapPin, onClick: onExploreClick },
    { label: 'Dashboard', icon: Compass, onClick: onDashboardClick },
    { label: 'Contribute', icon: Plus, onClick: onAdminClick },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-background/90 backdrop-blur-xl shadow-lg border-b border-border/50'
          : 'bg-transparent'
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Mountain className="w-7 h-7 sm:w-8 sm:h-8 text-[#FF5A3C]" strokeWidth={2} />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#FF5A3C] rounded-full animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                Discover
              </span>
              <span className="text-base sm:text-lg font-bold tracking-tight -mt-0.5 font-['Space_Grotesk']">
                NEPAL
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Button
                key={link.label}
                variant="ghost"
                size="sm"
                onClick={link.onClick}
                className="text-sm font-medium hover:text-[#FF5A3C] hover:bg-[#FF5A3C]/10 transition-colors"
              >
                <link.icon className="w-4 h-4 mr-2" />
                {link.label}
              </Button>
            ))}
            
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="relative overflow-hidden rounded-full w-9 h-9 sm:w-10 sm:h-10 hover:bg-muted transition-colors"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              <Sun
                className={`w-4 h-4 sm:w-5 sm:h-5 absolute transition-all duration-700 ease-in-out ${
                  theme === 'dark'
                    ? 'rotate-90 scale-0 opacity-0 blur-sm'
                    : 'rotate-0 scale-100 opacity-100 blur-0'
                }`}
              />
              <Moon
                className={`w-4 h-4 sm:w-5 sm:h-5 absolute transition-all duration-700 ease-in-out ${
                  theme === 'light'
                    ? '-rotate-90 scale-0 opacity-0 blur-sm'
                    : 'rotate-0 scale-100 opacity-100 blur-0'
                }`}
              />
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden rounded-full w-9 h-9 sm:w-10 sm:h-10"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-4 bg-background/95 backdrop-blur-xl border-t border-border/50">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Button
                key={link.label}
                variant="ghost"
                onClick={() => {
                  link.onClick?.();
                  setIsMobileMenuOpen(false);
                }}
                className="justify-start text-left hover:text-[#FF5A3C] hover:bg-[#FF5A3C]/10"
              >
                <link.icon className="w-4 h-4 mr-3" />
                {link.label}
              </Button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
