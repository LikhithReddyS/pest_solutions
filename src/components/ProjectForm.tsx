"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { createProject, updateProject } from "@/app/actions/projects";

interface ProjectData {
  id: number;
  name: string;
  clientName: string;
  address: string;
  phone: string;
  email: string | null;
  status: string;
  notes: string | null;
}

interface ProjectFormProps {
  project?: ProjectData;
  onClose: () => void;
}

export function ProjectForm({ project, onClose }: ProjectFormProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isEdit = !!project;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = isEdit
      ? await updateProject(project!.id, formData)
      : await createProject(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      onClose();
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? "Edit Project" : "New Project"}</h2>
          <button onClick={onClose} className="modal-close" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert--error">{error}</div>}

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="pf-name">Project / Site Name *</label>
              <input
                id="pf-name"
                name="name"
                defaultValue={project?.name}
                required
                placeholder="e.g. Sunrise Apartments"
              />
            </div>
            <div className="form-group">
              <label htmlFor="pf-client">Client Name *</label>
              <input
                id="pf-client"
                name="clientName"
                defaultValue={project?.clientName}
                required
                placeholder="e.g. Rajesh Kumar"
              />
            </div>
            <div className="form-group form-group--full">
              <label htmlFor="pf-address">Address *</label>
              <input
                id="pf-address"
                name="address"
                defaultValue={project?.address}
                required
                placeholder="Full address"
              />
            </div>
            <div className="form-group">
              <label htmlFor="pf-phone">Phone *</label>
              <input
                id="pf-phone"
                name="phone"
                defaultValue={project?.phone}
                required
                placeholder="10-digit number"
              />
            </div>
            <div className="form-group">
              <label htmlFor="pf-email">Email</label>
              <input
                id="pf-email"
                name="email"
                type="email"
                defaultValue={project?.email || ""}
                placeholder="Optional"
              />
            </div>
            <div className="form-group">
              <label htmlFor="pf-status">Status</label>
              <select
                id="pf-status"
                name="status"
                defaultValue={project?.status || "ACTIVE"}
              >
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="ON_HOLD">On Hold</option>
              </select>
            </div>
            <div className="form-group form-group--full">
              <label htmlFor="pf-notes">Notes</label>
              <textarea
                id="pf-notes"
                name="notes"
                rows={3}
                defaultValue={project?.notes || ""}
                placeholder="Any additional details..."
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn--outline">
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={loading}>
              {loading ? "Saving..." : isEdit ? "Update Project" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
