"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TabsContent } from "@/components/ui/tabs";
import { FlatTabNavigation } from "@/components/dashboard/FlatTabNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { 
  Settings, 
  Bell
} from "lucide-react";
import { toast } from "sonner";
import { FormsSettingsTab } from "@/components/dashboard/forms/FormsSettingsTab";
import type { JalurData } from "@/components/dashboard/forms/JalurTable";
import type { GelombangData } from "@/components/dashboard/forms/GelombangTable";

export default function SettingsManagement() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const subTabFromQuery = useMemo(() => {
    const subTabParam = searchParams.get("settingsView");
    if (subTabParam === "notifications") return "notifications";
    if (subTabParam === "spmb-form") return "spmb-form";
    return "general";
  }, [searchParams]);

  const [subTabValue, setSubTabValue] = useState<"general" | "notifications" | "spmb-form">(
    subTabFromQuery,
  );

  // SPMB Form Settings State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [spmbData, setSpmbData] = useState<{
    academicYear: string;
    heroTitle: string;
    heroSubtitle: string;
    heroDescription?: string;
    jalurData: JalurData[];
    gelombangData: GelombangData[];
  }>({
    academicYear: "",
    heroTitle: "",
    heroSubtitle: "",
    heroDescription: "",
    jalurData: [],
    gelombangData: [],
  });

  // Track initial data to detect changes
  const initialDataRef = useRef<typeof spmbData | null>(null);

  // General Settings State
  const [offlineUploadEnabled, setOfflineUploadEnabled] = useState(true);
  const [defaultExpandAccordion, setDefaultExpandAccordion] = useState(false);
  const [generalSettings, setGeneralSettings] = useState({
    systemName: "",
    adminEmail: "",
    backupFrequency: "daily",
    dataRetention: "5 Tahun",
  });

  // Notifications State
  const [notifications, setNotifications] = useState({
    emailNotifications: false,
    smsNotifications: false,
    autoReminders: false,
  });

  useEffect(() => {
    setSubTabValue(subTabFromQuery);
  }, [subTabFromQuery]);

  // Load SPMB data on mount
  useEffect(() => {
    fetchSpmbData();
  }, []);

  // Load general settings from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("admissions.offlineUploadEnabled");
    if (stored !== null) {
      setOfflineUploadEnabled(stored !== "false");
    }
    const storedExpand = window.localStorage.getItem("admissions.defaultExpandAccordion");
    if (storedExpand !== null) {
      setDefaultExpandAccordion(storedExpand === "true");
    }
  }, []);

  const fetchSpmbData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/spmb/settings");
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Gagal memuat data");
      }

      const settings = result.data;
      const fetchedData = {
        academicYear: settings.academicYear || "",
        heroTitle: settings.heroTitle || "",
        heroSubtitle: settings.heroSubtitle || "",
        heroDescription: settings.heroDescription || "",
        jalurData: settings.jalurData || [],
        gelombangData: settings.gelombangData || [],
      };
      setSpmbData(fetchedData);
      initialDataRef.current = JSON.parse(JSON.stringify(fetchedData)); // Deep clone
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Terjadi kesalahan saat memuat data",
      );
    } finally {
      setLoading(false);
    }
  };

  // Check if SPMB data has changed
  const hasChanges = useMemo(() => {
    if (!initialDataRef.current) return false;
    return JSON.stringify(spmbData) !== JSON.stringify(initialDataRef.current);
  }, [spmbData]);

  // Validate SPMB data before save
  const validateSpmbData = (): string | null => {
    if (!spmbData.academicYear.trim()) {
      return "Tahun Ajaran harus diisi";
    }
    if (!spmbData.heroTitle.trim()) {
      return "Judul Formulir harus diisi";
    }
    for (const jalur of spmbData.jalurData) {
      if (!jalur.name.trim()) {
        return "Nama Jalur tidak boleh kosong";
      }
      if (jalur.quota !== undefined && jalur.quota < 0) {
        return "Kuota Jalur tidak boleh negatif";
      }
    }
    for (const gelombang of spmbData.gelombangData) {
      if (!gelombang.name.trim()) {
        return "Nama Gelombang tidak boleh kosong";
      }
      if (!gelombang.period.trim()) {
        return "Periode Gelombang tidak boleh kosong";
      }
      if (!gelombang.discount.trim()) {
        return "Diskon Gelombang tidak boleh kosong";
      }
      if (!gelombang.price.trim()) {
        return "Biaya Gelombang tidak boleh kosong";
      }
      if (!gelombang.description.trim()) {
        return "Deskripsi Gelombang tidak boleh kosong";
      }
    }
    return null;
  };

  const handleSpmbSave = async () => {
    const validationError = validateSpmbData();
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/spmb/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          academicYear: spmbData.academicYear,
          heroTitle: spmbData.heroTitle,
          heroSubtitle: spmbData.heroSubtitle,
          heroDescription: spmbData.heroDescription,
          jalurData: spmbData.jalurData,
          gelombangData: spmbData.gelombangData,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Gagal menyimpan data");
      }

      initialDataRef.current = JSON.parse(JSON.stringify(spmbData)); // Deep clone

      toast.success("Data berhasil disimpan!");
      setSuccessMessage("Data berhasil disimpan");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (saveError) {
      const errorMessage =
        saveError instanceof Error
          ? saveError.message
          : "Terjadi kesalahan saat menyimpan";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleOfflineUploadToggle = (value: boolean) => {
    setOfflineUploadEnabled(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "admissions.offlineUploadEnabled",
        value ? "true" : "false",
      );
      window.dispatchEvent(new Event("admissions-offline-upload-changed"));
      toast.success("Pengaturan berhasil disimpan");
    }
  };

  const handleDefaultExpandAccordionToggle = (value: boolean) => {
    setDefaultExpandAccordion(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "admissions.defaultExpandAccordion",
        value ? "true" : "false",
      );
      window.dispatchEvent(new Event("admissions-default-expand-accordion-changed"));
      toast.success("Pengaturan berhasil disimpan");
    }
  };

  const handleSubTabChange = (value: string) => {
    let nextValue: "general" | "notifications" | "spmb-form" = "general";
    if (value === "notifications") nextValue = "notifications";
    else if (value === "spmb-form") nextValue = "spmb-form";

    setSubTabValue(nextValue);
    const params = new URLSearchParams(searchParams.toString());
    params.set("settingsView", nextValue);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const tabs = [
    { key: "general", label: "Umum" },
    { key: "notifications", label: "Notifikasi" },
    { key: "spmb-form", label: "Formulir SPMB" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Pengaturan</h1>
        <p className="text-sm text-muted-foreground">
          Kelola konfigurasi sistem dan pengaturan aplikasi
        </p>
      </div>

      <FlatTabNavigation
        tabs={tabs}
        current={subTabValue}
        onTabChange={handleSubTabChange}
        ariaLabel="Settings sections"
      >

      {/* Pengaturan Umum */}
      <TabsContent value="general">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Pengaturan Umum
              </CardTitle>
              <CardDescription>Konfigurasi sistem SPMB</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="system-name">Nama Sistem</Label>
                  <Input
                    id="system-name"
                    value={generalSettings.systemName}
                    onChange={(e) =>
                      setGeneralSettings({ ...generalSettings, systemName: e.target.value })
                    }
                    placeholder="SPMB SMP Syuhada"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email Administrator</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    value={generalSettings.adminEmail}
                    onChange={(e) =>
                      setGeneralSettings({ ...generalSettings, adminEmail: e.target.value })
                    }
                    placeholder="admin@smp-syuhada.sch.id"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backup-frequency">Frekuensi Backup</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={generalSettings.backupFrequency}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        backupFrequency: e.target.value,
                      })
                    }
                  >
                    <option value="daily">Harian</option>
                    <option value="weekly">Mingguan</option>
                    <option value="monthly">Bulanan</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data-retention">Retensi Data</Label>
                  <Input
                    id="data-retention"
                    value={generalSettings.dataRetention}
                    onChange={(e) =>
                      setGeneralSettings({ ...generalSettings, dataRetention: e.target.value })
                    }
                    placeholder="5 Tahun"
                  />
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Fitur Upload Bukti Offline</h3>
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                  <div className="max-w-lg">
                    <Label htmlFor="offline-upload-toggle">
                      Izinkan peserta mengirim bukti manual
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Saat dinonaktifkan, kolom upload bukti offline tidak akan muncul di
                      halaman registrar sehingga peserta hanya bisa mengisi form digital.
                    </p>
                  </div>
                  <Switch
                    id="offline-upload-toggle"
                    checked={offlineUploadEnabled}
                    onCheckedChange={handleOfflineUploadToggle}
                  />
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Tampilan Halaman Registrar</h3>
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                  <div className="max-w-lg">
                    <Label htmlFor="default-expand-accordion-toggle">
                      Buka accordion secara default
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Saat diaktifkan, section &quot;Data Lengkap Pendaftar&quot; dan
                      &quot;Dokumen Terunggah&quot; akan terbuka secara default di halaman
                      registrar. Saat dinonaktifkan, semua accordion akan minimize secara
                      default.
                    </p>
                  </div>
                  <Switch
                    id="default-expand-accordion-toggle"
                    checked={defaultExpandAccordion}
                    onCheckedChange={handleDefaultExpandAccordionToggle}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Notifikasi */}
      <TabsContent value="notifications">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Pengaturan Notifikasi
              </CardTitle>
              <CardDescription>
                Kelola preferensi notifikasi dan pengingat
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Jenis Notifikasi</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                    <div>
                      <Label htmlFor="email-notifications">Notifikasi Email</Label>
                      <p className="text-sm text-muted-foreground">
                        Kirim notifikasi via email saat ada pendaftar baru atau perubahan
                        status
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={notifications.emailNotifications}
                      onCheckedChange={(value) => {
                        setNotifications({ ...notifications, emailNotifications: value });
                        toast.success("Pengaturan notifikasi email diperbarui");
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                    <div>
                      <Label htmlFor="sms-notifications">Notifikasi SMS</Label>
                      <p className="text-sm text-muted-foreground">
                        Kirim notifikasi via SMS (memerlukan konfigurasi gateway SMS)
                      </p>
                    </div>
                    <Switch
                      id="sms-notifications"
                      checked={notifications.smsNotifications}
                      onCheckedChange={(value) => {
                        setNotifications({ ...notifications, smsNotifications: value });
                        toast.success("Pengaturan notifikasi SMS diperbarui");
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                    <div>
                      <Label htmlFor="auto-reminders">Pengingat Otomatis</Label>
                      <p className="text-sm text-muted-foreground">
                        Kirim pengingat otomatis untuk tindakan yang perlu dilakukan
                      </p>
                    </div>
                    <Switch
                      id="auto-reminders"
                      checked={notifications.autoReminders}
                      onCheckedChange={(value) => {
                        setNotifications({ ...notifications, autoReminders: value });
                        toast.success("Pengaturan pengingat otomatis diperbarui");
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Formulir SPMB */}
      <TabsContent value="spmb-form">
        <FormsSettingsTab
          data={{
            academicYear: spmbData.academicYear,
            heroTitle: spmbData.heroTitle,
            heroSubtitle: spmbData.heroSubtitle,
            heroDescription: spmbData.heroDescription,
          }}
          onChange={(settings) => setSpmbData({ ...spmbData, ...settings })}
          onSave={handleSpmbSave}
          saving={saving}
          error={error}
          successMessage={successMessage}
          loading={loading}
          hasChanges={hasChanges}
        />
          </TabsContent>
      </FlatTabNavigation>
    </div>
  );
}

