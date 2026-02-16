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
import { Badge } from "@/components/ui/badge";
import {
  Users,
  MessageSquare,
  FileText,
  Settings,
  BarChart3,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";

export default function OverviewPage() {
  const stats = [
    {
      title: "Total Pesan",
      value: "24",
      change: "+12%",
      changeType: "positive" as const,
      icon: MessageSquare,
      description: "Pesan masuk bulan ini",
    },
    {
      title: "Pesan Baru",
      value: "8",
      change: "+3",
      changeType: "positive" as const,
      icon: Mail,
      description: "Belum dibaca",
    },
    {
      title: "Pendaftar SPMB",
      value: "156",
      change: "+23%",
      changeType: "positive" as const,
      icon: Users,
      description: "Total pendaftar",
    },
    {
      title: "Formulir Aktif",
      value: "3",
      change: "0",
      changeType: "neutral" as const,
      icon: FileText,
      description: "Formulir pendaftaran",
    },
  ];

  const quickActions = [
    {
      title: "Kelola Pesan",
      description: "Lihat dan kelola pesan masuk",
      href: "/dashboard/messages",
      icon: MessageSquare,
      color: "bg-info",
    },
    {
      title: "Formulir SPMB",
      description: "Atur formulir pendaftaran",
      href: "/dashboard/admissions",
      icon: FileText,
      color: "bg-success",
    },
    {
      title: "Informasi Sekolah",
      description: "Edit profil, tentang, struktur, dan fasilitas",
      href: "/dashboard/school",
      icon: Settings,
      color: "bg-primary",
    },
    {
      title: "Kontak & Jam",
      description: "Atur informasi kontak",
      href: "/dashboard/contact",
      icon: Phone,
      color: "bg-warning",
    },
  ];

  const recentMessages = [
    {
      id: "1",
      name: "Ahmad Fauzi",
      subject: "Informasi Pendaftaran",
      time: "2 jam yang lalu",
      status: "new" as const,
    },
    {
      id: "2",
      name: "Siti Rahma",
      subject: "Kunjungan Sekolah",
      time: "4 jam yang lalu",
      status: "read" as const,
    },
    {
      id: "3",
      name: "Budi Setiawan",
      subject: "Beasiswa",
      time: "1 hari yang lalu",
      status: "new" as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
              <div className="flex items-center pt-1">
                <Badge
                  variant={
                    stat.changeType === "positive" ? "default" : "secondary"
                  }
                  className="text-xs"
                >
                  {stat.change}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Aksi Cepat</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-md ${action.color} ${
                      action.color === "bg-info" ? "text-info-foreground" :
                      action.color === "bg-success" ? "text-success-foreground" :
                      action.color === "bg-primary" ? "text-primary-foreground" :
                      action.color === "bg-warning" ? "text-warning-foreground" : "text-foreground"
                    }`}>
                      <action.icon className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-sm">{action.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Messages */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pesan Terbaru</CardTitle>
            <CardDescription>Pesan masuk yang perlu perhatian</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMessages.map((message) => (
                <div key={message.id} className="flex items-center space-x-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {message.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {message.subject}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        message.status === "new" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {message.status === "new" ? "Baru" : "Dibaca"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {message.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/dashboard/messages">
                <Button variant="outline" size="sm" className="w-full">
                  Lihat Semua Pesan
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* School Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Sekolah</CardTitle>
            <CardDescription>Ringkasan profil sekolah</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Jl. Pendidikan No. 123, Yogyakarta
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">(0274) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">info@smp-syuhada.sch.id</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Senin - Jumat, 07:00 - 15:00</span>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/dashboard/contact">
                <Button variant="outline" size="sm" className="w-full">
                  Edit Informasi
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
