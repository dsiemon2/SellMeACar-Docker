import { PrismaClient } from '@prisma/client';

const p = new PrismaClient();

async function main() {
  console.log('Sessions:', await p.salesSession.count());
  console.log('GlobalAnalytics:', await p.globalAnalytics.count());
  console.log('KnowledgeDoc:', await p.knowledgeDoc.count());
  console.log('SessionAnalytics:', await p.sessionAnalytics.count());
  console.log('Message:', await p.message.count());
  console.log('Vehicle:', await p.vehicle.count());
}

main()
  .catch(e => console.error(e))
  .finally(() => p.$disconnect());
