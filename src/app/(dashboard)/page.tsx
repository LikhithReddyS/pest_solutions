import { prisma } from "@/lib/prisma";
import {
  FolderKanban,
  Wrench,
  IndianRupee,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const projectCount = await prisma.project.count();
  const serviceCount = await prisma.service.count();
  const revenueAgg = await prisma.service.aggregate({ _sum: { amount: true } });
  const pendingAgg = await prisma.service.aggregate({
    _sum: { amount: true },
    where: { paymentStatus: { not: "PAID" } },
  });
  const recentServices = await prisma.service.findMany({
    include: { project: true },
    orderBy: { date: "desc" },
    take: 10,
  });

  const totalRevenue = revenueAgg._sum.amount || 0;
  const pendingAmount = pendingAgg._sum.amount || 0;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome to Amarnath Pest Solutions Admin</p>
        </div>
        <Link href="/projects" className="btn btn--primary btn--sm">
          <FolderKanban size={16} /> View Projects
        </Link>
      </div>

      {/* ── Stat Cards ── */}
      <div className="stats-grid">
        <div className="stat-card stat-card--blue">
          <div className="stat-icon">
            <FolderKanban size={24} />
          </div>
          <div>
            <p className="stat-label">Total Projects</p>
            <p className="stat-value">{projectCount}</p>
          </div>
        </div>
        <div className="stat-card stat-card--green">
          <div className="stat-icon">
            <Wrench size={24} />
          </div>
          <div>
            <p className="stat-label">Total Services</p>
            <p className="stat-value">{serviceCount}</p>
          </div>
        </div>
        <div className="stat-card stat-card--amber">
          <div className="stat-icon">
            <IndianRupee size={24} />
          </div>
          <div>
            <p className="stat-label">Total Revenue</p>
            <p className="stat-value">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
        <div className="stat-card stat-card--red">
          <div className="stat-icon">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="stat-label">Pending Payments</p>
            <p className="stat-value">
              ₹{pendingAmount.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>

      {/* ── Recent Services ── */}
      <div className="card">
        <div className="card-header">
          <h2>Recent Services</h2>
          <Link href="/reports" className="btn btn--sm btn--outline">
            View Reports
          </Link>
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
              {recentServices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="table-empty">
                    No services recorded yet. Start by creating a project.
                  </td>
                </tr>
              ) : (
                recentServices.map((s) => (
                  <tr key={s.id}>
                    <td>
                      {new Date(s.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      <Link
                        href={`/projects/${s.projectId}`}
                        className="link"
                      >
                        {s.project.name}
                      </Link>
                    </td>
                    <td>{s.serviceType}</td>
                    <td style={{ fontWeight: 600 }}>
                      ₹{s.amount.toLocaleString("en-IN")}
                    </td>
                    <td>
                      <span
                        className={`badge badge--${s.paymentStatus.toLowerCase()}`}
                      >
                        {s.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <span className="text-mono text-muted">
                        {s.invoiceNumber}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
