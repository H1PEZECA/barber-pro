import { Card, CardContent } from "./card"
import Image from "next/image"
const Header = () => {
  return (
    <div>
      <Card>
        <CardContent>
          <Image src={"/logo.svg"} alt="logo" width={80} height={120} />
        </CardContent>
      </Card>
    </div>
  )
}

export default Header
