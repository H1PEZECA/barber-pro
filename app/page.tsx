import { SearchIcon } from "lucide-react"
import Image from "next/image"
import Header from "./_components/header"
import { Button } from "./_components/ui/button"
import { Input } from "./_components/ui/input"

const HomePage = () => {
  return (
    <div>
      <Header />
      <div className="p-5">
        <h2 className="font-semi-bold text-xl">Olá, Zeca!</h2>
        <p>Sexta-Feira, 11 de Julho</p>

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

        <div className="relative mt-6 h-[190px] w-full">
          <Image
            src="/Banner Pizza.svg"
            fill
            className="rounded-xl object-cover"
            alt="Banner Pizza"
          />
        </div>
      </div>
    </div>
  )
}

export default HomePage
