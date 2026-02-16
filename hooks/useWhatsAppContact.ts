import { useState, useEffect } from "react";
import { getContactWhatsApp } from "@/lib/whatsapp";

interface WhatsAppContact {
  waUrl: string;
  label: string;
}

export function useWhatsAppContact(type: "call_center" | "admissions" = "admissions") {
  const [contact, setContact] = useState<WhatsAppContact | null>(null);

  useEffect(() => {
    getContactWhatsApp(type).then((data) => {
      if (data) {
        setContact({
          waUrl: data.waUrl,
          label: data.label,
        });
      }
    });
  }, [type]);

  return contact;
}

