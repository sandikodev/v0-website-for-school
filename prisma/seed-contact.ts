import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Call Center Setting
  await prisma.contactSetting.upsert({
    where: { type: 'call_center' },
    update: {},
    create: {
      type: 'call_center',
      phoneNumber: '6289649246450',
      label: 'Call Center',
      description: 'Layanan informasi umum sekolah untuk Orang Tua, Wali Murid, dan Tamu',
      waTemplate: `Halo Call Center SMP IT Masjid Syuhada.
Saya ingin meminta bantuan atau informasi terkait sekolah.

Nama : 
Sebagai : (Orang Tua/Wali Murid/Tamu)
Pesan : `,
      isActive: true,
    },
  })

  // Admissions/SPMB Setting
  await prisma.contactSetting.upsert({
    where: { type: 'admissions' },
    update: {},
    create: {
      type: 'admissions',
      phoneNumber: '6285878958029',
      label: 'Bantuan SPMB',
      description: 'Layanan bantuan khusus pendaftaran dan penerimaan peserta didik baru',
      waTemplate: `Halo Tim SPMB SMP IT Masjid Syuhada.
Saya ingin bertanya terkait pendaftaran siswa baru.

Nama : 
Nomor Pendaftaran (jika ada) : 
Pertanyaan : `,
      isActive: true,
    },
  })

  console.log('✅ Contact settings seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
