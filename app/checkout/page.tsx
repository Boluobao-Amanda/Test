'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { products } from '@/lib/mock-data';

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    country: 'US',
    zip: '',
    phone: '',
  });

  const cartItems = [
    { productId: '1', quantity: 1, price: 439 },
    { productId: '3', quantity: 2, price: 238 },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const shipping = subtotal > 300 ? 0 : 25;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/orders/ORD-2024-001234`;
  };

  return (
    <main id="checkout-page" className="min-h-screen bg-white">
      <Header />

      <div className="pt-24 pb-16 px-4">
        <div className="mx-auto max-w-6xl">
          <h1 id="checkout-title" className="text-3xl font-serif text-gray-900 mb-8">Checkout</h1>

          <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-12">
            <div id="checkout-form" className="space-y-8">
              <section id="contact-section">
                <h2 className="font-medium text-gray-900 mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm text-gray-600 mb-1">Phone (optional)</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </section>

              <section id="shipping-section">
                <h2 className="font-medium text-gray-900 mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm text-gray-600 mb-1">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm text-gray-600 mb-1">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-sm text-gray-600 mb-1">Address</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="123 Main St"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm text-gray-600 mb-1">City</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="zip" className="block text-sm text-gray-600 mb-1">ZIP / Postal Code</label>
                      <input
                        type="text"
                        id="zip"
                        name="zip"
                        value={formData.zip}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm text-gray-600 mb-1">Country</label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                </div>
              </section>

              <section id="payment-section">
                <h2 className="font-medium text-gray-900 mb-4">Payment Method</h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-amber-400">
                    <input type="radio" name="payment" value="card" defaultChecked className="text-amber-600" />
                    <span className="text-gray-700">Credit / Debit Card</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-amber-400">
                    <input type="radio" name="payment" value="paypal" className="text-amber-600" />
                    <span className="text-gray-700">PayPal</span>
                  </label>
                </div>
                <div id="card-input-placeholder" className="mt-4 p-4 bg-stone-50 rounded-lg">
                  <p className="text-sm text-gray-500 text-center">Card input fields will appear here</p>
                </div>
              </section>

              <div id="customs-notice" className="p-4 bg-amber-50 rounded-lg">
                <h3 className="font-medium text-amber-800 mb-2">Customs & Import Duties</h3>
                <p className="text-sm text-amber-700">
                  International orders may be subject to customs duties and taxes, which are the responsibility of the recipient. These charges are determined by your local customs office and are not included in your order total.
                </p>
              </div>
            </div>

            <div id="checkout-summary" className="lg:sticky lg:top-24 h-fit">
              <div className="bg-stone-50 rounded-xl p-6">
                <h2 className="font-medium text-gray-900 mb-4">Order Summary</h2>

                <div id="summary-items" className="space-y-4 mb-6">
                  {cartItems.map((item, index) => {
                    const product = products.find((p) => p.id === item.productId);
                    if (!product) return null;
                    return (
                      <div key={index} className="flex gap-3">
                        <div className="w-16 h-16 relative rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={product.image} alt={product.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">{product.name}</h4>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          <p className="text-sm font-medium text-gray-900">${item.price}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-3 text-sm border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">${subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">{shipping === 0 ? 'Free' : `$${shipping}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Tax</span>
                    <span className="text-gray-900">Calculated at checkout</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200 flex justify-between font-medium text-lg">
                    <span className="text-gray-900">Total</span>
                    <span id="checkout-total" className="text-gray-900">${total}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  id="place-order-button"
                  className="w-full mt-6 bg-amber-700 text-white py-4 rounded-full font-medium hover:bg-amber-800 transition-colors"
                >
                  Place Order
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By placing your order, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>

              <Link href="/cart" className="block text-center text-sm text-gray-600 hover:text-gray-900 mt-4">
                Return to Cart
              </Link>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </main>
  );
}
