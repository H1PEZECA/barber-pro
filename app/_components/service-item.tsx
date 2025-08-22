/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Barbershop, BarbershopService, Booking } from "@prisma/client"
import { isPast, isToday, set } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import {
  createBooking,
  checkRealTimeAvailability,
} from "../_actions/create-booking"
import { getBookings } from "../_actions/get-bookings"
import { getServiceEmployees } from "../_actions/get-service-employees"
import BookingSummary from "./booking-summary"
import SignInDialog from "./sign-in-dialog"
import { Button } from "./ui/button"
import { Calendar } from "./ui/calendar"
import { Card, CardContent } from "./ui/card"
import { Dialog, DialogContent } from "./ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet"
import { Loader2 } from "lucide-react"

interface ServiceItemProps {
  service: BarbershopService & {
    id: string
    employees?: { id: string; name: string }[]
    barbershopId: string
  }
  barbershop: Pick<Barbershop, "name">
}

type BookingWithIncludes = {
  id: string
  userId: string
  serviceId: string
  barbershopId: string
  employeeId: string | null
  scheduledAt: Date
  status: any
  notes: string | null
  createdAt: Date
  updatedAt: Date
  service?: any
  employee?: any
}

const TIME_LIST = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
]

interface GetTimeListProps {
  bookings: Booking[]
  selectedDay: Date
  selectedEmployeeId?: string
}

const getTimeList = ({
  bookings,
  selectedDay,
  selectedEmployeeId,
}: GetTimeListProps) => {
  return TIME_LIST.filter((time) => {
    const hour = Number(time.split(":")[0])
    const minutes = Number(time.split(":")[1])

    // Verificar se o horário já passou (somente para hoje)
    const timeIsOnThePast = isPast(set(new Date(), { hours: hour, minutes }))
    if (timeIsOnThePast && isToday(selectedDay)) {
      return false
    }

    // Verificar apenas se o EMPLOYEE ESPECÍFICO tem booking neste horário
    if (selectedEmployeeId) {
      const hasBookingForThisEmployee = bookings.some(
        (booking) =>
          booking.employeeId === selectedEmployeeId &&
          booking.scheduledAt.getHours() === hour &&
          booking.scheduledAt.getMinutes() === minutes,
      )
      if (hasBookingForThisEmployee) {
        return false
      }
    } else {
      return false
    }

    return true
  })
}

const ServiceItem = ({ service, barbershop }: ServiceItemProps) => {
  const { data } = useSession()
  const router = useRouter()
  const [signInDialogIsOpen, setSignInDialogIsOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined,
  )
  const [bookingSheetIsOpen, setBookingSheetIsOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [employees, setEmployees] = useState<
    { id: string; name: string; isAvailable?: boolean }[]
  >([])
  const [dayBookings, setDayBookings] = useState<BookingWithIncludes[]>([])

  // ✅ NOVOS ESTADOS PARA VERIFICAÇÃO EM TEMPO REAL
  const [isCreatingBooking, setIsCreatingBooking] = useState(false)
  const [lastAvailabilityCheck, setLastAvailabilityCheck] =
    useState<Date | null>(null)
  const [unavailableTimes, setUnavailableTimes] = useState<Set<string>>(
    new Set(),
  )

  useEffect(() => {
    const fetch = async () => {
      if (!selectedDay || !service?.id) return

      try {
        const bookings = await getBookings({ date: selectedDay })
        if (bookings) {
          setDayBookings(bookings as BookingWithIncludes[])
        } else {
          setDayBookings([])
        }
      } catch (error) {
        console.error("Erro ao buscar bookings:", error)
        setDayBookings([])
      }
    }

    fetch()
  }, [selectedDay, service?.id])

  const selectedDate = useMemo(() => {
    if (!selectedDay || !selectedTime) return undefined
    return set(selectedDay, {
      hours: Number(selectedTime.split(":")[0]),
      minutes: Number(selectedTime.split(":")[1]),
    })
  }, [selectedDay, selectedTime])

  const selectedEmployeeData = useMemo(() => {
    if (!selectedEmployee) return undefined
    return employees.find((emp) => emp.id === selectedEmployee)
  }, [selectedEmployee, employees])

  // ✅ FUNÇÃO PARA VERIFICAR DISPONIBILIDADE EM TEMPO REAL
  const checkAvailabilityBeforeBooking =
    useCallback(async (): Promise<boolean> => {
      if (!selectedDate || !selectedEmployee || !service.barbershopId)
        return false

      try {
        const availability = await checkRealTimeAvailability({
          barbershopId: service.barbershopId,
          employeeId: selectedEmployee,
          scheduledAt: selectedDate,
        })

        if (!availability.isAvailable) {
          toast.error("Este horário acabou de ser reservado por outro cliente!")
          // Marcar horário como indisponível
          if (selectedTime) {
            setUnavailableTimes((prev) => {
              const newSet = new Set(prev)
              newSet.add(selectedTime)
              return newSet
            })
          }
          setSelectedTime(undefined)
          return false
        }

        return true
      } catch (error) {
        console.error("Erro ao verificar disponibilidade:", error)
        toast.error("Erro ao verificar disponibilidade. Tente novamente.")
        return false
      }
    }, [selectedDate, selectedEmployee, service.barbershopId, selectedTime])

  // ✅ VERIFICAÇÃO AUTOMÁTICA A CADA 30 SEGUNDOS
  useEffect(() => {
    if (!selectedDate || !selectedEmployee) return

    const interval = setInterval(async () => {
      const isAvailable = await checkAvailabilityBeforeBooking()
      if (!isAvailable) {
        console.log(
          "⚠️ Horário não está mais disponível - removido automaticamente",
        )
      }
      setLastAvailabilityCheck(new Date())
    }, 30000) // 30 segundos

    return () => clearInterval(interval)
  }, [selectedDate, selectedEmployee, checkAvailabilityBeforeBooking])

  const handleBookingClick = () => {
    if (data?.user) {
      return setBookingSheetIsOpen(true)
    }
    return setSignInDialogIsOpen(true)
  }

  const handleBookingSheetOpenChange = () => {
    setSelectedDay(undefined)
    setSelectedTime(undefined)
    setDayBookings([])
    setSelectedEmployee("")
    setUnavailableTimes(new Set()) // ✅ Limpar horários indisponíveis
    setBookingSheetIsOpen(false)
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDay(date)
    setSelectedTime(undefined)
    setUnavailableTimes(new Set()) // ✅ Limpar ao mudar data
  }

  const handleTimeSelect = (time: string | undefined) => {
    if (selectedTime === time) {
      setSelectedTime(undefined)
    } else {
      setSelectedTime(time)
    }
  }

  const handleEmployeeSelect = (employeeId: string) => {
    setSelectedEmployee(employeeId)
    setSelectedTime(undefined)
    setUnavailableTimes(new Set()) // ✅ Limpar ao mudar employee
  }

  // ✅ FUNÇÃO DE CRIAÇÃO COM VERIFICAÇÃO FINAL
  const handleCreateBooking = async () => {
    if (!selectedDate || !selectedEmployee) {
      toast.error("Selecione data, horário e barbeiro!")
      return
    }

    setIsCreatingBooking(true)

    try {
      // ✅ VERIFICAÇÃO FINAL ANTES DE CONFIRMAR
      console.log("🔍 Verificando disponibilidade final...")
      const isStillAvailable = await checkAvailabilityBeforeBooking()

      if (!isStillAvailable) {
        console.log("❌ Horário não está mais disponível")
        return // O erro já foi mostrado na função checkAvailabilityBeforeBooking
      }

      console.log("✅ Horário disponível - criando booking...")

      await createBooking({
        serviceId: service.id,
        barbershopId: service.barbershopId,
        employeeId: selectedEmployee,
        date: selectedDate,
      })

      handleBookingSheetOpenChange()
      toast.success("Reserva criada com sucesso!", {
        action: {
          label: "Ver agendamentos",
          onClick: () => router.push("/bookings"),
        },
      })
    } catch (error) {
      console.error("❌ Erro ao criar booking:", error)

      if (error instanceof Error) {
        // ✅ Tratar erros específicos de conflito
        if (
          error.message.includes("não está mais disponível") ||
          error.message.includes("acabou de ser reservado")
        ) {
          toast.error(error.message)
          // Marcar horário como indisponível e limpar seleção
          if (selectedTime) {
            setUnavailableTimes((prev) => {
              const newSet = new Set(prev)
              newSet.add(selectedTime)
              return newSet
            })
          }
          setSelectedTime(undefined)
        } else {
          toast.error(error.message)
        }
      } else {
        toast.error("Erro ao criar reserva!")
      }
    } finally {
      setIsCreatingBooking(false)
    }
  }

  // ✅ timeList agora exclui horários marcados como indisponíveis
  const timeList = useMemo(() => {
    if (!selectedDay) return []
    const availableTimes = getTimeList({
      bookings: dayBookings as Booking[],
      selectedDay,
      selectedEmployeeId: selectedEmployee,
    })

    // Filtrar horários que foram marcados como indisponíveis
    return availableTimes.filter((time) => !unavailableTimes.has(time))
  }, [dayBookings, selectedDay, selectedEmployee, unavailableTimes])

  // Buscar employees disponíveis quando data/horário mudarem
  useEffect(() => {
    const fetchEmployees = async () => {
      if (!service?.barbershopId) return

      try {
        const availableEmployees = await getServiceEmployees({
          barbershopId: service.barbershopId,
          scheduledAt: selectedDate,
        })
        setEmployees(availableEmployees)
      } catch (error) {
        console.error("Erro ao buscar funcionários:", error)
        toast.error("Erro ao carregar funcionários!")
      }
    }

    fetchEmployees()
  }, [service?.barbershopId, selectedDate])

  // Limpar employee quando data mudar
  useEffect(() => {
    setSelectedEmployee("")
    setSelectedTime(undefined)
  }, [selectedDay])

  return (
    <>
      <Card>
        <CardContent className="flex items-center gap-3 p-3">
          {/* IMAGE */}
          <div className="relative max-h-[110px] min-h-[110px] min-w-[110px] max-w-[110px]">
            <Image
              alt={service.name}
              src={service.imageUrl}
              fill
              className="rounded-lg object-cover"
            />
          </div>
          {/* DIREITA */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">{service.name}</h3>
            <p className="text-sm text-gray-400">{service.description}</p>
            {/* PREÇO E BOTÃO */}
            <div className="flex items-center space-x-40">
              <p className="text-sm font-bold text-primary">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(service.price))}
              </p>

              <Sheet
                open={bookingSheetIsOpen}
                onOpenChange={handleBookingSheetOpenChange}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleBookingClick}
                >
                  Reservar
                </Button>

                <SheetContent className="px-0">
                  <SheetHeader>
                    <SheetTitle>Fazer Reserva</SheetTitle>
                  </SheetHeader>

                  <div className="border-b border-solid py-0">
                    <Calendar
                      mode="single"
                      locale={ptBR}
                      selected={selectedDay}
                      onSelect={handleDateSelect}
                      disabled={(date) =>
                        isPast(date) ||
                        date.getDay() === 0 ||
                        date.getDay() === 1
                      }
                      styles={{
                        head_cell: {
                          width: "100%",
                          textTransform: "capitalize",
                        },
                        cell: { width: "100%" },
                        button: { width: "100%" },
                        nav_button_previous: { width: "32px", height: "32px" },
                        nav_button_next: { width: "32px", height: "32px" },
                        caption: { textTransform: "capitalize" },
                      }}
                      className="ml-16 capitalize"
                    />
                  </div>

                  {/* Seleção de barbeiro */}
                  {selectedDay && (
                    <div className="border-b border-solid p-5">
                      <h4 className="mb-3 text-sm font-medium">
                        Escolha o barbeiro:
                      </h4>
                      <Select
                        value={selectedEmployee || undefined}
                        onValueChange={handleEmployeeSelect}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione um barbeiro disponível" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Barbeiros Disponíveis</SelectLabel>
                            {employees.length > 0 ? (
                              employees
                                .filter((emp) => emp.isAvailable !== false)
                                .map((employee) => (
                                  <SelectItem
                                    key={employee.id}
                                    value={employee.id}
                                  >
                                    {employee.name}
                                  </SelectItem>
                                ))
                            ) : (
                              <div className="p-2 text-sm text-muted-foreground">
                                Nenhum barbeiro disponível
                              </div>
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Horários disponíveis */}
                  {selectedDay && selectedEmployee && (
                    <div className="flex gap-3 overflow-x-auto border-b border-solid p-5 [&::-webkit-scrollbar]:hidden">
                      <h4 className="mb-3 w-full text-sm font-medium">
                        Horários disponíveis:
                        {/* ✅ Indicador de última verificação */}
                        {lastAvailabilityCheck && (
                          <span className="block text-xs text-muted-foreground">
                            Última verificação:{" "}
                            {lastAvailabilityCheck.toLocaleTimeString()}
                          </span>
                        )}
                      </h4>
                      <div className="flex w-full gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                        {timeList.length > 0 ? (
                          timeList.map((time) => (
                            <Button
                              key={time}
                              variant={
                                selectedTime === time ? "default" : "outline"
                              }
                              className="whitespace-nowrap rounded-xl"
                              onClick={() => handleTimeSelect(time)}
                              disabled={unavailableTimes.has(time)}
                            >
                              {time}
                              {unavailableTimes.has(time) && " (Ocupado)"}
                            </Button>
                          ))
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            Nenhum horário disponível para este barbeiro hoje.
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Resumo do agendamento */}
                  {selectedDate && selectedEmployee && (
                    <div className="p-5">
                      <BookingSummary
                        barbershop={barbershop}
                        service={service}
                        selectedDate={selectedDate}
                        employee={selectedEmployeeData}
                      />
                    </div>
                  )}

                  <SheetFooter className="mt-5 px-5">
                    <Button
                      variant="secondary"
                      onClick={() => setBookingSheetIsOpen(false)}
                      className="mt-2"
                      disabled={isCreatingBooking}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleCreateBooking}
                      disabled={
                        !selectedDay ||
                        !selectedTime ||
                        !selectedEmployee ||
                        isCreatingBooking
                      }
                    >
                      {isCreatingBooking ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Confirmando...
                        </>
                      ) : (
                        "Confirmar"
                      )}
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={signInDialogIsOpen}
        onOpenChange={(open) => setSignInDialogIsOpen(open)}
      >
        <DialogContent className="w-[90%]">
          <SignInDialog />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ServiceItem
