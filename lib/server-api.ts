import { prisma } from '@/lib/prisma'
import { Product, InlayOption } from '@/lib/api'

export async function getProducts(filters?: {
  category?: string;
  material?: string;
  minPrice?: number;
  maxPrice?: number;
  canEngrave?: boolean;
  canUploadPhoto?: boolean;
  sort?: string;
}): Promise<{ products: Product[]; filters: any }> {
  const where: any = {}
  
  if (filters?.category) where.category = filters.category
  if (filters?.material) where.material = filters.material
  if (filters?.minPrice || filters?.maxPrice) {
    where.basePrice = {}
    if (filters.minPrice) where.basePrice.gte = filters.minPrice
    if (filters.maxPrice) where.basePrice.lte = filters.maxPrice
  }
  if (filters?.canEngrave === true) where.canEngrave = true
  if (filters?.canUploadPhoto === true) where.canUploadPhoto = true

  let orderBy: any = { createdAt: 'desc' }
  if (filters?.sort === 'price-asc') orderBy = { basePrice: 'asc' }
  if (filters?.sort === 'price-desc') orderBy = { basePrice: 'desc' }
  if (filters?.sort === 'name') orderBy = { name: 'asc' }

  const products = await prisma.product.findMany({
    where,
    include: {
      assets: {
        where: { type: 'image' },
        take: 1
      },
      variants: true
    },
    orderBy
  })

  const categories = await prisma.product.groupBy({
    by: ['category'],
    _count: { category: true }
  })

  const materials = await prisma.product.groupBy({
    by: ['material'],
    _count: { material: true }
  })

  return {
    products: products.map(product => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      category: product.category as 'pendant' | 'ring' | 'bracelet' | 'brooch',
      material: product.material as 'gold' | 'silver' | 'rose-gold',
      basePrice: product.basePrice,
      image: product.assets[0]?.url || `/images/product-${product.category}-${product.material}.png`,
      description: product.description,
      canEngrave: product.canEngrave,
      canUploadPhoto: product.canUploadPhoto,
      canInlay: product.canInlay,
      productionDays: product.productionDays,
    })),
    filters: {
      categories: categories.map(c => ({
        id: c.category,
        name: formatCategoryName(c.category),
        count: c._count.category
      })),
      materials: materials.map(m => ({
        id: m.material,
        name: formatMaterialName(m.material),
        count: m._count.material
      }))
    }
  }
}

export async function getProduct(slug: string): Promise<{ product: Product }> {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      assets: true,
      variants: true
    }
  })

  if (!product) {
    throw new Error('Product not found')
  }

  // Get inlay options for customization
  const inlayOptions = await prisma.inlayOption.findMany()

  return {
    product: {
      id: product.id,
      slug: product.slug,
      name: product.name,
      category: product.category as 'pendant' | 'ring' | 'bracelet' | 'brooch',
      material: product.material as 'gold' | 'silver' | 'rose-gold',
      basePrice: product.basePrice,
      description: product.description,
      canEngrave: product.canEngrave,
      canUploadPhoto: product.canUploadPhoto,
      canInlay: product.canInlay,
      productionDays: product.productionDays,
      images: product.assets.filter(a => a.type === 'image').map(a => a.url),
      glbModel: product.assets.find(a => a.type === 'glb')?.url,
      customizationOptions: {
        engrave: product.canEngrave ? {
          maxLength: 20,
          allowedCharacters: 'alphanumeric'
        } : undefined,
        photo: product.canUploadPhoto ? {
          maxSizeMB: 10,
          allowedFormats: ['jpg', 'png', 'heic'],
          minResolution: 1500
        } : undefined,
        inlay: product.canInlay ? inlayOptions.map(option => ({
          id: option.id,
          name: option.name,
          price: option.price,
          color: option.color || undefined
        })) : undefined
      }
    }
  }
}

function formatCategoryName(category: string): string {
  const names: Record<string, string> = {
    'pendant': 'Pendants',
    'ring': 'Rings',
    'bracelet': 'Bracelets',
    'brooch': 'Brooches'
  }
  return names[category] || category
}

function formatMaterialName(material: string): string {
  const names: Record<string, string> = {
    'gold': '18K Gold',
    'silver': 'Sterling Silver',
    'rose-gold': 'Rose Gold'
  }
  return names[material] || material
}