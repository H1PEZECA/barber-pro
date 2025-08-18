"use server"

import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { authOptions } from "../_lib/auth"
import { db } from "../_lib/prisma"

interface CreateBookingParams {
  serviceId: string
  barbershopId: string
  employeeId: string
  date: Date
}

export const createBooking = async (params: CreateBookingParams) => {
  const session = await getServerSession(authOptions)

  if (!session?.user || !("id" in session.user)) {
    throw new Error("Usuário não autenticado")
  }

  const userId = (session.user as { id: string }).id

  console.log("=== CREATE BOOKING PARAMS ===", params)
  console.log("=== USER ID ===", userId)

  const employee = await db.employee.findUnique({
    where: { id: params.employeeId },
    include: {
      user: {
        select: { id: true, name: true },
      },
    },
  })

  console.log("=== EMPLOYEE ENCONTRADO ===", employee)

  if (!employee) {
    throw new Error(`Employee com ID ${params.employeeId} não encontrado`)
  }

  const newBooking = await db.booking.create({
    data: {
      userId,
      serviceId: params.serviceId,
      barbershopId: params.barbershopId,
      employeeId: params.employeeId,
      scheduledAt: params.date,
    },
    // ✅ INCLUDE MAIS SIMPLES PARA EVITAR WARNING DO DECIMAL
    include: {
      service: {
        select: {
          id: true,
          name: true,
          price: true, // Decimal vai ser serializado como string
        },
      },
      employee: {
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
      },
    },
  })

  console.log("=== BOOKING CRIADO ===", newBooking)

  // ✅ CORREÇÃO DO WARNING DO REVALIDATEPATH
  revalidatePath(`/barbershops/${params.barbershopId}`, "page")
  revalidatePath("/bookings", "page")

  return {
    id: newBooking.id,
    scheduledAt: newBooking.scheduledAt,
    employee: newBooking.employee,
  }
}

// ===== FUNÇÃO DE DEBUG ESPECÍFICA =====
// Execute esta função para entender melhor o problema:

export const debugBookingDates = async () => {
  console.log("🔍 DEBUGANDO DATAS DOS BOOKINGS...")

  // Ver todos os bookings e suas datas
  const allBookings = await db.booking.findMany({
    select: {
      id: true,
      scheduledAt: true,
      employeeId: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  })

  console.log("📋 Últimos 10 bookings criados:")
  allBookings.forEach((booking, index) => {
    console.log(`${index + 1}. ID: ${booking.id}`)
    console.log(`   📅 Agendado para: ${booking.scheduledAt}`)
    console.log(`   📅 Criado em: ${booking.createdAt}`)
    console.log(`   👤 Employee ID: ${booking.employeeId}`)
    console.log(`   ---`)
  })

  return allBookings
}
