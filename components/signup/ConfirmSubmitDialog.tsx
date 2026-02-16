"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertCircle, MessageCircle } from "lucide-react";

interface ConfirmSubmitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
  whatsAppContact?: {
    waUrl: string;
    label: string;
  } | null;
}

export function ConfirmSubmitDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending,
  whatsAppContact,
}: ConfirmSubmitDialogProps) {
  const [isConfirmed, setIsConfirmed] = React.useState(false);

  // Reset checkbox when dialog opens/closes
  React.useEffect(() => {
    if (!open) {
      setIsConfirmed(false);
    }
  }, [open]);

  const handleConfirm = () => {
    if (!isConfirmed) return;
    setIsConfirmed(false);
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-yellow-600">
            <AlertCircle className="h-5 w-5 shrink-0" />
            Konfirmasi Pengiriman Pendaftaran
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Warning Messages */}
          <div className="space-y-2.5 text-sm">
            <p className="font-medium leading-6 text-gray-900">
              Mohon periksa kembali seluruh data yang telah Anda masukkan sebelum mengirim formulir.
            </p>
            <p className="leading-6 text-gray-700">
              Setelah mengirim, data <strong>tidak dapat diubah</strong> kembali. 
              Pastikan semua informasi sudah benar dan lengkap.
            </p>
          </div>

          {/* WhatsApp Contact */}
          {whatsAppContact && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <p className="mb-1.5 text-sm font-semibold text-yellow-900">
                Butuh Bantuan?
              </p>
              <p className="mb-3 text-xs leading-5 text-yellow-800">
                Jika Anda menemukan masalah atau memiliki pertanyaan, silakan hubungi admin melalui WhatsApp:
              </p>
              <Button
                asChild
                size="sm"
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <a
                  href={whatsAppContact.waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Hubungi {whatsAppContact.label}
                </a>
              </Button>
            </div>
          )}

          {/* Confirmation Checkbox */}
          <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <Checkbox
              id="confirm-data"
              checked={isConfirmed}
              onCheckedChange={(checked) => setIsConfirmed(checked === true)}
              className="mt-0.5 shrink-0"
            />
            <Label
              htmlFor="confirm-data"
              className="cursor-pointer text-sm leading-5 text-gray-900"
            >
              Saya telah memeriksa kembali seluruh data yang telah saya masukkan. 
              Data tersebut sudah benar dan sesuai. Saya yakin untuk melanjutkan dan mengirim pendaftaran ini.
            </Label>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Batal
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!isConfirmed || isPending}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
          >
            {isPending ? "Mengirim..." : "Ya, Kirim Sekarang"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

