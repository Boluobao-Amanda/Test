import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'



export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: {
          include: {
            product: true,
            variant: true
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({
      order: {
        ...order,
        shippingAddress: JSON.parse(order.shippingAddress),
        taxInfo: order.taxInfo ? JSON.parse(order.taxInfo) : null,
        items: order.items.map(item => ({
          ...item,
          customization: item.customization ? JSON.parse(item.customization) : null
        }))
      }
    })

  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status, trackingNumber } = body

    const allowedStatuses = ['processing', 'production', 'quality-check', 'shipped', 'delivered', 'cancelled']
    
    if (status && !allowedStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const updateData: any = {}
    if (status) updateData.status = status
    if (trackingNumber) updateData.trackingNumber = trackingNumber
    updateData.updatedAt = new Date()

    const order = await prisma.order.update({
      where: { id: params.id },
      data: updateData,
      include: {
        items: {
          include: {
            product: true,
            variant: true
          }
        }
      }
    })

    return NextResponse.json({
      order: {
        ...order,
        shippingAddress: JSON.parse(order.shippingAddress),
        taxInfo: order.taxInfo ? JSON.parse(order.taxInfo) : null,
        items: order.items.map(item => ({
          ...item,
          customization: item.customization ? JSON.parse(item.customization) : null
        }))
      }
    })

  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}