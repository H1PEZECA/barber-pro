// _actions/get-service-employees.ts
"use server"

import { db } from "../_lib/prisma"

interface GetServiceEmployeesProps {
  barbershopId: string
  serviceId?: string
  scheduledAt?: Date
  // ✅ Excluir um booking específico da verificação (útil para edições)
  excludeBookingId?: string
}

export const getServiceEmployees = async ({
  barbershopId,
  serviceId,
  scheduledAt,
  excludeBookingId,
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

  // Se não tem horário específico selecionado, retorna todos os employees ativos
  if (!scheduledAt) {
    return employees.map((emp) => ({
      id: emp.id,
      name: emp.user.name || "Nome não informado",
      isAvailable: true,
      user: emp.user,
    }))
  }

  // Validar se o serviço existe e está ativo na barbearia
  if (serviceId) {
    const service = await db.barbershopService.findFirst({
      where: {
        id: serviceId,
        barbershopId: barbershopId,
        isActive: true,
      },
    })

    if (!service) {
      throw new Error("Serviço não encontrado ou inativo")
    }
  }

  // ✅ Buscar agendamentos conflitantes no horário específico
  const conflictingBookings = await db.booking.findMany({
    where: {
      employeeId: {
        in: employees.map((emp) => emp.id),
      },
      barbershopId: barbershopId,
      scheduledAt: scheduledAt,
      status: {
        in: ["SCHEDULED", "CONFIRMED", "IN_PROGRESS"],
      },
      // ✅ Excluir booking específico se fornecido
      ...(excludeBookingId && {
        NOT: {
          id: excludeBookingId,
        },
      }),
    },
    select: {
      employeeId: true,
      scheduledAt: true,
      status: true,
      service: {
        select: {
          name: true,
        },
      },
    },
  })

  // Mapear employees com status de disponibilidade
  const employeesWithAvailability = employees.map((employee) => {
    const conflictingBooking = conflictingBookings.find(
      (booking) => booking.employeeId === employee.id,
    )

    return {
      id: employee.id,
      name: employee.user.name || "Nome não informado",
      user: employee.user,
      isAvailable: !conflictingBooking,
      conflictReason: conflictingBooking
        ? `Ocupado com: ${conflictingBooking.service.name}`
        : null,
    }
  })

  return employeesWithAvailability
}

// ✅ Função auxiliar para buscar apenas employees disponíveis
export const getAvailableServiceEmployees = async (
  props: GetServiceEmployeesProps,
) => {
  const allEmployees = await getServiceEmployees(props)
  return allEmployees.filter((emp) => emp.isAvailable)
}

// ✅ Função para verificar se pelo menos um employee está disponível
export const hasAvailableEmployees = async (
  props: GetServiceEmployeesProps,
) => {
  const availableEmployees = await getAvailableServiceEmployees(props)
  return availableEmployees.length > 0
}

// ✅ Função para liberar horários de bookings antigos automaticamente
export const releaseExpiredBookings = async () => {
  const now = new Date()

  // Buscar bookings que já passaram da data/hora e estão como SCHEDULED ou CONFIRMED
  const expiredBookings = await db.booking.findMany({
    where: {
      scheduledAt: {
        lt: now,
      },
      status: {
        in: ["SCHEDULED", "CONFIRMED"],
      },
    },
  })

  if (expiredBookings.length > 0) {
    // Marcar como COMPLETED (assumindo que foi realizado) ou NO_SHOW se preferir
    await db.booking.updateMany({
      where: {
        id: {
          in: expiredBookings.map((b) => b.id),
        },
      },
      data: {
        status: "COMPLETED", // ou "NO_SHOW" dependendo da sua regra de negócio
      },
    })

    console.log(
      `✅ ${expiredBookings.length} bookings expirados foram marcados como COMPLETED`,
    )
  }

  return expiredBookings.length
}

// ✅ Função para validar se um agendamento é possível (melhorada)
export const validateBookingAvailability = async ({
  barbershopId,
  serviceId,
  employeeId,
  scheduledAt,
  excludeBookingId,
}: {
  barbershopId: string
  serviceId: string
  employeeId: string
  scheduledAt: Date
  excludeBookingId?: string
}) => {
  // Verificar se o employee existe e está ativo
  const employee = await db.employee.findFirst({
    where: {
      id: employeeId,
      barbershopId: barbershopId,
      isActive: true,
    },
    include: {
      user: {
        select: { id: true, name: true },
      },
    },
  })

  if (!employee) {
    return {
      isValid: false,
      error: "Funcionário não encontrado ou inativo",
    }
  }

  // Verificar se o serviço existe e está ativo
  const service = await db.barbershopService.findFirst({
    where: {
      id: serviceId,
      barbershopId: barbershopId,
      isActive: true,
    },
  })

  if (!service) {
    return {
      isValid: false,
      error: "Serviço não encontrado ou inativo",
    }
  }

  // Verificar se é um horário no passado
  if (scheduledAt < new Date()) {
    return {
      isValid: false,
      error: "Não é possível agendar para datas passadas",
    }
  }

  // Verificar se o employee está disponível no horário
  const conflictingBooking = await db.booking.findFirst({
    where: {
      employeeId: employeeId,
      scheduledAt: scheduledAt,
      status: {
        in: ["SCHEDULED", "CONFIRMED", "IN_PROGRESS"],
      },
      // Excluir booking específico se fornecido (útil para edições)
      ...(excludeBookingId && {
        NOT: { id: excludeBookingId },
      }),
    },
  })

  if (conflictingBooking) {
    return {
      isValid: false,
      error: "Funcionário não disponível neste horário",
    }
  }

  return {
    isValid: true,
    employee: {
      id: employee.id,
      name: employee.user.name || "Nome não informado",
    },
  }
}
