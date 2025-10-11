import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"
import type { WaliKelas } from "@/types/staff"

interface WaliKelasTabProps {
  waliKelas: WaliKelas[]
}

export default function WaliKelasTab({ waliKelas }: WaliKelasTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center space-x-2">
          <Users className="h-6 w-6 text-primary" />
          <span>Wali Kelas</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {waliKelas.map((wali, index) => (
            <Card key={index} className="bg-muted/30">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold text-sm">{wali.kelas}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm mb-1">Kelas {wali.kelas}</h4>
                    <p className="text-muted-foreground text-xs">{wali.nama}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
