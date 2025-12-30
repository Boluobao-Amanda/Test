import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/lib/server-api';

export default async function Home() {
  const { products, filters } = await getProducts({ sort: 'recommended' });
  const featuredProducts = products.slice(0, 4);
  const categories = filters.categories;

  return (
    <main id="home-page" className="min-h-screen bg-white">
      <Header />

      <section id="hero-section" className="relative h-screen flex items-center justify-center overflow-hidden">
        <Image
          src="/images/hero-bg.png"
          alt="Luxury pet memorial jewelry"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
        <div id="hero-content" className="relative z-10 text-center px-4 max-w-3xl">
          <p className="text-sm uppercase tracking-widest text-white/90 mb-4">Handcrafted Pet Memorial Jewelry</p>
          <h1 id="hero-title" className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium text-white mb-6 leading-tight">
            Keep Their Warmth Close
          </h1>
          <p id="hero-subtitle" className="text-lg text-white/90 mb-8 max-w-xl mx-auto">
            Timeless jewelry pieces crafted to celebrate the eternal bond with your beloved companion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              id="hero-cta-primary"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-gray-900 font-medium rounded-full hover:bg-gray-100 transition-colors"
            >
              Explore Collection
            </Link>
            <Link
              href="/story"
              id="hero-cta-secondary"
              className="inline-flex items-center justify-center px-8 py-3 border border-white text-white font-medium rounded-full hover:bg-white/10 transition-colors"
            >
              Our Craftsmanship
            </Link>
          </div>
        </div>
      </section>

      <section id="featured-products" className="py-20 px-4 bg-stone-50">
        <div className="mx-auto max-w-7xl">
          <div id="featured-header" className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-amber-700 mb-2">Curated Selection</p>
            <h2 id="featured-title" className="text-3xl md:text-4xl font-serif text-gray-900">Featured Pieces</h2>
          </div>
          <div id="featured-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/products"
              id="view-all-products"
              className="inline-flex items-center gap-2 text-amber-700 font-medium hover:text-amber-800 transition-colors"
            >
              View All Products
              <Image src="/images/icon-arrow-right.png" alt="" width={16} height={16} className="w-4 h-4 object-contain" />
            </Link>
          </div>
        </div>
      </section>

      <section id="categories-section" className="py-20 px-4">
        <div className="mx-auto max-w-7xl">
          <div id="categories-header" className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-amber-700 mb-2">Shop By Category</p>
            <h2 id="categories-title" className="text-3xl md:text-4xl font-serif text-gray-900">Find Your Perfect Piece</h2>
          </div>
          <div id="categories-grid" className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category: any) => (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                data-testid={`category-${category.id}`}
                className="relative group bg-stone-100 rounded-xl p-8 text-center hover:bg-stone-200 transition-colors"
              >
                <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{category.count} items</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="customization-section" className="py-20 px-4 bg-amber-50">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div id="customization-content">
              <p className="text-sm uppercase tracking-widest text-amber-700 mb-2">Personalized For You</p>
              <h2 id="customization-title" className="text-3xl md:text-4xl font-serif text-gray-900 mb-6">
                Create Something Truly Unique
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Upload your pet&apos;s photo and we&apos;ll craft a one-of-a-kind piece that captures their essence. Add custom engraving or choose from our selection of precious stones to make it truly yours.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <Image src="/images/icon-check.png" alt="" width={20} height={20} className="w-5 h-5 object-contain" />
                  <span className="text-gray-700">Photo-driven customization</span>
                </li>
                <li className="flex items-center gap-3">
                  <Image src="/images/icon-check.png" alt="" width={20} height={20} className="w-5 h-5 object-contain" />
                  <span className="text-gray-700">Personal engraving up to 20 characters</span>
                </li>
                <li className="flex items-center gap-3">
                  <Image src="/images/icon-check.png" alt="" width={20} height={20} className="w-5 h-5 object-contain" />
                  <span className="text-gray-700">Birthstone inlay options</span>
                </li>
                <li className="flex items-center gap-3">
                  <Image src="/images/icon-check.png" alt="" width={20} height={20} className="w-5 h-5 object-contain" />
                  <span className="text-gray-700">3D preview before ordering</span>
                </li>
              </ul>
              <Link
                href="/products"
                id="start-customizing"
                className="inline-flex items-center justify-center px-8 py-3 bg-amber-700 text-white font-medium rounded-full hover:bg-amber-800 transition-colors"
              >
                Start Customizing
              </Link>
            </div>
            <div id="customization-image" className="relative aspect-square rounded-2xl overflow-hidden">
              <Image
                src="/images/story-craftsmanship.png"
                alt="Jewelry craftsmanship"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="brand-story-section" className="py-20 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div id="brand-story-image" className="relative aspect-video rounded-2xl overflow-hidden order-2 md:order-1">
              <Image
                src="/images/story-quality.png"
                alt="Quality inspection"
                fill
                className="object-cover"
              />
            </div>
            <div id="brand-story-content" className="order-1 md:order-2">
              <p className="text-sm uppercase tracking-widest text-amber-700 mb-2">Our Promise</p>
              <h2 id="brand-story-title" className="text-3xl md:text-4xl font-serif text-gray-900 mb-6">
                Crafted With Love, Built To Last
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Each piece is handcrafted by skilled artisans using only the finest materials. From 18K gold to sterling silver, we ensure every detail meets our exacting standards.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                We understand that your pet holds a special place in your heart. That&apos;s why we put the same love and care into creating jewelry that honors that bond.
              </p>
              <Link
                href="/story"
                id="learn-more-story"
                className="inline-flex items-center gap-2 text-amber-700 font-medium hover:text-amber-800 transition-colors"
              >
                Learn More About Us
                <Image src="/images/icon-arrow-right.png" alt="" width={16} height={16} className="w-4 h-4 object-contain" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="shipping-info" className="py-12 px-4 bg-stone-100">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div id="shipping-worldwide" className="flex flex-col items-center">
              <h4 className="font-medium text-gray-900 mb-2">Worldwide Shipping</h4>
              <p className="text-sm text-gray-600">Free shipping on orders over $300</p>
            </div>
            <div id="shipping-secure" className="flex flex-col items-center">
              <h4 className="font-medium text-gray-900 mb-2">Secure Checkout</h4>
              <p className="text-sm text-gray-600">PayPal & Credit Cards accepted</p>
            </div>
            <div id="shipping-warranty" className="flex flex-col items-center">
              <h4 className="font-medium text-gray-900 mb-2">Lifetime Warranty</h4>
              <p className="text-sm text-gray-600">Quality guaranteed on all pieces</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
