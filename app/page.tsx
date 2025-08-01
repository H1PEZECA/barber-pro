import { SearchIcon } from "lucide-react"
import Image from "next/image"
import BarbershopItem from "./_components/barbershop-item"
import BookingItem from "./_components/booking-item"
import Footer from "./_components/footer"
import Header from "./_components/header"
import { Button } from "./_components/ui/button"
import { Input } from "./_components/ui/input"
import { quickSearchOptions } from "./_constants/search"
import { db } from "./_lib/prisma"
import TextUpperCard from "./_components/text-upper-card"

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
          {quickSearchOptions.map((option) => (
            <Button key={option.title} className="gap-2" variant="secondary">
              <Image
                src={option.image}
                alt={option.title}
                width={16}
                height={16}
              />
              {option.title}
            </Button>
          ))}
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
        <BookingItem />

        {/*Recommended Barbershops */}
        <TextUpperCard title="recomendados" />
        <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>

        {/*Popular Barbershops */}
        <TextUpperCard title="populares" />
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
