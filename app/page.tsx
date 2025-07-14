import { SearchIcon } from "lucide-react"
import Image from "next/image"
import Header from "./_components/header"
import { Avatar, AvatarImage } from "./_components/ui/avatar"
import { Badge } from "./_components/ui/badge"
import { Button } from "./_components/ui/button"
import { Card, CardContent } from "./_components/ui/card"
import { Input } from "./_components/ui/input"

const HomePage = () => {
  return (
    <div>
      {/* HEADER */}
      <Header />
      {/* TEXTO*/}
      <div className="p-5">
        <h2 className="font-semi-bold text-xl">Olá, Zeca!</h2>
        <p>Sexta-Feira, 11 de Julho</p>
        {/*BUSCA*/}
        <div className="flex items-center gap-1">
          <Input className="rounded-md" placeholder="Busque um serviço..." />
          <Button
            className="rounded-md bg-purple-700 text-white hover:bg-purple-700"
            variant="outline"
            size="icon"
          >
            <SearchIcon />
          </Button>
        </div>
        {/*IMAGEM*/}
        <div className="relative mt-6 h-[190px] w-full">
          <Image
            src="/Banner Pizza.svg"
            fill
            className="rounded-xl object-cover"
            alt="Banner Pizza"
          />
        </div>

        {/*AGENDANMENTOS*/}
        <Card className="mt-6">
          <CardContent className="flex justify-between p-0">
            {/* ESQUERDA */}
            <div className="flex flex-col gap-2 py-5">
              <Badge
                variant="secondary"
                className="w-fit rounded-xl bg-purple-700"
              >
                Confirmado
              </Badge>
              <h3 className="text-lg font-semibold">Corte de Cabelo</h3>
              <div className="mt-2 flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src="https://utfs.io/f/60f24f5c-9ed3-40ba-8c92-0cd1dcd043f9-16w.png"
                    alt="Avatar"
                  />
                </Avatar>
                <p>Barbearia FSW</p>
              </div>
            </div>
            {/* DIREITA */}
            <div className="flex flex-col items-end justify-between">
              <h3 className="font-semibold">Fevereiro</h3>
              <p>14</p>
              <p>10:00</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default HomePage
