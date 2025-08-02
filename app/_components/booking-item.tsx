import TextUpperCard from "./text-upper-card"
import { Avatar, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"

const BookingItem = () => {
  return (
    <>
      <div className="mt-6">
        <TextUpperCard title="agendamentos" />
      </div>
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
    </>
  )
}

export default BookingItem
