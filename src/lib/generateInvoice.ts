import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  projectName: string;
  clientName: string;
  address: string;
  phone: string;
  email?: string;
  serviceType: string;
  technician: string;
  amount: number;
  paymentStatus: string;
  notes: string | null;
}

export function generateInvoice(data: InvoiceData) {
  const doc = new jsPDF();
  const pw = doc.internal.pageSize.getWidth();

  /* ── Header bar ── */
  doc.setFillColor(10, 22, 40);
  doc.rect(0, 0, pw, 48, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Amarnath Pest Solutions", 20, 20);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Professional Pest Control Services", 20, 30);
  doc.setFontSize(9);
  doc.text("Trusted  •  Reliable  •  Effective", 20, 38);

  // Invoice label
  doc.setTextColor(245, 158, 11);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", pw - 20, 22, { align: "right" });
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(data.invoiceNumber, pw - 20, 32, { align: "right" });

  /* ── Accent line ── */
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(2);
  doc.line(20, 54, pw - 20, 54);

  /* ── Bill To / Invoice Info ── */
  let y = 66;
  doc.setTextColor(130, 130, 130);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("BILL TO", 20, y);
  doc.text("INVOICE DETAILS", pw / 2 + 10, y);

  y += 10;
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(data.clientName, 20, y);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Invoice No:  ${data.invoiceNumber}`, pw / 2 + 10, y);

  y += 7;
  doc.setFontSize(10);
  // wrap long addresses
  const addressLines = doc.splitTextToSize(data.address, pw / 2 - 40);
  doc.text(addressLines, 20, y);
  doc.text(`Date:  ${data.date}`, pw / 2 + 10, y);

  y += 7;
  doc.text(`Phone: ${data.phone}`, 20, y);
  doc.text(`Project:  ${data.projectName}`, pw / 2 + 10, y);

  if (data.email) {
    y += 7;
    doc.text(`Email: ${data.email}`, 20, y);
  }

  y += 7;
  doc.text(
    `Payment Status:  ${data.paymentStatus}`,
    pw / 2 + 10,
    y
  );

  /* ── Service table ── */
  y += 16;
  autoTable(doc, {
    startY: y,
    head: [["#", "Service Description", "Technician", "Amount (₹)"]],
    body: [
      [
        "1",
        data.serviceType,
        data.technician || "—",
        `₹ ${data.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
      ],
    ],
    foot: [
      [
        "",
        "",
        "Total",
        `₹ ${data.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
      ],
    ],
    theme: "grid",
    headStyles: {
      fillColor: [10, 22, 40],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 10,
    },
    footStyles: {
      fillColor: [245, 245, 245],
      textColor: [10, 22, 40],
      fontStyle: "bold",
      fontSize: 11,
    },
    bodyStyles: { fontSize: 10 },
    styles: { cellPadding: 8 },
    columnStyles: {
      0: { cellWidth: 15, halign: "center" },
      3: { halign: "right", cellWidth: 45 },
    },
    margin: { left: 20, right: 20 },
  });

  /* ── Notes ── */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const finalY = (doc as any).lastAutoTable.finalY + 16;
  if (data.notes) {
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(130, 130, 130);
    doc.text("NOTES", 20, finalY);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    const noteLines = doc.splitTextToSize(data.notes, pw - 40);
    doc.text(noteLines, 20, finalY + 8);
  }

  /* ── Footer ── */
  const footerY = doc.internal.pageSize.getHeight() - 28;
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.line(20, footerY, pw - 20, footerY);

  doc.setFontSize(9);
  doc.setTextColor(130, 130, 130);
  doc.setFont("helvetica", "normal");
  doc.text("Thank you for choosing Amarnath Pest Solutions!", pw / 2, footerY + 10, {
    align: "center",
  });
  doc.text(
    "For queries contact us  •  Professional Pest Control Services",
    pw / 2,
    footerY + 18,
    { align: "center" }
  );

  doc.save(`Invoice-${data.invoiceNumber}.pdf`);
}
