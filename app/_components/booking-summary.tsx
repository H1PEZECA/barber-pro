import { Barbershop, BarbershopService } from "@prisma/client"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Card, CardContent } from "./ui/card"

interface BookingSummaryProps {
  service: Pick<BarbershopService, "name" | "price">
  barbershop: Pick<Barbershop, "name">
  selectedDate: Date
  employee?: { id: string; name: string } | undefined
}

const BookingSummary = ({
  service,
  barbershop,
  selectedDate,
  employee,
}: BookingSummaryProps) => {
  // ✅ DEBUG: Opcional - remover após teste
  console.log("BookingSummary recebeu employee:", employee)

  return (
    <Card>
      <CardContent className="space-y-3 p-3">
        <h2 className="border-b pb-3 text-center text-lg font-bold">
          Resumo do Agendamento
        </h2>

        {/* Serviço e Preço */}
        <div className="flex items-center justify-between">
          <h3 className="font-bold">{service.name}</h3>
          <p className="text-sm font-bold text-primary">
            {Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(Number(service.price))}
          </p>
        </div>

        {/* Data */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Data</span>
          <p className="text-sm font-medium">
            {format(selectedDate, "d 'de' MMMM", {
              locale: ptBR,
            })}
          </p>
        </div>

        {/* Horário */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Horário</span>
          <p className="text-sm font-medium">{format(selectedDate, "HH:mm")}</p>
        </div>

        {/* ✅ Barbeiro - com melhor tratamento de erro */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Barbeiro</span>
          <p
            className={`text-sm font-medium ${!employee ? "text-red-400" : ""}`}
          >
            {employee?.name || "Não selecionado"}
          </p>
        </div>

        {/* Barbearia */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Barbearia</span>
          <p className="text-sm font-medium">{barbershop.name}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default BookingSummary
