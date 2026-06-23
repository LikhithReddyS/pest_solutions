"use server";

import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * Generates the next sequential invoice number in format APS-YYYY-NNNN.
 */
async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `APS-${year}-`;

  const lastService = await prisma.service.findFirst({
    where: { invoiceNumber: { startsWith: prefix } },
    orderBy: { invoiceNumber: "desc" },
  });

  let nextNum = 1;
  if (lastService) {
    const parts = lastService.invoiceNumber.split("-");
    const lastNum = parseInt(parts[2], 10);
    if (!isNaN(lastNum)) nextNum = lastNum + 1;
  }

  return `${prefix}${nextNum.toString().padStart(4, "0")}`;
}

export async function createService(projectId: number, formData: FormData) {
  const auth = await verifyAuth();
  if (!auth) return { error: "Unauthorized" };

  const date = formData.get("date") as string;
  const serviceType = formData.get("serviceType") as string;
  const technician = formData.get("technician") as string;
  const amountStr = formData.get("amount") as string;
  const paymentStatus = (formData.get("paymentStatus") as string) || "UNPAID";
  const notes = formData.get("notes") as string;

  const amount = parseFloat(amountStr);
  if (!date || !serviceType || isNaN(amount) || amount < 0) {
    return { error: "Date, service type, and a valid amount are required." };
  }

  const invoiceNumber = await generateInvoiceNumber();

  await prisma.service.create({
    data: {
      projectId,
      date: new Date(date),
      serviceType,
      technician: technician || "",
      amount,
      paymentStatus,
      invoiceNumber,
      notes: notes || null,
    },
  });

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/projects");
  revalidatePath("/");
  revalidatePath("/reports");
  return { success: true };
}

export async function updateService(
  id: number,
  projectId: number,
  formData: FormData
) {
  const auth = await verifyAuth();
  if (!auth) return { error: "Unauthorized" };

  const date = formData.get("date") as string;
  const serviceType = formData.get("serviceType") as string;
  const technician = formData.get("technician") as string;
  const amountStr = formData.get("amount") as string;
  const paymentStatus = formData.get("paymentStatus") as string;
  const notes = formData.get("notes") as string;

  const amount = parseFloat(amountStr);
  if (!date || !serviceType || isNaN(amount) || amount < 0) {
    return { error: "Date, service type, and a valid amount are required." };
  }

  await prisma.service.update({
    where: { id },
    data: {
      date: new Date(date),
      serviceType,
      technician: technician || "",
      amount,
      paymentStatus,
      notes: notes || null,
    },
  });

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/projects");
  revalidatePath("/");
  revalidatePath("/reports");
  return { success: true };
}

export async function deleteService(id: number, projectId: number) {
  const auth = await verifyAuth();
  if (!auth) return { error: "Unauthorized" };

  await prisma.service.delete({ where: { id } });

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/projects");
  revalidatePath("/");
  revalidatePath("/reports");
  return { success: true };
}
