import { Card, CardContent } from "@/app/_components/ui/card"
import { MenuIcon } from "lucide-react"
import Image from "next/image"
import { Button } from "./ui/button"

const Header = () => {
  return (
    <Card>
      <CardContent className="flex flex-row items-center justify-between p-5">
        <Image src="/Logo.svg" alt="FSW Barber Logo" height={18} width={120} />
        <Button size="icon" variant={"outline"}>
          <MenuIcon />
        </Button>
      </CardContent>
    </Card>
  )
}

export default Header
