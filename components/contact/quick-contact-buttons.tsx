"use client"

import { MessageCircle, Mail, ExternalLink } from "lucide-react"

export default function QuickContactButtons() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* WhatsApp Quick Contact */}
      <button
        onClick={() => window.open("https://wa.me/6289649246450?text=Halo%20SMP%20IT%20Masjid%20Syuhada", "_blank")}
        className="group relative overflow-hidden bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div className="text-left flex-1">
            <p className="text-xs text-white/80 mb-0.5">Chat Langsung</p>
            <p className="font-bold text-sm">WhatsApp</p>
          </div>
          <ExternalLink className="h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" />
        </div>
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
      </button>

      {/* Email Quick Contact */}
      <button
        onClick={() => window.location.href = "mailto:info@smpitmasjidsyuhada.sch.id"}
        className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <Mail className="h-5 w-5" />
          </div>
          <div className="text-left flex-1">
            <p className="text-xs text-white/80 mb-0.5">Kirim Email</p>
            <p className="font-bold text-sm">Email Kami</p>
          </div>
          <ExternalLink className="h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" />
        </div>
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
      </button>
    </div>
  )
}
