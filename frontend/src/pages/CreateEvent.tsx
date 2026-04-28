import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Navbar from "../components/Navbar";
import "./CreateEvent.css";
import LocationPicker from "../components/LocationPicker";
import { getAddressFromCoords } from "../utils/geocoding";

export default function CreateEvent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [readableAddress, setReadableAddress] = useState("Se încarcă locația...");

  // state-uri pentru datele text
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Sport", // categoria default
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
      // convertim data in ISO format pentru backend
      setFormData((prev) => ({
        ...prev,
        dateTime: date.toISOString(),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();

    // adaugam obiectul de eveniment ca blob JSON
    data.append(
      "event",
      new Blob([JSON.stringify(formData)], { type: "application/json" }),
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
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="Sport">Sport</option>
                      <option value="Gaming">Gaming</option>
                      <option value="Gătit">Gătit</option>
                      <option value="Artă">Artă</option>
                      <option value="Muzică">Muzică</option>
                      <option value="Altele">Altele</option>
                    </select>
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
    </div>
  );
}
