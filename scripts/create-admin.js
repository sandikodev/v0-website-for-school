const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createDefaultAdmin() {
  try {
    console.log('🔧 Creating default admin user...')
    
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { username: 'admin' }
    })
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists')
      return
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        email: 'admin@school.local',
        role: 'admin',
        isActive: true,
      }
    })
    
    console.log('✅ Default admin user created successfully!')
    console.log('📋 Login credentials:')
    console.log('   Username: admin')
    console.log('   Password: admin123')
    console.log('   Email: admin@school.local')
    console.log('   Role: admin')
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
createDefaultAdmin()
