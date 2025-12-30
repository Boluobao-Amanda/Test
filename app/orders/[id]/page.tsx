import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { sampleOrder } from '@/lib/mock-data';

export default function OrderDetailPage() {
  const order = sampleOrder;

  const statusSteps = [
    { key: 'processing', label: 'Order Confirmed' },
    { key: 'production', label: 'In Production' },
    { key: 'quality-check', label: 'Quality Check' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' },
  ];

  const currentStepIndex = statusSteps.findIndex((s) => s.key === order.status);

  return (
    <main id="order-detail-page" className="min-h-screen bg-white">
      <Header />

      <div className="pt-24 pb-16 px-4">
        <div className="mx-auto max-w-4xl">
          <div id="order-header" className="mb-8">
            <Link href="/" className="text-sm text-amber-700 hover:text-amber-800 mb-4 inline-block">
              Back to Home
            </Link>
            <h1 id="order-title" className="text-3xl font-serif text-gray-900">Order {order.id}</h1>
            <p className="text-gray-500 mt-1">Placed on {order.createdAt}</p>
          </div>

          <section id="order-status" className="bg-stone-50 rounded-xl p-6 mb-8">
            <h2 className="font-medium text-gray-900 mb-6">Order Status</h2>
            <div id="status-tracker" className="relative">
              <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200">
                <div
                  className="h-full bg-amber-600 transition-all"
                  style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                />
              </div>
              <div className="relative flex justify-between">
                {statusSteps.map((step, index) => (
                  <div
                    key={step.key}
                    data-testid={`status-step-${step.key}`}
                    className="flex flex-col items-center"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                        index <= currentStepIndex
                          ? 'bg-amber-600 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {index < currentStepIndex ? (
                        <Image src="/images/icon-check.png" alt="" width={16} height={16} className="w-4 h-4 object-contain" />
                      ) : (
                        <span className="text-xs">{index + 1}</span>
                      )}
                    </div>
                    <p
                      className={`text-xs mt-2 text-center max-w-20 ${
                        index <= currentStepIndex ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div id="status-message" className="mt-8 text-center">
              <p className="text-amber-700 font-medium">Your order is currently in production</p>
              <p className="text-sm text-gray-600 mt-1">
                Estimated delivery: {order.estimatedDelivery}
              </p>
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-8">
            <section id="order-items" className="bg-stone-50 rounded-xl p-6">
              <h2 className="font-medium text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} data-testid={`order-item-${index}`} className="flex gap-4">
                    <div className="w-20 h-20 relative rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      {item.customization?.engraving && (
                        <p className="text-xs text-gray-400">Engraving: {item.customization.engraving}</p>
                      )}
                      {item.customization?.inlayColor && (
                        <p className="text-xs text-gray-400">Inlay: {item.customization.inlayColor}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="order-summary" className="bg-stone-50 rounded-xl p-6">
              <h2 className="font-medium text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${order.total - 25}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">$25</span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-between font-medium">
                  <span className="text-gray-900">Total</span>
                  <span id="order-total" className="text-gray-900">${order.total}</span>
                </div>
              </div>
            </section>

            <section id="shipping-address" className="bg-stone-50 rounded-xl p-6">
              <h2 className="font-medium text-gray-900 mb-4">Shipping Address</h2>
              <address className="not-italic text-sm text-gray-600">
                <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.zip}</p>
                <p>{order.shippingAddress.country}</p>
              </address>
            </section>

            <section id="order-help" className="bg-stone-50 rounded-xl p-6">
              <h2 className="font-medium text-gray-900 mb-4">Need Help?</h2>
              <p className="text-sm text-gray-600 mb-4">
                If you have any questions about your order, please contact our support team.
              </p>
              <a
                href="mailto:support@petslove.com"
                className="inline-flex items-center text-sm text-amber-700 hover:text-amber-800"
              >
                support@petslove.com
              </a>
            </section>
          </div>

          <section id="customs-info" className="mt-8 p-6 bg-amber-50 rounded-xl">
            <h2 className="font-medium text-amber-800 mb-2">Customs & Import Information</h2>
            <p className="text-sm text-amber-700">
              International shipments may be subject to customs duties and taxes. These charges are determined by your local customs office and are the responsibility of the recipient. Delivery times may vary due to customs processing.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
