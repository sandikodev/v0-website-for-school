/**
 * Generate WhatsApp URL with pre-filled message
 * @param phoneNumber - Phone number in international format (e.g., 6289649246450)
 * @param message - Pre-filled message template
 * @returns wa.me URL string
 */
export function generateWhatsAppUrl(phoneNumber: string, message: string = ''): string {
  // Remove any spaces, dashes, or special characters from phone
  const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, '')
  
  // Ensure phone starts with country code (assume Indonesia +62 if not present)
  const formattedPhone = cleanPhone.startsWith('62') ? cleanPhone : `62${cleanPhone.replace(/^0+/, '')}`
  
  // Encode message for URL
  const encodedMessage = encodeURIComponent(message)
  
  return `https://wa.me/${formattedPhone}${encodedMessage ? `?text=${encodedMessage}` : ''}`
}

/**
 * Get contact setting and generate WhatsApp URL
 * @param type - 'call_center' or 'admissions'
 * @returns Object with phoneNumber, label, waUrl
 */
export async function getContactWhatsApp(type: 'call_center' | 'admissions') {
  try {
    const response = await fetch(`/api/settings/contact/${type}`)
    const { data } = await response.json()
    
    if (!data) {
      return null
    }
    
    return {
      phoneNumber: data.phoneNumber,
      label: data.label,
      description: data.description,
      waUrl: generateWhatsAppUrl(data.phoneNumber, data.waTemplate),
      waTemplate: data.waTemplate,
    }
  } catch (error) {
    console.error(`Error fetching ${type} contact:`, error)
    return null
  }
}

