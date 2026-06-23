import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProjectDetail } from "./ProjectDetail";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const projectId = parseInt(id, 10);
  if (isNaN(projectId)) notFound();

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      services: { orderBy: { date: "desc" } },
    },
  });

  if (!project) notFound();

  // Serialize dates for the client component
  const serialized = {
    ...project,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    services: project.services.map((s) => ({
      ...s,
      date: s.date.toISOString(),
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    })),
  };

  return <ProjectDetail project={serialized} />;
}
