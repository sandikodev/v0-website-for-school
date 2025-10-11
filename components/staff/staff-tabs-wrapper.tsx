"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PimpinanTab from "./pimpinan-tab"
import YasmaTab from "./yasma-tab"
import WaliKelasTab from "./wali-kelas-tab"
import PengajarTab from "./pengajar-tab"
import type { StaffMember, PengurusYasma, WaliKelas, StafPengajar } from "@/types/staff"

interface StaffTabsWrapperProps {
  pimpinanSekolah: StaffMember[]
  pengurusYasma: PengurusYasma[]
  waliKelas: WaliKelas[]
  stafPengajar: StafPengajar[]
}

const TAB_MAPPING = {
  pimpinan: "pimpinan",
  yasma: "yasma", 
  wali: "wali",
  pengajar: "pengajar"
} as const

type TabValue = keyof typeof TAB_MAPPING

export default function StaffTabsWrapper({ 
  pimpinanSekolah, 
  pengurusYasma, 
  waliKelas, 
  stafPengajar 
}: StaffTabsWrapperProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get tab from URL or default to 'pimpinan'
  const currentTab = (searchParams.get('tab') as TabValue) || 'pimpinan'
  
  // Ensure the tab value is valid, fallback to 'pimpinan'
  const validTab = TAB_MAPPING[currentTab] ? currentTab : 'pimpinan'

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value === 'pimpinan') {
      // Remove tab param for default tab
      params.delete('tab')
    } else {
      params.set('tab', value)
    }
    
    // Update URL without page reload
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname
    router.push(newUrl, { scroll: false })
  }

  return (
    <Tabs value={validTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="pimpinan">Pimpinan</TabsTrigger>
        <TabsTrigger value="yasma">YASMA</TabsTrigger>
        <TabsTrigger value="wali">Wali Kelas</TabsTrigger>
        <TabsTrigger value="pengajar">Pengajar</TabsTrigger>
      </TabsList>

      <TabsContent value="pimpinan" className="space-y-8">
        <PimpinanTab pimpinanSekolah={pimpinanSekolah} />
      </TabsContent>

      <TabsContent value="yasma" className="space-y-8">
        <YasmaTab pengurusYasma={pengurusYasma} />
      </TabsContent>

      <TabsContent value="wali" className="space-y-8">
        <WaliKelasTab waliKelas={waliKelas} />
      </TabsContent>

      <TabsContent value="pengajar" className="space-y-8">
        <PengajarTab stafPengajar={stafPengajar} />
      </TabsContent>
    </Tabs>
  )
}
