import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'File size exceeds 5MB limit' },
        { status: 400 }
      )
    }

    // Validate file type (images and PDFs only)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file type. Only JPG, PNG, WebP, and PDF allowed' },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const extension = file.name.split('.').pop()
    const filename = `${timestamp}-${randomString}.${extension}`
    
    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filepath = path.join(uploadsDir, filename)
    
    await writeFile(filepath, buffer)

    // Return public URL
    const publicUrl = `/uploads/${filename}`

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        filename,
        originalName: file.name,
        size: file.size,
        type: file.type,
        url: publicUrl
      }
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

// GET endpoint to list uploaded files (optional)
export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    
    if (!existsSync(uploadsDir)) {
      return NextResponse.json({ success: true, data: [] })
    }

    // This is a basic implementation
    // In production, you'd want to use a database to track uploads
    return NextResponse.json({
      success: true,
      message: 'Use database to track uploaded files'
    })
  } catch (error) {
    console.error('Error listing files:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to list files' },
      { status: 500 }
    )
  }
}

