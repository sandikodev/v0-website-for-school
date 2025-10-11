"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, GraduationCap, ExternalLink } from "lucide-react"
import type { StaffMember } from "@/types/staff"

interface PimpinanTabProps {
  pimpinanSekolah: StaffMember[]
}

export default function PimpinanTab({ pimpinanSekolah }: PimpinanTabProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get selected pimpinan from URL
  const selectedPimpinan = searchParams.get('pimpinan') || null

  const handlePimpinanClick = (index: number) => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Set tab to pimpinan if not already set
    if (!params.get('tab')) {
      params.set('tab', 'pimpinan')
    }
    
    // Set pimpinan parameter
    params.set('pimpinan', index.toString())
    
    const newUrl = `?${params.toString()}`
    router.push(newUrl, { scroll: false })
  }

  const handleRemoveSelection = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('pimpinan')
    
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname
    router.push(newUrl, { scroll: false })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center space-x-2">
          <Crown className="h-6 w-6 text-primary" />
          <span>Pimpinan Sekolah</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {pimpinanSekolah.map((pimpinan, index) => {
            const isSelected = selectedPimpinan === index.toString()
            
            return (
              <Card 
                key={index} 
                className={`bg-muted/30 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:bg-muted/50'
                }`}
                onClick={() => handlePimpinanClick(index)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">{pimpinan.nama}</h3>
                          <p className="text-primary font-medium mb-2">{pimpinan.jabatan}</p>
                          {pimpinan.mapel && (
                            <Badge variant="secondary" className="text-xs">
                              {pimpinan.mapel}
                            </Badge>
                          )}
                        </div>
                        {isSelected && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveSelection()
                            }}
                            className="ml-2 p-1 hover:bg-red-100 rounded-full transition-colors"
                            title="Tutup detail"
                          >
                            <ExternalLink className="h-4 w-4 text-red-500" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Selected State - Show Additional Info */}
                  {isSelected && (
                    <div className="mt-4 pt-4 border-t border-muted-foreground/20">
                      <div className="bg-primary/5 rounded-lg p-4">
                        <h4 className="font-semibold text-sm mb-2 text-primary">Informasi Detail</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Nama Lengkap:</span>
                            <p className="text-muted-foreground">{pimpinan.nama}</p>
                          </div>
                          <div>
                            <span className="font-medium">Jabatan:</span>
                            <p className="text-muted-foreground">{pimpinan.jabatan}</p>
                          </div>
                          {pimpinan.mapel && (
                            <div>
                              <span className="font-medium">Mata Pelajaran:</span>
                              <p className="text-muted-foreground">{pimpinan.mapel}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
        
        {/* URL Info for selected pimpinan */}
        {selectedPimpinan && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>URL untuk bookmark:</strong> 
              <code className="ml-2 px-2 py-1 bg-blue-100 rounded text-xs">
                {window.location.origin}/staff?tab=pimpinan&pimpinan={selectedPimpinan}
              </code>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}