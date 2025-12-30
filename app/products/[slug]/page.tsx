import { notFound } from 'next/navigation'
import ProductDetailClient from '@/components/ProductDetailClient'
import { getProduct } from '@/lib/server-api'

interface ProductDetailPageProps {
  params: { slug: string }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  try {
    const { product } = await getProduct(params.slug)
    
    return <ProductDetailClient product={product} />
  } catch (error) {
    notFound()
  }
}