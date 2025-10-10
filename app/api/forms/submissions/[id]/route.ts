import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Get submission detail
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const submission = await prisma.formSubmission.findUnique({
      where: { id: params.id },
      include: {
        school: {
          select: {
            name: true,
            phone: true,
            email: true,
          },
        },
      },
    })

    if (!submission) {
      return NextResponse.json(
        { success: false, message: 'Submission not found' },
        { status: 404 }
      )
    }

    // Parse uploaded files if exists
    let uploadedFiles = []
    if (submission.uploadedFiles) {
      try {
        uploadedFiles = JSON.parse(submission.uploadedFiles)
      } catch (e) {
        console.error('Error parsing uploaded files:', e)
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...submission,
        uploadedFiles,
      },
    })
  } catch (error) {
    console.error('Error fetching submission:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update submission (status, notes, review)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const updateData: any = {
      updatedAt: new Date(),
    }

    if (body.status) {
      updateData.status = body.status
      
      // If approving or rejecting, mark as reviewed
      if (body.status === 'approved' || body.status === 'rejected') {
        updateData.reviewedAt = new Date()
        updateData.reviewedBy = body.reviewedBy || 'admin'
      }
    }

    if (body.notes !== undefined) {
      updateData.notes = body.notes
    }

    const submission = await prisma.formSubmission.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      message: 'Submission updated successfully',
      data: submission,
    })
  } catch (error) {
    console.error('Error updating submission:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update submission' },
      { status: 500 }
    )
  }
}

// DELETE - Delete submission
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.formSubmission.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Submission deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting submission:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete submission' },
      { status: 500 }
    )
  }
}

