/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Barbershop, BarbershopService, Booking } from "@prisma/client"
import { isPast, isToday, set } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { createBooking } from "../_actions/create-booking"
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

interface ServiceItemProps {
  service: BarbershopService & {
    id: string
    employees?: { id: string; name: string }[]
    barbershopId: string
  }
  barbershop: Pick<Barbershop, "name">
}

// ✅ TIPO CORRETO PARA OS BOOKINGS COM INCLUDES
type BookingWithIncludes = {
  id: string
  userId: string
  serviceId: string
  barbershopId: string
  employeeId: string | null
  scheduledAt: Date
  status: any // ou BookingStatus se importado
  notes: string | null
  createdAt: Date
  updatedAt: Date
  // ✅ Includes opcionais para flexibilidade
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
}

const getTimeList = ({ bookings, selectedDay }: GetTimeListProps) => {
  return TIME_LIST.filter((time) => {
    const hour = Number(time.split(":")[0])
    const minutes = Number(time.split(":")[1])

    const timeIsOnThePast = isPast(set(new Date(), { hours: hour, minutes }))
    if (timeIsOnThePast && isToday(selectedDay)) {
      return false
    }

    const hasBookingOnCurrentTime = bookings.some(
      (booking) =>
        booking.scheduledAt.getHours() === hour &&
        booking.scheduledAt.getMinutes() === minutes,
    )
    if (hasBookingOnCurrentTime) {
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
  const [employees, setEmployees] = useState<{ id: string; name: string }[]>([])
  // ✅ TIPO CORRETO PARA dayBookings
  const [dayBookings, setDayBookings] = useState<BookingWithIncludes[]>([])

  // ✅ USEEFFECT CORRIGIDO COM TRATAMENTO DE UNDEFINED
  useEffect(() => {
    const fetch = async () => {
      if (!selectedDay || !service?.id) return

      try {
        const bookings = await getBookings({ date: selectedDay })

        // ✅ VERIFICAR SE bookings NÃO É UNDEFINED
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

  // ✅ NOVO: Buscar dados completos do employee selecionado
  const selectedEmployeeData = useMemo(() => {
    if (!selectedEmployee) return undefined
    return employees.find((emp) => emp.id === selectedEmployee)
  }, [selectedEmployee, employees])

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
    setSelectedEmployee("") // ✅ Limpar employee selecionado
    setBookingSheetIsOpen(false)
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDay(date)
  }

  const handleTimeSelect = (time: string | undefined) => {
    setSelectedTime(time)
    if (selectedTime === time) {
      setSelectedTime(undefined)
    }
  }

  const handleCreateBooking = async () => {
    try {
      if (!selectedDate || !selectedEmployee) {
        toast.error("Selecione data, horário e barbeiro!")
        return
      }

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
      console.error(error)
      toast.error("Erro ao criar reserva!")
    }
  }

  const timeList = useMemo(() => {
    if (!selectedDay) return []
    return getTimeList({
      bookings: dayBookings as Booking[], // Cast para Booking[] para a função getTimeList
      selectedDay,
    })
  }, [dayBookings, selectedDay])

  // ✅ CORRIGIDO: useEffect para recarregar employees quando date/time mudarem
  useEffect(() => {
    const fetchEmployees = async () => {
      if (!service?.barbershopId) return

      try {
        const availableEmployees = await getServiceEmployees({
          barbershopId: service.barbershopId,
          date: selectedDate,
        })
        setEmployees(availableEmployees)
      } catch (error) {
        console.error("Erro ao buscar funcionários:", error)
        toast.error("Erro ao carregar funcionários!")
      }
    }

    fetchEmployees()
  }, [service?.barbershopId, selectedDate])

  useEffect(() => {
    setSelectedEmployee("")
  }, [selectedDate])

  // ✅ CORRIGIDO: Limpar employee selecionado quando data/horário mudam
  useEffect(() => {
    setSelectedEmployee("")
  }, [selectedDate])

  useEffect(() => {
    const fetch = async () => {
      if (!selectedDay || !service?.id) return

      // ✅ Busca bookings de uma data específica
      const bookings = await getBookings({ date: selectedDay })
      setDayBookings(bookings)
    }
    fetch()
  }, [selectedDay, service?.id])

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
                        cell: {
                          width: "100%",
                        },
                        button: {
                          width: "100%",
                        },
                        nav_button_previous: {
                          width: "32px",
                          height: "32px",
                        },
                        nav_button_next: {
                          width: "32px",
                          height: "32px",
                        },
                        caption: {
                          textTransform: "capitalize",
                        },
                      }}
                      className="ml-16 capitalize"
                    />
                  </div>

                  {selectedDay && (
                    <div className="flex gap-3 overflow-x-auto border-b border-solid p-5 [&::-webkit-scrollbar]:hidden">
                      {timeList.length > 0 ? (
                        timeList.map((time) => (
                          <Button
                            key={time}
                            variant={
                              selectedTime === time ? "default" : "outline"
                            }
                            className="rounded-xl"
                            onClick={() => handleTimeSelect(time)}
                          >
                            {time}
                          </Button>
                        ))
                      ) : (
                        <p className="text-xs">
                          Não há horários disponíveis para este dia.
                        </p>
                      )}
                    </div>
                  )}

                  {/* ✅ SEÇÃO PARA SELECIONAR BARBEIROS */}
                  {selectedDate && (
                    <div className="border-b border-solid p-5">
                      <Select
                        value={selectedEmployee || undefined}
                        onValueChange={(value) => setSelectedEmployee(value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Escolha um barbeiro disponível" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Barbeiros Disponíveis</SelectLabel>
                            {employees.length > 0 ? (
                              employees.map((employee) => (
                                <SelectItem
                                  key={employee.id}
                                  value={employee.id}
                                >
                                  {employee.name}
                                </SelectItem>
                              ))
                            ) : (
                              <div className="p-2 text-sm text-muted-foreground">
                                Nenhum barbeiro disponível neste horário
                              </div>
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* ✅ RESUMO DO AGENDAMENTO - passa selectedEmployeeData */}
                  {selectedDate && selectedEmployee && (
                    <div className="p-5">
                      <BookingSummary
                        barbershop={barbershop}
                        service={service}
                        selectedDate={selectedDate}
                        employee={selectedEmployeeData} // ✅ Passa o objeto completo do employee
                      />
                    </div>
                  )}

                  <SheetFooter className="mt-5 px-5">
                    <Button
                      variant="secondary"
                      onClick={() => setBookingSheetIsOpen(false)}
                      className="mt-2"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleCreateBooking}
                      disabled={
                        !selectedDay || !selectedTime || !selectedEmployee
                      } // ✅ Inclui employee na validação
                    >
                      Confirmar
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
