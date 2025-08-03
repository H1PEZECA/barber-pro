import { BarbershopService } from "@prisma/client"
import Image from "next/image"
import { Button } from "./ui/button"

interface ServiceItemProps {
  service: BarbershopService
}
const ServiceItem = ({ service }: ServiceItemProps) => {
  return (
    <div className="flex items-center gap-3">
      {/*Service Image*/}
      <div className="relative max-h-[110px] min-h-[110px] min-w-[110px] max-w-[110px]">
        <Image src={service.imageUrl} fill alt={service.name} />
      </div>
      {/*Service Details (right)*/}
      <div className="space-y-3">
        <h3 className="font-semibold">{service.name}</h3>
        <p className="text-sm text-gray-500">{service.description}</p>
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-primary">
            {Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(Number(service.price))}
          </p>
          <Button variant="secondary" size={"sm"}>
            Reservar
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ServiceItem
