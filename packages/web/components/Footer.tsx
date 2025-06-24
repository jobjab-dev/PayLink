'use client';

import { QrCode, Github, Twitter, Globe, Heart, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useSectionFade } from '../hooks/useSectionFade';

export default function Footer() {
  const { ref, isVisible } = useSectionFade();

  const footerLinks = {
    product: [
      { label: 'Create Bill', href: '/create' },
      { label: 'Scan QR', href: '/scan' },
      { label: 'Network Guide', href: '/networks' }
    ],
    resources: [
      { label: 'Documentation', href: '#' },
      { label: 'API Reference', href: '#' },
      { label: 'Support', href: '#' }
    ],
    company: [
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' }
    ]
  };

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Globe, href: '#', label: 'Website' }
  ];

  return (
    <footer
      ref={ref}
      id="footer"
      className={`
        relative overflow-hidden
        px-4 py-16
        bg-gradient-to-br from-muted/30 via-background to-primary/5
        transition-all duration-1000 ease-out delay-500
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-2 gap-16 mb-16">
          {/* Brand Section */}
          <div className="space-y-8">
            {/* Logo and Brand */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-lg"></div>
                  <div className="relative bg-gradient-to-br from-primary to-accent rounded-2xl p-4">
                    <QrCode className="h-10 w-10 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    PayLink
                  </h2>
                  <p className="text-sm text-muted-foreground">Powered by Morph L2</p>
                </div>
              </div>

              <p className="text-xl text-muted-foreground max-w-md leading-relaxed">
                Revolutionizing payments with QR codes and zero gas fees. 
                Experience the future of decentralized transactions.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-4 bg-background/50 backdrop-blur-sm rounded-xl border border-muted-foreground/20">
                <div className="text-2xl font-bold text-primary mb-1">$0</div>
                <div className="text-xs text-muted-foreground">Gas Fees</div>
              </div>
              <div className="text-center p-4 bg-background/50 backdrop-blur-sm rounded-xl border border-muted-foreground/20">
                <div className="text-2xl font-bold text-primary mb-1">&lt;1s</div>
                <div className="text-xs text-muted-foreground">Speed</div>
              </div>
              <div className="text-center p-4 bg-background/50 backdrop-blur-sm rounded-xl border border-muted-foreground/20">
                <div className="text-2xl font-bold text-primary mb-1">24/7</div>
                <div className="text-xs text-muted-foreground">Available</div>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Connect with us</h3>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="group p-3 bg-background/80 backdrop-blur-sm rounded-xl border border-muted-foreground/20 hover:border-primary/40 transition-all duration-300 hover:scale-110"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Product</h3>
              <div className="space-y-3">
                {footerLinks.product.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Resources</h3>
              <div className="space-y-3">
                {footerLinks.resources.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </a>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Company</h3>
              <div className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-muted-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>© 2024 PayLink. Built on Morph L2 with</span>
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              <span>All rights reserved.</span>
            </div>

            {/* Tech Stack */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-primary">Morph L2</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/20">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-500"></div>
                <span className="text-sm font-medium text-accent-foreground">Next.js</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 