import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// PUT update message (mark as read)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const message = await prisma.message.update({
      where: { id: params.id },
      data: {
        read: body.read,
      },
    })
    
    console.log('✅ Message updated:', message.id)
    
    return NextResponse.json({
      success: true,
      data: message,
      message: 'Message updated successfully',
    })
    
  } catch (error) {
    console.error('❌ Error updating message:', error)
    
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to update message',
      },
      { status: 500 }
    )
  }
}

// DELETE message
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.message.delete({
      where: { id: params.id },
    })
    
    console.log('✅ Message deleted:', params.id)
    
    return NextResponse.json({
      success: true,
      message: 'Message deleted successfully',
    })
    
  } catch (error) {
    console.error('❌ Error deleting message:', error)
    
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to delete message',
      },
      { status: 500 }
    )
  }
}

