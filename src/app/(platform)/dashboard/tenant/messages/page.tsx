"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */

import * as React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { FlatTabNavigation } from "@/components/dashboard/FlatTabNavigation";
import {
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Clock,
  User,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Reply,
  Archive,
  Star,
  Flag,
  Download,
  Upload,
  Settings,
  Bell,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Image,
  Paperclip,
  Send,
  Inbox,
  Trash,
  Folder,
  Tag,
  Calendar,
  Globe,
  Building,
  School,
  GraduationCap,
  Award,
  BookOpen,
  Users,
  Settings as SettingsIcon,
  Plus,
} from "lucide-react";
import { useTabParam } from "@/hooks";

// Import MessagesPanel component
import MessagesPanel from "@/components/admin/messages-panel";

// Mock data untuk pesan
const mockMessages = [
  {
    id: "1",
    name: "Ahmad Fauzi",
    email: "ahmad@example.com",
    phone: "081234567890",
    subject: "Informasi Pendaftaran",
    message:
      "Assalamualaikum, saya ingin menanyakan jadwal pendaftaran dan persyaratan dokumen yang harus disiapkan. Terima kasih.",
    createdAt: "2024-01-15T10:30:00Z",
    status: "new",
    category: "pendaftaran",
    priority: "normal",
  },
  {
    id: "2",
    name: "Siti Rahma",
    email: "siti@example.com",
    phone: "081234567891",
    subject: "Kunjungan Sekolah",
    message:
      "Selamat pagi, saya ingin mengajukan kunjungan ke sekolah untuk melihat fasilitas dan lingkungan belajar. Kapan waktu yang tepat?",
    createdAt: "2024-01-14T14:20:00Z",
    status: "read",
    category: "kunjungan",
    priority: "high",
  },
  {
    id: "3",
    name: "Budi Setiawan",
    email: "budi@example.com",
    phone: "081234567892",
    subject: "Beasiswa",
    message:
      "Apakah sekolah menyediakan program beasiswa untuk siswa berprestasi? Bagaimana cara mendaftarnya?",
    createdAt: "2024-01-13T09:15:00Z",
    status: "new",
    category: "beasiswa",
    priority: "normal",
  },
];

export default function MessagesPage() {
  const { current, setTab } = useTabParam("inbox");
  const [messages] = React.useState(mockMessages);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <AlertCircle className="h-4 w-4 text-info" />;
      case "read":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "replied":
        return <Reply className="h-4 w-4 text-primary" />;
      default:
        return <Mail className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <Flag className="h-4 w-4 text-error" />;
      case "normal":
        return <Flag className="h-4 w-4 text-warning" />;
      case "low":
        return <Flag className="h-4 w-4 text-success" />;
      default:
        return <Flag className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const tabs = [
    { key: "inbox", label: "Kotak Masuk" },
    { key: "compose", label: "Tulis Pesan" },
    { key: "templates", label: "Template" },
    { key: "settings", label: "Pengaturan" },
  ];

  return (
    <FlatTabNavigation
      tabs={tabs}
      current={current}
      onTabChange={setTab}
      ariaLabel="Messages sections"
    >
        {/* Kotak Masuk - Menggunakan MessagesPanel */}
        <TabsContent value="inbox">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Inbox className="h-5 w-5" />
                Kotak Masuk
              </CardTitle>
              <CardDescription>
                Pesan dari halaman Kontak website
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <MessagesPanel />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tulis Pesan */}
        <TabsContent value="compose">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Tulis Pesan Baru
                </CardTitle>
                <CardDescription>
                  Kirim pesan kepada orang tua atau siswa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Penerima</Label>
                    <Input id="recipient" placeholder="email@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subjek</Label>
                    <Input id="subject" placeholder="Subjek pesan" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategori</Label>
                    <select className="w-full p-2 border border-border bg-background rounded-md text-sm transition-all duration-200 hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input dark:border-input">
                      <option value="umum">Umum</option>
                      <option value="pendaftaran">Pendaftaran</option>
                      <option value="akademik">Akademik</option>
                      <option value="keuangan">Keuangan</option>
                      <option value="kesiswaan">Kesiswaan</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Prioritas</Label>
                    <select className="w-full p-2 border border-border bg-background rounded-md text-sm transition-all duration-200 hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input dark:border-input">
                      <option value="normal">Normal</option>
                      <option value="high">Tinggi</option>
                      <option value="low">Rendah</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Pesan</Label>
                  <Textarea
                    id="message"
                    placeholder="Tulis pesan Anda di sini..."
                    rows={8}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Paperclip className="h-4 w-4 mr-2" />
                      Lampiran
                    </Button>
                    <Button variant="outline" size="sm">
                      <Image className="h-4 w-4 mr-2" />
                      Gambar
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Simpan Draft
                    </Button>
                    <Button>
                      <Send className="h-4 w-4 mr-2" />
                      Kirim Pesan
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Template Pesan */}
        <TabsContent value="templates">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Template Pesan
                </CardTitle>
                <CardDescription>
                  Kelola template pesan untuk berbagai keperluan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Template Tersedia</h3>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Template
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">
                        Konfirmasi Pendaftaran
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-3">
                        Template untuk konfirmasi pendaftaran siswa baru
                      </p>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">
                        Pemberitahuan Ujian
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-3">
                        Template untuk pemberitahuan jadwal ujian
                      </p>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Undangan Rapat</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-3">
                        Template untuk undangan rapat orang tua
                      </p>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">
                        Peringatan Pembayaran
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-3">
                        Template untuk peringatan pembayaran SPP
                      </p>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Informasi Libur</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-3">
                        Template untuk informasi hari libur
                      </p>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">
                        Selamat Hari Raya
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-3">
                        Template untuk ucapan hari raya
                      </p>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pengaturan Pesan */}
        <TabsContent value="settings">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" />
                  Pengaturan Pesan
                </CardTitle>
                <CardDescription>
                  Konfigurasi sistem pesan dan notifikasi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="auto-reply">Balasan Otomatis</Label>
                    <select className="w-full p-2 border border-border bg-background rounded-md text-sm transition-all duration-200 hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input dark:border-input">
                      <option value="enabled">Diaktifkan</option>
                      <option value="disabled">Dinonaktifkan</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notification-email">Email Notifikasi</Label>
                    <Input
                      id="notification-email"
                      placeholder="admin@smp-syuhada.sch.id"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-messages">
                      Maksimal Pesan per Hari
                    </Label>
                    <Input id="max-messages" placeholder="100" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spam-filter">Filter Spam</Label>
                    <select className="w-full p-2 border border-border bg-background rounded-md text-sm transition-all duration-200 hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input dark:border-input">
                      <option value="high">Tinggi</option>
                      <option value="medium">Sedang</option>
                      <option value="low">Rendah</option>
                    </select>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Notifikasi</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications">
                          Notifikasi Email
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Kirim notifikasi via email
                        </p>
                      </div>
                      <Checkbox id="email-notifications" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="sms-notifications">
                          Notifikasi SMS
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Kirim notifikasi via SMS
                        </p>
                      </div>
                      <Checkbox id="sms-notifications" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="push-notifications">
                          Notifikasi Push
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Kirim notifikasi push
                        </p>
                      </div>
                      <Checkbox id="push-notifications" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button>Simpan Pengaturan</Button>
                  <Button variant="outline">Reset ke Default</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
    </FlatTabNavigation>
  );
}
