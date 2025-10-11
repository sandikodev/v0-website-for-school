import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap } from "lucide-react"
import type { StafPengajar } from "@/types/staff"

interface PengajarTabProps {
  stafPengajar: StafPengajar[]
}

export default function PengajarTab({ stafPengajar }: PengajarTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center space-x-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span>Staf Pengajar</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-8">
          Seluruh pendidik di SMP IT Masjid Syuhada memenuhi kualifikasi Sarjana (S-1) sesuai dengan latar
          belakang pendidikannya.
        </p>
        <div className="space-y-4">
          {stafPengajar.map((staff, index) => (
            <Card key={index} className="bg-muted/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm mb-1">{staff.nama}</h4>
                      {staff.jabatan !== "–" && (
                        <p className="text-primary text-xs font-medium mb-1">{staff.jabatan}</p>
                      )}
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {staff.mapel}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
