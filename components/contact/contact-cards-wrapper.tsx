"use client"

import * as React from "react"
import InteractiveContactCards from "./interactive-contact-cards"
import QuickContactButtons from "./quick-contact-buttons"

export default function ContactCardsWrapper() {
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
    <>
      <InteractiveContactCards isOfficeOpen={isOfficeOpen} />
      <QuickContactButtons />
    </>
  )
}
