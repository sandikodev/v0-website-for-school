import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import StaffStatsCards from "@/components/staff/staff-stats-cards"
import StaffTabsWrapper from "@/components/staff/staff-tabs-wrapper"
import { staffStats, pimpinanSekolah, pengurusYasma, waliKelas, stafPengajar } from "@/data/staff-data"

export default function StaffPage() {

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Staff & Pengajar</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Tim pendidik dan tenaga kependidikan yang berpengalaman dan berkualitas
              </p>
            </div>
          </div>
        </section>

        {/* Staff Overview */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <StaffStatsCards stats={staffStats} />

            {/* Staff Directory */}
            <StaffTabsWrapper 
              pimpinanSekolah={pimpinanSekolah}
              pengurusYasma={pengurusYasma}
              waliKelas={waliKelas}
              stafPengajar={stafPengajar}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
