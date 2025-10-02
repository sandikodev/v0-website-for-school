import { z } from 'zod'

// User validation schemas
export const LoginSchema = z.object({
  username: z.string().min(1, 'Username harus diisi'),
  password: z.string().min(1, 'Password harus diisi'),
})

export const RegisterSchema = z.object({
  username: z.string().min(3, 'Username minimal 3 karakter').max(50, 'Username maksimal 50 karakter'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  email: z.string().email('Email tidak valid').optional(),
})

export const UserSchema = z.object({
  id: z.string().cuid(),
  username: z.string(),
  email: z.string().email().nullable(),
  role: z.enum(['admin', 'user']),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Student validation schemas
export const StudentSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(100, 'Nama maksimal 100 karakter'),
  email: z.string().email('Email tidak valid'),
  phone: z.string().optional(),
  grade: z.enum(['SD', 'SMP', 'SMA'], {
    errorMap: () => ({ message: 'Pilih tingkat pendidikan yang valid' })
  }),
  birthDate: z.date().optional(),
  parentName: z.string().optional(),
  parentPhone: z.string().optional(),
  address: z.string().optional(),
})

export const ApplicationSchema = z.object({
  studentId: z.string().cuid(),
  program: z.enum(['Reguler', 'Unggulan', 'Internasional']),
  notes: z.string().optional(),
})

// Type exports
export type LoginInput = z.infer<typeof LoginSchema>
export type RegisterInput = z.infer<typeof RegisterSchema>
export type User = z.infer<typeof UserSchema>
export type Student = z.infer<typeof StudentSchema>
export type Application = z.infer<typeof ApplicationSchema>
