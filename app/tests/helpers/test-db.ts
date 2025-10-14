import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: 'file:./test.db',
});

export async function setupTestDatabase() {
  // Clean existing data
  await prisma.escapeRoomOutput.deleteMany();
  await prisma.user.deleteMany();
}

export async function teardownTestDatabase() {
  await prisma.$disconnect();
}

export async function createTestEscapeRoomOutput() {
  return await prisma.escapeRoomOutput.create({
    data: {
      title: 'Test Escape Room',
      htmlContent: 'Test Content',
      timeSpent: 300,
      stagesCompleted: 3,
    },
  });
}

export { prisma };