import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer id="site-footer" className="bg-stone-50 border-t border-stone-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div id="footer-brand" className="col-span-1 md:col-span-2">
            <Image src="/images/logo.png" alt="PETS LOVE" width={140} height={46} className="h-12 w-auto object-contain mb-4" />
            <p className="text-gray-600 text-sm leading-relaxed max-w-md">
              Handcrafted jewelry celebrating the bond between you and your beloved pets. Each piece is made with love and care, designed to keep your companion close to your heart forever.
            </p>
          </div>

          <div id="footer-shop">
            <h4 className="font-semibold text-gray-900 mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-sm text-gray-600 hover:text-amber-700">All Products</Link></li>
              <li><Link href="/products?category=pendant" className="text-sm text-gray-600 hover:text-amber-700">Pendants</Link></li>
              <li><Link href="/products?category=ring" className="text-sm text-gray-600 hover:text-amber-700">Rings</Link></li>
              <li><Link href="/products?category=bracelet" className="text-sm text-gray-600 hover:text-amber-700">Bracelets</Link></li>
              <li><Link href="/products?category=brooch" className="text-sm text-gray-600 hover:text-amber-700">Brooches</Link></li>
            </ul>
          </div>

          <div id="footer-support">
            <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link href="/story" className="text-sm text-gray-600 hover:text-amber-700">Our Story</Link></li>
              <li><Link href="#" className="text-sm text-gray-600 hover:text-amber-700">Shipping & Returns</Link></li>
              <li><Link href="#" className="text-sm text-gray-600 hover:text-amber-700">Size Guide</Link></li>
              <li><Link href="#" className="text-sm text-gray-600 hover:text-amber-700">Care Instructions</Link></li>
              <li><Link href="#" className="text-sm text-gray-600 hover:text-amber-700">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div id="footer-bottom" className="mt-12 pt-8 border-t border-stone-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">2024 PETS LOVE. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-sm text-gray-500 hover:text-gray-700">Privacy Policy</Link>
            <Link href="#" className="text-sm text-gray-500 hover:text-gray-700">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
