import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'
import { prisma } from '@/lib/prisma'



const UPLOAD_DIR = './uploads'
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/heic']

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const sessionId = formData.get('sessionId') as string
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only JPG, PNG, and HEIC are allowed.' 
      }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 10MB.' 
      }, { status: 400 })
    }

    // Create upload directory if it doesn't exist
    try {
      await mkdir(UPLOAD_DIR, { recursive: true })
    } catch (error) {
      // Directory already exists or other error
    }

    // Generate unique filename
    const fileId = randomUUID()
    const extension = file.name.split('.').pop()
    const filename = `${fileId}.${extension}`
    const filepath = join(UPLOAD_DIR, filename)

    // Save file
    const bytes = await file.arrayBuffer()
    await writeFile(filepath, new Uint8Array(bytes))

    // Save to database
    const uploadedAsset = await prisma.uploadedAsset.create({
      data: {
        filename,
        url: `/uploads/${filename}`,
        size: file.size,
        contentType: file.type,
        sessionId,
        status: 'pending'
      }
    })

    return NextResponse.json({
      id: uploadedAsset.id,
      url: uploadedAsset.url,
      filename: uploadedAsset.filename,
      size: uploadedAsset.size,
      status: uploadedAsset.status
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}