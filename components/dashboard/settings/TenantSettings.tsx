"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Globe,
  Building2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Save,
  RefreshCw,
  Link as LinkIcon,
  Palette,
  Copy,
  ExternalLink,
  Info,
  Shield,
  Zap,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";

interface DomainConfig {
  id?: string;
  domain: string;
  status: "pending" | "configuring" | "active" | "error" | "suspended";
  verified: boolean;
  verifiedAt?: string | null;
  verificationRecord?: string; // TXT record for verification
  cnameTarget?: string; // CNAME target
  aRecordTarget?: string; // A record target (if not using CNAME)
  createdAt?: string;
  errorMessage?: string;
}

interface TenantSettingsData {
  id?: string;
  name: string;
  slug: string;
  domains: DomainConfig[];
  logo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  email: string;
  phone: string;
  address: string;
  website: string;
}

export function TenantSettings() {
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const [data, setData] = React.useState<TenantSettingsData>({
    name: "",
    slug: "",
    domains: [],
    logo: "",
    favicon: "",
    primaryColor: "#10b981",
    secondaryColor: "#059669",
    email: "",
    phone: "",
    address: "",
    website: "",
  });

  const [newDomain, setNewDomain] = React.useState("");
  const [addingDomain, setAddingDomain] = React.useState(false);
  const [verifyingDomain, setVerifyingDomain] = React.useState<string | null>(null);
  const [checkingDomain, setCheckingDomain] = React.useState<string | null>(null);
  const [expandedDomain, setExpandedDomain] = React.useState<string | null>(null);

  // Load tenant settings on mount
  React.useEffect(() => {
    fetchTenantSettings();
  }, []);

  const fetchTenantSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/tenant/settings");
      const result = await response.json();

      if (result.success && result.data) {
        setData({
          ...result.data,
          domains: result.data.domains || [],
        });
      } else {
        // If no tenant exists, use defaults
        setData({
          name: "",
          slug: "",
          domains: [],
          logo: "",
          favicon: "",
          primaryColor: "#10b981",
          secondaryColor: "#059669",
          email: "",
          phone: "",
          address: "",
          website: "",
        });
      }
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

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Validate required fields
      if (!data.name.trim()) {
        throw new Error("Nama instansi harus diisi");
      }
      if (!data.slug.trim()) {
        throw new Error("Slug harus diisi");
      }
      // Validate slug format (lowercase, alphanumeric, dashes only)
      if (!/^[a-z0-9-]+$/.test(data.slug)) {
        throw new Error("Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung");
      }

      const response = await fetch("/api/tenant/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Gagal menyimpan data");
      }

      setData(result.data);
      toast.success("Pengaturan tenant berhasil disimpan!");
      setSuccessMessage("Pengaturan berhasil disimpan");
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

  const handleAddDomain = async () => {
    if (!newDomain.trim()) {
      toast.error("Domain harus diisi");
      return;
    }

    // Validate domain format
    const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
    if (!domainRegex.test(newDomain.trim())) {
      toast.error("Format domain tidak valid");
      return;
    }

    setAddingDomain(true);
    setError(null);
    try {
      const response = await fetch("/api/tenant/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: newDomain.trim() }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Gagal menambahkan domain");
      }

      toast.success("Domain berhasil ditambahkan!");
      setNewDomain("");
      await fetchTenantSettings(); // Reload data
    } catch (addError) {
      const errorMessage =
        addError instanceof Error
          ? addError.message
          : "Gagal menambahkan domain";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setAddingDomain(false);
    }
  };

  const handleVerifyDomain = async (domain: string) => {
    setVerifyingDomain(domain);
    setError(null);
    try {
      const response = await fetch("/api/tenant/verify-domain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Gagal memverifikasi domain");
      }

      toast.success("Verifikasi domain berhasil!");
      await fetchTenantSettings(); // Reload data
    } catch (verifyError) {
      const errorMessage =
        verifyError instanceof Error
          ? verifyError.message
          : "Gagal memverifikasi domain";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setVerifyingDomain(null);
    }
  };

  const handleCheckDomain = async (domain: string) => {
    setCheckingDomain(domain);
    setError(null);
    try {
      const response = await fetch("/api/tenant/check-domain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Gagal memeriksa status domain");
      }

      toast.success("Status domain diperbarui");
      await fetchTenantSettings(); // Reload data
    } catch (checkError) {
      const errorMessage =
        checkError instanceof Error
          ? checkError.message
          : "Gagal memeriksa status domain";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setCheckingDomain(null);
    }
  };

  const handleRemoveDomain = async (domainId: string, domain: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus domain "${domain}"?`)) {
      return;
    }

    setError(null);
    try {
      const response = await fetch(`/api/tenant/domains/${domainId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Gagal menghapus domain");
      }

      toast.success("Domain berhasil dihapus");
      await fetchTenantSettings(); // Reload data
    } catch (removeError) {
      const errorMessage =
        removeError instanceof Error
          ? removeError.message
          : "Gagal menghapus domain";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} berhasil disalin`);
  };

  const getDomainStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-success text-success-foreground">
            <CheckCircle className="h-3 w-3 mr-1" />
            Aktif
          </Badge>
        );
      case "configuring":
        return (
          <Badge variant="secondary" className="bg-warning-muted text-warning-foreground">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Mengonfigurasi
          </Badge>
        );
      case "error":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        );
      case "suspended":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Ditangguhkan
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert className="border-success/50 bg-success/10">
          <CheckCircle className="h-4 w-4 text-success" />
          <AlertTitle className="text-success">Berhasil</AlertTitle>
          <AlertDescription className="text-success">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Informasi Tenant */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Informasi Instansi
          </CardTitle>
          <CardDescription>
            Informasi dasar instansi Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tenant-name">
                Nama Instansi <span className="text-destructive">*</span>
              </Label>
              <Input
                id="tenant-name"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                placeholder="SMP IT Masjid Syuhada"
              />
              <p className="text-xs text-muted-foreground">
                Nama lengkap instansi, sekolah, atau kampus Anda
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenant-slug">
                Slug <span className="text-destructive">*</span>
              </Label>
              <Input
                id="tenant-slug"
                value={data.slug}
                onChange={(e) =>
                  setData({
                    ...data,
                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                  })
                }
                placeholder="smp-syuhada"
              />
              <p className="text-xs text-muted-foreground">
                Identifier unik (huruf kecil, angka, dan tanda hubung)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenant-email">Email</Label>
              <Input
                id="tenant-email"
                type="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                placeholder="info@smp-syuhada.sch.id"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenant-phone">Telepon</Label>
              <Input
                id="tenant-phone"
                value={data.phone}
                onChange={(e) => setData({ ...data, phone: e.target.value })}
                placeholder="+62 21 1234 5678"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="tenant-address">Alamat</Label>
              <Input
                id="tenant-address"
                value={data.address}
                onChange={(e) => setData({ ...data, address: e.target.value })}
                placeholder="Jl. Contoh No. 123, Jakarta"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="tenant-website">Website</Label>
              <Input
                id="tenant-website"
                type="url"
                value={data.website}
                onChange={(e) => setData({ ...data, website: e.target.value })}
                placeholder="https://www.smp-syuhada.sch.id"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Domains */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Custom Domains
          </CardTitle>
          <CardDescription>
            Konfigurasi domain kustom untuk instansi Anda. Tambahkan domain dan ikuti instruksi DNS untuk mengaktifkannya.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Domain Section */}
          <div className="space-y-2">
            <Label htmlFor="new-domain">Tambahkan Domain</Label>
            <div className="flex gap-2">
              <Input
                id="new-domain"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                placeholder="example.com atau subdomain.example.com"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newDomain.trim()) {
                    handleAddDomain();
                  }
                }}
              />
              <Button
                onClick={handleAddDomain}
                disabled={addingDomain || !newDomain.trim()}
              >
                {addingDomain ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Menambahkan...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Tambah
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Masukkan domain lengkap (contoh: smp-syuhada.sch.id atau www.smp-syuhada.sch.id)
            </p>
          </div>

          <Separator />

          {/* Domains List */}
          {data.domains.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Globe className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">
                Belum ada domain yang ditambahkan. Tambahkan domain untuk mulai menggunakan custom domain.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.domains.map((domainConfig) => {
                const isExpanded = expandedDomain === domainConfig.id;
                const isVerifying = verifyingDomain === domainConfig.domain;
                const isChecking = checkingDomain === domainConfig.domain;
                const platformDomain = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || "your-platform.com";
                const cnameTarget = domainConfig.cnameTarget || `cname.${platformDomain}`;
                const verificationRecord = domainConfig.verificationRecord || `vercel-domain-verify=${domainConfig.domain},${domainConfig.id || ""}`;

                return (
                  <div
                    key={domainConfig.id || domainConfig.domain}
                    className="rounded-lg border border-border bg-card"
                  >
                    {/* Domain Header */}
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <LinkIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="font-medium text-foreground truncate">
                              {domainConfig.domain}
                            </span>
                            {getDomainStatusBadge(domainConfig.status)}
                          </div>
                          {domainConfig.verified && domainConfig.verifiedAt && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <CheckCircle className="h-3 w-3 text-success" />
                              Terverifikasi pada{" "}
                              {new Date(domainConfig.verifiedAt).toLocaleDateString("id-ID", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          )}
                          {domainConfig.errorMessage && (
                            <p className="text-xs text-destructive mt-1">
                              {domainConfig.errorMessage}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCheckDomain(domainConfig.domain)}
                          disabled={isChecking}
                          title="Periksa status domain"
                        >
                          {isChecking ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setExpandedDomain(isExpanded ? null : (domainConfig.id || domainConfig.domain))
                          }
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveDomain(domainConfig.id || "", domainConfig.domain)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          title="Hapus domain"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Domain Details (Expandable) */}
                    {isExpanded && (
                      <div className="border-t border-border p-4 space-y-4 bg-muted/30">
                        {domainConfig.status !== "active" && (
                          <div className="space-y-4">
                            {/* DNS Configuration Instructions */}
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Info className="h-4 w-4 text-info" />
                                <Label className="text-sm font-semibold">
                                  Konfigurasi DNS
                                </Label>
                              </div>
                              <Alert className="mb-4">
                                <AlertDescription className="text-sm">
                                  Tambahkan record berikut di DNS provider Anda untuk mengaktifkan domain ini.
                                  Perubahan DNS bisa memakan waktu hingga 48 jam untuk diterapkan.
                                </AlertDescription>
                              </Alert>

                              {/* CNAME Configuration */}
                              <div className="space-y-3 mb-4">
                                <div>
                                  <Label className="text-xs font-medium text-muted-foreground mb-2 block">
                                    Method 1: CNAME Record (Recommended)
                                  </Label>
                                  <div className="rounded-lg border border-border bg-background p-4 space-y-3">
                                    <div>
                                      <div className="flex items-center justify-between mb-1">
                                        <Label className="text-xs font-medium">Type</Label>
                                        <Badge variant="outline" className="text-xs">CNAME</Badge>
                                      </div>
                                      <div className="flex items-center justify-between mb-1">
                                        <Label className="text-xs font-medium">Name</Label>
                                        <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                                          @
                                        </code>
                                      </div>
                                      <div className="flex items-center justify-between mb-1">
                                        <Label className="text-xs font-medium">Value</Label>
                                        <div className="flex items-center gap-2">
                                          <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                                            {cnameTarget}
                                          </code>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 w-7 p-0"
                                            onClick={() =>
                                              copyToClipboard(cnameTarget, "CNAME target")
                                            }
                                            title="Salin CNAME target"
                                          >
                                            <Copy className="h-3.5 w-3.5" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* A Record Configuration (Alternative) */}
                                <div>
                                  <Label className="text-xs font-medium text-muted-foreground mb-2 block">
                                    Method 2: A Record (Alternative)
                                  </Label>
                                  <div className="rounded-lg border border-border bg-background p-4 space-y-3">
                                    <div>
                                      <div className="flex items-center justify-between mb-1">
                                        <Label className="text-xs font-medium">Type</Label>
                                        <Badge variant="outline" className="text-xs">A</Badge>
                                      </div>
                                      <div className="flex items-center justify-between mb-1">
                                        <Label className="text-xs font-medium">Name</Label>
                                        <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                                          @
                                        </code>
                                      </div>
                                      <div className="flex items-center justify-between mb-1">
                                        <Label className="text-xs font-medium">Value</Label>
                                        <div className="flex items-center gap-2">
                                          <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                                            {domainConfig.aRecordTarget || "76.76.21.21"}
                                          </code>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 w-7 p-0"
                                            onClick={() =>
                                              copyToClipboard(
                                                domainConfig.aRecordTarget || "76.76.21.21",
                                                "A record target",
                                              )
                                            }
                                            title="Salin A record target"
                                          >
                                            <Copy className="h-3.5 w-3.5" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Verification TXT Record */}
                              <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2">
                                  <Shield className="h-4 w-4 text-primary" />
                                  <Label className="text-xs font-semibold">
                                    Verifikasi Domain (TXT Record)
                                  </Label>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2">
                                  Tambahkan TXT record berikut untuk memverifikasi kepemilikan domain:
                                </p>
                                <div className="rounded-lg border border-border bg-background p-4">
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <Label className="text-xs font-medium">Type</Label>
                                      <Badge variant="outline" className="text-xs">TXT</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <Label className="text-xs font-medium">Name</Label>
                                      <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                                        @
                                      </code>
                                    </div>
                                    <div>
                                      <Label className="text-xs font-medium mb-1 block">
                                        Value
                                      </Label>
                                      <div className="flex items-center gap-2">
                                        <code className="text-xs bg-muted px-2 py-1 rounded font-mono break-all flex-1">
                                          {verificationRecord}
                                        </code>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-7 w-7 p-0 shrink-0"
                                          onClick={() =>
                                            copyToClipboard(verificationRecord, "Verification record")
                                          }
                                          title="Salin verification record"
                                        >
                                          <Copy className="h-3.5 w-3.5" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-2 pt-2">
                                <Button
                                  onClick={() => handleVerifyDomain(domainConfig.domain)}
                                  disabled={isVerifying}
                                  size="sm"
                                >
                                  {isVerifying ? (
                                    <>
                                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                      Memverifikasi...
                                    </>
                                  ) : (
                                    <>
                                      <Shield className="h-4 w-4 mr-2" />
                                      Verifikasi Domain
                                    </>
                                  )}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    window.open(
                                      `https://dnschecker.org/#TXT/${domainConfig.domain}`,
                                      "_blank",
                                    )
                                  }
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Cek DNS
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Active Domain Status */}
                        {domainConfig.status === "active" && domainConfig.verified && (
                          <div className="rounded-lg border border-success/20 bg-success/5 p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="h-5 w-5 text-success" />
                              <span className="font-medium text-success">Domain Aktif</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Domain Anda telah dikonfigurasi dengan benar dan aktif.
                              Website Anda dapat diakses melalui{" "}
                              <a
                                href={`https://${domainConfig.domain}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline font-medium"
                              >
                                https://{domainConfig.domain}
                              </a>
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Branding */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Branding & Tampilan
          </CardTitle>
          <CardDescription>
            Kustomisasi logo, warna, dan identitas visual instansi Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tenant-logo">Logo</Label>
              <Input
                id="tenant-logo"
                type="url"
                value={data.logo}
                onChange={(e) => setData({ ...data, logo: e.target.value })}
                placeholder="https://example.com/logo.png"
              />
              <p className="text-xs text-muted-foreground">
                URL logo instansi (disarankan ukuran 200x200px)
              </p>
              {data.logo && (
                <div className="mt-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={data.logo}
                    alt="Logo preview"
                    className="h-16 w-16 rounded-md object-contain border border-border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenant-favicon">Favicon</Label>
              <Input
                id="tenant-favicon"
                type="url"
                value={data.favicon}
                onChange={(e) => setData({ ...data, favicon: e.target.value })}
                placeholder="https://example.com/favicon.ico"
              />
              <p className="text-xs text-muted-foreground">
                URL favicon instansi (disarankan ukuran 32x32px atau 16x16px)
              </p>
              {data.favicon && (
                <div className="mt-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={data.favicon}
                    alt="Favicon preview"
                    className="h-8 w-8 rounded object-contain border border-border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenant-primary-color">Warna Utama</Label>
              <div className="flex gap-2">
                <Input
                  id="tenant-primary-color"
                  type="color"
                  value={data.primaryColor}
                  onChange={(e) =>
                    setData({ ...data, primaryColor: e.target.value })
                  }
                  className="h-10 w-20 cursor-pointer"
                />
                <Input
                  value={data.primaryColor}
                  onChange={(e) =>
                    setData({ ...data, primaryColor: e.target.value })
                  }
                  placeholder="#10b981"
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenant-secondary-color">Warna Sekunder</Label>
              <div className="flex gap-2">
                <Input
                  id="tenant-secondary-color"
                  type="color"
                  value={data.secondaryColor}
                  onChange={(e) =>
                    setData({ ...data, secondaryColor: e.target.value })
                  }
                  className="h-10 w-20 cursor-pointer"
                />
                <Input
                  value={data.secondaryColor}
                  onChange={(e) =>
                    setData({ ...data, secondaryColor: e.target.value })
                  }
                  placeholder="#059669"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={fetchTenantSettings} disabled={saving}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Simpan Pengaturan
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

