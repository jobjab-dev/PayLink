'use client';

import { PlusCircle, QrCode, CheckCircle, ArrowRight, Play } from 'lucide-react';
import { useSectionFade } from '../hooks/useSectionFade';
import { useState } from 'react';

export default function HowItWorks() {
  const { ref, isVisible } = useSectionFade();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      icon: PlusCircle,
      title: "Create Bill",
      description: "Set amount, token, and recipient address to generate a payment request",
      details: "Simply enter the payment details and our smart contract will generate a unique bill ID",
      color: "from-green-400 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-900/10"
    },
    {
      icon: QrCode,
      title: "Share QR Code",
      description: "Share the generated QR code or payment link with the payer",
      details: "Recipients can scan the QR code with any device or use the shareable payment link",
      color: "from-blue-400 to-indigo-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/10"
    },
    {
      icon: CheckCircle,
      title: "Instant Payment",
      description: "Payer scans QR and pays instantly with zero gas fees",
      details: "Payments are processed instantly on Morph L2 with no gas fees for the payer",
      color: "from-purple-400 to-violet-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/10"
    }
  ];

  return (
    <section
      ref={ref}
      id="how-it-works"
      className={`
        min-h-screen snap-start relative overflow-hidden
        flex flex-col items-center justify-center
        px-4 py-8 sm:py-16
        bg-gradient-to-br from-accent/5 via-background to-primary/5
        transition-all duration-1000 ease-out delay-300
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-2xl sm:blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-2xl sm:blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-20 px-2 sm:px-4">
          <div className="inline-flex items-center gap-2 px-3 lg:px-4 py-2 bg-accent/10 rounded-full border border-accent/20 mb-4 lg:mb-6">
            <Play className="w-3 lg:w-4 h-3 lg:h-4 text-accent-foreground" />
            <span className="text-xs lg:text-sm font-semibold text-accent-foreground">How It Works</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-3 sm:mb-4 lg:mb-6 tracking-tight">
            Simple as{' '}
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              1-2-3
            </span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed">
            Get started with PayLink in just three simple steps. No complex setup required.
          </p>
        </div>

        {/* Interactive Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 xl:gap-12 mb-8 sm:mb-12 lg:mb-16 px-2 sm:px-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`
                group relative cursor-pointer transform transition-all duration-700 ease-out
                ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
                ${activeStep === index ? 'scale-105' : 'hover:scale-105'}
                ${index === 2 && 'md:col-span-2 xl:col-span-1 md:max-w-md md:mx-auto xl:max-w-none'}
              `}
              style={{ transitionDelay: `${400 + index * 200}ms` }}
              onMouseEnter={() => setActiveStep(index)}
            >
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden xl:block absolute top-16 left-full w-12 h-0.5 bg-gradient-to-r from-primary/30 to-transparent transform -translate-x-6 z-10">
                  <div className={`h-full bg-gradient-to-r ${step.color} transform origin-left transition-transform duration-1000 ${activeStep >= index ? 'scale-x-100' : 'scale-x-0'}`}></div>
                </div>
              )}

              {/* Step Card */}
              <div className={`
                relative p-6 lg:p-8 rounded-3xl border-2 transition-all duration-500
                ${activeStep === index 
                  ? 'border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 shadow-2xl' 
                  : 'border-muted-foreground/20 bg-background/80 hover:border-primary/20'
                }
                backdrop-blur-sm
              `}>
                {/* Step Number */}
                <div className="absolute -top-3 lg:-top-4 -left-3 lg:-left-4 w-10 lg:w-12 h-10 lg:h-12 rounded-2xl bg-gradient-to-r from-primary to-accent flex items-center justify-center shadow-xl">
                  <span className="text-white font-bold text-lg lg:text-xl">{index + 1}</span>
                </div>

                {/* Icon Container */}
                <div className="relative mb-6 lg:mb-8">
                  <div className={`
                    inline-flex items-center justify-center w-16 lg:w-20 h-16 lg:h-20 rounded-2xl mb-4 transition-all duration-300
                    ${activeStep === index ? step.bgColor : 'bg-muted/50'}
                    ${activeStep === index ? 'scale-110' : 'group-hover:scale-110'}
                  `}>
                    <step.icon className={`
                      h-8 lg:h-10 w-8 lg:w-10 transition-colors duration-300
                      ${activeStep === index ? 'text-primary' : 'text-muted-foreground'}
                    `} />
                  </div>
                  
                  {/* Pulse Animation */}
                  {activeStep === index && (
                    <div className="absolute inset-0 w-16 lg:w-20 h-16 lg:h-20 rounded-2xl bg-primary/20 animate-ping"></div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-3 lg:space-y-4">
                  <h3 className={`
                    text-xl lg:text-2xl xl:text-3xl font-bold transition-colors duration-300
                    ${activeStep === index ? 'text-primary' : 'text-foreground'}
                  `}>
                    {step.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-base lg:text-lg leading-relaxed">
                    {step.description}
                  </p>

                  {/* Detailed Description */}
                  <div className={`
                    overflow-hidden transition-all duration-500 ease-out
                    ${activeStep === index ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}
                  `}>
                    <div className="pt-4 border-t border-primary/20">
                      <p className="text-sm text-primary font-medium">
                        {step.details}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hover Arrow */}
                <div className={`
                  absolute bottom-6 right-6 transition-all duration-300
                  ${activeStep === index ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}
                `}>
                  <ArrowRight className="w-5 h-5 text-primary" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4">
            {steps.map((_, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className={`
                    w-3 h-3 rounded-full transition-all duration-300 cursor-pointer
                    ${activeStep === index ? 'bg-primary scale-125' : 'bg-muted-foreground/30 hover:bg-primary/50'}
                  `}
                  onClick={() => setActiveStep(index)}
                />
                {index < steps.length - 1 && (
                  <div className="w-12 h-0.5 bg-muted-foreground/20 mx-2">
                    <div className={`
                      h-full bg-primary transition-all duration-500 transform origin-left
                      ${activeStep > index ? 'scale-x-100' : 'scale-x-0'}
                    `}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-flex items-center gap-6 px-8 py-6 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl border border-primary/20 backdrop-blur-sm shadow-xl">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Ready to start?</div>
              <div className="font-semibold text-lg">Create your first bill now</div>
            </div>
            <ArrowRight className="w-6 h-6 text-primary animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
} 