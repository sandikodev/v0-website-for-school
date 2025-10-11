import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Send } from "lucide-react"
import ContactForm from "@/components/contact/contact-form"
import OfficeStatusBadge from "@/components/contact/office-status-badge"
import ContactCardsWrapper from "@/components/contact/contact-cards-wrapper"
import InteractiveMapSection from "@/components/contact/interactive-map-section"
import CTASection from "@/components/contact/cta-section"

export default function KontakPage() {

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-emerald-50 via-blue-50 to-background py-20 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center">
              <OfficeStatusBadge />
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Hubungi Kami
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Kami siap membantu Anda dengan informasi tentang pendaftaran, program, dan segala hal tentang SMP IT Masjid Syuhada
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Details */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-3">Informasi Kontak</h2>
                  <p className="text-lg text-muted-foreground">
                    Kami siap membantu Anda dengan informasi tentang SMP IT Masjid Syuhada Yogyakarta
                  </p>
                </div>

                <ContactCardsWrapper />
              </div>

              {/* Contact Form */}
              <div className="lg:sticky lg:top-24">
                <Card className="py-0 shadow-xl border-t-0 overflow-hidden">
                  <CardHeader className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 text-white rounded-t-lg py-6">
                    <CardTitle className="text-2xl font-bold flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <Send className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <span className="text-white">Kirim Pesan</span>
                        <p className="text-sm font-normal text-white/90 mt-1">Kami akan membalas dalam 1-2 hari kerja</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 mb-6">
                    <ContactForm />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Map Section */}
            <Card className="mt-16 overflow-hidden py-0">
              <CardContent className="p-0">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                  {/* Google Maps Embed */}
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.0791698736736!2d110.38347631477743!3d-7.7829471944414!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a59f2f9c7c9f7%3A0x1234567890!2sJl.%20I%20Dewa%20Nyoman%20Oka%20No.28%2C%20Kotabaru%2C%20Yogyakarta!5e0!3m2!1sen!2sid!4v1234567890123!5m2!1sen!2sid"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                  />
                </div>
                
                <InteractiveMapSection />
              </CardContent>
            </Card>

            {/* FAQ or Help Section */}
            <Card className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-3">Butuh Bantuan Lebih Lanjut?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Tim kami siap membantu Anda dengan pertanyaan seputar pendaftaran, kurikulum, fasilitas, dan informasi lainnya.
                </p>
                <CTASection />
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
