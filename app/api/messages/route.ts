import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET all messages
export async function GET() {
  try {
    console.log('📨 Fetching messages...')
    
    const messages = await prisma.message.findMany({
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    console.log(`✅ Found ${messages.length} messages`)
    
    return NextResponse.json({
      success: true,
      data: messages,
    })
    
  } catch (error) {
    console.error('❌ Error fetching messages:', error)
    
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to fetch messages',
      },
      { status: 500 }
    )
  }
}

