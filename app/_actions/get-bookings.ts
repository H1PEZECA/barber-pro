"use server"

import { endOfDay, startOfDay } from "date-fns"
import { db } from "../_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"

interface GetBookingsProps {
  date?: Date
  userId?: string
  includeAllUserBookings?: boolean
}

export const getBookings = async ({
  date,
  userId,
  includeAllUserBookings = false,
}: GetBookingsProps = {}) => {
  if (includeAllUserBookings) {
    const session = await getServerSession(authOptions)

    if (!session?.user || !("id" in session.user)) {
      return []
    }

    const loggedUserId = (session.user as { id: string }).id

    console.log("🔍 Buscando bookings do usuário:", loggedUserId)

    const bookings = await db.booking.findMany({
      where: {
        userId: loggedUserId,
      },
      include: {
        service: {
          include: {
            barbershop: true,
          },
        },
        employee: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        scheduledAt: "desc",
      },
    })

    console.log("📊 Total de bookings do usuário encontrados:", bookings.length)

    if (bookings.length > 0) {
      console.log("🔍 Primeiro booking:", bookings[0])
      console.log("👤 Employee do primeiro:", bookings[0].employee)
    }

    return bookings
  }

  // ✅ BUSCA POR DATA - COM DEBUG DETALHADO
  if (!date) {
    throw new Error("Data é obrigatória quando includeAllUserBookings é false")
  }

  // ✅ DEBUG: Ver as datas que estão sendo usadas no filtro
  const startDate = startOfDay(date)
  const endDate = endOfDay(date)

  console.log("📅 Buscando bookings para data:", date)
  console.log("📅 Start date:", startDate)
  console.log("📅 End date:", endDate)
  console.log("👤 User ID filter:", userId)

  // ✅ PRIMEIRO: Buscar TODOS os bookings sem filtro de data para debug
  const allBookings = await db.booking.findMany({
    where: {
      ...(userId && { userId }),
    },
    select: {
      id: true,
      scheduledAt: true,
      employeeId: true,
    },
    orderBy: {
      scheduledAt: "desc",
    },
    take: 10,
  })

  console.log(
    "📊 Total de bookings no sistema (sem filtro de data):",
    allBookings.length,
  )
  console.log("📋 Primeiros bookings:", allBookings)

  // ✅ SEGUNDO: Buscar com filtro de data
  const bookings = await db.booking.findMany({
    where: {
      ...(userId && { userId }),
      scheduledAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      service: {
        include: {
          barbershop: true,
        },
      },
      employee: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      user: true,
    },
    orderBy: {
      scheduledAt: "asc",
    },
  })

  console.log("📊 Bookings encontrados com filtro de data:", bookings.length)

  // ✅ TERCEIRO: Se não encontrou nada, vamos ver o que tem no banco
  if (bookings.length === 0) {
    console.log("❌ Nenhum booking encontrado para esta data!")

    // Buscar bookings próximos desta data
    const nearbyBookings = await db.booking.findMany({
      where: {
        ...(userId && { userId }),
        scheduledAt: {
          gte: new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 dias antes
          lte: new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 dias depois
        },
      },
      select: {
        id: true,
        scheduledAt: true,
        employeeId: true,
      },
      orderBy: {
        scheduledAt: "asc",
      },
    })

    console.log("📅 Bookings próximos (±7 dias):", nearbyBookings)
  }

  return bookings
}
