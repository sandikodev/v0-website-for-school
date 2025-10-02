import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { LoginInput, RegisterInput } from '@/lib/validations'

export class AuthService {
  // Hash password
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
  }

  // Verify password
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }

  // Login user
  static async login(credentials: LoginInput) {
    const { username, password } = credentials

    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username },
    })

    if (!user) {
      throw new Error('Username atau password salah')
    }

    if (!user.isActive) {
      throw new Error('Akun tidak aktif')
    }

    // Verify password
    const isValidPassword = await this.verifyPassword(password, user.password)
    if (!isValidPassword) {
      throw new Error('Username atau password salah')
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  // Register user
  static async register(userData: RegisterInput) {
    const { username, password, email } = userData

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    })

    if (existingUser) {
      throw new Error('Username sudah digunakan')
    }

    // Check if email already exists (if provided)
    if (email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email },
      })

      if (existingEmail) {
        throw new Error('Email sudah digunakan')
      }
    }

    // Hash password
    const hashedPassword = await this.hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
        role: 'user',
        isActive: true,
      },
    })

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  // Get user by ID
  static async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return user
  }

  // Update user
  static async updateUser(id: string, data: Partial<RegisterInput>) {
    const updateData: any = { ...data }

    // Hash password if provided
    if (data.password) {
      updateData.password = await this.hashPassword(data.password)
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return user
  }

  // Delete user
  static async deleteUser(id: string) {
    await prisma.user.delete({
      where: { id },
    })

    return { success: true }
  }

  // Get all users
  static async getAllUsers() {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return users
  }
}