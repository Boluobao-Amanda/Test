import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' })

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      items, 
      customerEmail, 
      shippingAddress, 
      currency = 'USD' 
    } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 })
    }

    if (!customerEmail || !shippingAddress) {
      return NextResponse.json({ 
        error: 'Customer email and shipping address are required' 
      }, { status: 400 })
    }

    // Calculate totals
    let subtotal = 0
    const orderItems = []

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { variants: true }
      })

      if (!product) {
        return NextResponse.json({ 
          error: `Product not found: ${item.productId}` 
        }, { status: 400 })
      }

      let unitPrice = product.basePrice
      
      // Apply variant price delta if specified
      if (item.variantId) {
        const variant = product.variants.find(v => v.id === item.variantId)
        if (variant) {
          unitPrice += variant.priceDelta
        }
      }

      // Apply customization price modifiers
      if (item.customization?.inlay) {
        const inlayOption = await prisma.inlayOption.findUnique({
          where: { id: item.customization.inlay }
        })
        if (inlayOption) {
          unitPrice += inlayOption.price
        }
      }

      const totalPrice = unitPrice * (item.quantity || 1)
      subtotal += totalPrice

      orderItems.push({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity || 1,
        unitPrice,
        totalPrice,
        customization: item.customization ? JSON.stringify(item.customization) : null
      })
    }

    // Calculate shipping (simplified - could be more complex based on location/weight)
    const shippingAmount = subtotal >= 300 ? 0 : 25 // Free shipping over $300

    // Calculate tax (simplified - would need proper tax calculation service)
    const taxAmount = subtotal * 0.1 // 10% placeholder

    const totalAmount = subtotal + shippingAmount + taxAmount

    // Create order in database
    const order = await prisma.order.create({
      data: {
        customerEmail,
        currency,
        subtotal,
        shippingAmount,
        taxAmount,
        totalAmount,
        shippingAddress: JSON.stringify(shippingAddress),
        items: {
          create: orderItems
        }
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true
          }
        }
      }
    })

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        orderId: order.id,
        customerEmail
      },
      automatic_payment_methods: {
        enabled: true
      }
    })

    // Update order with Stripe payment ID
    await prisma.order.update({
      where: { id: order.id },
      data: { stripePaymentId: paymentIntent.id }
    })

    return NextResponse.json({
      orderId: order.id,
      clientSecret: paymentIntent.client_secret,
      totalAmount,
      currency,
      estimatedDelivery: new Date(Date.now() + (order.items[0].product.productionDays * 24 * 60 * 60 * 1000))
    })

  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}