import { Card, CardContent } from "@/components/ui/card"
import { Users, UserCheck, Award } from "lucide-react"
import type { StaffStats } from "@/types/staff"

interface StaffStatsCardsProps {
  stats: StaffStats
}

export default function StaffStatsCards({ stats }: StaffStatsCardsProps) {
  return (
    <div className="grid md:grid-cols-3 gap-8 mb-16">
      <Card className="text-center">
        <CardContent className="p-8">
          <Users className="h-16 w-16 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">{stats.totalGuru} Guru</h3>
          <p className="text-muted-foreground">{stats.kualifikasi}</p>
        </CardContent>
      </Card>

      <Card className="text-center">
        <CardContent className="p-8">
          <UserCheck className="h-16 w-16 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">{stats.totalStaff} Staff</h3>
          <p className="text-muted-foreground">Tenaga Kependidikan</p>
        </CardContent>
      </Card>

      <Card className="text-center">
        <CardContent className="p-8">
          <Award className="h-16 w-16 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">100%</h3>
          <p className="text-muted-foreground">Sesuai Bidang</p>
        </CardContent>
      </Card>
    </div>
  )
}
