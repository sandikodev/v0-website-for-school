#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Generate bcrypt hash for 'admin123'
const bcrypt = require('bcryptjs');
const password = 'admin123';
const hashedPassword = bcrypt.hashSync(password, 12);

const now = new Date().toISOString();
const userId = 'admin-' + Date.now();

// Create SQL insert statement
const sql = `
INSERT INTO users (id, username, password, email, role, isActive, createdAt, updatedAt)
VALUES ('${userId}', 'admin', '${hashedPassword}', 'admin@school.local', 'admin', 1, '${now}', '${now}');
`;

// Write SQL to temp file
const sqlFile = path.join(__dirname, 'temp-insert.sql');
fs.writeFileSync(sqlFile, sql);

try {
  // Execute SQL
  execSync(`sqlite3 ${path.join(__dirname, '..', 'prisma', 'dev.db')} < ${sqlFile}`, {
    stdio: 'inherit'
  });
  
  console.log('\n✅ Admin user created successfully!');
  console.log('📋 Login credentials:');
  console.log('   Username: admin');
  console.log('   Password: admin123');
  console.log('   Email: admin@school.local');
  console.log('   Role: admin\n');
  
} catch (error) {
  console.error('❌ Error creating admin user:', error.message);
} finally {
  // Clean up temp file
  if (fs.existsSync(sqlFile)) {
    fs.unlinkSync(sqlFile);
  }
}

