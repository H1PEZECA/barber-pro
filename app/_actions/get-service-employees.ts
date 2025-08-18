// _actions/get-service-employees.ts
"use server"

import { endOfDay, startOfDay } from "date-fns"
import { db } from "../_lib/prisma"

interface GetServiceEmployeesProps {
  barbershopId: string
  date?: Date
}

export const getServiceEmployees = async ({
  barbershopId,
  date,
}: GetServiceEmployeesProps) => {
  if (!barbershopId) return []

  // Buscar todos os employees ATIVOS da barbearia
  const employees = await db.employee.findMany({
    where: {
      barbershopId: barbershopId,
      isActive: true,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })

  if (!employees.length) return []

  // Se não tem data selecionada, retorna todos os employees ativos
  if (!date) {
    return employees.map((emp) => ({
      id: emp.id,
      name: emp.user.name || "Nome não informado",
    }))
  }

  // Buscar agendamentos dos employees nesta data
  const bookings = await db.booking.findMany({
    where: {
      employeeId: {
        in: employees.map((emp) => emp.id),
      },
      barbershopId: barbershopId,
      scheduledAt: {
        gte: startOfDay(date),
        lte: endOfDay(date),
      },
      status: {
        in: ["SCHEDULED", "CONFIRMED", "IN_PROGRESS"], // Apenas status que ocupam o horário
      },
    },
    select: {
      employeeId: true,
      scheduledAt: true,
    },
  })

  // Filtrar employees disponíveis no horário específico
  const availableEmployees = employees.filter((employee) => {
    // Verificar se o employee tem algum agendamento no horário selecionado
    const hasConflict = bookings.some(
      (booking) =>
        booking.employeeId === employee.id &&
        booking.scheduledAt.getHours() === date.getHours() &&
        booking.scheduledAt.getMinutes() === date.getMinutes(),
    )

    return !hasConflict
  })

  return availableEmployees.map((emp) => ({
    id: emp.id,
    name: emp.user.name || "Nome não informado",
  }))
}
