// app/adm/barber/layout.tsx
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/_lib/auth"

export default async function BarberLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "BARBER") {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-900 p-4 text-white">Painel do Barber</header>
      <main className="p-6">{children}</main>
    </div>
  )
}
