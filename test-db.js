const { PrismaClient } = require('@prisma/client'); const p = new PrismaClient(); p.service.count().then(c => console.log('Services:', c)).catch(e => console.error(e)).finally(() => p.$disconnect());
