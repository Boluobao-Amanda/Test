export interface Product {
  id: string;
  slug: string;
  name: string;
  category: 'pendant' | 'ring' | 'bracelet' | 'brooch';
  material: 'gold' | 'silver' | 'rose-gold';
  basePrice: number;
  image?: string;
  images?: string[];
  glbModel?: string;
  description: string;
  canEngrave: boolean;
  canUploadPhoto: boolean;
  canInlay: boolean;
  productionDays: number;
  customizationOptions?: {
    engrave?: {
      maxLength: number;
      allowedCharacters: string;
    };
    photo?: {
      maxSizeMB: number;
      allowedFormats: string[];
      minResolution: number;
    };
    inlay?: InlayOption[];
  };
}

export interface InlayOption {
  id: string;
  name: string;
  price: number;
  color?: string;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  customization?: {
    engraving?: string;
    inlay?: string;
    uploadedPhotoId?: string;
    size?: string;
  };
}

export interface Order {
  id: string;
  status: 'pending' | 'processing' | 'production' | 'quality-check' | 'shipped' | 'delivered' | 'cancelled';
  currency: string;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
  customerEmail: string;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    country: string;
    zip: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: string;
  items: OrderItemWithProduct[];
  createdAt: string;
}

export interface OrderItemWithProduct {
  id: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customization?: any;
  product: Product;
}

const API_BASE = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000'

export async function fetchProducts(filters?: {
  category?: string;
  material?: string;
  minPrice?: number;
  maxPrice?: number;
  canEngrave?: boolean;
  canUploadPhoto?: boolean;
  sort?: string;
}): Promise<{ products: Product[]; filters: any }> {
  const params = new URLSearchParams()
  
  if (filters?.category) params.append('category', filters.category)
  if (filters?.material) params.append('material', filters.material)
  if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString())
  if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString())
  if (filters?.canEngrave) params.append('canEngrave', 'true')
  if (filters?.canUploadPhoto) params.append('canUploadPhoto', 'true')
  if (filters?.sort) params.append('sort', filters.sort)

  const response = await fetch(`${API_BASE}/api/products?${params.toString()}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }
  
  return response.json()
}

export async function fetchProduct(slug: string): Promise<{ product: Product }> {
  const response = await fetch(`${API_BASE}/api/products/${slug}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch product')
  }
  
  return response.json()
}

export async function uploadFile(file: File, sessionId: string): Promise<{
  id: string;
  url: string;
  filename: string;
  size: number;
  status: string;
}> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('sessionId', sessionId)

  const response = await fetch(`${API_BASE}/api/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Upload failed')
  }

  return response.json()
}

export async function createCheckout(data: {
  items: CartItem[];
  customerEmail: string;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    country: string;
    zip: string;
  };
  currency?: string;
}): Promise<{
  orderId: string;
  clientSecret: string;
  totalAmount: number;
  currency: string;
  estimatedDelivery: string;
}> {
  const response = await fetch(`${API_BASE}/api/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Checkout failed')
  }

  return response.json()
}

export async function fetchOrder(id: string): Promise<{ order: Order }> {
  const response = await fetch(`${API_BASE}/api/orders/${id}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch order')
  }
  
  return response.json()
}