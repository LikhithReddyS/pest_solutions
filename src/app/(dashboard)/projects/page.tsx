import { prisma } from "@/lib/prisma";
import { ProjectsList } from "./ProjectsList";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ q?: string; status?: string }>;
}

export default async function ProjectsPage({ searchParams }: Props) {
  const params = await searchParams;
  const q = params.q || "";
  const status = params.status || "";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { clientName: { contains: q } },
      { phone: { contains: q } },
    ];
  }
  if (status) {
    where.status = status;
  }

  const projects = await prisma.project.findMany({
    where,
    include: {
      services: { select: { amount: true, paymentStatus: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  const serialized = projects.map((p) => ({
    id: p.id,
    name: p.name,
    clientName: p.clientName,
    address: p.address,
    phone: p.phone,
    email: p.email,
    status: p.status,
    notes: p.notes,
    totalServices: p.services.length,
    totalBill: p.services.reduce((sum, s) => sum + s.amount, 0),
    pendingBill: p.services
      .filter((s) => s.paymentStatus !== "PAID")
      .reduce((sum, s) => sum + s.amount, 0),
  }));

  return <ProjectsList projects={serialized} searchQuery={q} statusFilter={status} />;
}
