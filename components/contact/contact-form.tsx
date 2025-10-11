"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { User, Mail, Phone, Tag, MessageSquare, Send, CheckCircle2, Loader2 } from "lucide-react"

export default function ContactForm() {
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    category: "",
  })
  
  const MAX_MESSAGE_LENGTH = 500
  const messageLength = form.message.length

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
    setSuccess(false)
    
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
          category: form.category || 'umum',
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setForm({ name: "", email: "", phone: "", subject: "", message: "", category: "" })
        toast({ 
          title: "✅ Pesan Terkirim", 
          description: "Terima kasih! Pesan Anda sudah kami terima dan akan segera ditinjau." 
        })
        
        // Reset success animation after 3 seconds
        setTimeout(() => setSuccess(false), 3000)
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
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Success State */}
      {success && (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-green-900">Pesan Terkirim!</p>
            <p className="text-sm text-green-700">Terima kasih, kami akan segera merespons.</p>
          </div>
        </div>
      )}

      {/* Nama & Email */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nama" className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            Nama Lengkap <span className="text-red-500">*</span>
          </Label>
          <Input
            id="nama"
            placeholder="Contoh: Ahmad Riyadi"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
            className="focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="contoh@email.com"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
            className="focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Telepon & Kategori */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="telepon" className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            Nomor Telepon
          </Label>
          <Input
            id="telepon"
            placeholder="08xxxxxxxxxx"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="kategori" className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            Kategori Pesan
          </Label>
          <Select value={form.category} onValueChange={(value) => handleChange("category", value)}>
            <SelectTrigger className="w-full focus:border-emerald-500 focus:ring-emerald-500">
              <SelectValue placeholder="Pilih kategori..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pendaftaran">📝 Pendaftaran</SelectItem>
              <SelectItem value="kunjungan">🏫 Kunjungan Sekolah</SelectItem>
              <SelectItem value="beasiswa">💰 Beasiswa</SelectItem>
              <SelectItem value="kurikulum">📚 Kurikulum & Program</SelectItem>
              <SelectItem value="fasilitas">🏢 Fasilitas</SelectItem>
              <SelectItem value="umum">💬 Pertanyaan Umum</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Subjek */}
      <div className="space-y-2">
        <Label htmlFor="subjek" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          Subjek
        </Label>
        <Input
          id="subjek"
          placeholder="Ringkasan singkat pesan Anda"
          value={form.subject}
          onChange={(e) => handleChange("subject", e.target.value)}
          className="focus:border-emerald-500 focus:ring-emerald-500"
        />
      </div>

      {/* Pesan */}
      <div className="space-y-2">
        <Label htmlFor="pesan" className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            Pesan <span className="text-red-500">*</span>
          </span>
          <span className={`text-xs ${messageLength > MAX_MESSAGE_LENGTH ? 'text-red-500 font-semibold' : 'text-muted-foreground'}`}>
            {messageLength}/{MAX_MESSAGE_LENGTH}
          </span>
        </Label>
        <Textarea
          id="pesan"
          placeholder="Tulis pesan Anda di sini... Jelaskan pertanyaan atau kebutuhan Anda secara detail."
          rows={5}
          value={form.message}
          onChange={(e) => {
            if (e.target.value.length <= MAX_MESSAGE_LENGTH) {
              handleChange("message", e.target.value)
            }
          }}
          required
          className={`focus:border-emerald-500 focus:ring-emerald-500 resize-none ${
            messageLength > MAX_MESSAGE_LENGTH * 0.9 ? 'border-orange-300' : ''
          }`}
        />
        <p className="text-xs text-muted-foreground">
          💡 Tip: Semakin detail pertanyaan Anda, semakin cepat kami dapat membantu.
        </p>
      </div>

      {/* Submit Button */}
      <Button 
        className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]" 
        size="lg" 
        type="submit" 
        disabled={loading || messageLength > MAX_MESSAGE_LENGTH}
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Mengirim Pesan...
          </>
        ) : (
          <>
            <Send className="h-5 w-5 mr-2" />
            Kirim Pesan
          </>
        )}
      </Button>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
        <p className="text-sm text-blue-900">
          ⏱️ <span className="font-semibold">Waktu Respons:</span> 1-2 hari kerja
        </p>
      </div>
    </form>
  )
}
