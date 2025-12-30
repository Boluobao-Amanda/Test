'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { products } from '@/lib/mock-data';

interface CartItemData {
  productId: string;
  quantity: number;
  customization: {
    engraving?: string;
    inlay?: string;
    material: string;
  };
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItemData[]>([
    {
      productId: '1',
      quantity: 1,
      customization: {
        engraving: 'Forever loved',
        inlay: 'diamond',
        material: 'gold',
      },
    },
    {
      productId: '3',
      quantity: 2,
      customization: {
        material: 'silver',
      },
    },
  ]);

  const getProduct = (id: string) => products.find((p) => p.id === id);

  const calculateItemPrice = (item: CartItemData) => {
    const product = getProduct(item.productId);
    if (!product) return 0;
    let price = product.basePrice;
    if (item.customization.material === 'rose-gold') price *= 1.1;
    if (item.customization.material === 'silver') price *= 0.6;
    if (item.customization.inlay === 'diamond') price += 150;
    if (item.customization.inlay === 'sapphire') price += 120;
    return Math.round(price);
  };

  const updateQuantity = (index: number, delta: number) => {
    setCartItems((items) =>
      items.map((item, i) =>
        i === index ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const removeItem = (index: number) => {
    setCartItems((items) => items.filter((_, i) => i !== index));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + calculateItemPrice(item) * item.quantity, 0);
  const shipping = subtotal > 300 ? 0 : 25;
  const total = subtotal + shipping;

  return (
    <main id="cart-page" className="min-h-screen bg-white">
      <Header />

      <div className="pt-24 pb-16 px-4">
        <div className="mx-auto max-w-4xl">
          <h1 id="cart-title" className="text-3xl font-serif text-gray-900 mb-8">Shopping Cart</h1>

          {cartItems.length > 0 ? (
            <div className="grid lg:grid-cols-3 gap-8">
              <div id="cart-items" className="lg:col-span-2 space-y-4">
                {cartItems.map((item, index) => {
                  const product = getProduct(item.productId);
                  if (!product) return null;
                  const itemPrice = calculateItemPrice(item);

                  return (
                    <div
                      key={index}
                      data-testid={`cart-item-${index}`}
                      className="flex gap-4 p-4 bg-stone-50 rounded-xl"
                    >
                      <div className="w-24 h-24 relative rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 id={`cart-item-name-${index}`} className="font-medium text-gray-900">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-500 capitalize">{item.customization.material}</p>
                            {item.customization.engraving && (
                              <p className="text-xs text-gray-400">Engraving: {item.customization.engraving}</p>
                            )}
                            {item.customization.inlay && (
                              <p className="text-xs text-gray-400 capitalize">Inlay: {item.customization.inlay}</p>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(index)}
                            className="p-1 hover:bg-gray-200 rounded"
                            aria-label="Remove item"
                          >
                            <Image src="/images/icon-close.png" alt="Remove" width={16} height={16} className="w-4 h-4 object-contain" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(index, -1)}
                              className="w-8 h-8 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-100"
                            >
                              <Image src="/images/icon-minus.png" alt="-" width={12} height={12} className="w-3 h-3 object-contain" />
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(index, 1)}
                              className="w-8 h-8 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-100"
                            >
                              <Image src="/images/icon-plus.png" alt="+" width={12} height={12} className="w-3 h-3 object-contain" />
                            </button>
                          </div>
                          <p id={`cart-item-price-${index}`} className="font-medium text-gray-900">
                            ${itemPrice * item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div id="cart-summary" className="lg:col-span-1">
                <div className="bg-stone-50 rounded-xl p-6 sticky top-24">
                  <h2 id="summary-title" className="font-medium text-gray-900 mb-4">Order Summary</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">${subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-gray-900">{shipping === 0 ? 'Free' : `$${shipping}`}</span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-xs text-amber-700">Free shipping on orders over $300</p>
                    )}
                    <div className="pt-3 border-t border-gray-200 flex justify-between font-medium">
                      <span className="text-gray-900">Total</span>
                      <span id="cart-total" className="text-gray-900">${total}</span>
                    </div>
                    <p className="text-xs text-gray-500">Customs duties may apply for international orders</p>
                  </div>
                  <Link
                    href="/checkout"
                    id="checkout-button"
                    className="block w-full mt-6 bg-amber-700 text-white text-center py-3 rounded-full font-medium hover:bg-amber-800 transition-colors"
                  >
                    Proceed to Checkout
                  </Link>
                  <Link
                    href="/products"
                    className="block w-full mt-3 text-center text-sm text-gray-600 hover:text-gray-900"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div id="cart-empty" className="text-center py-16">
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-6 py-3 bg-amber-700 text-white font-medium rounded-full hover:bg-amber-800 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
