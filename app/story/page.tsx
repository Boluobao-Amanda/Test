import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function StoryPage() {
  const craftingSteps = [
    {
      title: 'Design Consultation',
      description: 'We work with you to understand your vision and your pet\'s unique personality.',
    },
    {
      title: 'Material Selection',
      description: 'Choose from our premium materials: 18K gold, sterling silver, or rose gold.',
    },
    {
      title: 'Artisan Crafting',
      description: 'Our skilled artisans handcraft each piece with meticulous attention to detail.',
    },
    {
      title: 'Quality Inspection',
      description: 'Every piece undergoes rigorous quality checks to ensure perfection.',
    },
    {
      title: 'Personal Touches',
      description: 'Custom engravings and stone inlays are carefully added to your specifications.',
    },
    {
      title: 'Final Polish',
      description: 'A final polish brings out the natural brilliance of your jewelry.',
    },
  ];

  return (
    <main id="story-page" className="min-h-screen bg-white">
      <Header />

      <section id="story-hero" className="relative h-96 flex items-center justify-center">
        <Image
          src="/images/story-hero.png"
          alt="Our Story"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div id="story-hero-content" className="relative z-10 text-center px-4">
          <h1 id="story-title" className="text-4xl md:text-5xl font-serif text-white mb-4">Our Story</h1>
          <p className="text-lg text-white/90 max-w-xl mx-auto">
            Celebrating the eternal bond between you and your beloved companion.
          </p>
        </div>
      </section>

      <section id="story-origin" className="py-20 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-amber-700 mb-2">Our Beginning</p>
            <h2 id="origin-title" className="text-3xl font-serif text-gray-900">Born From Love</h2>
          </div>
          <div className="prose prose-lg mx-auto text-gray-600 text-center">
            <p>
              PETS LOVE was founded with a simple yet profound mission: to create timeless jewelry pieces that honor the unbreakable bond between pet owners and their beloved companions.
            </p>
            <p>
              Our journey began when our founder, after losing her cherished Golden Retriever, searched for a meaningful way to keep his memory close. Unable to find jewelry that truly captured the depth of that bond, she partnered with master jewelers to create pieces that would do justice to such precious relationships.
            </p>
            <p>
              Today, we continue that mission, crafting each piece with the same love and care that you have for your pet. Every pendant, ring, bracelet, and brooch tells a story—your story.
            </p>
          </div>
        </div>
      </section>

      <section id="story-craftsmanship" className="py-20 px-4 bg-stone-50">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div id="craftsmanship-image" className="relative aspect-square rounded-2xl overflow-hidden">
              <Image
                src="/images/story-craftsmanship.png"
                alt="Artisan crafting jewelry"
                fill
                className="object-cover"
              />
            </div>
            <div id="craftsmanship-content">
              <p className="text-sm uppercase tracking-widest text-amber-700 mb-2">The Art of Creation</p>
              <h2 id="craftsmanship-title" className="text-3xl font-serif text-gray-900 mb-6">Handcrafted Excellence</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Each piece in our collection is meticulously handcrafted by skilled artisans with decades of experience. We combine traditional jewelry-making techniques with modern precision to create pieces that are both beautiful and enduring.
              </p>
              <p className="text-gray-600 leading-relaxed">
                From the initial sketch to the final polish, every step is performed with care and attention to detail. We use only the finest materials—18K gold, sterling silver, and ethically sourced gemstones—to ensure that your jewelry will be treasured for generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="story-process" className="py-20 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-amber-700 mb-2">Our Process</p>
            <h2 id="process-title" className="text-3xl font-serif text-gray-900">From Vision to Reality</h2>
          </div>
          <div id="process-steps" className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {craftingSteps.map((step, index) => (
              <div key={index} data-testid={`process-step-${index + 1}`} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-medium mb-4">
                  {index + 1}
                </div>
                <h3 className="font-medium text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="story-quality" className="py-20 px-4 bg-amber-50">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div id="quality-content" className="order-2 md:order-1">
              <p className="text-sm uppercase tracking-widest text-amber-700 mb-2">Our Promise</p>
              <h2 id="quality-title" className="text-3xl font-serif text-gray-900 mb-6">Quality You Can Trust</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                We stand behind every piece we create. Our rigorous quality control process ensures that each item meets our exacting standards before it reaches you.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Image src="/images/icon-check.png" alt="" width={20} height={20} className="w-5 h-5 mt-0.5 object-contain" />
                  <div>
                    <h4 className="font-medium text-gray-900">Premium Materials</h4>
                    <p className="text-sm text-gray-600">Only the finest 18K gold, sterling silver, and ethically sourced stones.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Image src="/images/icon-check.png" alt="" width={20} height={20} className="w-5 h-5 mt-0.5 object-contain" />
                  <div>
                    <h4 className="font-medium text-gray-900">Lifetime Warranty</h4>
                    <p className="text-sm text-gray-600">Every piece is backed by our comprehensive warranty.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Image src="/images/icon-check.png" alt="" width={20} height={20} className="w-5 h-5 mt-0.5 object-contain" />
                  <div>
                    <h4 className="font-medium text-gray-900">Expert Craftsmanship</h4>
                    <p className="text-sm text-gray-600">Made by artisans with decades of jewelry-making experience.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div id="quality-image" className="relative aspect-square rounded-2xl overflow-hidden order-1 md:order-2">
              <Image
                src="/images/story-quality.png"
                alt="Quality inspection"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="story-cta" className="py-20 px-4 bg-stone-900 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="cta-title" className="text-3xl font-serif mb-4">Ready to Create Your Piece?</h2>
          <p className="text-stone-300 mb-8">
            Explore our collection and find the perfect way to celebrate your bond with your beloved pet.
          </p>
          <Link
            href="/products"
            id="story-cta-button"
            className="inline-flex items-center justify-center px-8 py-3 bg-white text-gray-900 font-medium rounded-full hover:bg-gray-100 transition-colors"
          >
            Shop Our Collection
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
