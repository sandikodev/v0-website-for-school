import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedSMPN1Srandakan() {
  console.log('🌱 Seeding SMP N 1 Srandakan...');

  // Hash password untuk admin
  const hashedPassword = await bcrypt.hash('sransa2024', 12);

  // 1. Create Tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'smpn1srandakan' },
    update: {},
    create: {
      name: 'SMP Negeri 1 Srandakan',
      slug: 'smpn1srandakan',
      domain: 'smpn1srandakan.aksesekolah.id',
      email: 'layanan@smpsransa.sch.id',
      phone: '(0274) 6464726',
      address: 'Jl. Nengahan Paten, Srandakan, Trimurti, Kec. Srandakan, Kabupaten Bantul, Daerah Istimewa Yogyakarta 55762',
      website: 'https://smpsransa.sch.id',
      primaryColor: '#1e40af', // Blue
      secondaryColor: '#dc2626', // Red
      domainStatus: 'active',
      domainVerified: true,
      isActive: true,
    },
  });

  console.log('✅ Tenant created:', tenant.name);

  // 2. Create School
  const school = await prisma.school.upsert({
    where: { id: 'school-smpn1srandakan' },
    update: {},
    create: {
      id: 'school-smpn1srandakan',
      name: 'SMP Negeri 1 Srandakan',
      description: `SMP N 1 Srandakan - Berjiwa Pancasila, Berprestasi, Berwawasan Global

Sekolah Penggerak yang menjadi pionir dalam penerapan Pendidikan inovasi Teknologi Berbudaya, memberdayakan siswa untuk menjadi pemimpin masa depan yang visioner. 

Berlokasi di jantung kecamatan Srandakan tepatnya di Nengahan dengan jarak sekurangnya 13.1km dari pusat kota Bantul, Yogyakarta.

Dengan semangat juang dan kreativitas, kami mengubah paradigma pembelajaran, menanamkan nilai-nilai kepemimpinan dan kepedulian sosial untuk periode eskalasi generasi dari masa ke masa.`,
      address: 'Jl. Nengahan Paten, Srandakan, Trimurti, Kec. Srandakan, Kabupaten Bantul, DIY 55762',
      phone: '(0274) 6464726',
      email: 'layanan@smpsransa.sch.id',
      website: 'https://smpsransa.sch.id',
      logo: 'https://smpsransa.sch.id/wp-content/uploads/elementor/thumbs/bg-logo-sransa-r4n48tlyfaf7juxnc3quw31755kkadwst8e3s18z4g.webp',
      tenantId: tenant.id,
    },
  });

  console.log('✅ School created:', school.name);

  // 3. Create Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@smpsransa.sch.id' },
    update: {},
    create: {
      username: 'admin_sransa',
      email: 'admin@smpsransa.sch.id',
      password: hashedPassword,
      role: 'tenant_admin',
      isActive: true,
      tenantId: tenant.id,
    },
  });

  console.log('✅ Admin user created:', adminUser.email);

  // 4. Create School Config
  await prisma.schoolConfig.upsert({
    where: { id: 'school-config-smpn1srandakan' },
    update: {},
    create: {
      id: 'school-config-smpn1srandakan',
      schoolName: 'SMP Negeri 1 Srandakan',
      academicYear: '2024/2025',
      address: 'Jl. Nengahan Paten, Srandakan, Trimurti, Kec. Srandakan, Kabupaten Bantul, DIY 55762',
      contactEmail: 'layanan@smpsransa.sch.id',
      logoUrl: 'https://smpsransa.sch.id/wp-content/uploads/elementor/thumbs/bg-logo-sransa-r4n48tlyfaf7juxnc3quw31755kkadwst8e3s18z4g.webp',
    },
  });

  console.log('✅ School config created');

  // 5. Create Contact Settings
  await prisma.contactSetting.upsert({
    where: { type: 'call_center' },
    update: {},
    create: {
      type: 'call_center',
      phoneNumber: '6289627850100',
      label: 'Call Center SMP N 1 Srandakan',
      description: 'Hubungi kami untuk informasi lebih lanjut',
      waTemplate: 'Halo, saya ingin bertanya tentang SMP N 1 Srandakan',
      isActive: true,
    },
  });

  await prisma.contactSetting.upsert({
    where: { type: 'admissions' },
    update: {},
    create: {
      type: 'admissions',
      phoneNumber: '6289627850100',
      label: 'Bantuan PPDB',
      description: 'Informasi Penerimaan Peserta Didik Baru',
      waTemplate: 'Halo, saya ingin bertanya tentang PPDB SMP N 1 Srandakan',
      isActive: true,
    },
  });

  console.log('✅ Contact settings created');

  // 6. Create SPMB Settings
  await prisma.sPMBSetting.upsert({
    where: { id: 'spmb-smpn1srandakan' },
    update: {},
    create: {
      id: 'spmb-smpn1srandakan',
      academicYear: '2025/2026',
      registrationOpen: true,
      heroTitle: 'PPDB SMP NEGERI 1 SRANDAKAN',
      heroSubtitle: 'TAHUN PELAJARAN 2025/2026',
      heroDescription: 'Bergabunglah dengan Sekolah Penggerak yang Berjiwa Pancasila, Berprestasi, dan Berwawasan Global',
      gelombangData: JSON.stringify([
        {
          name: 'Gelombang 1',
          startDate: '2025-05-01',
          endDate: '2025-06-15',
          quota: 100,
          status: 'open',
        },
        {
          name: 'Gelombang 2',
          startDate: '2025-06-16',
          endDate: '2025-07-15',
          quota: 50,
          status: 'upcoming',
        },
      ]),
      jalurData: JSON.stringify([
        {
          name: 'Jalur Prestasi',
          description: 'Untuk siswa berprestasi akademik dan non-akademik',
          requirements: ['Sertifikat prestasi', 'Rapor semester 1-5'],
        },
        {
          name: 'Jalur Reguler',
          description: 'Jalur pendaftaran umum',
          requirements: ['Rapor semester 1-5', 'Surat keterangan lulus SD'],
        },
      ]),
      biayaData: JSON.stringify({
        pendaftaran: 0,
        spp: 0,
        seragam: 'Rp 500.000',
        buku: 'Rp 300.000',
        note: 'SMP Negeri 1 Srandakan adalah sekolah negeri, tidak ada biaya SPP',
      }),
      syaratData: JSON.stringify([
        'Fotocopy Ijazah SD/MI yang telah dilegalisir',
        'Fotocopy SKHUN SD/MI yang telah dilegalisir',
        'Fotocopy Akta Kelahiran',
        'Fotocopy Kartu Keluarga',
        'Pas foto berwarna ukuran 3x4 (3 lembar)',
        'Map warna merah',
      ]),
      wawancaraData: JSON.stringify({
        required: true,
        description: 'Wawancara dilakukan untuk mengenal calon siswa lebih dekat',
        schedule: 'Akan diinformasikan setelah pendaftaran',
      }),
      schoolAddress: 'Jl. Nengahan Paten, Srandakan, Trimurti, Kec. Srandakan, Kabupaten Bantul, DIY 55762',
      schoolPhone: '(0274) 6464726',
      schoolEmail: 'layanan@smpsransa.sch.id',
    },
  });

  console.log('✅ SPMB settings created');

  // 7. Create Sample Students (Prestasi)
  const students = [
    {
      name: 'Nabila Nur Azizah',
      email: 'nabila@student.smpsransa.sch.id',
      phone: '081234567890',
      grade: 'SMP',
      status: 'active',
      address: 'Srandakan, Bantul, DIY',
    },
    {
      name: 'Galuh Sekar Utami',
      email: 'galuh@student.smpsransa.sch.id',
      phone: '081234567891',
      grade: 'SMP',
      status: 'active',
      address: 'Srandakan, Bantul, DIY',
    },
    {
      name: 'Senior Cheza Adellio',
      email: 'senior@student.smpsransa.sch.id',
      phone: '081234567892',
      grade: 'SMP',
      status: 'active',
      address: 'Srandakan, Bantul, DIY',
    },
  ];

  for (const studentData of students) {
    await prisma.student.upsert({
      where: { email: studentData.email },
      update: {},
      create: {
        ...studentData,
        schoolId: school.id,
      },
    });
  }

  console.log('✅ Sample students created:', students.length);

  // 8. Create Form Configuration for PPDB
  await prisma.formConfiguration.upsert({
    where: { id: 'form-ppdb-smpn1srandakan' },
    update: {},
    create: {
      id: 'form-ppdb-smpn1srandakan',
      name: 'Formulir PPDB SMP N 1 Srandakan 2025/2026',
      description: 'Formulir Penerimaan Peserta Didik Baru Tahun Ajaran 2025/2026',
      isActive: true,
      schema: JSON.stringify({
        sections: [
          {
            title: 'Data Pribadi Siswa',
            fields: [
              { name: 'namaLengkap', label: 'Nama Lengkap', type: 'text', required: true },
              { name: 'tempatLahir', label: 'Tempat Lahir', type: 'text', required: true },
              { name: 'tanggalLahir', label: 'Tanggal Lahir', type: 'date', required: true },
              { name: 'jenisKelamin', label: 'Jenis Kelamin', type: 'select', options: ['Laki-laki', 'Perempuan'], required: true },
              { name: 'alamatLengkap', label: 'Alamat Lengkap', type: 'textarea', required: true },
              { name: 'noHP', label: 'No. HP/WA', type: 'tel', required: true },
              { name: 'email', label: 'Email', type: 'email', required: false },
            ],
          },
          {
            title: 'Data Orang Tua/Wali',
            fields: [
              { name: 'namaAyah', label: 'Nama Ayah', type: 'text', required: true },
              { name: 'pekerjaanAyah', label: 'Pekerjaan Ayah', type: 'text', required: true },
              { name: 'namaIbu', label: 'Nama Ibu', type: 'text', required: true },
              { name: 'pekerjaanIbu', label: 'Pekerjaan Ibu', type: 'text', required: true },
              { name: 'noHPOrangtua', label: 'No. HP Orang Tua', type: 'tel', required: true },
            ],
          },
          {
            title: 'Data Sekolah Asal',
            fields: [
              { name: 'asalSekolah', label: 'Nama Sekolah Asal', type: 'text', required: true },
              { name: 'alamatSekolah', label: 'Alamat Sekolah', type: 'textarea', required: true },
            ],
          },
          {
            title: 'Prestasi & Jalur Pendaftaran',
            fields: [
              { name: 'prestasi', label: 'Prestasi (jika ada)', type: 'textarea', required: false },
              { name: 'jalurPendaftaran', label: 'Jalur Pendaftaran', type: 'select', options: ['Jalur Prestasi', 'Jalur Reguler'], required: true },
              { name: 'gelombangPendaftaran', label: 'Gelombang', type: 'select', options: ['Gelombang 1', 'Gelombang 2'], required: true },
            ],
          },
        ],
      }),
      schoolId: school.id,
    },
  });

  console.log('✅ Form configuration created');

  console.log('\n🎉 Seeding completed for SMP N 1 Srandakan!');
  console.log('\n📝 Login credentials:');
  console.log('   Email: admin@smpsransa.sch.id');
  console.log('   Password: sransa2024');
  console.log('\n🌐 Access URLs:');
  console.log('   Dashboard: https://dashboard.aksesekolah.id');
  console.log('   Website: https://smpn1srandakan.aksesekolah.id');
  console.log('   PPDB: https://smpn1srandakan.aksesekolah.id/admissions');
}

seedSMPN1Srandakan()
  .catch((e) => {
    console.error('❌ Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
