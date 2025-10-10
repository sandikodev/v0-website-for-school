import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const jalur = searchParams.get('jalur')
    const gelombang = searchParams.get('gelombang')

    // Build where clause
    const where: any = {}

    if (status && status !== 'all') {
      where.status = status
    }

    if (search) {
      where.OR = [
        { namaLengkap: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { registrationNumber: { contains: search, mode: 'insensitive' } },
        { noHPOrangtua: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (jalur && jalur !== 'all') {
      where.jalurPendaftaran = jalur
    }

    if (gelombang && gelombang !== 'all') {
      where.gelombangPendaftaran = gelombang
    }

    // Get submissions
    const submissions = await prisma.formSubmission.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        school: {
          select: {
            name: true,
          },
        },
      },
    })

    // Get counts for stats
    const stats = await prisma.formSubmission.groupBy({
      by: ['status'],
      _count: {
        _all: true,
      },
    })

    const statusCounts = {
      total: submissions.length,
      pending: stats.find(s => s.status === 'pending')?._count._all || 0,
      reviewed: stats.find(s => s.status === 'reviewed')?._count._all || 0,
      approved: stats.find(s => s.status === 'approved')?._count._all || 0,
      rejected: stats.find(s => s.status === 'rejected')?._count._all || 0,
    }

    return NextResponse.json({
      success: true,
      data: {
        submissions,
        stats: statusCounts,
      },
    })
  } catch (error) {
    console.error('Error fetching submissions:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

