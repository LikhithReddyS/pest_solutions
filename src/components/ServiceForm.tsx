"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { createService, updateService } from "@/app/actions/services";

const SERVICE_TYPES = [
  "General Pest Control",
  "Snake Control",
  "Rat Control",
  "Cockroach Treatment",
  "Fogging Mosquito Control",
  "Bed Bug Treatment",
  "Fumigation",
  "Disinfestation (sanitizer spray)",
  "General desinfestations (Mosquitoes)",
  "Honey Bees",
];

interface ServiceData {
  id: number;
  date: string;
  serviceType: string;
  technician: string;
  amount: number;
  paymentStatus: string;
  notes: string | null;
}

interface ServiceFormProps {
  projectId: number;
  service?: ServiceData;
  onClose: () => void;
}

export function ServiceForm({ projectId, service, onClose }: ServiceFormProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isEdit = !!service;

  const defaultDate = service
    ? new Date(service.date).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = isEdit
      ? await updateService(service!.id, projectId, formData)
      : await createService(projectId, formData);

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
          <h2>{isEdit ? "Edit Service" : "Add Service"}</h2>
          <button onClick={onClose} className="modal-close" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert--error">{error}</div>}

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="sf-date">Date *</label>
              <input
                id="sf-date"
                name="date"
                type="date"
                defaultValue={defaultDate}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="sf-type">Service Type *</label>
              <select
                id="sf-type"
                name="serviceType"
                defaultValue={service?.serviceType || ""}
                required
              >
                <option value="">Select service type</option>
                {SERVICE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="sf-tech">Technician</label>
              <input
                id="sf-tech"
                name="technician"
                defaultValue={service?.technician || ""}
                placeholder="Technician name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="sf-amount">Amount (₹) *</label>
              <input
                id="sf-amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                defaultValue={service?.amount ?? ""}
                required
                placeholder="0.00"
              />
            </div>
            <div className="form-group">
              <label htmlFor="sf-payment">Payment Status</label>
              <select
                id="sf-payment"
                name="paymentStatus"
                defaultValue={service?.paymentStatus || "UNPAID"}
              >
                <option value="PAID">Paid</option>
                <option value="UNPAID">Unpaid</option>
                <option value="PARTIAL">Partial</option>
              </select>
            </div>
            <div className="form-group form-group--full">
              <label htmlFor="sf-notes">Notes</label>
              <textarea
                id="sf-notes"
                name="notes"
                rows={3}
                defaultValue={service?.notes || ""}
                placeholder="Service details, observations..."
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn--outline">
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={loading}>
              {loading ? "Saving..." : isEdit ? "Update Service" : "Add Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
