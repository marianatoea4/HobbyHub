import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"; // Asigură-te că drumul e corect
import "./CreateEvent.css";

export default function CreateEvent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // State pentru datele text
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Sport", // Categoria default
    dateTime: "",
    capacity: 10,
    lat: 44.4268, // Placeholder coordonate (București)
    lng: 26.1025,
    status: "Active"
  });

  // State pentru poze
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    
    // Adăugăm obiectul de eveniment ca Blob JSON
    data.append("event", new Blob([JSON.stringify(formData)], { type: "application/json" }));

    // Adăugăm fișierele
    if (selectedFiles) {
      Array.from(selectedFiles).forEach((file) => {
        data.append("files", file);
      });
    }

    try {
      const response = await fetch("http://localhost:8080/api/events/create", {
        method: "POST",
        body: data, // Browserul setează automat "multipart/form-data"
      });

      if (response.ok) {
        alert("Eveniment creat cu succes!");
        navigate("/events"); // Redirecționare către explorare
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
          <h1 className="create-title">Organizează un Hobby</h1>
          <p className="create-subtitle">Completează detaliile evenimentului tău.</p>

          <form onSubmit={handleSubmit} className="event-form">
            <div className="form-grid">
              {/* Coloana Stângă: Info de bază */}
              <div className="form-column">
                <div className="form-group">
                  <label>Titlu Eveniment</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Ex: Meci de fotbal amatori" required />
                </div>

                <div className="form-group">
                  <label>Descriere</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Spune-le oamenilor despre ce este vorba..." rows={4} required />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Categorie</label>
                    <select name="category" value={formData.category} onChange={handleChange}>
                      <option value="Sport">Sport</option>
                      <option value="Gaming">Gaming</option>
                      <option value="Gătit">Gătit</option>
                      <option value="Artă">Artă</option>
                      <option value="Muzică">Muzică</option>
                      <option value="Altele">Altele</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Capacitate (pers.)</label>
                    <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} min="2" required />
                  </div>
                </div>

                <div className="form-group">
                  <label>Data și Ora</label>
                  <input type="datetime-local" name="dateTime" value={formData.dateTime} onChange={handleChange} required />
                </div>
              </div>

              {/* Coloana Dreaptă: Media și Locație */}
              <div className="form-column">
                <div className="form-group">
                  <label>Adaugă Poze (poți selecta mai multe)</label>
                  <div className="file-input-wrapper">
                    <input type="file" multiple accept="image/*" onChange={handleFileChange} />
                  </div>
                  {selectedFiles && <p className="files-count">{selectedFiles.length} fișiere selectate</p>}
                </div>

                <div className="form-group">
                  <label>Locație (Google Maps)</label>
                  {/* AICI VA VENI COMPONENTA DE GOOGLE MAPS */}
                  <div className="map-placeholder">
                    <p>Harta Google Maps va fi integrată aici.</p>
                    <small>Momentan folosim coordonate implicite.</small>
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" className="create-btn" disabled={loading}>
              {loading ? "Se creează..." : "Publică Evenimentul"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}