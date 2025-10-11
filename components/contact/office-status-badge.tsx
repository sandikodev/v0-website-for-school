"use client"

import * as React from "react"
import { CheckCircle, Clock } from "lucide-react"

export default function OfficeStatusBadge() {
  const [isOfficeOpen, setIsOfficeOpen] = React.useState(false)

  React.useEffect(() => {
    // Check if office is currently open
    const checkOfficeHours = () => {
      const now = new Date()
      const day = now.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const hour = now.getHours()
      const minute = now.getMinutes()
      const currentTime = hour * 60 + minute // Convert to minutes

      // Office hours: Monday-Friday, 07:00-14:30
      const openTime = 7 * 60 // 07:00
      const closeTime = 14 * 60 + 30 // 14:30

      if (day >= 1 && day <= 5) { // Monday to Friday
        if (currentTime >= openTime && currentTime < closeTime) {
          setIsOfficeOpen(true)
        } else {
          setIsOfficeOpen(false)
        }
      } else {
        setIsOfficeOpen(false)
      }
    }

    checkOfficeHours()
    // Update every minute
    const interval = setInterval(checkOfficeHours, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full mb-6 animate-pulse-subtle">
      {isOfficeOpen ? (
        <>
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm font-medium">Kantor Sedang Buka</span>
        </>
      ) : (
        <>
          <Clock className="h-4 w-4" />
          <span className="text-sm font-medium">Kantor Tutup - Buka Senin-Jumat 07:00-14:30</span>
        </>
      )}
    </div>
  )
}
