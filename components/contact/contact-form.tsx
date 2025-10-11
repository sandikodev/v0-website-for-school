"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function ContactForm() {
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  function handleChange<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast({ title: "Lengkapi Data", description: "Nama, email, dan pesan wajib diisi." })
      return
    }
    setLoading(true)
    try {
      const response = await fetch('/api/contact/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || null,
          subject: form.subject.trim() || null,
          message: form.message.trim(),
        }),
      })

      const data = await response.json()

      if (data.success) {
        setForm({ name: "", email: "", phone: "", subject: "", message: "" })
        toast({ 
          title: "Pesan Terkirim", 
          description: "Terima kasih! Pesan Anda sudah kami terima dan akan segera ditinjau." 
        })
      } else {
        toast({ 
          title: "Gagal Mengirim", 
          description: data.error || "Terjadi kesalahan. Coba lagi.", 
          variant: "destructive" as any 
        })
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast({ 
        title: "Gagal Mengirim", 
        description: "Terjadi kesalahan koneksi. Coba lagi.", 
        variant: "destructive" as any 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nama">Nama Lengkap</Label>
          <Input
            id="nama"
            placeholder="Masukkan nama lengkap"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Masukkan email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="telepon">Nomor Telepon</Label>
          <Input
            id="telepon"
            placeholder="Masukkan nomor telepon"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subjek">Subjek</Label>
          <Input
            id="subjek"
            placeholder="Subjek pesan"
            value={form.subject}
            onChange={(e) => handleChange("subject", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="pesan">Pesan</Label>
        <Textarea
          id="pesan"
          placeholder="Tulis pesan Anda di sini..."
          rows={6}
          value={form.message}
          onChange={(e) => handleChange("message", e.target.value)}
          required
        />
      </div>

      <Button className="w-full" size="lg" type="submit" disabled={loading}>
        {loading ? "Mengirim..." : "Kirim Pesan"}
      </Button>

      <p className="text-sm text-muted-foreground text-center">Kami akan merespons pesan Anda dalam 1-2 hari kerja</p>
    </form>
  )
}
