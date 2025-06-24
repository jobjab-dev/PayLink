'use client';

import { Button, Card } from 'ui';
import { Users, PlusCircle, TrendingUp, Award, Star, Zap } from 'lucide-react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { useNetworkAlert } from './NetworkAlert';
import { useSectionFade } from '../hooks/useSectionFade';
import { useState, useEffect } from 'react';

// Animated Counter Component
function AnimatedCounter({ 
  end, 
  duration = 2000, 
  prefix = '', 
  suffix = '' 
}: { 
  end: number; 
  duration?: number; 
  prefix?: string; 
  suffix?: string; 
}) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return (
    <div 
      className="counter-trigger"
      ref={(el) => {
        if (el) {
          const observer = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                setIsVisible(true);
              }
            },
            { threshold: 0.5 }
          );
          observer.observe(el);
        }
      }}
    >
      {prefix}{count}{suffix}
    </div>
  );
}

export default function Stats() {
  const { isConnected } = useAccount();
  const { canProceed } = useNetworkAlert();
  const { ref, isVisible } = useSectionFade();

  const stats = [
    { 
      value: "0", 
      label: "Gas Fees",
      icon: Zap,
      color: "from-green-400 to-emerald-500",
      description: "Complete zero-cost transactions"
    },
    { 
      value: "<1", 
      label: "Second Transactions",
      icon: TrendingUp,
      color: "from-blue-400 to-indigo-500",
      description: "Lightning-fast processing"
    },
    { 
      value: "100", 
      label: "Success Rate",
      icon: Award,
      color: "from-purple-400 to-violet-500",
      description: "Guaranteed transaction success"
    },
    { 
      value: "24/7", 
      label: "Availability",
      icon: Star,
      color: "from-orange-400 to-red-500",
      description: "Always ready when you need it"
    }
  ];

  return (
    <section
      ref={ref}
      id="stats"
      className={`
        min-h-screen snap-start relative overflow-hidden
        flex flex-col items-center justify-center
        px-4 py-8 sm:py-16
        bg-gradient-to-br from-primary/5 via-background to-accent/5
        transition-all duration-1000 ease-out delay-400
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 sm:left-20 w-32 sm:w-48 md:w-72 h-32 sm:h-48 md:h-72 bg-gradient-to-r from-primary/10 to-transparent rounded-full blur-2xl sm:blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 sm:right-20 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-gradient-to-r from-accent/10 to-transparent rounded-full blur-2xl sm:blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-2xl sm:blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 xl:gap-8 mb-8 sm:mb-12 lg:mb-16 xl:mb-20 px-2 sm:px-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`
                group relative transform transition-all duration-700 ease-out
                ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
              `}
              style={{ transitionDelay: `${500 + index * 150}ms` }}
            >
              {/* Glow Effect */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${stat.color} rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
              
              <div className="relative p-4 lg:p-6 xl:p-8 bg-background/80 backdrop-blur-sm rounded-2xl border border-muted-foreground/20 hover:border-primary/30 transition-all duration-500 group-hover:scale-105 shadow-xl hover:shadow-2xl">
                {/* Icon */}
                <div className="flex justify-center mb-3 lg:mb-4">
                  <div className={`p-2 lg:p-3 rounded-xl bg-gradient-to-r ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-4 lg:w-6 h-4 lg:h-6 text-white" />
                  </div>
                </div>

                {/* Value */}
                <div className="text-center mb-2">
                  <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black mb-1 lg:mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {stat.value === "100" ? (
                      <AnimatedCounter end={100} suffix="%" />
                    ) : (
                      stat.value
                    )}
                    {stat.value === "100" ? "" : stat.value === "0" ? " $" : stat.value === "<1" ? "s" : ""}
                  </div>
                  <div className="text-xs sm:text-sm lg:text-base font-semibold text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    {stat.label}
                  </div>
                </div>

                {/* Description */}
                <div className="text-center">
                  <p className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                    {stat.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced CTA Section */}
        <div className="relative">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-xl"></div>
          
          <Card className="relative p-12 md:p-16 text-center bg-gradient-to-br from-background/90 to-background/80 backdrop-blur-sm border-primary/20 rounded-3xl shadow-2xl">
            {/* Icon with Animation */}
            <div className="relative mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-2xl mb-4 animate-glow">
                <Users className="h-10 w-10 text-white" />
              </div>
              
              {/* Floating Particles */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-500"></div>
              <div className="absolute top-0 left-0 w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
            </div>

            {/* Enhanced Typography */}
            <div className="mb-6 lg:mb-8 space-y-3 lg:space-y-4 px-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black mb-3 lg:mb-4 tracking-tight">
                Ready to{' '}
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
                  Transform
                </span>
                <br />
                Your Payments?
              </h2>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-2xl lg:max-w-3xl mx-auto leading-relaxed">
                Join the revolution of{' '}
                <span className="font-semibold text-primary">gasless payments</span> and experience the future today
              </p>
            </div>

            {/* Social Proof */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-4 px-6 py-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full border border-primary/20">
                <div className="flex -space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`w-8 h-8 bg-gradient-to-r ${stats[i % stats.length]?.color || 'from-gray-400 to-gray-600'} rounded-full border-2 border-white`}></div>
                  ))}
                </div>
                <span className="text-muted-foreground font-medium">
                  <AnimatedCounter end={1000} suffix="+" /> users trust PayLink
                </span>
              </div>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 justify-center items-center px-4">
              <Link href="/create">
                <Button 
                  size="lg" 
                  className={`
                    group relative w-full lg:w-auto px-8 lg:px-10 py-4 lg:py-6 text-lg lg:text-xl font-bold
                    bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90
                    shadow-2xl hover:shadow-primary/25 transform hover:scale-105 
                    transition-all duration-300 ease-out rounded-2xl
                    ${!canProceed ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  disabled={!canProceed}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  <PlusCircle className="h-5 lg:h-6 w-5 lg:w-6 mr-2 lg:mr-3 group-hover:rotate-180 transition-transform duration-500" />
                  Create Your First Bill
                </Button>
              </Link>
              
              <Link href="/networks">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className={`
                    group w-full lg:w-auto px-8 lg:px-10 py-4 lg:py-6 text-lg lg:text-xl font-bold
                    border-2 border-primary/40 hover:border-primary
                    bg-background/80 backdrop-blur-sm hover:bg-primary/5
                    shadow-xl hover:shadow-2xl transform hover:scale-105
                    transition-all duration-300 ease-out rounded-2xl
                  `}
                >
                  Setup Guide
                </Button>
              </Link>
            </div>
            
            {/* Network Warning */}
            {!canProceed && isConnected && (
              <div className="mt-8 inline-flex items-center gap-3 px-6 py-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-2xl">
                <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                <span className="text-orange-800 dark:text-orange-200 font-medium">
                  Please switch to Morph L2 to create and pay bills
                </span>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
} 