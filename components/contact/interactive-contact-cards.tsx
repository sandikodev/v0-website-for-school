"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Clock, Copy, ExternalLink } from "lucide-react"
import { toast } from "sonner"

interface OfficeStatusBadgeProps {
  isOfficeOpen: boolean
}

export default function InteractiveContactCards({ isOfficeOpen }: OfficeStatusBadgeProps) {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} tersalin ke clipboard!`)
  }

  return (
    <div className="space-y-3">
      {/* Row 1: Address + Phone (2 cols on md+) */}
      <div className="grid md:grid-cols-2 gap-3">
        {/* Address Card */}
        <Card className="py-0 group hover:shadow-lg transition-all duration-300 hover:border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start space-x-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base mb-1.5 flex items-center gap-2">
                    Alamat
                    <Badge variant="outline" className="text-xs">Lokasi</Badge>
                  </h3>
                  <p className="text-sm text-muted-foreground leading-snug">
                    Jl. I Dewa Nyoman Oka No. 28<br />
                    Kotabaru, Yogyakarta 55224
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => copyToClipboard("Jl. I Dewa Nyoman Oka No. 28, Kotabaru, Yogyakarta 55224", "Alamat")}
                  className="hover:bg-emerald-50/50 hover:text-emerald-700 transition-all duration-200 h-8 w-8 p-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => window.open("https://maps.google.com/?q=Jl.+I+Dewa+Nyoman+Oka+No.+28+Kotabaru+Yogyakarta", "_blank")}
                  className="hover:bg-emerald-50/50 hover:text-emerald-700 transition-all duration-200 h-8 w-8 p-0"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Phone Card */}
        <Card className="py-0 group hover:shadow-lg transition-all duration-300 hover:border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start space-x-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base mb-1.5 flex items-center gap-2">
                    Telepon
                    {isOfficeOpen && (
                      <Badge className="bg-green-100 text-green-700 text-xs">Online</Badge>
                    )}
                  </h3>
                  <p className="text-muted-foreground font-semibold">(0274) 563972</p>
                  <p className="text-xs text-muted-foreground">Klik untuk menelepon</p>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => copyToClipboard("(0274) 563972", "Nomor telepon")}
                  className="hover:bg-blue-50/50 hover:text-blue-700 transition-all duration-200 h-8 w-8 p-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => window.location.href = "tel:0274563972"}
                  className="hover:bg-blue-50/50 hover:text-blue-700 transition-all duration-200 h-8 w-8 p-0"
                >
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Email + Operating Hours (2 cols on md+) */}
      <div className="py-0 grid md:grid-cols-2 gap-3">
        {/* Email Card */}
        <Card className="py-0 group hover:shadow-lg transition-all duration-300 hover:border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start space-x-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Mail className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base mb-1.5">Email</h3>
                  <p className="text-sm text-muted-foreground break-all">info@smpitmasjidsyuhada.sch.id</p>
                  <p className="text-xs text-muted-foreground">Klik untuk mengirim email</p>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => copyToClipboard("info@smpitmasjidsyuhada.sch.id", "Email")}
                  className="hover:bg-purple-50/50 hover:text-purple-700 transition-all duration-200 h-8 w-8 p-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => window.location.href = "mailto:info@smpitmasjidsyuhada.sch.id"}
                  className="hover:bg-purple-50/50 hover:text-purple-700 transition-all duration-200 h-8 w-8 p-0"
                >
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Operating Hours Card */}
        <Card className="py-0 group hover:shadow-lg transition-all duration-300 hover:border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-base mb-2 flex items-center gap-2">
                  Jam Operasional
                  {isOfficeOpen && (
                    <Badge className="bg-green-100 text-green-700 text-xs">Buka</Badge>
                  )}
                </h3>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Senin - Jumat</span>
                    <span className="font-semibold">07:00 - 14:30</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Sabtu - Minggu</span>
                    <span className="font-semibold text-red-600">Tutup</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
