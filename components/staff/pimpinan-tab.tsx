"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, GraduationCap } from "lucide-react"
import type { StaffMember } from "@/types/staff"
import PimpinanDetailModal from "./pimpinan-detail-modal"

interface PimpinanTabProps {
  pimpinanSekolah: StaffMember[]
}

export default function PimpinanTab({ pimpinanSekolah }: PimpinanTabProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get selected pimpinan from URL
  const selectedPimpinanIndex = searchParams.get('pimpinan')
  const selectedPimpinan = selectedPimpinanIndex !== null 
    ? pimpinanSekolah[parseInt(selectedPimpinanIndex)] 
    : null

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

  const handleCloseModal = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('pimpinan')
    
    const newUrl = params.toString() ? `?${params.toString()}` : '/staff?tab=pimpinan'
    router.push(newUrl, { scroll: false })
  }

  return (
    <>
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
              const isSelected = selectedPimpinanIndex === index.toString()
              
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
                        <h3 className="font-bold text-lg mb-1">{pimpinan.nama}</h3>
                        <p className="text-primary font-medium mb-2">{pimpinan.jabatan}</p>
                        {pimpinan.mapel && (
                          <Badge variant="secondary" className="text-xs">
                            {pimpinan.mapel}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Modal for Detail View */}
      <PimpinanDetailModal
        pimpinan={selectedPimpinan}
        isOpen={selectedPimpinan !== null}
        onClose={handleCloseModal}
      />
    </>
  )
}