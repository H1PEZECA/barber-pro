"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"
import { db } from "../_lib/prisma"

type SessionUser = {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

export const getConcludedBookings = async () => {
  const session = await getServerSession(authOptions)
  if (!session?.user) return []
  const user = session.user as SessionUser
  return db.booking.findMany({
    where: {
      userId: user.id,
      scheduledAt: {
        lt: new Date(),
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
    },
  })
}
