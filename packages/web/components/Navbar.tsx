'use client';

import Link from 'next/link';
import { WalletConnect } from './WalletConnect';
import { NetworkAlert, NetworkBadge } from './NetworkAlert';
import { QrCode, Plus, Home, Menu, X, Network } from 'lucide-react';
import { useState } from 'react';
import { Button } from 'ui';
import { useAccount } from 'wagmi';
import { useNetworkAlert } from '../hooks/useNetworkAlert';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isConnected } = useAccount();
  const { isWrongNetwork, shouldShowAlert } = useNetworkAlert();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/create', label: 'Create Bill', icon: Plus },
    { href: '/scan', label: 'Scan QR', icon: QrCode },
    { href: '/networks', label: 'Networks', icon: Network },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <QrCode className="h-8 w-8 text-primary" />
              <span className="hidden font-bold text-xl sm:inline-block">
                PayLink
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden xl:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Desktop Status & Wallet */}
            <div className="hidden xl:flex items-center space-x-3">
              {/* ✅ Network Alert - Orange badge for wrong network */}
              {isConnected && <NetworkBadge />}
              <WalletConnect />
            </div>

            {/* Mobile Menu Button */}
            <div className="xl:hidden flex items-center space-x-2">
              {/* Mobile Network Alert */}
              {isConnected && <NetworkBadge />}
              <WalletConnect />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="tap-target"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="xl:hidden border-t">
              <div className="px-2 py-4 space-y-4">
                {/* Mobile Network Status with detailed alert */}
                {isConnected && shouldShowAlert && (
                  <div className="px-3 py-2 bg-muted/50 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Network Status:</span>
                    </div>
                    <NetworkAlert showButton={true} />
                  </div>
                )}

                {/* Navigation Items */}
                <div className="space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center space-x-3 px-3 py-2 text-sm font-medium transition-colors hover:bg-accent rounded-md tap-target"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ✅ Global Network Warning Banner - Using NetworkAlert */}
      {shouldShowAlert && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border-b border-orange-200 dark:border-orange-800">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                <span className="text-[16px]">⚠️</span>
                <span className="text-sm font-medium">
                  Wrong Network Detected: Please switch to Morph L2 to use PayLink
                </span>
              </div>
              <div className="hidden sm:block">
                <NetworkAlert showButton={true} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 