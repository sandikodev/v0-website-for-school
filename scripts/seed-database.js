#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database...')
    
    // Create school if not exists
    let school = await prisma.school.findFirst()
    
    if (!school) {
      school = await prisma.school.create({
        data: {
          name: 'SMP IT Masjid Syuhada',
          description: 'Lembaga pendidikan Islam terpadu yang unggul',
          address: 'Jl. Masjid Syuhada No. 123, Yogyakarta',
          phone: '0274-123456',
          email: 'info@smpitsyuhada.sch.id',
          website: 'www.smpitsyuhada.sch.id',
          logo: '/logo.png',
        }
      })
      console.log('✅ School created:', school.name)
    } else {
      console.log('✅ School already exists:', school.name)
    }
    
    // Create sample students
    const studentsData = [
      {
        name: 'Ahmad Fauzi',
        email: 'ahmad.fauzi@student.sch.id',
        phone: '08123456789',
        grade: 'SMP',
        birthDate: new Date('2010-05-15'),
        parentName: 'Bapak Fauzi',
        parentPhone: '08123456780',
        address: 'Jl. Sudirman No. 10, Yogyakarta',
        status: 'active',
        schoolId: school.id,
      },
      {
        name: 'Siti Nurhaliza',
        email: 'siti.nurhaliza@student.sch.id',
        phone: '08234567890',
        grade: 'SMP',
        birthDate: new Date('2011-03-20'),
        parentName: 'Ibu Haliza',
        parentPhone: '08234567891',
        address: 'Jl. Malioboro No. 25, Yogyakarta',
        status: 'active',
        schoolId: school.id,
      },
      {
        name: 'Budi Santoso',
        email: 'budi.santoso@student.sch.id',
        phone: '08345678901',
        grade: 'SMA',
        birthDate: new Date('2008-07-10'),
        parentName: 'Bapak Santoso',
        parentPhone: '08345678902',
        address: 'Jl. Kaliurang KM 5, Sleman',
        status: 'active',
        schoolId: school.id,
      },
    ]
    
    for (const studentData of studentsData) {
      const existing = await prisma.student.findUnique({
        where: { email: studentData.email }
      })
      
      if (!existing) {
        const student = await prisma.student.create({ data: studentData })
        console.log('✅ Student created:', student.name)
      } else {
        console.log('⏭️  Student already exists:', studentData.name)
      }
    }
    
    // Create sample applications
    const students = await prisma.student.findMany()
    
    if (students.length > 0) {
      for (const student of students) {
        const existingApp = await prisma.application.findFirst({
          where: { 
            studentId: student.id,
            schoolId: school.id 
          }
        })
        
        if (!existingApp) {
          await prisma.application.create({
            data: {
              studentId: student.id,
              schoolId: school.id,
              program: 'Reguler',
              status: 'pending',
              notes: 'Pendaftaran awal',
            }
          })
          console.log('✅ Application created for:', student.name)
        }
      }
    }
    
    // Create sample messages
    if (students.length > 0) {
      for (const student of students.slice(0, 2)) {
        const existingMsg = await prisma.message.findFirst({
          where: { 
            studentId: student.id,
            schoolId: school.id 
          }
        })
        
        if (!existingMsg) {
          await prisma.message.create({
            data: {
              studentId: student.id,
              schoolId: school.id,
              subject: 'Konfirmasi Pendaftaran',
              content: 'Terima kasih telah mendaftar di sekolah kami.',
              type: 'info',
              read: false,
            }
          })
          console.log('✅ Message created for:', student.name)
        }
      }
    }
    
    console.log('\n🎉 Database seeded successfully!')
    console.log(`📊 Stats:`)
    console.log(`   - Students: ${await prisma.student.count()}`)
    console.log(`   - Applications: ${await prisma.application.count()}`)
    console.log(`   - Messages: ${await prisma.message.count()}`)
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedDatabase()

