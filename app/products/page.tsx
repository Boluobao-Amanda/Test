import { Suspense } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductList from '@/components/ProductList'
import { getProducts } from '@/lib/server-api'

interface PageProps {
  searchParams: {
    category?: string
    material?: string
    minPrice?: string
    maxPrice?: string
    canEngrave?: string
    canUploadPhoto?: string
    sort?: string
  }
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const filters = {
    category: searchParams.category,
    material: searchParams.material,
    minPrice: searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined,
    canEngrave: searchParams.canEngrave === 'true',
    canUploadPhoto: searchParams.canUploadPhoto === 'true',
    sort: searchParams.sort || 'recommended',
  }

  const { products, filters: availableFilters } = await getProducts(filters)

  return (
    <main id="products-page" className="min-h-screen bg-white">
      <Header />

      <div className="pt-24 pb-16 px-4 bg-stone-50">
        <div className="mx-auto max-w-7xl text-center">
          <h1 id="products-title" className="text-4xl font-serif text-gray-900 mb-4">
            Our Collection
          </h1>
          <p id="products-subtitle" className="text-gray-600 max-w-2xl mx-auto">
            Discover handcrafted pet memorial jewelry, each piece designed to keep your beloved companion close to your heart.
          </p>
        </div>
      </div>

      <Suspense fallback={<div>Loading products...</div>}>
        <ProductList
          initialProducts={products}
          availableFilters={availableFilters}
          currentFilters={filters}
        />
      </Suspense>

      <Footer />
    </main>
  )
}