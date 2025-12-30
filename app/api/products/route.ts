import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const material = searchParams.get('material')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const canEngrave = searchParams.get('canEngrave')
    const canUploadPhoto = searchParams.get('canUploadPhoto')
    const sort = searchParams.get('sort') || 'recommended'

    const where: any = {}
    
    if (category) where.category = category
    if (material) where.material = material
    if (minPrice || maxPrice) {
      where.basePrice = {}
      if (minPrice) where.basePrice.gte = parseFloat(minPrice)
      if (maxPrice) where.basePrice.lte = parseFloat(maxPrice)
    }
    if (canEngrave === 'true') where.canEngrave = true
    if (canUploadPhoto === 'true') where.canUploadPhoto = true

    let orderBy: any = { createdAt: 'desc' }
    if (sort === 'price-asc') orderBy = { basePrice: 'asc' }
    if (sort === 'price-desc') orderBy = { basePrice: 'desc' }
    if (sort === 'name') orderBy = { name: 'asc' }

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

    return NextResponse.json({
      products: products.map(product => ({
        ...product,
        image: product.assets[0]?.url || `/images/product-${product.category}-${product.material}.png`
      })),
      filters: {
        categories: categories.map(c => ({
          id: c.category,
          name: c.category,
          count: c._count.category
        })),
        materials: materials.map(m => ({
          id: m.material,
          name: m.material,
          count: m._count.material
        }))
      }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}