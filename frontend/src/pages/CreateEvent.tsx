import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./CreateEvent.css";
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

export default function CreateEvent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [readableAddress, setReadableAddress] = useState("Se încarcă locația...");

  // state-uri pentru datele text
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "", // nicio categorie selectata by default
    dateTime: "",
    capacity: 10,
    lat: 44.4268, // placeholder coordonate (Bucuresti)
    lng: 26.1025,
    status: "Active",
  });

  // state pentru data si ora
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // state pentru poze
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const handleLocationChange = async (lat: number, lng: number) => {
        setFormData(prev => ({ ...prev, lat, lng }));

        const address = await getAddressFromCoords(lat, lng);
        setReadableAddress(address);
    };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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
      // Formam data ca string local (fara conversie la UTC)
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const localISO = `${year}-${month}-${day}T${hours}:${minutes}:00`;
      setFormData((prev) => ({
        ...prev,
        dateTime: localISO,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");

    if (!loggedInUser.id) {
        alert("Trebuie să fii logat pentru a crea un eveniment!");
        setLoading(false);
        return;
    }

    // const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
    console.log("User logat extras din storage:", loggedInUser);  

    const eventToSave = {
        ...formData,
        organizerId: loggedInUser.id // Trimitem ID-ul contului logat
    };

    // adaugam obiectul de eveniment ca blob JSON (cu organizatorul inclus)
    const data = new FormData();

    const eventPayload = { ...eventToSave, organizer: { id: loggedInUser.id } };
    data.append(
        "event",
        new Blob([JSON.stringify(eventPayload)], { type: "application/json" }),
    );

    // adaugam fisierele
    if (selectedFiles) {
      Array.from(selectedFiles).forEach((file) => {
        data.append("files", file);
      });
    }

    try {
      const response = await fetch("http://localhost:8080/api/events/create", {
        method: "POST",
        body: data, // browserul seteaza automat "multipart/form-data"
      });

      if (response.ok) {
        alert("Eveniment creat cu succes!");
        navigate("/events"); // redirectionare catre explorare
      } else {
        alert("Eroare la crearea evenimentului.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Serverul nu răspunde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-page">
      <Navbar />

      <div className="create-event-container">
        <div className="create-event-card">
          <h1 className="create-title">
            Organizează un <span className="highlight-word">EVENIMENT</span>
          </h1>
          <p className="create-subtitle">
            Completează detaliile evenimentului tău.
          </p>

          <form onSubmit={handleSubmit} className="event-form">
            <div className="form-grid">
              {/* coloana stanga: info de baza */}
              <div className="form-column">
                <div className="form-group">
                  <label>Titlu eveniment</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Ex: Meci de fotbal amatori"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Descriere</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Spune-le oamenilor despre ce este vorba..."
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
                      onChange={(val) =>
                        setFormData((prev) => ({ ...prev, category: val }))
                      }
                      options={[
                        "Sport",
                        "Gaming",
                        "Gătit",
                        "Artă",
                        "Muzică",
                        "Altele",
                      ]}
                    />
                  </div>

                  <div className="form-group">
                    <label>Capacitate (nr. persoane)</label>
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
                  <label>Data și ora</label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    showTimeSelect
                    timeIntervals={30}
                    dateFormat="dd/MM/yyyy HH:mm"
                    placeholderText="Selectează data și ora"
                    className="date-picker-input"
                    required
                  />
                </div>
              </div>

              {/* coloana dreapta: imagini si locatie */}
              <div className="form-column">
                <div className="form-group">
                  <label>Adaugă poze (poți selecta mai multe)</label>
                  <div className="file-input-wrapper">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                  {selectedFiles && (
                    <p className="files-count">
                      {selectedFiles.length} fișiere selectate
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label>Locație</label>
                  <LocationPicker 
                    onLocationSelect={handleLocationChange} />
                    <div className="address-display-box">
                      <p className="address-text">{readableAddress}</p>
                    </div>
                </div>
              </div>
            </div>

            <button type="submit" className="create-btn" disabled={loading}>
              {loading ? "Se creează..." : "Publică evenimentul"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
