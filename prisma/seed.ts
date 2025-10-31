const { PrismaClient, ClientCategory } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  // First, delete existing clients
  await prisma.client.deleteMany({});

  const standardClients = [
    {
      images: ['assets/clients/standard/model1-1.jpg', 'assets/clients/standard/model1-2.jpg'],
      earnings: 25000,
      serviceType: 'Short Time',
      category: 'STANDARD'
    },
    {
      images: ['assets/clients/standard/model2-1.jpg', 'assets/clients/standard/model2-2.jpg'],
      earnings: 28000,
      serviceType: 'Full Night',
      category: 'STANDARD'
    },
    {
      images: ['assets/clients/standard/model3-1.jpg', 'assets/clients/standard/model3-2.jpg'],
      earnings: 30000,
      serviceType: 'Short Time',
      category: 'STANDARD'
    },
    {
      images: ['assets/clients/standard/model4-1.jpg', 'assets/clients/standard/model4-2.jpg'],
      earnings: 27000,
      serviceType: 'Full Night',
      category: 'STANDARD'
    },
    {
      images: ['assets/clients/standard/model5-1.jpg', 'assets/clients/standard/model5-2.jpg'],
      earnings: 32000,
      serviceType: 'Short Time',
      category: 'STANDARD'
    }
  ];

  const premiumClients = [
    {
      images: ['assets/clients/premium/model1-1.jpg', 'assets/clients/premium/model1-2.jpg', 'assets/clients/premium/model1-3.jpg'],
      earnings: 45000,
      serviceType: 'Full Night',
      category: 'PREMIUM'
    },
    {
      images: ['assets/clients/premium/model2-1.jpg', 'assets/clients/premium/model2-2.jpg', 'assets/clients/premium/model2-3.jpg'],
      earnings: 50000,
      serviceType: 'Full Night',
      category: 'PREMIUM'
    },
    {
      images: ['assets/clients/premium/model3-1.jpg', 'assets/clients/premium/model3-2.jpg', 'assets/clients/premium/model3-3.jpg'],
      earnings: 48000,
      serviceType: 'Short Time',
      category: 'PREMIUM'
    },
    {
      images: ['assets/clients/premium/model4-1.jpg', 'assets/clients/premium/model4-2.jpg', 'assets/clients/premium/model4-3.jpg'],
      earnings: 55000,
      serviceType: 'Full Night',
      category: 'PREMIUM'
    },
    {
      images: ['assets/clients/premium/model5-1.jpg', 'assets/clients/premium/model5-2.jpg', 'assets/clients/premium/model5-3.jpg'],
      earnings: 52000,
      serviceType: 'Short Time',
      category: 'PREMIUM'
    }
  ];

  for (const client of [...standardClients, ...premiumClients]) {
    await prisma.client.create({
      data: client
    });
  }

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });