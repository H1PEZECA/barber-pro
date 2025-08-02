import TextUpperCard from "@/app/_components/text-upper-card"
import { Button } from "@/app/_components/ui/button"
import { db } from "@/app/_lib/prisma"
import { ChevronLeft, MapPinIcon, MenuIcon, StarIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
interface BarbershopPageProps {
  params: {
    id: string
  }
}
const BarbershopPage = async ({ params }: BarbershopPageProps) => {
  // Fetch barbershop data based on the ID from params
  const barbershop = await db.barbershop.findUnique({
    where: { id: params.id },
  })

  if (!barbershop) {
    return notFound()
  }
  return (
    <div>
      {/*Image*/}
      <div className="relative h-[250px] w-full">
        <Image
          src={barbershop?.imageUrl}
          alt={barbershop.name}
          fill
          className="object-cover"
        />
        <Button
          size={"icon"}
          className="absolute left-4 top-4"
          variant="secondary"
          asChild
        >
          <Link href="/">
            <ChevronLeft />
          </Link>
        </Button>

        <Button
          size={"icon"}
          className="absolute right-4 top-4"
          variant="secondary"
        >
          <MenuIcon />
        </Button>
      </div>

      {/*Barbershop Details*/}
      <div className="border-b border-solid p-5">
        <h1 className="mb-3 text-xl font-bold">{barbershop?.name}</h1>
        <div className="mb-2 flex items-center gap-1">
          <MapPinIcon className="text-primary" size={18} />
          <p className="text-sm text-gray-400">{barbershop?.address}</p>
        </div>
        <div className="flex items-center gap-1">
          <StarIcon className="fill-primary text-primary" size={18} />
          <p className="text-sm text-gray-400">5,0 ( 723 Avaliações )</p>
        </div>
      </div>

      {/*Description*/}
      <div className="mt-0 border-b border-solid p-5">
        <TextUpperCard title="Sobre Nós" />
        <p className="text-justify text-sm text-gray-300">
          {barbershop?.description}
        </p>
      </div>
    </div>
  )
}

export default BarbershopPage
