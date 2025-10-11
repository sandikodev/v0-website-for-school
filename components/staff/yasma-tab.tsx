import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building } from "lucide-react"
import type { PengurusYasma } from "@/types/staff"

interface YasmaTabProps {
  pengurusYasma: PengurusYasma[]
}

export default function YasmaTab({ pengurusYasma }: YasmaTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center space-x-2">
          <Building className="h-6 w-6 text-primary" />
          <span>Pengurus YASMA Syuhada</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-8">
          Yayasan Masjid dan Asrama (YASMA) Syuhada Yogyakarta yang menaungi TK, SD, dan SMP IT Masjid
          Syuhada.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pengurusYasma.map((pengurus, index) => (
            <Card key={index} className="bg-muted/30">
              <CardContent className="p-4">
                <h4 className="font-bold text-sm mb-1">{pengurus.nama}</h4>
                <p className="text-primary text-xs font-medium">{pengurus.jabatan}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
