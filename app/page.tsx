import { SearchIcon } from "lucide-react"
import Image from "next/image"
import { Avatar, AvatarImage } from "./_components/ui/avatar"
import { Badge } from "./_components/ui/badge"
import { Button } from "./_components/ui/button"
import { Card, CardContent } from "./_components/ui/card"
import Header from "./_components/ui/header"
import { Input } from "./_components/ui/input"
const Home = () => {
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
        <Card className="mt-6">
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
      </div>
    </div>
  )
}

export default Home
;<div></div>
