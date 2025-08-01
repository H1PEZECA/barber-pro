import { SearchIcon } from "lucide-react"
import Image from "next/image"
import BarbershopItem from "./_components/barbershop-item"
import Header from "./_components/header"
import { Avatar, AvatarImage } from "./_components/ui/avatar"
import { Badge } from "./_components/ui/badge"
import { Button } from "./_components/ui/button"
import { Card, CardContent } from "./_components/ui/card"
import { Input } from "./_components/ui/input"
import { db } from "./_lib/prisma"
import Footer from "./_components/footer"
const Home = async () => {
  // log db
  const barbershops = await db.barbershop.findMany({})
  const popularBarbershops = await db.barbershop.findMany({
    orderBy: {
      name: "desc",
    },
  })

  return (
    <div>
      {/* Header*/}
      <Header />
      <div className="p-5">
        <h2 className="text-xl font-bold">Olá, Zeca!</h2>
        <p>Quinta-Feira, 31 de Julho</p>

        {/*Search*/}
        <div className="mt-6 flex items-center gap-2">
          <Input placeholder="Buscar..." />
          <Button>
            <SearchIcon />
          </Button>
        </div>

        {/*Quick Search*/}
        <div className="mt-6 flex gap-3 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
          <Button className="gap-2" variant="secondary">
            <Image src="/cabelo.svg" alt="Cabelo" width={16} height={16} />
            Cabelo
          </Button>

          <Button className="gap-2" variant="secondary">
            <Image src="/barba.svg" alt="Barba" width={16} height={16} />
            Barba
          </Button>

          <Button className="gap-2" variant="secondary">
            <Image
              src="/acabamento.svg"
              alt="Acabamento"
              width={16}
              height={16}
            />
            Acabamento
          </Button>

          <Button className="gap-2" variant="secondary">
            <Image
              src="/hidratacao.svg"
              alt="Hidratação"
              width={16}
              height={16}
            />
            Hidratação
          </Button>

          <Button className="gap-2" variant="secondary">
            <Image src="/massage.svg" alt="Massagem" width={16} height={16} />
            Massagem
          </Button>

          <Button className="gap-2" variant="secondary">
            <Image
              src="/sobrancelha.svg"
              alt="Sobrancelha"
              width={16}
              height={16}
            />
            Sobrancelha
          </Button>
        </div>

        {/*Banner*/}
        <div className="relative mt-6 h-[150px] w-full">
          <Image
            src="/banner.svg"
            alt="Banner BarberPro"
            fill
            className="rounded-xl object-cover"
          />
        </div>

        {/*Bookings*/}
        <h2 className="mb-3 mt-6 text-sm uppercase text-gray-400">
          agendamentos
        </h2>
        <Card>
          <CardContent className="flex justify-between p-0">
            {/*Left*/}
            <div className="flex flex-col gap-2 py-5 pl-5">
              <Badge className="w-fit">Confirmado</Badge>
              <h3>Corte de cabelo</h3>
              {/*Service Details*/}
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="https://utfs.io/f/60f24f5c-9ed3-40ba-8c92-0cd1dcd043f9-16w.png" />
                </Avatar>
                <p>BarberPro</p>
              </div>
            </div>

            {/*Right*/}
            <div className="mr-5 flex flex-col items-center justify-center border-l-2 border-solid px-5">
              <p className="text-sm">Julho</p>
              <p className="text-2xl">31</p>
              <p className="text-sm">20:00</p>
            </div>
          </CardContent>
        </Card>
        {/*Recommended Barbershops */}
        <h2 className="mb-3 mt-6 text-sm uppercase text-gray-400">
          recomendados
        </h2>
        <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>

        {/*Popular Barbershops */}
        <h2 className="mb-3 mt-6 text-sm uppercase text-gray-400">Populares</h2>
        <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
          {popularBarbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>
      {/*Footer*/}
      <Footer />
    </div>
  )
}

export default Home
