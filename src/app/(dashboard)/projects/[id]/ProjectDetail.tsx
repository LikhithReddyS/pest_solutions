"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Plus,
  Download,
  MapPin,
  Phone,
  Mail,
  AlertTriangle,
} from "lucide-react";
import { ProjectForm } from "@/components/ProjectForm";
import { ServiceForm } from "@/components/ServiceForm";
import { deleteProject } from "@/app/actions/projects";
import { deleteService } from "@/app/actions/services";
import { generateInvoice } from "@/lib/generateInvoice";

interface Service {
  id: number;
  projectId: number;
  date: string;
  serviceType: string;
  technician: string;
  amount: number;
  paymentStatus: string;
  invoiceNumber: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Project {
  id: number;
  name: string;
  clientName: string;
  address: string;
  phone: string;
  email: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  services: Service[];
}

interface Props {
  project: Project;
}

export function ProjectDetail({ project }: Props) {
  const router = useRouter();
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<"project" | number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");

  const totalServices = project.services.length;
  const totalBill = project.services.reduce((s, sv) => s + sv.amount, 0);
  const paidBill = project.services
    .filter((s) => s.paymentStatus === "PAID")
    .reduce((s, sv) => s + sv.amount, 0);
  const pendingBill = totalBill - paidBill;

  const filteredServices = filterStatus
    ? project.services.filter((s) => s.paymentStatus === filterStatus)
    : project.services;

  async function handleDeleteProject() {
    setDeleting(true);
    await deleteProject(project.id);
    router.push("/projects");
  }

  async function handleDeleteService(serviceId: number) {
    setDeleting(true);
    await deleteService(serviceId, project.id);
    setConfirmDelete(null);
    setDeleting(false);
  }

  function handleInvoice(service: Service) {
    generateInvoice({
      invoiceNumber: service.invoiceNumber,
      date: new Date(service.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      projectName: project.name,
      clientName: project.clientName,
      address: project.address,
      phone: project.phone,
      email: project.email || undefined,
      serviceType: service.serviceType,
      technician: service.technician,
      amount: service.amount,
      paymentStatus: service.paymentStatus,
      notes: service.notes,
    });
  }

  return (
    <div>
      {/* ── Header ── */}
      <div className="project-detail-header">
        <div className="project-info">
          <Link
            href="/projects"
            className="btn btn--ghost btn--sm"
            style={{ marginBottom: 8, marginLeft: -8 }}
          >
            <ArrowLeft size={16} /> Back to Projects
          </Link>
          <h1>{project.name}</h1>
          <span
            className={`badge badge--${project.status.toLowerCase()}`}
            style={{ marginTop: 4 }}
          >
            {project.status.replace("_", " ")}
          </span>

          <div className="project-meta">
            <span className="project-meta-item">
              <MapPin size={15} /> {project.address}
            </span>
            <span className="project-meta-item">
              <Phone size={15} /> {project.phone}
            </span>
            {project.email && (
              <span className="project-meta-item">
                <Mail size={15} /> {project.email}
              </span>
            )}
          </div>
          {project.notes && (
            <p className="text-muted" style={{ marginTop: 8 }}>
              {project.notes}
            </p>
          )}
        </div>

        <div className="btn-group">
          <button
            className="btn btn--outline btn--sm"
            onClick={() => setShowProjectForm(true)}
          >
            <Edit size={15} /> Edit
          </button>
          <button
            className="btn btn--danger btn--sm"
            onClick={() => setConfirmDelete("project")}
          >
            <Trash2 size={15} /> Delete
          </button>
        </div>
      </div>

      {/* ── Summary Stats ── */}
      <div className="detail-stats">
        <div className="detail-stat detail-stat--blue">
          <p className="stat-label">Total Services</p>
          <p className="stat-value">{totalServices}</p>
        </div>
        <div className="detail-stat detail-stat--amber">
          <p className="stat-label">Total Bill</p>
          <p className="stat-value">₹{totalBill.toLocaleString("en-IN")}</p>
        </div>
        <div className="detail-stat detail-stat--green">
          <p className="stat-label">Paid</p>
          <p className="stat-value">₹{paidBill.toLocaleString("en-IN")}</p>
        </div>
        <div className="detail-stat detail-stat--red">
          <p className="stat-label">Pending</p>
          <p className="stat-value">₹{pendingBill.toLocaleString("en-IN")}</p>
        </div>
      </div>

      {/* ── Service History ── */}
      <div className="card">
        <div className="card-header">
          <h2>Service History</h2>
          <div className="btn-group">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: "6px 10px",
                border: "1px solid var(--gray-200)",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.85rem",
              }}
            >
              <option value="">All</option>
              <option value="PAID">Paid</option>
              <option value="UNPAID">Unpaid</option>
              <option value="PARTIAL">Partial</option>
            </select>
            <button
              className="btn btn--primary btn--sm"
              onClick={() => {
                setEditingService(null);
                setShowServiceForm(true);
              }}
            >
              <Plus size={16} /> Add Service
            </button>
          </div>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Service</th>
                <th>Technician</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Invoice #</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="table-empty">
                    {filterStatus
                      ? "No services match the selected filter."
                      : "No services yet. Click \"Add Service\" to record one."}
                  </td>
                </tr>
              ) : (
                filteredServices.map((s) => (
                  <tr key={s.id}>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {new Date(s.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td>{s.serviceType}</td>
                    <td>{s.technician || "—"}</td>
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
                    <td>
                      <span className="text-muted text-sm">
                        {s.notes
                          ? s.notes.length > 30
                            ? s.notes.slice(0, 30) + "..."
                            : s.notes
                          : "—"}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn btn--ghost btn--sm"
                          title="Download Invoice"
                          onClick={() => handleInvoice(s)}
                        >
                          <Download size={15} />
                        </button>
                        <button
                          className="btn btn--ghost btn--sm"
                          title="Edit Service"
                          onClick={() => {
                            setEditingService(s);
                            setShowServiceForm(true);
                          }}
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          className="btn btn--ghost btn--sm"
                          title="Delete Service"
                          onClick={() => setConfirmDelete(s.id)}
                          style={{ color: "var(--danger-500)" }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modals ── */}
      {showProjectForm && (
        <ProjectForm
          project={project}
          onClose={() => setShowProjectForm(false)}
        />
      )}

      {showServiceForm && (
        <ServiceForm
          projectId={project.id}
          service={editingService || undefined}
          onClose={() => {
            setShowServiceForm(false);
            setEditingService(null);
          }}
        />
      )}

      {confirmDelete !== null && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-body">
              <div className="confirm-icon">
                <AlertTriangle size={28} />
              </div>
              <h3>
                {confirmDelete === "project"
                  ? "Delete Project?"
                  : "Delete Service?"}
              </h3>
              <p>
                {confirmDelete === "project"
                  ? "This will permanently delete the project and all its services. This action cannot be undone."
                  : "This will permanently delete this service record. This action cannot be undone."}
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn--outline"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn--danger"
                disabled={deleting}
                onClick={() =>
                  confirmDelete === "project"
                    ? handleDeleteProject()
                    : handleDeleteService(confirmDelete as number)
                }
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
