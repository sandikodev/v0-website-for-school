const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./prisma/dev.db', (err) => {
  if (err) {
    console.error('❌ Error connecting to database:', err.message);
    return;
  }
  console.log('✅ Connected to SQLite database');
});

async function createAdminUser() {
  try {
    // Check if admin user exists
    db.get('SELECT * FROM users WHERE username = ?', ['admin'], async (err, row) => {
      if (err) {
        console.error('❌ Error checking user:', err.message);
        return;
      }

      if (row) {
        console.log('✅ Admin user already exists!');
        console.log('📋 Username:', row.username);
        console.log('📋 Email:', row.email);
        console.log('📋 Role:', row.role);
        db.close();
        return;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash('admin123', 12);
      const now = new Date().toISOString();

      // Create admin user
      db.run(
        `INSERT INTO users (id, username, password, email, role, isActive, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          'admin-' + Date.now(),
          'admin',
          hashedPassword,
          'admin@school.local',
          'admin',
          1,
          now,
          now
        ],
        function(err) {
          if (err) {
            console.error('❌ Error creating user:', err.message);
            return;
          }

          console.log('✅ Admin user created successfully!');
          console.log('📋 Login credentials:');
          console.log('   Username: admin');
          console.log('   Password: admin123');
          console.log('   Email: admin@school.local');
          console.log('   Role: admin');
          
          db.close((err) => {
            if (err) {
              console.error('❌ Error closing database:', err.message);
            } else {
              console.log('✅ Database connection closed');
            }
          });
        }
      );
    });
  } catch (error) {
    console.error('❌ Error:', error);
    db.close();
  }
}

createAdminUser();

