'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header id="site-header" className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div id="header-logo" className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/images/logo.png" alt="PETS LOVE" width={120} height={40} className="h-10 w-auto object-contain" />
            </Link>
          </div>

          <nav id="main-nav" className="hidden md:flex items-center gap-8">
            <Link href="/products" className="text-sm font-medium text-gray-700 hover:text-amber-700 transition-colors">
              Shop
            </Link>
            <Link href="/story" className="text-sm font-medium text-gray-700 hover:text-amber-700 transition-colors">
              Our Story
            </Link>
            <Link href="/products?category=pendant" className="text-sm font-medium text-gray-700 hover:text-amber-700 transition-colors">
              Pendants
            </Link>
            <Link href="/products?category=ring" className="text-sm font-medium text-gray-700 hover:text-amber-700 transition-colors">
              Rings
            </Link>
          </nav>

          <div id="header-actions" className="flex items-center gap-4">
            <button id="search-button" className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Search">
              <Image src="/images/icon-search.png" alt="Search" width={20} height={20} className="w-5 h-5 object-contain" />
            </button>
            <Link href="/cart" id="cart-button" className="p-2 hover:bg-gray-100 rounded-full transition-colors relative" aria-label="Cart">
              <Image src="/images/icon-cart.png" alt="Cart" width={20} height={20} className="w-5 h-5 object-contain" />
              <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">2</span>
            </Link>
            <button id="user-button" className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:block" aria-label="Account">
              <Image src="/images/icon-user.png" alt="Account" width={20} height={20} className="w-5 h-5 object-contain" />
            </button>
            <button
              id="mobile-menu-button"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              <Image src="/images/icon-menu.png" alt="Menu" width={20} height={20} className="w-5 h-5 object-contain" />
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden bg-white border-t border-gray-100">
          <nav className="flex flex-col py-4 px-4 gap-2">
            <Link href="/products" className="py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg">Shop All</Link>
            <Link href="/story" className="py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg">Our Story</Link>
            <Link href="/products?category=pendant" className="py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg">Pendants</Link>
            <Link href="/products?category=ring" className="py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg">Rings</Link>
            <Link href="/products?category=bracelet" className="py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg">Bracelets</Link>
            <Link href="/products?category=brooch" className="py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg">Brooches</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
