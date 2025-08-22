import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { getServerSession } from "next-auth"
import Header from "../../_components/header"
import { authOptions } from "../../_lib/auth"

interface BarbershopsPageProps {
  searchParams: {
    title?: string
    service?: string
  }
  title?: string
  service?: string
}

export default async function AdmPage({}: BarbershopsPageProps) {
  const session = await getServerSession(authOptions)

  return (
    <div>
      <Header />
      <div className="p-5">
        <h2 className="text-xl font-semibold">
          Olá, {session?.user ? session.user.name : "bem vindo"}!
        </h2>
        <p>
          <span className="capitalize">
            {format(new Date(), "EEEE, dd", { locale: ptBR })}
          </span>
          <span>&nbsp;de&nbsp;</span>
          <span className="capitalize">
            {format(new Date(), "MMMM", { locale: ptBR })}
          </span>
        </p>
        <div className="mt-10 text-center">
          <h3>Bem vindo a área administrativa do sistema!</h3>
        </div>
      </div>
    </div>
  )
}
