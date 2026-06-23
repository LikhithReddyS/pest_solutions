"use server";

import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createProject(formData: FormData) {
  const auth = await verifyAuth();
  if (!auth) return { error: "Unauthorized" };

  const name = formData.get("name") as string;
  const clientName = formData.get("clientName") as string;
  const address = formData.get("address") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const status = (formData.get("status") as string) || "ACTIVE";
  const notes = formData.get("notes") as string;

  if (!name || !clientName || !address || !phone) {
    return { error: "Project name, client name, address, and phone are required." };
  }

  await prisma.project.create({
    data: {
      name,
      clientName,
      address,
      phone,
      email: email || null,
      status,
      notes: notes || null,
    },
  });

  revalidatePath("/projects");
  revalidatePath("/");
  return { success: true };
}

export async function updateProject(id: number, formData: FormData) {
  const auth = await verifyAuth();
  if (!auth) return { error: "Unauthorized" };

  const name = formData.get("name") as string;
  const clientName = formData.get("clientName") as string;
  const address = formData.get("address") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const status = formData.get("status") as string;
  const notes = formData.get("notes") as string;

  if (!name || !clientName || !address || !phone) {
    return { error: "Project name, client name, address, and phone are required." };
  }

  await prisma.project.update({
    where: { id },
    data: {
      name,
      clientName,
      address,
      phone,
      email: email || null,
      status,
      notes: notes || null,
    },
  });

  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);
  revalidatePath("/");
  return { success: true };
}

export async function deleteProject(id: number) {
  const auth = await verifyAuth();
  if (!auth) return { error: "Unauthorized" };

  await prisma.project.delete({ where: { id } });

  revalidatePath("/projects");
  revalidatePath("/");
  revalidatePath("/reports");
  return { success: true };
}
