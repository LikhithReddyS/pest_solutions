"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Search, Wrench, IndianRupee, FolderKanban } from "lucide-react";
import { ProjectForm } from "@/components/ProjectForm";

interface ProjectWithTotals {
  id: number;
  name: string;
  clientName: string;
  address: string;
  phone: string;
  email: string | null;
  status: string;
  notes: string | null;
  totalServices: number;
  totalBill: number;
  pendingBill: number;
}

interface Props {
  projects: ProjectWithTotals[];
  searchQuery: string;
  statusFilter: string;
}

export function ProjectsList({ projects, searchQuery, statusFilter }: Props) {
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const q = (fd.get("q") as string) || "";
    const status = (fd.get("status") as string) || "";
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    router.push(`/projects?${params.toString()}`);
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Projects</h1>
          <p>
            {projects.length} project{projects.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <button className="btn btn--primary" onClick={() => setShowForm(true)}>
          <Plus size={18} /> New Project
        </button>
      </div>

      {/* Search & Filter */}
      <div className="card" style={{ marginBottom: 24 }}>
        <form onSubmit={handleSearch} className="search-bar">
          <div className="search-input-wrap">
            <Search size={18} />
            <input
              name="q"
              placeholder="Search by project, client, or phone..."
              defaultValue={searchQuery}
            />
          </div>
          <select name="status" defaultValue={statusFilter}>
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="ON_HOLD">On Hold</option>
          </select>
          <button type="submit" className="btn btn--primary btn--sm">
            Search
          </button>
        </form>
      </div>

      {/* Project Cards */}
      {projects.length === 0 ? (
        <div className="empty-state">
          <FolderKanban size={48} />
          <h3>No projects found</h3>
          <p>Create your first project to get started.</p>
          <button
            className="btn btn--primary"
            onClick={() => setShowForm(true)}
          >
            <Plus size={18} /> Create Project
          </button>
        </div>
      ) : (
        <div className="project-grid">
          {projects.map((project) => (
            <Link
              href={`/projects/${project.id}`}
              key={project.id}
              className="project-card"
            >
              <div className="project-card-header">
                <h3>{project.name}</h3>
                <span
                  className={`badge badge--${project.status.toLowerCase()}`}
                >
                  {project.status.replace("_", " ")}
                </span>
              </div>
              <p className="project-client">{project.clientName}</p>
              <p className="project-phone">{project.phone}</p>
              <div className="project-card-stats">
                <div className="project-stat">
                  <Wrench size={14} />
                  <span>{project.totalServices} services</span>
                </div>
                <div className="project-stat">
                  <IndianRupee size={14} />
                  <span>₹{project.totalBill.toLocaleString("en-IN")}</span>
                </div>
              </div>
              {project.pendingBill > 0 && (
                <div className="project-pending">
                  ₹{project.pendingBill.toLocaleString("en-IN")} pending
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {showForm && <ProjectForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
