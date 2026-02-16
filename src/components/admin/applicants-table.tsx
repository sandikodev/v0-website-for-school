"use client";

import * as React from "react";
import useSWR from "swr";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

type Status = "pending" | "approved" | "declined";

type ApplicantDetailsValue = string | number | boolean | null | undefined;

export interface Applicant {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  status: Status;
  details?: Record<string, ApplicantDetailsValue>;
}

const STORAGE_KEY = "registrar_applicants";

const fetcher = async (): Promise<Applicant[]> => {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seed: Applicant[] = [
      {
        id: "REG-2025-0001",
        name: "Ahmad Setiawan",
        email: "ahmad@example.com",
        phone: "0812-1111-2222",
        createdAt: new Date().toISOString(),
        status: "pending",
        details: {
          sekolahAsal: "SMP 1",
          alamat: "Jl. Merdeka",
          nilaiRata: "88",
        },
      },
      {
        id: "REG-2025-0002",
        name: "Siti Rahma",
        email: "siti@example.com",
        phone: "0813-3333-4444",
        createdAt: new Date().toISOString(),
        status: "approved",
        details: {
          sekolahAsal: "SMP 2",
          alamat: "Jl. Anggrek",
          nilaiRata: "91",
        },
      },
      {
        id: "REG-2025-0003",
        name: "Budi Santoso",
        email: "budi@example.com",
        phone: "0812-5555-6666",
        createdAt: new Date().toISOString(),
        status: "declined",
        details: {
          sekolahAsal: "SMP 3",
          alamat: "Jl. Melati",
          nilaiRata: "76",
        },
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const save = (data: Applicant[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export default function ApplicantsTable() {
  const { data, mutate } = useSWR(STORAGE_KEY, fetcher);
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<Applicant | null>(null);

  const rows = React.useMemo(() => {
    if (!data) return [];
    if (!query) return data;
    const q = query.toLowerCase();
    return data.filter(
      (a) =>
        a.id.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        (a.phone || "").toLowerCase().includes(q),
    );
  }, [data, query]);

  const updateStatus = (id: string, status: Status) => {
    if (!data) return;
    const next = data.map((a) => (a.id === id ? { ...a, status } : a));
    save(next);
    mutate(next, { revalidate: false });
  };

  const removeApplicant = (id: string) => {
    if (!data) return;
    const next = data.filter((a) => a.id !== id);
    save(next);
    mutate(next, { revalidate: false });
  };

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-2">
        <Input
          placeholder="Cari pendaftar (ID / nama / email / telp)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-2">
          <Link href="/registrar">
            <Button variant="outline">Cek Status</Button>
          </Link>
          <Link href="/signup">
            <Button>Formulir Online</Button>
          </Link>
        </div>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <div className="min-w-[900px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No. Pendaftar</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telp</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-mono text-xs">{a.id}</TableCell>
                  <TableCell>{a.name}</TableCell>
                  <TableCell className="text-xs">{a.email}</TableCell>
                  <TableCell className="text-xs">{a.phone || "-"}</TableCell>
                  <TableCell>
                    {a.status === "approved"
                      ? "disetujui"
                      : a.status === "declined"
                        ? "tertolak"
                        : "sedang di tinjau"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelected(a)}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => updateStatus(a.id, "approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateStatus(a.id, "declined")}
                      >
                        Decline
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeApplicant(a.id)}
                      >
                        Hapus
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-sm text-muted-foreground"
                  >
                    Tidak ada data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Detail Pendaftar</DialogTitle>
            <DialogDescription>No. Pendaftar: {selected?.id}</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-2">
                <Item label="Nama" value={selected.name} />
                <Item label="Email" value={selected.email} />
                <Item label="Telepon" value={selected.phone || "-"} />
                <Item
                  label="Status"
                  value={
                    selected.status === "approved"
                      ? "disetujui"
                      : selected.status === "declined"
                        ? "tertolak"
                        : "sedang di tinjau"
                  }
                />
              </div>
              <Separator />
              <div className="grid gap-1">
                <div className="text-sm font-medium">Data Formulir</div>
                <pre className="rounded-md bg-muted p-2 text-xs overflow-auto">
                  {JSON.stringify(selected.details ?? {}, null, 2)}
                </pre>
              </div>
            </div>
          )}
          <DialogFooter className="flex items-center justify-between gap-2">
            {selected && (
              <div className="text-xs text-muted-foreground">
                Dibuat: {new Date(selected.createdAt).toLocaleString()}
              </div>
            )}
            <div className="flex gap-2">
              {selected && (
                <>
                  <Link
                    href={`/registrar?id=${encodeURIComponent(selected.id)}`}
                  >
                    <Button variant="outline">Lihat Status Publik</Button>
                  </Link>
                  <Button onClick={() => setSelected(null)}>Tutup</Button>
                </>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Item({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid gap-1">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm">{value}</div>
    </div>
  );
}
