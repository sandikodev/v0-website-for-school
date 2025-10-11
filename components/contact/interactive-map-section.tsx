"use client"

import { Button } from "@/components/ui/button"
import { MapPin, Copy, ExternalLink } from "lucide-react"
import { toast } from "sonner"

export default function InteractiveMapSection() {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} tersalin ke clipboard!`)
  }

  return (
    <div className="p-6 bg-white">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
          <MapPin className="h-6 w-6 text-emerald-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2">SMP IT Masjid Syuhada Yogyakarta</h3>
          <p className="text-muted-foreground mb-3">
            Jl. I Dewa Nyoman Oka No. 28, Kotabaru<br />
            Yogyakarta 55224, DIY
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            📍 Dekat dengan RRI, Balai Bahasa, dan Jogja Study Center
          </p>
          <div className="flex gap-2">
            <Button 
              size="sm"
              variant="outline"
              onClick={() => window.open("https://maps.google.com/?q=Jl.+I+Dewa+Nyoman+Oka+No.+28+Kotabaru+Yogyakarta", "_blank")}
              className="hover:bg-emerald-50/50 hover:border-emerald-300 hover:text-emerald-700 transition-all duration-200"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Buka di Google Maps
            </Button>
            <Button 
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard("Jl. I Dewa Nyoman Oka No. 28, Kotabaru, Yogyakarta 55224", "Alamat")}
              className="hover:bg-blue-50/50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200"
            >
              <Copy className="h-4 w-4 mr-2" />
              Salin Alamat
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
