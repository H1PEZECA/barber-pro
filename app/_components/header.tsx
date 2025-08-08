import { MenuIcon } from "lucide-react"
import Image from "next/image"

import Link from "next/link"
import SidebarItem from "./sidebar-item"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Sheet, SheetTrigger } from "./ui/sheet"
const Header = () => {
  return (
    <div>
      <Card>
        <CardContent className="flex flex-row items-center justify-between p-5">
          <Link href="/">
            <Image src="/logonew.svg" alt="logo" width={80} height={120} />
          </Link>
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
