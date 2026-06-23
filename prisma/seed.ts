import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...\n");

  // ── Admin user ──
  const hashedPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: hashedPassword,
      name: "Admin",
    },
  });
  console.log(`✅ Admin user created (username: admin, password: admin123)`);

  // ── Sample Projects ──
  const p1 = await prisma.project.create({
    data: {
      name: "Sunrise Apartments",
      clientName: "Rajesh Kumar",
      address: "42, MG Road, Bangalore 560001",
      phone: "9876543210",
      email: "rajesh@email.com",
      status: "ACTIVE",
      notes: "Monthly pest control contract — 12 units",
    },
  });

  const p2 = await prisma.project.create({
    data: {
      name: "Green Valley Villa",
      clientName: "Priya Sharma",
      address: "15, Lake View Road, Mysore 570001",
      phone: "9988776655",
      email: "priya.sharma@email.com",
      status: "ACTIVE",
      notes: "Quarterly termite treatment",
    },
  });

  const p3 = await prisma.project.create({
    data: {
      name: "Royal Food Court",
      clientName: "Mohammed Ali",
      address: "88, Commercial Street, Bangalore 560025",
      phone: "8877665544",
      status: "COMPLETED",
      notes: "One-time fumigation completed",
    },
  });

  const p4 = await prisma.project.create({
    data: {
      name: "Tech Park Towers",
      clientName: "Suresh Reddy",
      address: "Whitefield Main Road, Bangalore 560066",
      phone: "7766554433",
      email: "suresh@techpark.com",
      status: "ACTIVE",
      notes: "Annual maintenance contract for office complex",
    },
  });

  const p5 = await prisma.project.create({
    data: {
      name: "Lakshmi Residency",
      clientName: "Anita Desai",
      address: "23, JP Nagar, Bangalore 560078",
      phone: "9654321098",
      status: "ON_HOLD",
      notes: "On hold — tenant relocation in progress",
    },
  });

  console.log(`✅ Created ${5} sample projects`);

  // ── Sample Services ──
  const services = [
    // Sunrise Apartments
    { projectId: p1.id, date: new Date("2026-01-15"), serviceType: "General Pest Control", technician: "Ramesh", amount: 3500, paymentStatus: "PAID", invoiceNumber: "APS-2026-0001", notes: "Full apartment spray — all 12 units" },
    { projectId: p1.id, date: new Date("2026-02-15"), serviceType: "Cockroach Treatment", technician: "Ramesh", amount: 2500, paymentStatus: "PAID", invoiceNumber: "APS-2026-0002", notes: "Kitchen and bathroom treatment" },
    { projectId: p1.id, date: new Date("2026-03-15"), serviceType: "General Pest Control", technician: "Sunil", amount: 3500, paymentStatus: "PAID", invoiceNumber: "APS-2026-0003", notes: "Monthly maintenance spray" },
    { projectId: p1.id, date: new Date("2026-04-15"), serviceType: "Rodent Control", technician: "Ramesh", amount: 4000, paymentStatus: "UNPAID", invoiceNumber: "APS-2026-0004", notes: "Rat bait stations installed in basement" },
    { projectId: p1.id, date: new Date("2026-05-15"), serviceType: "General Pest Control", technician: "Sunil", amount: 3500, paymentStatus: "UNPAID", invoiceNumber: "APS-2026-0005", notes: "Monthly spray" },
    { projectId: p1.id, date: new Date("2026-06-15"), serviceType: "Mosquito Control", technician: "Ramesh", amount: 3000, paymentStatus: "UNPAID", invoiceNumber: "APS-2026-0006", notes: "Fogging in common areas" },

    // Green Valley Villa
    { projectId: p2.id, date: new Date("2026-01-10"), serviceType: "Termite Treatment", technician: "Vikram", amount: 8000, paymentStatus: "PAID", invoiceNumber: "APS-2026-0007", notes: "Pre-construction anti-termite treatment" },
    { projectId: p2.id, date: new Date("2026-04-10"), serviceType: "Termite Treatment", technician: "Vikram", amount: 6000, paymentStatus: "PAID", invoiceNumber: "APS-2026-0008", notes: "Quarterly follow-up treatment" },
    { projectId: p2.id, date: new Date("2026-06-20"), serviceType: "Inspection", technician: "Vikram", amount: 1500, paymentStatus: "PARTIAL", invoiceNumber: "APS-2026-0009", notes: "Routine inspection — no active infestation found" },

    // Royal Food Court
    { projectId: p3.id, date: new Date("2026-02-05"), serviceType: "Fumigation", technician: "Ramesh", amount: 15000, paymentStatus: "PAID", invoiceNumber: "APS-2026-0010", notes: "Complete fumigation of kitchen and storage" },
    { projectId: p3.id, date: new Date("2026-02-20"), serviceType: "Cockroach Treatment", technician: "Sunil", amount: 5000, paymentStatus: "PAID", invoiceNumber: "APS-2026-0011", notes: "Follow-up gel treatment" },

    // Tech Park Towers
    { projectId: p4.id, date: new Date("2026-01-20"), serviceType: "General Pest Control", technician: "Sunil", amount: 12000, paymentStatus: "PAID", invoiceNumber: "APS-2026-0012", notes: "Floors 1-5 complete treatment" },
    { projectId: p4.id, date: new Date("2026-03-20"), serviceType: "General Pest Control", technician: "Sunil", amount: 12000, paymentStatus: "PAID", invoiceNumber: "APS-2026-0013", notes: "Quarterly treatment — all floors" },
    { projectId: p4.id, date: new Date("2026-05-20"), serviceType: "Rodent Control", technician: "Ramesh", amount: 8000, paymentStatus: "UNPAID", invoiceNumber: "APS-2026-0014", notes: "Basement and parking area" },
    { projectId: p4.id, date: new Date("2026-06-20"), serviceType: "Bed Bug Treatment", technician: "Vikram", amount: 6000, paymentStatus: "UNPAID", invoiceNumber: "APS-2026-0015", notes: "Guest room on floor 3" },
  ];

  for (const s of services) {
    await prisma.service.create({ data: s });
  }

  console.log(`✅ Created ${services.length} sample services\n`);
  console.log("🎉 Database seeded successfully!");
  console.log("   Login with:  admin / admin123\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
