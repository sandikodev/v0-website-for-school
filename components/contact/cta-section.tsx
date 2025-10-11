"use client"

import { Button } from "@/components/ui/button"
import { Send, MessageCircle } from "lucide-react"

export default function CTASection() {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <Button 
        size="lg"
        className="bg-emerald-600 hover:bg-emerald-700 transition-all duration-200 hover:shadow-lg hover:scale-105"
        onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <Send className="h-5 w-5 mr-2" />
        Kirim Pesan
      </Button>
      <Button 
        size="lg"
        variant="outline"
        onClick={() => window.open("https://wa.me/6289649246450?text=Halo%20SMP%20IT%20Masjid%20Syuhada", "_blank")}
        className="hover:bg-green-50/50 hover:border-green-300 hover:text-green-700 transition-all duration-200"
      >
        <MessageCircle className="h-5 w-5 mr-2" />
        Chat WhatsApp
      </Button>
    </div>
  )
}
