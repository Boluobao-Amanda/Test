'use client'

import { useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ProductCard from './ProductCard'
import { Product } from '@/lib/api'

interface ProductListProps {
  initialProducts: Product[]
  availableFilters: {
    categories: Array<{ id: string; name: string; count: number }>
    materials: Array<{ id: string; name: string; count: number }>
  }
  currentFilters: {
    category?: string
    material?: string
    minPrice?: number
    maxPrice?: number
    canEngrave?: boolean
    canUploadPhoto?: boolean
    sort?: string
  }
}

export default function ProductList({ initialProducts, availableFilters, currentFilters }: ProductListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [products] = useState<Product[]>(initialProducts)

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams)
    
    if (value && value !== 'null') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    
    router.push(`/products?${params.toString()}`)
  }

  const clearAllFilters = () => {
    router.push('/products')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside id="filters-sidebar" className="w-full lg:w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            <div id="filter-category">
              <h3 className="font-medium text-gray-900 mb-3">Category</h3>
              <div className="space-y-2">
                <button
                  onClick={() => updateFilter('category', null)}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${!currentFilters.category ? 'bg-amber-100 text-amber-800' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  All Categories
                </button>
                {availableFilters.categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => updateFilter('category', cat.id)}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${currentFilters.category === cat.id ? 'bg-amber-100 text-amber-800' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    {cat.name} ({cat.count})
                  </button>
                ))}
              </div>
            </div>

            <div id="filter-material">
              <h3 className="font-medium text-gray-900 mb-3">Material</h3>
              <div className="space-y-2">
                <button
                  onClick={() => updateFilter('material', null)}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${!currentFilters.material ? 'bg-amber-100 text-amber-800' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  All Materials
                </button>
                {availableFilters.materials.map((mat) => (
                  <button
                    key={mat.id}
                    onClick={() => updateFilter('material', mat.id)}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${currentFilters.material === mat.id ? 'bg-amber-100 text-amber-800' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    {mat.name} ({mat.count})
                  </button>
                ))}
              </div>
            </div>

            <div id="filter-customization">
              <h3 className="font-medium text-gray-900 mb-3">Customization</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentFilters.canEngrave || false}
                    onChange={(e) => updateFilter('canEngrave', e.target.checked ? 'true' : null)}
                    className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-sm text-gray-600">Engravable</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentFilters.canUploadPhoto || false}
                    onChange={(e) => updateFilter('canUploadPhoto', e.target.checked ? 'true' : null)}
                    className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-sm text-gray-600">Photo Customizable</span>
                </label>
              </div>
            </div>

            {(currentFilters.category || currentFilters.material || currentFilters.canEngrave || currentFilters.canUploadPhoto) && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-amber-700 hover:text-amber-800 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        </aside>

        <div id="products-content" className="flex-1">
          <div id="products-toolbar" className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-600">
              {products.length} product{products.length !== 1 ? 's' : ''}
            </p>
            <select
              id="sort-select"
              value={currentFilters.sort || 'recommended'}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="recommended">Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </div>

          {products.length > 0 ? (
            <div id="products-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div id="no-products" className="text-center py-16">
              <p className="text-gray-500">No products match your filters.</p>
              <button
                onClick={clearAllFilters}
                className="mt-4 text-amber-700 hover:text-amber-800 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}