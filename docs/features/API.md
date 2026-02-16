# 📡 API Documentation

## Base URL
```
http://localhost:3000/api
```

---

## 🔐 Authentication

### POST /api/auth/login
Login dengan username dan password.

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Login berhasil",
  "user": {
    "id": "cuid",
    "username": "admin",
    "email": "admin@school.local",
    "role": "admin",
    "isActive": true
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Username atau password salah"
}
```

---

### GET /api/auth/me
Get current authenticated user.

**Headers:**
```
Cookie: user-session=<session-cookie>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "cuid",
    "username": "admin",
    "role": "admin"
  }
}
```

---

### POST /api/auth/logout
Logout dan clear session.

**Response:**
```json
{
  "success": true,
  "message": "Logout berhasil"
}
```

---

## 👥 Students

### GET /api/students
Get all students.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "student-1",
      "name": "Ahmad Fauzi",
      "email": "ahmad@student.sch.id",
      "phone": "08123456789",
      "grade": "SMP",
      "status": "active",
      "createdAt": "2024-10-09T..."
    }
  ]
}
```

---

### POST /api/students
Create new student.

**Request:**
```json
{
  "name": "Nama Siswa",
  "email": "email@student.sch.id",
  "phone": "08123456789",
  "grade": "SMP",
  "birthDate": "2010-05-15",
  "parentName": "Nama Orang Tua",
  "parentPhone": "08123456780",
  "address": "Alamat lengkap",
  "status": "active",
  "schoolId": "school-id"
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Student created successfully"
}
```

---

### GET /api/students/[id]
Get single student with relations.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "student-1",
    "name": "Ahmad Fauzi",
    "school": { ... },
    "applications": [ ... ],
    "messages": [ ... ]
  }
}
```

---

### PUT /api/students/[id]
Update student.

**Request:** Same as POST

**Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Student updated successfully"
}
```

---

### DELETE /api/students/[id]
Delete student and related data.

**Response:**
```json
{
  "success": true,
  "message": "Student deleted successfully"
}
```

---

## 📝 Applications

### GET /api/applications
Get all applications with student info.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "app-1",
      "student": {
        "id": "student-1",
        "name": "Ahmad Fauzi",
        "email": "ahmad@student.sch.id",
        "grade": "SMP"
      },
      "program": "Reguler",
      "status": "pending",
      "createdAt": "2024-10-09T..."
    }
  ]
}
```

---

### PUT /api/applications/[id]
Update application status.

**Request:**
```json
{
  "status": "approved",
  "notes": "Diterima di kelas reguler"
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Application status updated successfully"
}
```

---

## 💬 Messages

### GET /api/messages
Get all messages with student info.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "msg-1",
      "student": {
        "id": "student-1",
        "name": "Ahmad Fauzi",
        "email": "ahmad@student.sch.id"
      },
      "subject": "Konfirmasi Pendaftaran",
      "content": "Terima kasih...",
      "type": "info",
      "read": false,
      "createdAt": "2024-10-09T..."
    }
  ]
}
```

---

### PUT /api/messages/[id]
Mark message as read.

**Request:**
```json
{
  "read": true
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Message updated successfully"
}
```

---

### DELETE /api/messages/[id]
Delete message.

**Response:**
```json
{
  "success": true,
  "message": "Message deleted successfully"
}
```

---

## 🏫 Schools

### GET /api/schools/first
Get first school (for single-school setup).

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "school-1",
    "name": "SMP IT Masjid Syuhada",
    "address": "Jl. ...",
    "phone": "0274-123456",
    "email": "info@school.sch.id"
  }
}
```

---

### PUT /api/schools/[id]
Update school information.

**Request:**
```json
{
  "name": "Nama Sekolah",
  "description": "Deskripsi...",
  "address": "Alamat lengkap",
  "phone": "0274-123456",
  "email": "info@school.sch.id",
  "website": "www.school.sch.id",
  "logo": "https://..."
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "School updated successfully"
}
```

---

## 📊 Dashboard

### GET /api/dashboard/stats
Get dashboard statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalStudents": 123,
    "totalTeachers": 45,
    "totalApplications": 15,
    "totalMessages": 8
  }
}
```

---

### GET /api/dashboard/charts
Get chart data for visualizations.

**Response:**
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "month": "Sep 2024",
        "pending": 5,
        "approved": 10,
        "rejected": 2
      }
    ],
    "studentsByGrade": [
      { "name": "SD", "value": 50 },
      { "name": "SMP", "value": 40 },
      { "name": "SMA", "value": 33 }
    ]
  }
}
```

---

## ⚠️ Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message here",
  "error": "Detailed error (optional)"
}
```

### Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not authenticated)
- `404` - Not Found
- `500` - Internal Server Error

---

## 🔧 Rate Limiting

Currently no rate limiting implemented.

**Planned for production:**
- Login: 5 attempts per minute
- API calls: 100 requests per minute

---

## 📝 Notes

- All dates are in ISO 8601 format
- All responses include `success` boolean
- Authentication required for all `/admin/*` endpoints
- Session cookie expires after 7 days

---

**Version**: 1.0.0 Beta  
**Last Updated**: October 2024

