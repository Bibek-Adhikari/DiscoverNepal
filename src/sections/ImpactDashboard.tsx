import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { useData } from '@/contexts/DataContext';
import { TrendingUp, TrendingDown, Users, Leaf, Coins, Landmark } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const metricIcons = {
  'carbon-offset': Leaf,
  'community-revenue': Coins,
  'heritage-investment': Landmark,
  'wildlife-protection': Users,
};

interface ImpactDashboardProps {
  sectionRef?: React.RefObject<HTMLElement | null>;
}

function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const counterRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = counterRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            const startTime = Date.now();
            const animate = () => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / (duration * 1000), 1);
              const easeProgress = 1 - Math.pow(1 - progress, 3);
              setCount(Math.floor(value * easeProgress));
              if (progress < 1) {
                requestAnimationFrame(animate);
              }
            };
            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  return <span ref={counterRef}>{count.toLocaleString()}</span>;
}

export function ImpactDashboard({ sectionRef }: ImpactDashboardProps) {
  const internalRef = useRef<HTMLElement>(null);
  const ref = sectionRef || internalRef;
  const metricsRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const { impactMetrics, monthlyVisitorData } = useData();

  useEffect(() => {
    const section = ref.current;
    const metrics = metricsRef.current;
    const chart = chartRef.current;

    if (!section || !metrics || !chart) return;

    const ctx = gsap.context(() => {
      // Metrics animation
      gsap.fromTo(
        metrics.children,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: metrics,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Chart animation
      gsap.fromTo(
        chart,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: chart,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [ref]);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative w-full py-20 lg:py-32 z-20 bg-background"
    >
      <div className="w-full px-2 sm:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="font-mono text-xs tracking-[0.2em] text-[#FF5A3C] uppercase">
            Impact Dashboard
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight font-['Space_Grotesk']">
            Tourism With
            <span className="text-gradient-sunrise"> Purpose</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Real-time metrics showing how responsible tourism contributes to environmental conservation,
            community development, and heritage preservation across Nepal.
          </p>
        </div>

        {/* Metrics Grid */}
        <div
          ref={metricsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-2 mb-12"
        >
          {impactMetrics.map((metric) => {
            const Icon = metricIcons[metric.id as keyof typeof metricIcons];
            const isPositive = metric.change > 0;

            return (
              <div
                key={metric.id}
                className="card-nepal p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FF5A3C]/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#FF5A3C]" />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-xs font-medium ${
                      isPositive ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {isPositive ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {Math.abs(metric.change)}%
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-3xl font-bold font-['Space_Grotesk']">
                    <AnimatedCounter
                      value={metric.value}
                      duration={metric.unit === 'M NPR' ? 1.5 : 2}
                    />
                    {metric.unit === 'M NPR' && (
                      <span className="text-lg text-muted-foreground ml-1">M</span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">{metric.unit}</div>
                </div>

                <div className="mt-4 text-sm font-medium">{metric.label}</div>
                <div className="text-xs text-muted-foreground">{metric.changeLabel}</div>
              </div>
            );
          })}
        </div>

        {/* Chart Section */}
        <div
          ref={chartRef}
          className="card-nepal p-4 lg:p-8"
          style={{ opacity: 0 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Visitor Trends & Carbon Offset</h3>
              <p className="text-sm text-muted-foreground">
                Monthly visitor numbers and corresponding carbon footprint offset
              </p>
            </div>
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5A3C]" />
                <span className="text-xs text-muted-foreground">Visitors</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-xs text-muted-foreground">Carbon Offset (tons)</span>
              </div>
            </div>
          </div>

          <div className="h-[350px] lg:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyVisitorData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF5A3C" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF5A3C" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  stroke="rgba(0,0,0,0.2)"
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 10 }}
                  width={35}
                  stroke="rgba(0,0,0,0.1)"
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 10 }}
                  width={35}
                  stroke="rgba(0,0,0,0.1)"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  }}
                  formatter={(value: number, name: string) => [
                    name === 'visitors' ? `${value.toLocaleString()}` : `${value} tons`,
                    name === 'visitors' ? 'Visitors' : 'Carbon Offset',
                  ]}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="visitors"
                  stroke="#FF5A3C"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorVisitors)"
                  animationDuration={1500}
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="carbonOffset"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCarbon)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {[
            { label: 'Local Guides Employed', value: '2,450+' },
            { label: 'Heritage Sites Protected', value: '127' },
            { label: 'Community Projects', value: '89' },
            { label: 'Wildlife Corridors', value: '34' },
          ].map((stat, index) => (
            <div key={index} className="text-center p-2 sm:p-4">
              <div className="text-2xl lg:text-3xl font-bold text-[#FF5A3C] font-['Space_Grotesk']">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
