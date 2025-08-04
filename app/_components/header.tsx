import { MenuIcon } from "lucide-react"
import Image from "next/image"

import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Sheet, SheetTrigger } from "./ui/sheet"
import SidebarItem from "./sidebar-item"
const Header = () => {
  return (
    <div>
      <Card>
        <CardContent className="flex flex-row items-center justify-between p-5">
          <Image
            alt="BarberPro logo"
            src={"/logo.svg"}
            width={80}
            height={120}
          />
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline">
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SidebarItem />
          </Sheet>
        </CardContent>
      </Card>
    </div>
  )
}

export default Header
