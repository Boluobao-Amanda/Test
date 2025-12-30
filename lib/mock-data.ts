export interface Product {
  id: string;
  slug: string;
  name: string;
  category: 'pendant' | 'ring' | 'bracelet' | 'brooch';
  material: 'gold' | 'silver' | 'rose-gold';
  basePrice: number;
  image: string;
  description: string;
  customizable: {
    engrave: boolean;
    photo: boolean;
    inlay: boolean;
  };
  productionDays: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customization?: {
    engraving?: string;
    inlayColor?: string;
    size?: string;
  };
}

export interface Order {
  id: string;
  status: 'processing' | 'production' | 'quality-check' | 'shipped' | 'delivered';
  items: CartItem[];
  total: number;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    country: string;
    zip: string;
  };
  createdAt: string;
  estimatedDelivery: string;
  trackingNumber?: string;
}

export const products: Product[] = [
  {
    id: '1',
    slug: 'golden-companion-pendant',
    name: 'Golden Companion Pendant',
    category: 'pendant',
    material: 'gold',
    basePrice: 289,
    image: '/images/product-pendant-gold.png',
    description: 'A timeless 18K gold pendant featuring an elegant dog silhouette. Perfect for keeping your beloved companion close to your heart.',
    customizable: { engrave: true, photo: true, inlay: true },
    productionDays: 14,
  },
  {
    id: '2',
    slug: 'rose-whiskers-ring',
    name: 'Rose Whiskers Ring',
    category: 'ring',
    material: 'rose-gold',
    basePrice: 349,
    image: '/images/product-ring-rosegold.png',
    description: 'A delicate rose gold ring with cat silhouette engraving and optional birthstone. A subtle reminder of your feline friend.',
    customizable: { engrave: true, photo: false, inlay: true },
    productionDays: 12,
  },
  {
    id: '3',
    slug: 'silver-paw-bracelet',
    name: 'Silver Paw Bracelet',
    category: 'bracelet',
    material: 'silver',
    basePrice: 199,
    image: '/images/product-bracelet-silver.png',
    description: 'Sterling silver chain bracelet with paw print charm. A timeless piece to celebrate the bond with your pet.',
    customizable: { engrave: true, photo: false, inlay: false },
    productionDays: 10,
  },
  {
    id: '4',
    slug: 'golden-portrait-brooch',
    name: 'Golden Portrait Brooch',
    category: 'brooch',
    material: 'gold',
    basePrice: 459,
    image: '/images/product-brooch-gold.png',
    description: 'Exquisite 18K gold brooch featuring a custom pet portrait with diamond accent. A true heirloom piece.',
    customizable: { engrave: true, photo: true, inlay: true },
    productionDays: 21,
  },
  {
    id: '5',
    slug: 'feline-grace-pendant',
    name: 'Feline Grace Pendant',
    category: 'pendant',
    material: 'rose-gold',
    basePrice: 319,
    image: '/images/product-pendant-cat.png',
    description: 'Rose gold pendant with elegant cat silhouette and optional precious stones. Perfect for cat lovers.',
    customizable: { engrave: true, photo: true, inlay: true },
    productionDays: 14,
  },
  {
    id: '6',
    slug: 'loyal-friend-ring',
    name: 'Loyal Friend Ring',
    category: 'ring',
    material: 'silver',
    basePrice: 249,
    image: '/images/product-ring-dog.png',
    description: 'Sterling silver ring with Labrador engraving and sapphire accent. For those who treasure their loyal companions.',
    customizable: { engrave: true, photo: false, inlay: true },
    productionDays: 12,
  },
];

export const categories = [
  { id: 'pendant', name: 'Pendants', count: 2 },
  { id: 'ring', name: 'Rings', count: 2 },
  { id: 'bracelet', name: 'Bracelets', count: 1 },
  { id: 'brooch', name: 'Brooches', count: 1 },
];

export const materials = [
  { id: 'gold', name: '18K Gold', priceModifier: 1.0 },
  { id: 'silver', name: 'Sterling Silver', priceModifier: 0.6 },
  { id: 'rose-gold', name: 'Rose Gold', priceModifier: 1.1 },
];

export const inlayOptions = [
  { id: 'diamond', name: 'Diamond', price: 150 },
  { id: 'sapphire', name: 'Sapphire', price: 120 },
  { id: 'ruby', name: 'Ruby', price: 130 },
  { id: 'emerald', name: 'Emerald', price: 125 },
  { id: 'birthstone', name: 'Birthstone', price: 100 },
];

export const sampleOrder: Order = {
  id: 'ORD-2024-001234',
  status: 'production',
  items: [
    {
      product: products[0],
      quantity: 1,
      customization: {
        engraving: 'Forever in my heart',
        inlayColor: 'diamond',
        size: 'Medium',
      },
    },
  ],
  total: 439,
  shippingAddress: {
    name: 'Sarah Johnson',
    street: '123 Pet Lover Lane',
    city: 'New York',
    country: 'United States',
    zip: '10001',
  },
  createdAt: '2024-12-20',
  estimatedDelivery: '2025-01-10',
  trackingNumber: undefined,
};
