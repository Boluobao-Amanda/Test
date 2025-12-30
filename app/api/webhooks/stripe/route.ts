import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' })
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentSuccess(paymentIntent)
        break
      
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent
        await handlePaymentFailure(failedPayment)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata.orderId

  if (!orderId) {
    console.error('No order ID in payment intent metadata')
    return
  }

  try {
    // Update order status
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'paid',
        status: 'processing',
        updatedAt: new Date()
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    // Calculate estimated delivery date
    const maxProductionDays = Math.max(...order.items.map(item => item.product.productionDays))
    const estimatedDelivery = new Date()
    estimatedDelivery.setDate(estimatedDelivery.getDate() + maxProductionDays + 7) // Add shipping time

    await prisma.order.update({
      where: { id: orderId },
      data: { estimatedDelivery }
    })

    // Here you could send confirmation email
    console.log(`Payment succeeded for order ${orderId}`)

  } catch (error) {
    console.error('Error handling payment success:', error)
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata.orderId

  if (!orderId) {
    console.error('No order ID in payment intent metadata')
    return
  }

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'failed',
        status: 'cancelled',
        updatedAt: new Date()
      }
    })

    console.log(`Payment failed for order ${orderId}`)

  } catch (error) {
    console.error('Error handling payment failure:', error)
  }
}