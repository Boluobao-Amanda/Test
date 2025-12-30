import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Create inlay options
  const inlayOptions = [
    { name: 'Diamond', price: 150, color: '#ffffff' },
    { name: 'Sapphire', price: 120, color: '#0f4c81' },
    { name: 'Ruby', price: 130, color: '#e0115f' },
    { name: 'Emerald', price: 125, color: '#50c878' },
    { name: 'Birthstone', price: 100, color: '#ffd700' },
  ]

  for (const option of inlayOptions) {
    await prisma.inlayOption.upsert({
      where: { name: option.name },
      update: {},
      create: option
    })
  }

  // Create products
  const products = [
    {
      slug: 'golden-companion-pendant',
      name: 'Golden Companion Pendant',
      category: 'pendant',
      material: 'gold',
      basePrice: 289,
      description: 'A timeless 18K gold pendant featuring an elegant dog silhouette. Perfect for keeping your beloved companion close to your heart.',
      canEngrave: true,
      canUploadPhoto: true,
      canInlay: true,
      productionDays: 14,
    },
    {
      slug: 'rose-whiskers-ring',
      name: 'Rose Whiskers Ring',
      category: 'ring',
      material: 'rose-gold',
      basePrice: 349,
      description: 'A delicate rose gold ring with cat silhouette engraving and optional birthstone. A subtle reminder of your feline friend.',
      canEngrave: true,
      canUploadPhoto: false,
      canInlay: true,
      productionDays: 12,
    },
    {
      slug: 'silver-paw-bracelet',
      name: 'Silver Paw Bracelet',
      category: 'bracelet',
      material: 'silver',
      basePrice: 199,
      description: 'Sterling silver chain bracelet with paw print charm. A timeless piece to celebrate the bond with your pet.',
      canEngrave: true,
      canUploadPhoto: false,
      canInlay: false,
      productionDays: 10,
    },
    {
      slug: 'golden-portrait-brooch',
      name: 'Golden Portrait Brooch',
      category: 'brooch',
      material: 'gold',
      basePrice: 459,
      description: 'Exquisite 18K gold brooch featuring a custom pet portrait with diamond accent. A true heirloom piece.',
      canEngrave: true,
      canUploadPhoto: true,
      canInlay: true,
      productionDays: 21,
    },
    {
      slug: 'feline-grace-pendant',
      name: 'Feline Grace Pendant',
      category: 'pendant',
      material: 'rose-gold',
      basePrice: 319,
      description: 'Rose gold pendant with elegant cat silhouette and optional precious stones. Perfect for cat lovers.',
      canEngrave: true,
      canUploadPhoto: true,
      canInlay: true,
      productionDays: 14,
    },
    {
      slug: 'loyal-friend-ring',
      name: 'Loyal Friend Ring',
      category: 'ring',
      material: 'silver',
      basePrice: 249,
      description: 'Sterling silver ring with Labrador engraving and sapphire accent. For those who treasure their loyal companions.',
      canEngrave: true,
      canUploadPhoto: false,
      canInlay: true,
      productionDays: 12,
    },
  ]

  for (const productData of products) {
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: productData
    })

    // Create assets (images) for each product
    await prisma.asset.create({
      data: {
        productId: product.id,
        type: 'image',
        url: `/images/product-${product.category}-${product.material}.png`,
        filename: `product-${product.category}-${product.material}.png`,
        size: 1024000
      }
    })

    // Create variants for different sizes (for rings and bracelets)
    if (product.category === 'ring' || product.category === 'bracelet') {
      const sizes = ['S', 'M', 'L']
      for (const size of sizes) {
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            material: product.material,
            size: size,
            priceDelta: size === 'S' ? -10 : size === 'L' ? 10 : 0
          }
        })
      }
    }
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })