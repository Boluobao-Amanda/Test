import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'



export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: {
        assets: true,
        variants: true
      }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Get inlay options for customization
    const inlayOptions = await prisma.inlayOption.findMany()

    return NextResponse.json({
      product: {
        ...product,
        images: product.assets.filter(a => a.type === 'image').map(a => a.url),
        glbModel: product.assets.find(a => a.type === 'glb')?.url,
        customizationOptions: {
          engrave: product.canEngrave ? {
            maxLength: 20,
            allowedCharacters: 'alphanumeric'
          } : null,
          photo: product.canUploadPhoto ? {
            maxSizeMB: 10,
            allowedFormats: ['jpg', 'png', 'heic'],
            minResolution: 1500
          } : null,
          inlay: product.canInlay ? inlayOptions : null
        }
      }
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}