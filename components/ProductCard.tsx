import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/api';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      data-testid={`product-card-${product.id}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
    >
      <div id={`product-image-${product.id}`} className="aspect-square relative bg-stone-100 overflow-hidden">
        <Image
          src={product.image || `/images/product-${product.category}-${product.material}.png`}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.canUploadPhoto && (
          <span className="absolute top-3 left-3 bg-amber-600 text-white text-xs px-2 py-1 rounded-full">
            Photo Custom
          </span>
        )}
      </div>
      <div className="p-4">
        <p id={`product-category-${product.id}`} className="text-xs uppercase tracking-wider text-amber-700 mb-1">
          {product.category}
        </p>
        <h3 id={`product-name-${product.id}`} className="font-medium text-gray-900 group-hover:text-amber-700 transition-colors">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center justify-between">
          <p id={`product-price-${product.id}`} className="text-gray-900 font-semibold">
            ${product.basePrice}
          </p>
          <div className="flex gap-1">
            {product.canEngrave && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Engrave</span>
            )}
            {product.canInlay && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Inlay</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
