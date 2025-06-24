'use client';

import { Button } from 'ui';
import { QrCode, PlusCircle, ArrowRight, Wallet, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { NetworkAlert, useNetworkAlert } from './NetworkAlert';
import { useSectionFade } from '../hooks/useSectionFade';

export default function Hero() {
  const { isConnected } = useAccount();
  const { canProceed, shouldShowAlert } = useNetworkAlert();
  const { ref, isVisible } = useSectionFade();

  return (
    <section
      ref={ref}
      id="hero"
      className={`
        h-screen snap-start relative overflow-hidden
        flex flex-col items-center justify-center
        text-center px-4
        bg-gradient-to-br from-primary/5 via-background to-accent/10
        transition-all duration-1000 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 animate-float delay-0">
          <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary" />
          </div>
        </div>
        <div className="absolute top-1/3 right-1/4 animate-float delay-1000">
          <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-accent-foreground" />
          </div>
        </div>
        <div className="absolute bottom-1/3 left-1/6 animate-float delay-2000">
          <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center">
            <QrCode className="w-5 h-5 text-secondary-foreground" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Logo with Glow Effect */}
        <div className="mb-8 relative">
          <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-5 shadow-2xl">
              <QrCode className="h-14 w-14 text-white" />
            </div>
          </div>
        </div>

                 {/* Title with Enhanced Typography */}
         <div className="mb-8 space-y-4">
           <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-8xl font-black mb-4 tracking-tight">
             <span className="bg-gradient-to-r from-primary via-primary/90 to-accent bg-clip-text text-transparent animate-gradient">
               PayLink
             </span>
           </h1>
           <div className="flex items-center justify-center gap-3 mb-6">
             <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent flex-1 max-w-12 sm:max-w-20"></div>
             <div className="px-3 sm:px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
               <span className="text-xs sm:text-sm font-semibold text-primary">Powered by Morph L2</span>
             </div>
             <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent flex-1 max-w-12 sm:max-w-20"></div>
           </div>
           <p className="text-lg sm:text-xl xl:text-2xl text-muted-foreground max-w-2xl xl:max-w-3xl mx-auto leading-relaxed px-4">
             Experience the future of payments with{' '}
             <span className="font-semibold text-primary">zero gas fees</span>,{' '}
             <span className="font-semibold text-primary">instant QR codes</span>, and{' '}
             <span className="font-semibold text-primary">seamless transactions</span>
           </p>
         </div>

        {/* Network Alert */}
        {shouldShowAlert && (
          <div className="mb-8 transform transition-all duration-500 hover:scale-105">
            <NetworkAlert showButton={true} />
          </div>
        )}

                 {/* Enhanced CTA Buttons */}
         <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 justify-center items-center mb-12 px-4">
           <Link href="/create">
             <Button 
               size="lg" 
               className={`
                 group relative w-full lg:w-auto px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg font-semibold
                 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary
                 shadow-2xl hover:shadow-primary/25 transform hover:scale-105 
                 transition-all duration-300 ease-out
                 ${!canProceed ? 'opacity-50 cursor-not-allowed' : ''}
               `}
               disabled={!canProceed}
             >
               <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
               <PlusCircle className="h-5 w-5 lg:h-6 lg:w-6 mr-2 lg:mr-3 group-hover:rotate-180 transition-transform duration-300" />
               Create Payment Bill
               <ArrowRight className="h-5 w-5 lg:h-6 lg:w-6 ml-2 lg:ml-3 group-hover:translate-x-1 transition-transform duration-300" />
             </Button>
           </Link>
           
           <Link href="/scan">
             <Button 
               variant="outline" 
               size="lg" 
               className={`
                 group w-full lg:w-auto px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg font-semibold
                 border-2 border-primary/30 hover:border-primary
                 bg-background/80 backdrop-blur-sm hover:bg-primary/5
                 shadow-xl hover:shadow-2xl transform hover:scale-105
                 transition-all duration-300 ease-out
                 ${!canProceed ? 'opacity-50 cursor-not-allowed' : ''}
               `}
               disabled={!canProceed}
             >
               <QrCode className="h-5 w-5 lg:h-6 lg:w-6 mr-2 lg:mr-3 group-hover:scale-110 transition-transform duration-300" />
               Scan QR Code
             </Button>
           </Link>
         </div>

        {/* Connection Status */}
        {!isConnected && (
          <div className="transform transition-all duration-500 hover:scale-105">
            <div className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-muted/50 to-muted/30 backdrop-blur-sm rounded-2xl border border-muted-foreground/20 shadow-lg">
              <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
              <Wallet className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground font-medium">Connect your wallet to get started</span>
            </div>
          </div>
        )}

                 {/* Stats Preview */}
         <div className="mt-12 lg:mt-16 grid grid-cols-3 gap-4 lg:gap-8 max-w-xl lg:max-w-2xl mx-auto px-4">
           <div className="text-center group cursor-pointer">
             <div className="text-2xl sm:text-3xl xl:text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
               $0
             </div>
             <div className="text-xs sm:text-sm text-muted-foreground">Gas Fees</div>
           </div>
           <div className="text-center group cursor-pointer">
             <div className="text-2xl sm:text-3xl xl:text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
               &lt;1s
             </div>
             <div className="text-xs sm:text-sm text-muted-foreground">Transaction</div>
           </div>
           <div className="text-center group cursor-pointer">
             <div className="text-2xl sm:text-3xl xl:text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
               24/7
             </div>
             <div className="text-xs sm:text-sm text-muted-foreground">Available</div>
           </div>
         </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
} 