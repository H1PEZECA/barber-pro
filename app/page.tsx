import Image from "next/image"
import BarbershopItem from "./_components/barbershop-item"
import BookingItem from "./_components/booking-item"

import Header from "./_components/header"
import TextUpperCard from "./_components/text-upper-card"
import { Button } from "./_components/ui/button"
import { quickSearchOptions } from "./_constants/search"
import { db } from "./_lib/prisma"
import Search from "./_components/search"
import Link from "next/link"

const Home = async () => {
  // log db
  const barbershops = await db.barbershop.findMany({})
  const popularBarbershops = await db.barbershop.findMany({
    orderBy: {
      name: "desc",
    },
  })

  // Fetch a booking with service and barbershop included
  const booking = await db.booking.findFirst({
    include: {
      service: {
        include: {
          barbershop: true,
        },
      },
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
        <div className="mt-6">
          <Search />
        </div>

        {/*Quick Search*/}
        <div className="mt-6 flex gap-3 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
          {quickSearchOptions.map((option) => (
            <Button
              className="gap-2"
              variant="secondary"
              key={option.title}
              asChild
            >
              <Link href={`/barbershops?service=${option.title}`}>
                <Image
                  src={option.image}
                  width={16}
                  height={16}
                  alt={option.title}
                />
                {option.title}
              </Link>
            </Button>
          ))}
        </div>

        {/*Banner*/}
        <div className="relative mb-6 mt-6 h-[150px] w-full">
          <Image
            src="/banner.svg"
            alt="Banner BarberPro"
            fill
            className="rounded-xl object-cover"
          />
        </div>

        {/*Bookings*/}
        {booking && <BookingItem booking={booking} />}

        {/*Recommended Barbershops */}
        <div className="mt-6">
          <TextUpperCard title="recomendados" />
        </div>
        <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>

        {/*Popular Barbershops */}
        <div className="mt-6">
          <TextUpperCard title="populares" />
        </div>
        <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
          {popularBarbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
