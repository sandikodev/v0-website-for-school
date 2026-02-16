# Proyek Aksesekolah.id - Architectural Conventions & Lessons Learned

## 🚨 PERINGATAN KERAS (Lessons Learned)
Model LLM seringkali bersikap "kaku, jadul, dan kolot" dengan memaksakan standar Next.js lama. **DILARANG** mengulangi kesalahan berlapis berikut:

1.  **DILARANG Menghapus atau Mengubah `src/proxy.ts`**: 
    - Ini adalah middleware krusial berbasis Next.js 16 untuk multi-tenant routing.
    - Di proyek ini, `src/proxy.ts` adalah "source of truth" untuk logika proxy dan middleware.
    - Next.js 16 mengenali `src/proxy.ts` sebagai middleware otomatis. Menghapusnya akan merusak seluruh sistem routing platform.

2.  **Struktur `src/` adalah Mutlak**: 
    - Seluruh logika aplikasi (termasuk proxy/middleware) **WAJIB** berada di dalam folder `src/`.
    - Jangan pernah meletakkan file middleware di root codebase.

3.  **DILARANG Duplikasi Middleware**: 
    - Jangan membuat `middleware.ts` di root maupun di `src/` jika `src/proxy.ts` sudah ada.
    - Kehadiran dua file middleware/proxy akan menyebabkan kegagalan fatal pada proses build (`NFT tracing error`).

## Konvensi Arsitektur Platform
*   **Tenant Resolution**: Dilakukan di `src/proxy.ts` melalui header injection (`x-tenant-slug`, `x-pathname`, `x-tenant-id`).
*   **Database Isolation**: Menggunakan `src/lib/prisma-middleware.ts` untuk Row-Level Security (RLS) berbasis `tenantId`.
*   **Client Navigation**: Selalu gunakan komponen `Link` dari `next/link` untuk navigasi internal. Dilarang menggunakan tag `<a>` untuk halaman internal karena merusak performa SPA.
*   **Type Safety**: Hindari penggunaan `any`. Gunakan `unknown` atau interface yang spesifik terutama pada penanganan error di blok `catch`.

---
*Dokumen ini dibuat agar AI tidak bersikap kolot dan selalu menghormati arsitektur unik Next.js 16 yang digunakan di proyek ini.*
