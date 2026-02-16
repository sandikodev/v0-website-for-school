#!/usr/bin/env node

/**
 * Seed script for SMP N 1 Srandakan
 * 
 * Usage:
 *   node scripts/seed-smpn1-srandakan.js
 *   npm run seed:smpn1srandakan
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🌱 Starting seed for SMP N 1 Srandakan...\n');

try {
  // Run TypeScript seed file using tsx
  const seedFile = path.join(__dirname, '../prisma/seeds/smpn1-srandakan.ts');
  
  execSync(`npx tsx ${seedFile}`, {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..'),
  });
  
  console.log('\n✅ Seed completed successfully!');
} catch (error) {
  console.error('\n❌ Seed failed:', error.message);
  process.exit(1);
}
