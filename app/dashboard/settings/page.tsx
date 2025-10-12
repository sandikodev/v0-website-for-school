"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { 
  Settings,
  Globe,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  Key,
  Database,
  FileText,
  Building,
  Link as LinkIcon,
  RefreshCw,
  Save,
  TestTube,
  Shield,
  BookOpen,
  GraduationCap
} from "lucide-react"
import { toast } from "sonner"
import { useTabParam } from "@/hooks"
import { useSearchParams } from "next/navigation"

interface IntegrationStatus {
  connected: boolean
  lastSync?: Date | null
  accountName?: string
  accountEmail?: string
  error?: string
}

export default function SettingsPage() {
  const { current, setTab } = useTabParam("google")
  const searchParams = useSearchParams()
  
  // Google Integration State
  const [googleStatus, setGoogleStatus] = React.useState<IntegrationStatus>({
    connected: false,
    lastSync: null
  })
  const [googleClientId, setGoogleClientId] = React.useState("")
  const [googleClientSecret, setGoogleClientSecret] = React.useState("")
  const [googleRedirectUri, setGoogleRedirectUri] = React.useState("http://localhost:3000/api/auth/google/callback")
  const [isConnectingGoogle, setIsConnectingGoogle] = React.useState(false)

  // WordPress Integration State
  const [wordpressStatus, setWordpressStatus] = React.useState<IntegrationStatus>({
    connected: false,
    lastSync: null
  })
  const [wordpressUrl, setWordpressUrl] = React.useState("")
  const [wordpressUsername, setWordpressUsername] = React.useState("")
  const [wordpressAppPassword, setWordpressAppPassword] = React.useState("")
  const [isConnectingWordpress, setIsConnectingWordpress] = React.useState(false)

  // Academic System Integration State
  const [academicStatus, setAcademicStatus] = React.useState<IntegrationStatus>({
    connected: false,
    lastSync: null
  })
  const [academicApiUrl, setAcademicApiUrl] = React.useState("")
  const [academicApiKey, setAcademicApiKey] = React.useState("")
  const [academicSchoolCode, setAcademicSchoolCode] = React.useState("")
  const [isConnectingAcademic, setIsConnectingAcademic] = React.useState(false)

  // Handle OAuth callback success/error
  React.useEffect(() => {
    const success = searchParams.get('success')
    const error = searchParams.get('error')

    if (success === 'true') {
      toast.success("Google berhasil terhubung!")
      // Update status
      setGoogleStatus({
        connected: true,
        lastSync: new Date(),
        accountEmail: searchParams.get('email') || "user@gmail.com"
      })
      // Clear URL parameters
      window.history.replaceState({}, '', '/dashboard/settings?tab=google')
    } else if (error) {
      const errorMessages: { [key: string]: string } = {
        'no_code': 'Kode authorization tidak ditemukan',
        'callback_failed': 'Gagal memproses callback dari Google',
        'access_denied': 'Akses ditolak oleh pengguna'
      }
      toast.error(errorMessages[error] || `Error: ${error}`)
      // Clear URL parameters
      window.history.replaceState({}, '', '/dashboard/settings?tab=google')
    }
  }, [searchParams])

  // Load saved settings
  React.useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      const result = await response.json()
      
      if (result.success && result.data) {
        // Google settings
        if (result.data.google) {
          setGoogleStatus(result.data.google.status || { connected: false })
          setGoogleClientId(result.data.google.clientId || "")
          setGoogleClientSecret(result.data.google.clientSecret || "")
          setGoogleRedirectUri(result.data.google.redirectUri || "http://localhost:3000/api/auth/google/callback")
        }

        // WordPress settings
        if (result.data.wordpress) {
          setWordpressStatus(result.data.wordpress.status || { connected: false })
          setWordpressUrl(result.data.wordpress.url || "")
          setWordpressUsername(result.data.wordpress.username || "")
          // Password tidak di-load untuk keamanan
        }

        // Academic system settings
        if (result.data.academic) {
          setAcademicStatus(result.data.academic.status || { connected: false })
          setAcademicApiUrl(result.data.academic.apiUrl || "")
          setAcademicSchoolCode(result.data.academic.schoolCode || "")
          // API key tidak di-load untuk keamanan
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }

  // Google Integration Functions
  const handleConnectGoogle = async () => {
    setIsConnectingGoogle(true)
    try {
      // Validasi input
      if (!googleClientId || !googleClientSecret) {
        toast.error("Mohon lengkapi Client ID dan Client Secret")
        return
      }

      // Simpan konfigurasi
      const response = await fetch('/api/settings/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: googleClientId,
          clientSecret: googleClientSecret,
          redirectUri: googleRedirectUri
        })
      })

      const result = await response.json()

      if (result.success) {
        // Redirect ke Google OAuth
        window.location.href = result.data.authUrl
      } else {
        toast.error(result.message || "Gagal menyimpan konfigurasi Google")
      }
    } catch (error) {
      console.error('Error connecting Google:', error)
      toast.error("Terjadi kesalahan saat menghubungkan Google")
    } finally {
      setIsConnectingGoogle(false)
    }
  }

  const handleDisconnectGoogle = async () => {
    if (!confirm("Apakah Anda yakin ingin memutuskan koneksi dengan Google?")) {
      return
    }

    try {
      const response = await fetch('/api/settings/google', {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        setGoogleStatus({ connected: false, lastSync: null })
        toast.success("Koneksi Google berhasil diputuskan")
      } else {
        toast.error(result.message || "Gagal memutuskan koneksi")
      }
    } catch (error) {
      console.error('Error disconnecting Google:', error)
      toast.error("Terjadi kesalahan saat memutuskan koneksi")
    }
  }

  const handleTestGoogle = async () => {
    toast.info("Menguji koneksi Google...")
    try {
      const response = await fetch('/api/settings/google/test')
      const result = await response.json()

      if (result.success) {
        toast.success("Koneksi Google berhasil!")
      } else {
        toast.error(result.message || "Koneksi Google gagal")
      }
    } catch (error) {
      console.error('Error testing Google:', error)
      toast.error("Terjadi kesalahan saat menguji koneksi")
    }
  }

  // WordPress Integration Functions
  const handleConnectWordpress = async () => {
    setIsConnectingWordpress(true)
    try {
      // Validasi input
      if (!wordpressUrl || !wordpressUsername || !wordpressAppPassword) {
        toast.error("Mohon lengkapi semua field WordPress")
        return
      }

      const response = await fetch('/api/settings/wordpress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: wordpressUrl,
          username: wordpressUsername,
          appPassword: wordpressAppPassword
        })
      })

      const result = await response.json()

      if (result.success) {
        setWordpressStatus({
          connected: true,
          lastSync: new Date(),
          accountName: result.data.accountName
        })
        toast.success("WordPress berhasil terhubung!")
      } else {
        toast.error(result.message || "Gagal menghubungkan WordPress")
      }
    } catch (error) {
      console.error('Error connecting WordPress:', error)
      toast.error("Terjadi kesalahan saat menghubungkan WordPress")
    } finally {
      setIsConnectingWordpress(false)
    }
  }

  const handleDisconnectWordpress = async () => {
    if (!confirm("Apakah Anda yakin ingin memutuskan koneksi dengan WordPress?")) {
      return
    }

    try {
      const response = await fetch('/api/settings/wordpress', {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        setWordpressStatus({ connected: false, lastSync: null })
        toast.success("Koneksi WordPress berhasil diputuskan")
      } else {
        toast.error(result.message || "Gagal memutuskan koneksi")
      }
    } catch (error) {
      console.error('Error disconnecting WordPress:', error)
      toast.error("Terjadi kesalahan saat memutuskan koneksi")
    }
  }

  const handleTestWordpress = async () => {
    toast.info("Menguji koneksi WordPress...")
    try {
      const response = await fetch('/api/settings/wordpress/test')
      const result = await response.json()

      if (result.success) {
        toast.success("Koneksi WordPress berhasil!")
      } else {
        toast.error(result.message || "Koneksi WordPress gagal")
      }
    } catch (error) {
      console.error('Error testing WordPress:', error)
      toast.error("Terjadi kesalahan saat menguji koneksi")
    }
  }

  // Academic System Integration Functions
  const handleConnectAcademic = async () => {
    setIsConnectingAcademic(true)
    try {
      // Validasi input
      if (!academicApiUrl || !academicApiKey || !academicSchoolCode) {
        toast.error("Mohon lengkapi semua field Sistem Akademik")
        return
      }

      const response = await fetch('/api/settings/academic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiUrl: academicApiUrl,
          apiKey: academicApiKey,
          schoolCode: academicSchoolCode
        })
      })

      const result = await response.json()

      if (result.success) {
        setAcademicStatus({
          connected: true,
          lastSync: new Date(),
          accountName: result.data.schoolName
        })
        toast.success("Sistem Akademik berhasil terhubung!")
      } else {
        toast.error(result.message || "Gagal menghubungkan Sistem Akademik")
      }
    } catch (error) {
      console.error('Error connecting Academic System:', error)
      toast.error("Terjadi kesalahan saat menghubungkan Sistem Akademik")
    } finally {
      setIsConnectingAcademic(false)
    }
  }

  const handleDisconnectAcademic = async () => {
    if (!confirm("Apakah Anda yakin ingin memutuskan koneksi dengan Sistem Akademik?")) {
      return
    }

    try {
      const response = await fetch('/api/settings/academic', {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        setAcademicStatus({ connected: false, lastSync: null })
        toast.success("Koneksi Sistem Akademik berhasil diputuskan")
      } else {
        toast.error(result.message || "Gagal memutuskan koneksi")
      }
    } catch (error) {
      console.error('Error disconnecting Academic System:', error)
      toast.error("Terjadi kesalahan saat memutuskan koneksi")
    }
  }

  const handleTestAcademic = async () => {
    toast.info("Menguji koneksi Sistem Akademik...")
    try {
      const response = await fetch('/api/settings/academic/test')
      const result = await response.json()

      if (result.success) {
        toast.success("Koneksi Sistem Akademik berhasil!")
      } else {
        toast.error(result.message || "Koneksi Sistem Akademik gagal")
      }
    } catch (error) {
      console.error('Error testing Academic System:', error)
      toast.error("Terjadi kesalahan saat menguji koneksi")
    }
  }

  const getStatusBadge = (status: IntegrationStatus) => {
    if (status.connected) {
      return (
        <Badge className="bg-green-100 text-green-700 border-green-300">
          <CheckCircle className="h-3 w-3 mr-1" />
          Terhubung
        </Badge>
      )
    }
    return (
      <Badge variant="secondary" className="bg-gray-100 text-gray-700">
        <XCircle className="h-3 w-3 mr-1" />
        Belum Terhubung
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="h-8 w-8 text-blue-600" />
            Pengaturan Integrasi
          </h1>
          <p className="text-gray-600 mt-2">
            Kelola integrasi dengan sistem eksternal untuk memperluas fitur administrasi sekolah
          </p>
        </div>
      </div>

      {/* Integration Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className={googleStatus.connected ? "border-green-300 bg-green-50/50" : ""}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Google</CardTitle>
                  <CardDescription className="text-xs">Forms & Sheets</CardDescription>
                </div>
              </div>
              {getStatusBadge(googleStatus)}
            </div>
          </CardHeader>
          {googleStatus.connected && (
            <CardContent>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Akun:</span> {googleStatus.accountEmail}
              </p>
              {googleStatus.lastSync && (
                <p className="text-xs text-gray-500 mt-1">
                  Sinkronisasi terakhir: {new Date(googleStatus.lastSync).toLocaleString('id-ID')}
                </p>
              )}
            </CardContent>
          )}
        </Card>

        <Card className={wordpressStatus.connected ? "border-green-300 bg-green-50/50" : ""}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-base">WordPress</CardTitle>
                  <CardDescription className="text-xs">CMS & Blog</CardDescription>
                </div>
              </div>
              {getStatusBadge(wordpressStatus)}
            </div>
          </CardHeader>
          {wordpressStatus.connected && (
            <CardContent>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Site:</span> {wordpressStatus.accountName}
              </p>
              {wordpressStatus.lastSync && (
                <p className="text-xs text-gray-500 mt-1">
                  Sinkronisasi terakhir: {new Date(wordpressStatus.lastSync).toLocaleString('id-ID')}
                </p>
              )}
            </CardContent>
          )}
        </Card>

        <Card className={academicStatus.connected ? "border-green-300 bg-green-50/50" : ""}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Sistem Akademik</CardTitle>
                  <CardDescription className="text-xs">PT Koneksi JI</CardDescription>
                </div>
              </div>
              {getStatusBadge(academicStatus)}
            </div>
          </CardHeader>
          {academicStatus.connected && (
            <CardContent>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Sekolah:</span> {academicStatus.accountName}
              </p>
              {academicStatus.lastSync && (
                <p className="text-xs text-gray-500 mt-1">
                  Sinkronisasi terakhir: {new Date(academicStatus.lastSync).toLocaleString('id-ID')}
                </p>
              )}
            </CardContent>
          )}
        </Card>
      </div>

      {/* Tabs Navigation */}
      <nav aria-label="Integration tabs" className="mb-6 overflow-x-auto">
        <ul className="flex items-center gap-1 border-b">
          {[
            { key: "google", label: "Google Integration", icon: Globe },
            { key: "wordpress", label: "WordPress CMS", icon: BookOpen },
            { key: "academic", label: "Sistem Akademik", icon: GraduationCap },
            { key: "general", label: "Pengaturan Umum", icon: Settings },
          ].map((item) => {
            const isActive = current === item.key
            const Icon = item.icon
            return (
              <li key={item.key}>
                <button
                  onClick={() => setTab(item.key)}
                  className={`inline-flex items-center gap-2 rounded-t-md px-4 py-3 text-sm transition-colors ${
                    isActive 
                      ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600 font-medium" 
                      : "hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Google Integration Tab */}
      {current === "google" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                Integrasi Google
              </CardTitle>
              <CardDescription>
                Hubungkan dengan Google untuk mengakses Google Forms dan Google Sheets untuk manajemen data interview
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${googleStatus.connected ? 'bg-green-100' : 'bg-gray-200'}`}>
                    {googleStatus.connected ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {googleStatus.connected ? "Terhubung dengan Google" : "Belum Terhubung"}
                    </p>
                    {googleStatus.connected && googleStatus.accountEmail && (
                      <p className="text-sm text-gray-600">{googleStatus.accountEmail}</p>
                    )}
                  </div>
                </div>
                {googleStatus.connected ? (
                  <div className="flex gap-2">
                    <Button onClick={handleTestGoogle} variant="outline" size="sm">
                      <TestTube className="h-4 w-4 mr-2" />
                      Test Koneksi
                    </Button>
                    <Button onClick={handleDisconnectGoogle} variant="destructive" size="sm">
                      Putuskan
                    </Button>
                  </div>
                ) : null}
              </div>

              <Separator />

              {/* Configuration */}
              {!googleStatus.connected && (
                <>
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 flex items-center gap-2 mb-2">
                        <Shield className="h-4 w-4" />
                        Cara Mendapatkan OAuth Credentials
                      </h4>
                      <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                        <li>Buka <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></li>
                        <li>Buat project baru atau pilih project yang ada</li>
                        <li>Aktifkan Google Drive API dan Google Sheets API</li>
                        <li>Buat OAuth 2.0 Client ID di "Credentials"</li>
                        <li>Tambahkan Redirect URI: <code className="bg-white px-2 py-0.5 rounded">{googleRedirectUri}</code></li>
                        <li>Copy Client ID dan Client Secret</li>
                      </ol>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="googleClientId">Google Client ID</Label>
                        <Input
                          id="googleClientId"
                          value={googleClientId}
                          onChange={(e) => setGoogleClientId(e.target.value)}
                          placeholder="123456789-abcdefg.apps.googleusercontent.com"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="googleClientSecret">Google Client Secret</Label>
                        <Input
                          id="googleClientSecret"
                          type="password"
                          value={googleClientSecret}
                          onChange={(e) => setGoogleClientSecret(e.target.value)}
                          placeholder="GOCSPX-xxxxxxxxxxxxx"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="googleRedirectUri">Redirect URI</Label>
                        <Input
                          id="googleRedirectUri"
                          value={googleRedirectUri}
                          onChange={(e) => setGoogleRedirectUri(e.target.value)}
                          className="mt-1"
                          disabled
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Tambahkan URI ini ke Google Cloud Console
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handleConnectGoogle} 
                    disabled={isConnectingGoogle || !googleClientId || !googleClientSecret}
                    className="w-full"
                  >
                    {isConnectingGoogle ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Menghubungkan...
                      </>
                    ) : (
                      <>
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Hubungkan dengan Google
                      </>
                    )}
                  </Button>
                </>
              )}

              {/* Features when connected */}
              {googleStatus.connected && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Fitur yang Tersedia:</h4>
                  <div className="grid gap-3">
                    <div className="flex items-start gap-3 p-3 bg-white border rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Akses Google Forms</p>
                        <p className="text-xs text-gray-600">Import data hasil interview dari Google Forms</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white border rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Akses Google Sheets</p>
                        <p className="text-xs text-gray-600">Baca dan tulis data ke Google Sheets</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white border rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Sinkronisasi Otomatis</p>
                        <p className="text-xs text-gray-600">Data akan tersinkronisasi secara otomatis</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* WordPress Integration Tab */}
      {current === "wordpress" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                Integrasi WordPress CMS
              </CardTitle>
              <CardDescription>
                Hubungkan dengan WordPress untuk manajemen konten, blog, dan artikel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${wordpressStatus.connected ? 'bg-green-100' : 'bg-gray-200'}`}>
                    {wordpressStatus.connected ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {wordpressStatus.connected ? "Terhubung dengan WordPress" : "Belum Terhubung"}
                    </p>
                    {wordpressStatus.connected && wordpressStatus.accountName && (
                      <p className="text-sm text-gray-600">{wordpressStatus.accountName}</p>
                    )}
                  </div>
                </div>
                {wordpressStatus.connected ? (
                  <div className="flex gap-2">
                    <Button onClick={handleTestWordpress} variant="outline" size="sm">
                      <TestTube className="h-4 w-4 mr-2" />
                      Test Koneksi
                    </Button>
                    <Button onClick={handleDisconnectWordpress} variant="destructive" size="sm">
                      Putuskan
                    </Button>
                  </div>
                ) : null}
              </div>

              <Separator />

              {/* Configuration */}
              {!wordpressStatus.connected && (
                <>
                  <div className="space-y-4">
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="font-medium text-purple-900 flex items-center gap-2 mb-2">
                        <Shield className="h-4 w-4" />
                        Cara Mendapatkan Application Password
                      </h4>
                      <ol className="text-sm text-purple-800 space-y-1 list-decimal list-inside">
                        <li>Login ke dashboard WordPress Anda</li>
                        <li>Buka menu Users → Profile</li>
                        <li>Scroll ke bawah ke bagian "Application Passwords"</li>
                        <li>Masukkan nama aplikasi (contoh: "School Admin System")</li>
                        <li>Klik "Add New Application Password"</li>
                        <li>Copy password yang muncul (format: xxxx xxxx xxxx xxxx xxxx xxxx)</li>
                      </ol>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="wordpressUrl">WordPress Site URL</Label>
                        <Input
                          id="wordpressUrl"
                          value={wordpressUrl}
                          onChange={(e) => setWordpressUrl(e.target.value)}
                          placeholder="https://blog.sekolah.com"
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          URL lengkap website WordPress Anda
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="wordpressUsername">WordPress Username</Label>
                        <Input
                          id="wordpressUsername"
                          value={wordpressUsername}
                          onChange={(e) => setWordpressUsername(e.target.value)}
                          placeholder="admin"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="wordpressAppPassword">Application Password</Label>
                        <Input
                          id="wordpressAppPassword"
                          type="password"
                          value={wordpressAppPassword}
                          onChange={(e) => setWordpressAppPassword(e.target.value)}
                          placeholder="xxxx xxxx xxxx xxxx xxxx xxxx"
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Application Password dari WordPress (bukan password login biasa)
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handleConnectWordpress} 
                    disabled={isConnectingWordpress || !wordpressUrl || !wordpressUsername || !wordpressAppPassword}
                    className="w-full"
                  >
                    {isConnectingWordpress ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Menghubungkan...
                      </>
                    ) : (
                      <>
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Hubungkan dengan WordPress
                      </>
                    )}
                  </Button>
                </>
              )}

              {/* Features when connected */}
              {wordpressStatus.connected && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Fitur yang Tersedia:</h4>
                  <div className="grid gap-3">
                    <div className="flex items-start gap-3 p-3 bg-white border rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Manajemen Artikel</p>
                        <p className="text-xs text-gray-600">Buat, edit, dan publikasikan artikel langsung dari sistem</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white border rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Media Library</p>
                        <p className="text-xs text-gray-600">Akses dan upload media ke WordPress</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white border rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Categories & Tags</p>
                        <p className="text-xs text-gray-600">Kelola kategori dan tag artikel</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900 font-medium mb-2">Akses WordPress Site:</p>
                    <a 
                      href={wordpressUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-700 hover:underline flex items-center gap-1"
                    >
                      {wordpressUrl}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Academic System Integration Tab */}
      {current === "academic" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-emerald-600" />
                Integrasi Sistem Akademik
              </CardTitle>
              <CardDescription>
                Hubungkan dengan Sistem Akademik Full Version dari PT Koneksi Jaringan Indonesia
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${academicStatus.connected ? 'bg-green-100' : 'bg-gray-200'}`}>
                    {academicStatus.connected ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {academicStatus.connected ? "Terhubung dengan Sistem Akademik" : "Belum Terhubung"}
                    </p>
                    {academicStatus.connected && academicStatus.accountName && (
                      <p className="text-sm text-gray-600">{academicStatus.accountName}</p>
                    )}
                  </div>
                </div>
                {academicStatus.connected ? (
                  <div className="flex gap-2">
                    <Button onClick={handleTestAcademic} variant="outline" size="sm">
                      <TestTube className="h-4 w-4 mr-2" />
                      Test Koneksi
                    </Button>
                    <Button onClick={handleDisconnectAcademic} variant="destructive" size="sm">
                      Putuskan
                    </Button>
                  </div>
                ) : null}
              </div>

              <Separator />

              {/* Information Box */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-4">
                <h4 className="font-medium text-emerald-900 flex items-center gap-2 mb-3">
                  <Building className="h-5 w-5" />
                  Tentang Sistem Akademik Full Version
                </h4>
                <div className="space-y-2 text-sm text-emerald-800">
                  <p>
                    <strong>Sistem Administrasi Sekolah</strong> (aplikasi ini) adalah versi lite yang fokus pada manajemen administrasi umum seperti:
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Pendaftaran siswa baru (SPMB)</li>
                    <li>Manajemen kontak dan komunikasi</li>
                    <li>Manajemen staff dan pengajar</li>
                    <li>Konten website dan artikel</li>
                  </ul>
                  <p className="mt-3">
                    <strong>Sistem Akademik Full Version</strong> dari PT Koneksi Jaringan Indonesia mencakup fitur lengkap seperti:
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Manajemen kurikulum dan mata pelajaran</li>
                    <li>Penjadwalan kelas dan ujian</li>
                    <li>Input dan olah nilai siswa</li>
                    <li>Rapor dan transkrip digital</li>
                    <li>Absensi siswa dan guru</li>
                    <li>E-learning dan materi ajar</li>
                    <li>Perpustakaan digital</li>
                    <li>Keuangan dan SPP</li>
                  </ul>
                </div>
              </div>

              {/* Configuration */}
              {!academicStatus.connected && (
                <>
                  <div className="space-y-4">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                      <h4 className="font-medium text-emerald-900 flex items-center gap-2 mb-2">
                        <Shield className="h-4 w-4" />
                        Cara Mendapatkan API Key
                      </h4>
                      <ol className="text-sm text-emerald-800 space-y-1 list-decimal list-inside">
                        <li>Login ke dashboard Sistem Akademik Anda</li>
                        <li>Buka menu Pengaturan → API & Integrasi</li>
                        <li>Klik "Generate New API Key"</li>
                        <li>Copy API Key dan School Code</li>
                        <li>Pastikan API endpoint sudah aktif</li>
                      </ol>
                      <div className="mt-3 pt-3 border-t border-emerald-200">
                        <p className="text-sm text-emerald-900 font-medium">Butuh Bantuan?</p>
                        <p className="text-sm text-emerald-800 mt-1">
                          Hubungi: <strong>support@koneksijaringan.com</strong> atau 
                          <strong> +62 xxx-xxxx-xxxx</strong>
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="academicApiUrl">API URL Sistem Akademik</Label>
                        <Input
                          id="academicApiUrl"
                          value={academicApiUrl}
                          onChange={(e) => setAcademicApiUrl(e.target.value)}
                          placeholder="https://api.akademik.koneksijaringan.com"
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          URL API endpoint Sistem Akademik Anda
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="academicSchoolCode">School Code</Label>
                        <Input
                          id="academicSchoolCode"
                          value={academicSchoolCode}
                          onChange={(e) => setAcademicSchoolCode(e.target.value)}
                          placeholder="SCH-2024-XXXX"
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Kode unik sekolah Anda
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="academicApiKey">API Key</Label>
                        <Input
                          id="academicApiKey"
                          type="password"
                          value={academicApiKey}
                          onChange={(e) => setAcademicApiKey(e.target.value)}
                          placeholder="ak_live_xxxxxxxxxxxxxxxxxxxxxxxx"
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          API Key dari dashboard Sistem Akademik
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handleConnectAcademic} 
                    disabled={isConnectingAcademic || !academicApiUrl || !academicApiKey || !academicSchoolCode}
                    className="w-full"
                  >
                    {isConnectingAcademic ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Menghubungkan...
                      </>
                    ) : (
                      <>
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Hubungkan dengan Sistem Akademik
                      </>
                    )}
                  </Button>
                </>
              )}

              {/* Features when connected */}
              {academicStatus.connected && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Fitur yang Tersedia:</h4>
                  <div className="grid gap-3">
                    <div className="flex items-start gap-3 p-3 bg-white border rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Data Siswa Terintegrasi</p>
                        <p className="text-xs text-gray-600">Sinkronisasi data siswa dari pendaftaran ke sistem akademik</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white border rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Transfer Data Otomatis</p>
                        <p className="text-xs text-gray-600">Data pendaftar yang diterima otomatis masuk ke sistem akademik</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white border rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Akses Data Staff</p>
                        <p className="text-xs text-gray-600">Sinkronisasi data guru dan staff</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white border rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Reporting & Analytics</p>
                        <p className="text-xs text-gray-600">Akses laporan dan statistik dari sistem akademik</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <p className="text-sm text-emerald-900 font-medium mb-2">API Status:</p>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-emerald-800">Connected to {academicApiUrl}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* General Settings Tab */}
      {current === "general" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-600" />
                Pengaturan Umum
              </CardTitle>
              <CardDescription>
                Konfigurasi umum untuk semua integrasi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Auto Sync</p>
                    <p className="text-sm text-gray-600">Sinkronisasi otomatis data setiap hari</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-600">Notifikasi email untuk setiap update</p>
                  </div>
                  <Switch />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">API Logging</p>
                    <p className="text-sm text-gray-600">Simpan log semua aktivitas API</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div>
                  <Label htmlFor="syncInterval">Interval Sinkronisasi (jam)</Label>
                  <Input
                    id="syncInterval"
                    type="number"
                    defaultValue="24"
                    min="1"
                    max="168"
                    className="mt-1 max-w-xs"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Simpan Pengaturan
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-gray-600" />
                Informasi Sistem
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Versi Aplikasi:</span>
                  <span className="font-medium">1.0.0</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-600">Database:</span>
                  <span className="font-medium">PostgreSQL</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-600">Environment:</span>
                  <Badge variant="outline">Development</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
