# 🧪 Testing Checklist - School Management System

## ✅ Authentication & Authorization

### Login System
- [ ] Login dengan credentials yang benar (admin/admin123)
- [ ] Login dengan password salah (harus ditolak)
- [ ] Login dengan username yang tidak ada (harus ditolak)
- [ ] Session cookie di-set setelah login berhasil
- [ ] Redirect ke dashboard setelah login
- [ ] Check authentication pada setiap protected route
- [ ] Logout berhasil clear session
- [ ] Redirect ke /signin setelah logout

### Protected Routes
- [ ] /admin/dashboard - hanya accessible jika login
- [ ] /admin/students - hanya accessible jika login
- [ ] /admin/admissions - hanya accessible jika login
- [ ] /admin/messages - hanya accessible jika login
- [ ] /admin/school - hanya accessible jika login
- [ ] Redirect ke /signin jika belum login

---

## 🎯 Dashboard

### Stats Cards
- [ ] Total Siswa menampilkan data real dari database
- [ ] Total Guru menampilkan angka (mock: 45)
- [ ] Pendaftar Baru menampilkan pending applications
- [ ] Pesan Baru menampilkan unread messages
- [ ] Stats ter-update setelah add/delete data

### Charts
- [ ] Line chart menampilkan trend pendaftar
- [ ] Pie chart menampilkan distribusi siswa per grade
- [ ] Charts responsive di mobile
- [ ] Tooltip muncul saat hover
- [ ] Legend menampilkan label yang benar

### Quick Actions
- [ ] "Tambah Siswa Baru" → redirect ke /admin/students/new
- [ ] "Lihat Pendaftar" → redirect ke /admin/admissions
- [ ] "Kelola Pesan" → redirect ke /admin/messages

---

## 👥 Students Management

### List Page
- [ ] Menampilkan semua siswa dari database
- [ ] Search by nama works
- [ ] Search by email works
- [ ] Search by grade works
- [ ] Table responsive di mobile
- [ ] Grade badges menampilkan warna yang tepat
- [ ] Status badges menampilkan warna yang tepat

### Create Student
- [ ] Form validation untuk required fields
- [ ] Email validation
- [ ] Select dropdown untuk Grade works
- [ ] Select dropdown untuk Status works
- [ ] Date picker untuk Birth Date works
- [ ] Save berhasil redirect ke list
- [ ] Data tersimpan di database
- [ ] Error handling untuk duplicate email

### Delete Student
- [ ] Confirmation dialog muncul
- [ ] Cancel tidak menghapus
- [ ] Confirm berhasil menghapus
- [ ] Related applications dihapus (cascade)
- [ ] Related messages dihapus (cascade)
- [ ] List ter-refresh setelah delete

---

## 📝 Admissions/SPMB

### List Applications
- [ ] Menampilkan semua applications
- [ ] Stats cards update (Pending, Approved, Rejected)
- [ ] Search by student name works
- [ ] Search by email works
- [ ] Search by program works
- [ ] Filter by status works
- [ ] Table responsive di mobile

### Approve/Reject
- [ ] "Terima" button mengubah status ke approved
- [ ] "Tolak" button mengubah status ke rejected
- [ ] Buttons hilang setelah status changed
- [ ] Stats cards update setelah approve/reject
- [ ] List ter-refresh setelah action

---

## 💬 Messages

### List Messages
- [ ] Menampilkan semua messages
- [ ] Unread counter badge shows correct count
- [ ] Filter tabs works (All, Unread, Read)
- [ ] Search by subject works
- [ ] Search by sender works
- [ ] Unread messages highlighted dengan green background
- [ ] Mail icon berbeda untuk read/unread

### Mark as Read
- [ ] "Tandai Dibaca" button works
- [ ] Message background berubah setelah read
- [ ] Icon berubah dari Mail ke MailOpen
- [ ] Unread counter berkurang
- [ ] List ter-refresh

### Delete Message
- [ ] Confirmation dialog muncul
- [ ] Cancel tidak menghapus
- [ ] Confirm berhasil menghapus
- [ ] List ter-refresh setelah delete

---

## 🏫 School Settings

### Profile Tab
- [ ] Load existing school data
- [ ] Edit nama sekolah
- [ ] Edit deskripsi
- [ ] Edit logo URL
- [ ] Save berhasil
- [ ] Success alert muncul
- [ ] Data ter-update di database

### Contact Tab
- [ ] Edit alamat
- [ ] Edit phone
- [ ] Edit email (dengan validation)
- [ ] Edit website (dengan validation)
- [ ] Save berhasil
- [ ] Success alert muncul

---

## 🎨 UI/UX

### Navigation
- [ ] Sidebar menu items working
- [ ] Active route highlighted
- [ ] Collapse/expand sidebar works
- [ ] User dropdown menampilkan username & role
- [ ] Logout dari dropdown works

### Responsive Design
- [ ] Dashboard responsive di mobile
- [ ] Tables scrollable di mobile
- [ ] Forms usable di mobile
- [ ] Sidebar menu accessible di mobile
- [ ] Charts responsive

### Loading States
- [ ] Loading spinner saat fetch data
- [ ] Loading button saat submit
- [ ] Skeleton/placeholder saat loading

### Error Handling
- [ ] Error messages displayed properly
- [ ] Network errors handled
- [ ] 404 handled
- [ ] 500 handled

---

## 🔒 Security

### Data Validation
- [ ] Email validation
- [ ] Required fields validation
- [ ] SQL injection protection (Prisma)
- [ ] XSS protection

### Session Management
- [ ] HTTP-only cookies
- [ ] Session expiration
- [ ] Secure cookies in production

---

## 🚀 Performance

### Load Times
- [ ] Dashboard loads < 2s
- [ ] Students list loads < 2s
- [ ] Charts render smoothly
- [ ] No console errors

### Database
- [ ] Queries optimized
- [ ] Proper indexes
- [ ] No N+1 queries

---

## ✅ Test Results

**Date Tested**: _____________  
**Tested By**: _____________  
**Browser**: _____________  
**Device**: _____________  

**Total Passed**: _____ / _____  
**Total Failed**: _____  

**Ready for Beta**: ☐ Yes ☐ No

---

## 🐛 Bugs Found

1. 
2. 
3. 

---

## 📋 Notes


