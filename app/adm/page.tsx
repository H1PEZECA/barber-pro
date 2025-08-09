interface BarbershopsPageProps {
  searchParams: {
    title?: string
    service?: string
  }
  title?: string
  service?: string
}

export default async function AdmPage({}: BarbershopsPageProps) {
  //const barbershops = await db.barbershop.findMany()

  return <div>{}Admin Page</div>
}
