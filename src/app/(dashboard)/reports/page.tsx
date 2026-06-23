import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CalendarDays, AlertCircle, FolderKanban } from "lucide-react";

export const dynamic = "force-dynamic";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default async function ReportsPage() {
  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(currentYear, 0, 1);
  const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);

  const [yearServices, pendingServices, projects] = await Promise.all([
    prisma.service.findMany({
      where: { date: { gte: startOfYear, lte: endOfYear } },
      orderBy: { date: "desc" },
    }),
    prisma.service.findMany({
      where: { paymentStatus: { not: "PAID" } },
      include: { project: true },
      orderBy: { date: "desc" },
    }),
    prisma.project.findMany({
      include: { services: { select: { amount: true, paymentStatus: true } } },
      orderBy: { name: "asc" },
    }),
  ]);

  // Monthly revenue breakdown
  const monthly = MONTH_NAMES.map((name) => ({
    name,
    revenue: 0,
    count: 0,
    paid: 0,
    pending: 0,
  }));

  let maxRevenue = 0;
  yearServices.forEach((s) => {
    const m = new Date(s.date).getMonth();
    monthly[m].revenue += s.amount;
    monthly[m].count += 1;
    if (s.paymentStatus === "PAID") monthly[m].paid += s.amount;
    else monthly[m].pending += s.amount;
    if (monthly[m].revenue > maxRevenue) maxRevenue = monthly[m].revenue;
  });

  const yearTotal = monthly.reduce((s, m) => s + m.revenue, 0);

  // Project-wise summary
  const projectSummary = projects.map((p) => ({
    id: p.id,
    name: p.name,
    status: p.status,
    totalServices: p.services.length,
    totalBill: p.services.reduce((s, sv) => s + sv.amount, 0),
    paid: p.services
      .filter((sv) => sv.paymentStatus === "PAID")
      .reduce((s, sv) => s + sv.amount, 0),
    pending: p.services
      .filter((sv) => sv.paymentStatus !== "PAID")
      .reduce((s, sv) => s + sv.amount, 0),
  }));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Reports</h1>
          <p>Financial overview &amp; analytics</p>
        </div>
      </div>

      <div className="reports-grid">
        {/* ── Monthly Revenue ── */}
        <div className="report-section">
          <div className="report-section-header">
            <h2>
              <CalendarDays
                size={18}
                style={{ marginRight: 8, verticalAlign: "text-bottom" }}
              />
              Monthly Revenue — {currentYear}
            </h2>
            <span style={{ fontWeight: 700, color: "var(--accent-600)" }}>
              Total: ₹{yearTotal.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Services</th>
                  <th>Revenue</th>
                  <th>Paid</th>
                  <th>Pending</th>
                  <th style={{ width: "25%" }}>Progress</th>
                </tr>
              </thead>
              <tbody>
                {monthly.map((m) => (
                  <tr key={m.name}>
                    <td style={{ fontWeight: 500 }}>{m.name}</td>
                    <td>{m.count}</td>
                    <td style={{ fontWeight: 600 }}>
                      ₹{m.revenue.toLocaleString("en-IN")}
                    </td>
                    <td style={{ color: "var(--success-500)" }}>
                      ₹{m.paid.toLocaleString("en-IN")}
                    </td>
                    <td style={{ color: "var(--danger-500)" }}>
                      ₹{m.pending.toLocaleString("en-IN")}
                    </td>
                    <td>
                      <div className="revenue-bar">
                        <div
                          className="revenue-bar-fill"
                          style={{
                            width: maxRevenue > 0
                              ? `${(m.revenue / maxRevenue) * 100}%`
                              : "0%",
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Pending Payments ── */}
        <div className="report-section">
          <div className="report-section-header">
            <h2>
              <AlertCircle
                size={18}
                style={{ marginRight: 8, verticalAlign: "text-bottom", color: "var(--danger-500)" }}
              />
              Pending Payments
            </h2>
            <span className="badge badge--unpaid">
              {pendingServices.length} pending
            </span>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Project</th>
                  <th>Service</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Invoice #</th>
                </tr>
              </thead>
              <tbody>
                {pendingServices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="table-empty">
                      No pending payments 🎉
                    </td>
                  </tr>
                ) : (
                  pendingServices.map((s) => (
                    <tr key={s.id}>
                      <td style={{ whiteSpace: "nowrap" }}>
                        {new Date(s.date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td>
                        <Link href={`/projects/${s.projectId}`} className="link">
                          {s.project.name}
                        </Link>
                      </td>
                      <td>{s.serviceType}</td>
                      <td style={{ fontWeight: 600 }}>
                        ₹{s.amount.toLocaleString("en-IN")}
                      </td>
                      <td>
                        <span className={`badge badge--${s.paymentStatus.toLowerCase()}`}>
                          {s.paymentStatus}
                        </span>
                      </td>
                      <td className="text-mono text-muted">{s.invoiceNumber}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Project-wise Summary ── */}
        <div className="report-section">
          <div className="report-section-header">
            <h2>
              <FolderKanban
                size={18}
                style={{ marginRight: 8, verticalAlign: "text-bottom" }}
              />
              Project-wise Summary
            </h2>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Status</th>
                  <th>Services</th>
                  <th>Total Bill</th>
                  <th>Paid</th>
                  <th>Pending</th>
                </tr>
              </thead>
              <tbody>
                {projectSummary.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="table-empty">
                      No projects yet.
                    </td>
                  </tr>
                ) : (
                  projectSummary.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <Link href={`/projects/${p.id}`} className="link" style={{ fontWeight: 500 }}>
                          {p.name}
                        </Link>
                      </td>
                      <td>
                        <span className={`badge badge--${p.status.toLowerCase()}`}>
                          {p.status.replace("_", " ")}
                        </span>
                      </td>
                      <td>{p.totalServices}</td>
                      <td style={{ fontWeight: 600 }}>
                        ₹{p.totalBill.toLocaleString("en-IN")}
                      </td>
                      <td style={{ color: "var(--success-500)" }}>
                        ₹{p.paid.toLocaleString("en-IN")}
                      </td>
                      <td style={{ color: "var(--danger-500)" }}>
                        ₹{p.pending.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
