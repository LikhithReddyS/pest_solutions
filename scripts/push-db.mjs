import { execSync } from 'child_process';

if (!process.env.DIRECT_URL) {
  console.log('Skipping db push, DIRECT_URL not found');
  process.exit(0);
}

execSync('npx prisma db push --accept-data-loss', {
  env: { ...process.env, DATABASE_URL: process.env.DIRECT_URL },
  stdio: 'inherit'
});

console.log('Running database seed...');
try {
  execSync('npx tsx prisma/seed.ts', {
    env: process.env,
    stdio: 'inherit'
  });
} catch (e) {
  console.log('Seed failed (likely because data already exists), ignoring error.');
}
