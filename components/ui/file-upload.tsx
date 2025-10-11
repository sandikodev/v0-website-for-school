"use client"

import * as React from "react"
import { Upload, X, FileText, Image as ImageIcon, Loader2 } from "lucide-react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onUpload: (fileUrl: string, fileName: string) => void
  onRemove?: () => void
  accept?: string
  maxSize?: number // in MB
  currentFile?: string
  disabled?: boolean
  className?: string
}

export function FileUpload({
  onUpload,
  onRemove,
  accept = "image/*,.pdf",
  maxSize = 5,
  currentFile,
  disabled = false,
  className
}: FileUploadProps) {
  const [isUploading, setIsUploading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [preview, setPreview] = React.useState<string | null>(currentFile || null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`)
      return
    }

    // Show preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreview('file')
    }

    // Upload file
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        onUpload(result.data.url, result.data.originalName)
      } else {
        setError(result.message || 'Upload failed')
        setPreview(null)
      }
    } catch (err) {
      console.error('Upload error:', err)
      setError('Failed to upload file')
      setPreview(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onRemove?.()
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {!preview ? (
        <div
          onClick={handleClick}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            "hover:border-emerald-500 hover:bg-emerald-50/50",
            disabled && "opacity-50 cursor-not-allowed hover:border-gray-300 hover:bg-transparent",
            error && "border-red-300 bg-red-50"
          )}
        >
          <Upload className="h-10 w-10 mx-auto mb-2 text-gray-400" />
          <p className="text-sm font-medium text-gray-700">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {accept.includes('image') && 'Images'} 
            {accept.includes('pdf') && ' or PDFs'} 
            {' '}(max {maxSize}MB)
          </p>
        </div>
      ) : (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {preview === 'file' ? (
                <FileText className="h-10 w-10 text-blue-600" />
              ) : (
                <div className="relative w-16 h-16 rounded overflow-hidden">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  File uploaded successfully
                </p>
                <p className="text-xs text-gray-500">
                  {preview !== 'file' && 'Image file'}
                  {preview === 'file' && 'Document file'}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {isUploading && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Uploading...</span>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

