import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function seedDatabase() {
  try {
    console.log("🚀 Iniciando seed do banco de dados...")

    // Verificar se já existem dados
    const existingBarbershops = await prisma.barbershop.count()
    console.log(`📊 Barbearias existentes: ${existingBarbershops}`)

    // Se você quiser resetar todos os dados, descomente as linhas abaixo:
    // console.log("🧹 Limpando dados existentes...");
    // await prisma.booking.deleteMany();
    // await prisma.barber.deleteMany();
    // await prisma.barbershopService.deleteMany();
    // await prisma.barbershop.deleteMany();
    // await prisma.user.deleteMany();

    const images = [
      "https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png",
      "https://utfs.io/f/45331760-899c-4b4b-910e-e00babb6ed81-16q.png",
      "https://utfs.io/f/5832df58-cfd7-4b3f-b102-42b7e150ced2-16r.png",
      "https://utfs.io/f/7e309eaa-d722-465b-b8b6-76217404a3d3-16s.png",
      "https://utfs.io/f/178da6b6-6f9a-424a-be9d-a2feb476eb36-16t.png",
      "https://utfs.io/f/2f9278ba-3975-4026-af46-64af78864494-16u.png",
      "https://utfs.io/f/988646ea-dcb6-4f47-8a03-8d4586b7bc21-16v.png",
      "https://utfs.io/f/60f24f5c-9ed3-40ba-8c92-0cd1dcd043f9-16w.png",
      "https://utfs.io/f/f64f1bd4-59ce-4ee3-972d-2399937eeafc-16x.png",
      "https://utfs.io/f/e995db6d-df96-4658-99f5-11132fd931e1-17j.png",
    ]

    // Nomes criativos para as barbearias
    const creativeNames = [
      "Barbearia Vintage",
      "Corte & Estilo",
      "Barba & Navalha",
      "The Dapper Den",
      "Cabelo & Cia.",
      "Machado & Tesoura",
      "Barbearia Elegance",
      "Aparência Impecável",
      "Estilo Urbano",
      "Estilo Clássico",
    ]

    // Endereços fictícios para as barbearias
    const addresses = [
      "Rua da Barbearia, 123",
      "Avenida dos Cortes, 456",
      "Praça da Barba, 789",
      "Travessa da Navalha, 101",
      "Alameda dos Estilos, 202",
      "Estrada do Machado, 303",
      "Avenida Elegante, 404",
      "Praça da Aparência, 505",
      "Rua Urbana, 606",
      "Avenida Clássica, 707",
    ]

    const services = [
      {
        name: "Corte de Cabelo",
        description: "Estilo personalizado com as últimas tendências.",
        price: 60.0,
        imageUrl:
          "https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png",
      },
      {
        name: "Barba",
        description: "Modelagem completa para destacar sua masculinidade.",
        price: 40.0,
        imageUrl:
          "https://utfs.io/f/e6bdffb6-24a9-455b-aba3-903c2c2b5bde-1jo6tu.png",
      },
      {
        name: "Pézinho",
        description: "Acabamento perfeito para um visual renovado.",
        price: 35.0,
        imageUrl:
          "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
      },
      {
        name: "Sobrancelha",
        description: "Expressão acentuada com modelagem precisa.",
        price: 20.0,
        imageUrl:
          "https://utfs.io/f/2118f76e-89e4-43e6-87c9-8f157500c333-b0ps0b.png",
      },
      {
        name: "Massagem",
        description: "Relaxe com uma massagem revigorante.",
        price: 50.0,
        imageUrl:
          "https://utfs.io/f/c4919193-a675-4c47-9f21-ebd86d1c8e6a-4oen2a.png",
      },
      {
        name: "Hidratação",
        description: "Hidratação profunda para cabelo e barba.",
        price: 25.0,
        imageUrl:
          "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
      },
    ]

    // SEU ID DE USUÁRIO (substitua pelo email real que você usa no Google)
    const ADMIN_USER_ID = "cmdx6rwbp000197h8uvtixmrd"
    const ADMIN_EMAIL = "josemendess004@gmail.com" // SUBSTITUA PELO SEU EMAIL REAL

    // Criar ou buscar o usuário admin
    let adminUser = await prisma.user.findUnique({
      where: { id: ADMIN_USER_ID },
    })

    if (!adminUser) {
      console.log("👤 Criando usuário admin...")
      adminUser = await prisma.user.create({
        data: {
          id: ADMIN_USER_ID,
          name: "Admin User",
          email: ADMIN_EMAIL,
          image: "https://via.placeholder.com/150",
        },
      })
    } else {
      console.log("👤 Usuário admin encontrado:", adminUser.name)
    }

    // Nomes fictícios para barbeiros
    const barberNames = [
      "Carlos Silva",
      "João Santos",
      "Pedro Lima",
      "Rafael Costa",
      "Lucas Oliveira",
      "Bruno Ferreira",
      "Daniel Rocha",
      "Marcos Almeida",
      "André Barbosa",
    ]

    const barberEmails = [
      "carlos@barberpro.com",
      "joao@barberpro.com",
      "pedro@barberpro.com",
      "rafael@barberpro.com",
      "lucas@barberpro.com",
      "bruno@barberpro.com",
      "daniel@barberpro.com",
      "marcos@barberpro.com",
      "andre@barberpro.com",
    ]

    // Criar 10 barbearias (ou pular se já existirem)
    const barbershops = []
    for (let i = 0; i < 10; i++) {
      const name = creativeNames[i]
      const address = addresses[i]
      const imageUrl = images[i]

      // Verificar se a barbearia já existe
      let barbershop = await prisma.barbershop.findFirst({
        where: { name },
      })

      if (!barbershop) {
        console.log(`🏪 Criando barbearia: ${name}`)

        // Criar barbearia
        barbershop = await prisma.barbershop.create({
          data: {
            name,
            address,
            imageUrl: imageUrl,
            phones: ["(11) 99999-9999", "(11) 99999-9999"],
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac augue ullamcorper, pharetra orci mollis, auctor tellus. Phasellus pharetra erat ac libero efficitur tempus. Donec pretium convallis iaculis. Etiam eu felis sollicitudin, cursus mi vitae, iaculis magna. Nam non erat neque. In hac habitasse platea dictumst. Pellentesque molestie accumsan tellus id laoreet.",
          },
        })

        // Criar serviços para a barbearia
        for (const service of services) {
          await prisma.barbershopService.create({
            data: {
              name: service.name,
              description: service.description,
              price: service.price,
              barbershopId: barbershop.id,
              imageUrl: service.imageUrl,
            },
          })
        }
      } else {
        console.log(`🏪 Barbearia já existe: ${name}`)
      }

      barbershops.push(barbershop)

      // Para a PRIMEIRA barbearia, definir o admin como dono
      if (i === 0) {
        const existingBarber = await prisma.barber.findUnique({
          where: { userId: adminUser.id },
        })

        if (!existingBarber) {
          await prisma.barber.create({
            data: {
              userId: adminUser.id,
              barbershopId: barbershop.id,
              role: "ADMIN",
              isActive: true,
            },
          })
          console.log(
            `✅ ${adminUser.name} definido como ADMIN da barbearia: ${name}`,
          )
        } else {
          console.log(`✅ ${adminUser.name} já é barbeiro/admin`)
        }
      }

      // Para as outras barbearias, criar barbeiros fictícios
      if (i > 0 && i < barberNames.length + 1) {
        const barberIndex = i - 1

        // Verificar se o barbeiro já existe
        let barberUser = await prisma.user.findUnique({
          where: { email: barberEmails[barberIndex] },
        })

        if (!barberUser) {
          // Criar usuário barbeiro
          barberUser = await prisma.user.create({
            data: {
              name: barberNames[barberIndex],
              email: barberEmails[barberIndex],
              image: "https://via.placeholder.com/150",
            },
          })

          // Criar barbeiro
          await prisma.barber.create({
            data: {
              userId: barberUser.id,
              barbershopId: barbershop.id,
              role: "BARBER",
              isActive: true,
            },
          })

          console.log(
            `👨‍💼 Barbeiro criado: ${barberNames[barberIndex]} na ${name}`,
          )
        }
      }
    }

    console.log("🎉 Seed concluído com sucesso!")
    console.log(`👤 Admin: ${adminUser.name} (${adminUser.email})`)
    console.log(`🏪 Admin é dono da: ${creativeNames[0]}`)
    console.log(`📊 Total de barbearias: ${barbershops.length}`)
  } catch (error) {
    console.error("❌ Erro durante o seed:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seedDatabase().catch((error) => {
  console.error(error)
  process.exit(1)
})
