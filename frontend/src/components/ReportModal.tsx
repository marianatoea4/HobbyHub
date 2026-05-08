import { useState } from "react";
import "./ReportModal.css";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportType: "USER" | "MESSAGE" | "EVENT";
  targetId: number;
  targetLabel: string; // ce apare in titlu, ex: "utilizatorul Andrei" sau "evenimentul Meci Fotbal"
  reporterId: number;
}

const REASONS: Record<string, string[]> = {
  USER: [
    "Comportament inadecvat",
    "Hărțuire",
    "Spam",
    "Cont fals",
    "Altele",
  ],
  MESSAGE: [
    "Mesaj ofensiv",
    "Hărțuire",
    "Spam",
    "Amenințări",
    "Altele",
  ],
  EVENT: [
    "Informații false",
    "Conținut inadecvat",
    "Fraudă / Înșelătorie",
    "Eveniment periculos",
    "Altele",
  ],
};

export default function ReportModal({
  isOpen,
  onClose,
  reportType,
  targetId,
  targetLabel,
  reporterId,
}: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<"success" | "error" | "duplicate" | null>(null);

  if (!isOpen) return null;

  const reasons = REASONS[reportType] || [];

  const handleSubmit = async () => {
    if (!selectedReason) return;

    setIsSubmitting(true);
    setSubmitResult(null);

    const payload: any = {
      reporterId,
      reportType,
      reason: selectedReason,
      description: description.trim() || null,
    };

    if (reportType === "USER") payload.reportedUserId = targetId;
    if (reportType === "MESSAGE") payload.reportedMessageId = targetId;
    if (reportType === "EVENT") payload.reportedEventId = targetId;

    try {
      const response = await fetch("http://localhost:8080/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSubmitResult("success");
      } else {
        const data = await response.json();
        if (data.error && data.error.includes("ALREADY_REPORTED")) {
          setSubmitResult("duplicate");
        } else {
          setSubmitResult("error");
        }
      }
    } catch {
      setSubmitResult("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedReason("");
    setDescription("");
    setSubmitResult(null);
    onClose();
  };

  const typeLabel =
    reportType === "USER"
      ? "utilizatorul"
      : reportType === "MESSAGE"
      ? "mesajul"
      : "evenimentul";

  return (
    <div className="report-modal-overlay" onClick={handleClose}>
      <div className="report-modal" onClick={(e) => e.stopPropagation()}>
        {/* Rezultat dupa trimitere */}
        {submitResult ? (
          <div className="report-result">
            {submitResult === "success" && (
              <>
                <div className="report-result-icon success">✓</div>
                <h3>Raportare trimisă!</h3>
                <p>Mulțumim pentru raportare. Vom analiza situația în cel mai scurt timp.</p>
              </>
            )}
            {submitResult === "duplicate" && (
              <>
                <div className="report-result-icon duplicate">!</div>
                <h3>Deja raportat</h3>
                <p>Ai raportat deja acest {typeLabel}. Raportarea ta este în curs de analiză.</p>
              </>
            )}
            {submitResult === "error" && (
              <>
                <div className="report-result-icon error">✕</div>
                <h3>Eroare</h3>
                <p>A apărut o eroare. Te rugăm să încerci din nou.</p>
              </>
            )}
            <button className="report-btn-close" onClick={handleClose}>
              Închide
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="report-header">
              <h3>Raportează {typeLabel}</h3>
              <p className="report-target-label">{targetLabel}</p>
              <button className="report-close-x" onClick={handleClose}>
                ✕
              </button>
            </div>

            {/* Motiv */}
            <div className="report-body">
              <label className="report-label">Selectează motivul:</label>
              <div className="report-reasons">
                {reasons.map((reason) => (
                  <label
                    key={reason}
                    className={`report-reason-option ${
                      selectedReason === reason ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="report-reason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={(e) => setSelectedReason(e.target.value)}
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>

              {/* Descriere optionala */}
              <label className="report-label">
                Detalii suplimentare (opțional):
              </label>
              <textarea
                className="report-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrie situația mai detaliat..."
                rows={3}
                maxLength={500}
              />
              <div className="report-char-count">
                {description.length}/500
              </div>
            </div>

            {/* Butoane */}
            <div className="report-footer">
              <button
                className="report-btn-submit"
                onClick={handleSubmit}
                disabled={!selectedReason || isSubmitting}
              >
                {isSubmitting ? "Se trimite..." : "Trimite raportarea"}
              </button>
              <button className="report-btn-cancel" onClick={handleClose}>
                Anulează
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
