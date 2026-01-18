import { PrismaClient } from '@prisma/client';
const p = new PrismaClient({ datasources: { db: { url: 'file:./check.db' } } });

(async () => {
  console.log('Sessions:', await p.salesSession.count());
  console.log('GlobalAnalytics:', await p.globalAnalytics.count());
  console.log('KnowledgeDoc:', await p.knowledgeDoc.count());
  console.log('SessionAnalytics:', await p.sessionAnalytics.count());
  console.log('Message:', await p.message.count());
  await p.$disconnect();
})();
