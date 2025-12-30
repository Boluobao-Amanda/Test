'use client'

import { useState, useMemo, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Product, uploadFile } from '@/lib/api'

interface ProductDetailClientProps {
  product: Product
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedMaterial, setSelectedMaterial] = useState(product.material)
  const [engraving, setEngraving] = useState('')
  const [selectedInlay, setSelectedInlay] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const calculatedPrice = useMemo(() => {
    let price = product.basePrice
    
    if (selectedInlay && product.customizationOptions?.inlay) {
      const inlay = product.customizationOptions.inlay.find(i => i.id === selectedInlay)
      if (inlay) price += inlay.price
    }
    
    return price * quantity
  }, [product.basePrice, selectedInlay, quantity, product.customizationOptions?.inlay])

  const handlePhotoUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadError(null)

    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const uploadResult = await uploadFile(file, sessionId)
      setUploadedPhoto(uploadResult.url)
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }, [])

  const addToCart = useCallback(() => {
    const cartItem = {
      productId: product.id,
      quantity,
      customization: {
        ...(engraving && { engraving }),
        ...(selectedInlay && { inlay: selectedInlay }),
        ...(uploadedPhoto && { uploadedPhotoUrl: uploadedPhoto }),
      }
    }

    // Store in localStorage for now (could be replaced with cart context/store)
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
    existingCart.push(cartItem)
    localStorage.setItem('cart', JSON.stringify(existingCart))

    alert('Added to cart!')
  }, [product.id, quantity, engraving, selectedInlay, uploadedPhoto])

  if (!product) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-gray-500">Product not found</p>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main id="product-detail-page" className="min-h-screen bg-white">
      <Header />

      <div className="pt-24 px-4">
        <div className="mx-auto max-w-7xl">
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm">
              <li><Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link></li>
              <li className="text-gray-400">/</li>
              <li><Link href="/products" className="text-gray-500 hover:text-gray-700">Products</Link></li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-medium">{product.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div id="product-media" className="space-y-4">
              <div className="aspect-square relative bg-stone-100 rounded-2xl overflow-hidden">
                <Image
                  src={product.image || product.images?.[0] || `/images/product-${product.category}-${product.material}.png`}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(1, 5).map((image, index) => (
                    <div key={index} className="aspect-square relative bg-stone-100 rounded-lg overflow-hidden">
                      <Image
                        src={image}
                        alt={`${product.name} view ${index + 2}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info & Configuration */}
            <div id="product-info" className="space-y-8">
              <div>
                <p className="text-sm uppercase tracking-wider text-amber-700 mb-2">{product.category}</p>
                <h1 className="text-3xl font-serif text-gray-900 mb-4">{product.name}</h1>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-2xl font-semibold text-gray-900">${calculatedPrice.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">{product.productionDays} days production time</p>
                </div>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Customization Options */}
              <div id="customization-options" className="space-y-6">
                {product.canEngrave && product.customizationOptions?.engrave && (
                  <div id="engraving-section">
                    <label htmlFor="engraving-input" className="block text-sm font-medium text-gray-900 mb-2">
                      Personal Engraving (optional)
                    </label>
                    <input
                      id="engraving-input"
                      type="text"
                      value={engraving}
                      onChange={(e) => setEngraving(e.target.value.slice(0, product.customizationOptions?.engrave?.maxLength || 20))}
                      placeholder="Enter text to engrave..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      maxLength={product.customizationOptions.engrave.maxLength}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {engraving.length}/{product.customizationOptions.engrave.maxLength} characters
                    </p>
                  </div>
                )}

                {product.canUploadPhoto && product.customizationOptions?.photo && (
                  <div id="photo-upload-section">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Upload Pet Photo (optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                      {uploadedPhoto ? (
                        <div className="space-y-3">
                          <Image src={uploadedPhoto} alt="Uploaded photo" width={100} height={100} className="mx-auto rounded-lg" />
                          <button
                            onClick={() => setUploadedPhoto(null)}
                            className="text-sm text-amber-700 hover:text-amber-800"
                          >
                            Remove photo
                          </button>
                        </div>
                      ) : (
                        <div>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/heic"
                            onChange={handlePhotoUpload}
                            disabled={uploading}
                            className="hidden"
                            id="photo-upload"
                          />
                          <label
                            htmlFor="photo-upload"
                            className="cursor-pointer inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 font-medium"
                          >
                            {uploading ? 'Uploading...' : 'Choose Photo'}
                          </label>
                          <p className="text-xs text-gray-500 mt-2">
                            Max {product.customizationOptions.photo.maxSizeMB}MB • {product.customizationOptions.photo.allowedFormats.join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                    {uploadError && (
                      <p className="text-sm text-red-600 mt-2">{uploadError}</p>
                    )}
                  </div>
                )}

                {product.canInlay && product.customizationOptions?.inlay && (
                  <div id="inlay-section">
                    <label className="block text-sm font-medium text-gray-900 mb-3">Inlay Stone (optional)</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setSelectedInlay(null)}
                        className={`p-3 border rounded-lg text-left ${
                          !selectedInlay ? 'border-amber-500 bg-amber-50 text-amber-800' : 'border-gray-200 text-gray-600'
                        }`}
                      >
                        <span className="block font-medium">None</span>
                        <span className="text-sm">No additional cost</span>
                      </button>
                      {product.customizationOptions.inlay.map((inlay) => (
                        <button
                          key={inlay.id}
                          onClick={() => setSelectedInlay(inlay.id)}
                          className={`p-3 border rounded-lg text-left ${
                            selectedInlay === inlay.id ? 'border-amber-500 bg-amber-50 text-amber-800' : 'border-gray-200 text-gray-600'
                          }`}
                        >
                          <span className="block font-medium">{inlay.name}</span>
                          <span className="text-sm">+${inlay.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div id="quantity-section">
                  <label className="block text-sm font-medium text-gray-900 mb-2">Quantity</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <Image src="/images/icon-minus.png" alt="Decrease" width={16} height={16} />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <Image src="/images/icon-plus.png" alt="Increase" width={16} height={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Add to Cart */}
              <div id="add-to-cart-section" className="pt-6 border-t border-gray-200">
                <button
                  onClick={addToCart}
                  className="w-full bg-amber-700 text-white py-4 px-8 rounded-full font-medium hover:bg-amber-800 transition-colors mb-4"
                >
                  Add to Cart • ${calculatedPrice.toFixed(2)}
                </button>
                <div className="grid grid-cols-3 gap-4 text-center text-sm text-gray-500">
                  <div>
                    <p className="font-medium">Free Shipping</p>
                    <p>Orders over $300</p>
                  </div>
                  <div>
                    <p className="font-medium">Secure Payment</p>
                    <p>SSL Protected</p>
                  </div>
                  <div>
                    <p className="font-medium">Quality Guarantee</p>
                    <p>Lifetime warranty</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="mt-16 border-t border-gray-200 pt-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Materials & Care</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• {product.material === 'gold' ? '18K Gold' : product.material === 'silver' ? 'Sterling Silver' : 'Rose Gold'}</li>
                  <li>• Hypoallergenic materials</li>
                  <li>• Professional cleaning recommended</li>
                  <li>• Store in provided jewelry box</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Shipping & Returns</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• {product.productionDays} days production time</li>
                  <li>• Express worldwide shipping</li>
                  <li>• 30-day return policy</li>
                  <li>• Custom pieces are non-returnable</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Size Guide</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Pendant chain: 18" (adjustable)</li>
                  <li>• Ring sizes: 5-10 available</li>
                  <li>• Bracelet: 7" (adjustable)</li>
                  <li>• Contact us for custom sizing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}