const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testPrisma() {
  try {
    console.log('🔍 Testing Prisma connection...');
    
    const users = await prisma.user.findMany();
    
    console.log('✅ Prisma connection successful!');
    console.log('📊 Total users:', users.length);
    
    if (users.length > 0) {
      console.log('\n👥 Users in database:');
      users.forEach(user => {
        console.log(`  - ${user.username} (${user.email}) - Role: ${user.role}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Prisma error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPrisma();

