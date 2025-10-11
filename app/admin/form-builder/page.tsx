"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Settings, Save, Eye, Plus, Trash2, GripVertical } from "lucide-react"
import { toast } from "sonner"

export default function FormBuilderPage() {
  const [formName, setFormName] = React.useState("Formulir Pendaftaran 2025/2026")
  const [formDescription, setFormDescription] = React.useState("Formulir pendaftaran siswa baru")
  const [isSaving, setIsSaving] = React.useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success("Form configuration saved successfully!")
    } catch (error) {
      toast.error("Failed to save form configuration")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Form Builder</h1>
          <p className="text-muted-foreground">Configure registration form fields and structure</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Form Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Form Information</CardTitle>
          <CardDescription>Basic information about the registration form</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="form-name">Form Name</Label>
            <Input
              id="form-name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g., Formulir Pendaftaran 2025/2026"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="form-description">Description</Label>
            <Textarea
              id="form-description"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Brief description of this form"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Current Form Structure */}
      <Card>
        <CardHeader>
          <CardTitle>Current Form Structure</CardTitle>
          <CardDescription>
            The signup form currently uses a fixed structure with the following sections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Section: Data Siswa */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">📝 Step 1: Data Siswa</h3>
                  <p className="text-sm text-gray-600">Basic student information</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <span>• Nama Lengkap (required)</span>
                </div>
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <span>• Tempat Lahir</span>
                </div>
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <span>• Tanggal Lahir</span>
                </div>
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <span>• Jenis Kelamin</span>
                </div>
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <span>• Alamat Lengkap</span>
                </div>
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <span>• No. HP</span>
                </div>
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <span>• Email</span>
                </div>
              </div>
            </div>

            {/* Section: Data Orangtua */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">👨‍👩‍👧 Step 2: Data Orangtua</h3>
                  <p className="text-sm text-gray-600">Parent/guardian information</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <span>• Nama Ayah</span>
                </div>
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <span>• Pekerjaan Ayah</span>
                </div>
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <span>• Nama Ibu</span>
                </div>
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <span>• Pekerjaan Ibu</span>
                </div>
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <span>• No. HP Orangtua</span>
                </div>
              </div>
            </div>

            {/* Section: Data Sekolah */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">🏫 Step 3: Data Sekolah Asal</h3>
                  <p className="text-sm text-gray-600">Previous school information</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <span>• Asal Sekolah</span>
                </div>
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <span>• Alamat Sekolah</span>
                </div>
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <span>• Prestasi (opsional)</span>
                </div>
              </div>
            </div>

            {/* Section: Data Pendaftaran */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">📋 Step 4: Data Pendaftaran</h3>
                  <p className="text-sm text-gray-600">Registration preferences</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <span>• Jalur Pendaftaran (Reguler/Prestasi)</span>
                </div>
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <span>• Gelombang Pendaftaran</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Settings className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-2">Form Builder - Coming Soon</h4>
              <p className="text-sm text-blue-800 mb-3">
                The current form structure is working well for the registration process. 
                A full drag-and-drop form builder with custom fields is planned for a future release.
              </p>
              <p className="text-sm text-blue-800">
                <strong>Current Features:</strong>
              </p>
              <ul className="text-sm text-blue-800 space-y-1 ml-4 mt-2">
                <li>• Fixed form structure with 4 steps</li>
                <li>• Data stored in FormSubmission model</li>
                <li>• All submissions viewable in /admin/submissions</li>
                <li>• Auto-generated registration numbers</li>
                <li>• Status tracking (pending, approved, rejected)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

