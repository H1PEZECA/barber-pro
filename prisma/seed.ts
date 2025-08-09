import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function seedDatabase() {
  try {
    // Limpar dados existentes (opcional - descomente se quiser resetar)
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

    // Criar/buscar o usuário administrador
    const adminUserId = "cmdx6rwbp000197h8uvtixmrd"
    let adminUser = await prisma.user.findUnique({
      where: { id: adminUserId },
    })

    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          id: adminUserId,
          name: "Admin User",
          email: "admin@example.com", // Substitua pelo seu email do Google
          image: "https://via.placeholder.com/150",
        },
      })
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
      "Felipe Mendes",
    ]

    const barberEmails = [
      "carlos@barbershop.com",
      "joao@barbershop.com",
      "pedro@barbershop.com",
      "rafael@barbershop.com",
      "lucas@barbershop.com",
      "bruno@barbershop.com",
      "daniel@barbershop.com",
      "marcos@barbershop.com",
      "andre@barbershop.com",
      "felipe@barbershop.com",
    ]

    // Criar 10 barbearias
    for (let i = 0; i < 10; i++) {
      const name = creativeNames[i]
      const address = addresses[i]
      const imageUrl = images[i]

      // Criar barbearia
      const barbershop = await prisma.barbershop.create({
        data: {
          name,
          address,
          imageUrl: imageUrl,
          phones: ["(11) 99999-9999", "(11) 99999-9999"],
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac augue ullamcorper, pharetra orci mollis, auctor tellus.",
        },
      })

      // Para a primeira barbearia, o admin será o dono (ADMIN)
      if (i === 0) {
        await prisma.barber.create({
          data: {
            userId: adminUser.id,
            barbershopId: barbershop.id,
            role: "ADMIN",
            isActive: true,
          },
        })
        console.log(
          `✅ Usuário admin configurado como dono da barbearia: ${name}`,
        )
      }

      // Criar um barbeiro fictício para cada barbearia (exceto a primeira que já tem o admin)
      if (i > 0) {
        // Criar usuário barbeiro
        const barberUser = await prisma.user.create({
          data: {
            name: barberNames[i],
            email: barberEmails[i],
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
      }

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

      console.log(`✅ Barbearia criada: ${name}`)
    }

    console.log("🎉 Database seeded successfully!")
    console.log(`👤 Admin user ID: ${adminUser.id}`)
    console.log(`🏪 Admin é dono da barbearia: ${creativeNames[0]}`)
  } catch (error) {
    console.error("❌ Erro ao criar as barbearias:", error)
  } finally {
    await prisma.$disconnect()
  }
}

seedDatabase()
