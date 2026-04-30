import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./CreateEvent.css"; // Refolosim stilurile de la crearea evenimentului
import LocationPicker from "../components/LocationPicker";
import { getAddressFromCoords } from "../utils/geocoding";

const CustomDropdown = ({
  options,
  value,
  onChange,
  defaultLabel,
}: {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  defaultLabel: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="custom-select-container"
      tabIndex={0}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <div
        className={`custom-select-header ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{value || defaultLabel}</span>
        <span className="custom-select-arrow">▼</span>
      </div>

      {isOpen && (
        <ul className="custom-select-list">
          <li
            className={`custom-select-item ${value === "" ? "selected" : ""}`}
            onClick={() => {
              onChange("");
              setIsOpen(false);
            }}
          >
            {defaultLabel}
          </li>
          {options.map((opt) => (
            <li
              key={opt}
              className={`custom-select-item ${value === opt ? "selected" : ""}`}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [readableAddress, setReadableAddress] = useState("Se încarcă locația...");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    dateTime: "",
    capacity: 10,
    lat: 44.4268,
    lng: 26.1025,
    status: "Active",
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/events/${id}`);
        if (!response.ok) throw new Error("Evenimentul nu a putut fi încărcat.");
        
        const data = await response.json();
        setFormData({
          title: data.title,
          description: data.description,
          category: data.category,
          dateTime: data.dateTime,
          capacity: data.capacity,
          lat: data.lat,
          lng: data.lng,
          status: data.status || "Active",
        });

        if (data.dateTime) {
          setSelectedDate(new Date(data.dateTime));
        }

        const address = await getAddressFromCoords(data.lat, data.lng);
        setReadableAddress(address);
        setLoading(false);
      } catch (err: any) {
        alert(err.message);
        navigate("/profile");
      }
    };

    fetchEvent();
  }, [id, navigate]);

  const handleLocationChange = async (lat: number, lng: number) => {
    setFormData(prev => ({ ...prev, lat, lng }));
    const address = await getAddressFromCoords(lat, lng);
    setReadableAddress(address);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const localISO = `${year}-${month}-${day}T${hours}:${minutes}:00`;
      setFormData((prev) => ({ ...prev, dateTime: localISO }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const data = new FormData();
    data.append(
      "event",
      new Blob([JSON.stringify(formData)], { type: "application/json" })
    );

    if (selectedFiles) {
      Array.from(selectedFiles).forEach((file) => {
        data.append("files", file);
      });
    }

    try {
      const response = await fetch(`http://localhost:8080/api/events/${id}`, {
        method: "PUT",
        body: data,
      });

      if (response.ok) {
        alert("Eveniment actualizat cu succes!");
        navigate("/profile");
      } else {
        alert("Eroare la actualizarea evenimentului.");
      }
    } catch (error) {
      alert("Serverul nu răspunde.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Se încarcă detaliile evenimentului...</div>;

  return (
    <div className="create-event-page">
      <Navbar />
      <div className="create-event-container">
        <div className="create-event-card">
          <h1 className="create-title">
            Modifică <span className="highlight-word">EVENIMENTUL</span>
          </h1>
          <form onSubmit={handleSubmit} className="event-form">
            <div className="form-grid">
              <div className="form-column">
                <div className="form-group">
                  <label>Titlu eveniment</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Descriere</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Categorie</label>
                    <CustomDropdown
                      defaultLabel="Alege categoria"
                      value={formData.category}
                      onChange={(val) => setFormData((prev) => ({ ...prev, category: val }))}
                      options={["Sport", "Gaming", "Gătit", "Artă", "Muzică", "Altele"]}
                    />
                  </div>
                  <div className="form-group">
                    <label>Capacitate</label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleChange}
                      min="2"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <CustomDropdown
                    defaultLabel="Alege status"
                    value={formData.status}
                    onChange={(val) => setFormData((prev) => ({ ...prev, status: val }))}
                    options={["Active", "Finished", "Cancelled"]}
                  />
                </div>
                <div className="form-group">
                  <label>Data și ora</label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    showTimeSelect
                    timeIntervals={30}
                    dateFormat="dd/MM/yyyy HH:mm"
                    className="date-picker-input"
                    required
                  />
                </div>
              </div>
              <div className="form-column">
                <div className="form-group">
                  <label>Adaugă poze noi (opțional)</label>
                  <input type="file" multiple accept="image/*" onChange={handleFileChange} />
                </div>
                <div className="form-group">
                  <label>Modifică Locația</label>
                  <LocationPicker 
                    initialLat={formData.lat}
                    initialLng={formData.lng}
                    onLocationSelect={handleLocationChange} 
                  />
                  <div className="address-display-box">
                    <p className="address-text">{readableAddress}</p>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
              <button type="submit" className="create-btn" disabled={saving}>
                {saving ? "Se salvează..." : "Salvează modificările"}
              </button>
              <button type="button" className="create-btn" style={{ backgroundColor: "#ccc" }} onClick={() => navigate("/profile")}>
                Anulează
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
