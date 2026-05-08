import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// interfat pentru datele utilizatorului primite de la API
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  profilePicture?: string;
  organizedEventsCount?: number;
  joinedEventsCount?: number;
  rating?: number;
}

function StarIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="#a0c878"
      style={{
        display: "inline-block",
        marginLeft: "6px",
        verticalAlign: "middle",
      }}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function AvatarWithInitials({
  firstName,
  lastName,
  profilePicture,
}: {
  firstName: string;
  lastName: string;
  profilePicture?: string;
}) {
  const initials = (
    (firstName?.charAt(0) || "") + (lastName?.charAt(0) || "")
  ).toUpperCase();

  if (profilePicture) {
    return (
      <img
        src={`http://localhost:8080${profilePicture}`}
        alt="Profil"
        className="profile-avatar-img"
      />
    );
  }

  return <div className="profile-avatar-initials">{initials}</div>;
}

interface Event {
  id: number;
  title: string;
  category: string;
  dateTime: string;
  status: string;
  capacity: number;
}


// pentru afisarea listei de participanti
interface ParticipantEnrollment {
  id: number;
  status: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
}


interface Enrollment {
  id: number;
  status: string;
  event: {
    id: number;
    title: string;
    dateTime: string;
  };
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [organizedEvents, setOrganizedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // stari pentru evenimentele inscrise
  const [joinedEvents, setJoinedEvents] = useState<Enrollment[]>([]);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [enrollmentToWithdraw, setEnrollmentToWithdraw] = useState<number | null>(null);

  // stari pentru editare profil
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ firstName: "", lastName: "", bio: "" });
  const [selectedProfilePic, setSelectedProfilePic] = useState<File | null>(null);

  // stari pentru accepatare/ respingerea participantilor 
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<ParticipantEnrollment[]>([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);

  // stari pentru schimbare parola
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // stare pentru a sti ce tab este selectat
  const [activeTab, setActiveTab] = useState<
    "organized" | "joined" | "reports"
  >("organized");

  // preluam ID-ul din localStorage
  const getLoggedInUserId = () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      const userData = JSON.parse(userStr);
      return userData.id;
    } catch (e) {
      return null;
    }
  };

  const userId = getLoggedInUserId();

//   const fetchUserData = () => {
//     if (!userId) {
//       navigate("/login");
//       return;
//     }
//     setLoading(true);
    
//     // Preluăm datele utilizatorului și evenimentele organizate în paralel
//     Promise.all([
//       fetch(`http://localhost:8080/api/users/${userId}`).then(res => res.json()),
//       fetch(`http://localhost:8080/api/events/organizer/${userId}`).then(res => res.json()),
//       fetch(`http://localhost:8080/api/enrollments/user/${userId}`).then(res => res.json())
//     ])
//     .then(([userData, organizedData, enrollmentsData]) => {
//     setOrganizedEvents(organizedData);
//     setJoinedEvents(enrollmentsData); 
//     setUser({
//       ...userData,
//       organizedEventsCount: organizedData.length,
//       joinedEventsCount: enrollmentsData.length, 
//       rating: 4.9,
//     });
//     setEditData({ firstName: userData.firstName, lastName: userData.lastName, bio: userData.bio || "" });
//     setLoading(false);
//   })
//   .catch((err) => {
//     setError(err.message);
//     setLoading(false);
//   });
// };


const fetchUserData = () => {
  if (!userId) {
    navigate("/login");
    return;
  }
  setLoading(true);
  
  Promise.all([
    fetch(`http://localhost:8080/api/users/${userId}`).then(res => res.json()),
    fetch(`http://localhost:8080/api/events/organizer/${userId}`).then(res => res.json()),
    fetch(`http://localhost:8080/api/enrollments/user/${userId}`).then(res => res.json())
  ])
  .then(([userData, organizedData, enrollmentsData]) => {
    setOrganizedEvents(organizedData);
    setJoinedEvents(enrollmentsData); 
    
    // --- SINCRONIZARE MODAL ---
    // Dacă modalul este deschis, actualizăm selectedEvent cu noile date (ex: capacitatea nouă)
    if (showParticipantsModal && selectedEvent) {
      const updatedEvent = organizedData.find((e: Event) => e.id === selectedEvent.id);
      if (updatedEvent) {
        setSelectedEvent(updatedEvent);
      }
    }

    setUser({
      ...userData,
      organizedEventsCount: organizedData.length,
      joinedEventsCount: enrollmentsData.length, 
      rating: 4.9,
    });
    setEditData({ firstName: userData.firstName, lastName: userData.lastName, bio: userData.bio || "" });
    setLoading(false);
  })
  .catch((err) => {
    setError(err.message);
    setLoading(false);
  });
};


const refreshParticipantsList = async (eventId: number) => {
  try {
    const response = await fetch(`http://localhost:8080/api/enrollments/event/${eventId}`);
    if (response.ok) {
      const data = await response.json();
      setParticipants(data);
    }
  } catch (error) {
    console.error("Eroare la refresh participanți:", error);
  }
};

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setIsChangingPassword(false);
    setSelectedProfilePic(null);
    if (user) {
      setEditData({ firstName: user.firstName, lastName: user.lastName, bio: user.bio || "" });
    }
  };

  const handleChangePasswordToggle = () => {
    setIsChangingPassword(!isChangingPassword);
    setIsEditing(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // 1. Salvam datele text (nume, prenume, bio)
      const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      if (!response.ok) throw new Error("Eroare la salvarea modificărilor");

      // 2. Daca s-a selectat o poza noua, o uploadam
      if (selectedProfilePic) {
        const formData = new FormData();
        formData.append("file", selectedProfilePic);

        const picResponse = await fetch(
          `http://localhost:8080/api/users/${userId}/profile-picture`,
          {
            method: "POST",
            body: formData,
          }
        );
        if (!picResponse.ok) throw new Error("Eroare la salvarea imaginii");
      }

      // Actualizam si localStorage
      const updatedUser = await response.json();
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.firstName = updatedUser.firstName;
        parsed.lastName = updatedUser.lastName;
        localStorage.setItem("user", JSON.stringify(parsed));
      }

      setIsEditing(false);
      setSelectedProfilePic(null);
      fetchUserData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handlePasswordSave = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Parolele noi nu coincid!");
      return;
    }

    fetch(`http://localhost:8080/api/users/${userId}/change-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorMsg = await response.text();
          if (errorMsg === "INVALID_PASSWORD") {
            throw new Error(
              "Parola nouă nu respectă regulile (min. 8 caractere, o majusculă, o cifră, un caracter special).",
            );
          } else if (errorMsg === "WRONG_PASSWORD") {
            throw new Error("Parola actuală este incorectă.");
          }
          throw new Error("Eroare la schimbarea parolei. Încearcă din nou.");
        }
        alert("Parola a fost schimbată cu succes!");
        setIsChangingPassword(false);
      })
      .catch((err) => alert(err.message));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (!window.confirm("Ești sigur că vrei să ștergi acest eveniment? Această acțiune este ireversibilă.")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        //alert("Evenimentul a fost șters.");
        // Reîncărcăm datele pentru a actualiza lista
        fetchUserData();
      } else {
        const errorText = await response.text();
        alert(`Eroare la ștergere: ${errorText}`);
      }
    } catch (err) {
      alert("Eroare de server la ștergerea evenimentului.");
    }
  };

  const handleEditEvent = (eventId: number) => {
    navigate(`/edit-event/${eventId}`);
  };

  const openWithdrawModal = (enrollmentId: number) => {
  setEnrollmentToWithdraw(enrollmentId);
  setShowWithdrawModal(true);
};

// Funcția care este apelată când apeși "Da" în modal
const confirmWithdraw = async () => {
  if (enrollmentToWithdraw === null) return;

  try {
    const response = await fetch(`http://localhost:8080/api/enrollments/${enrollmentToWithdraw}`, {
      method: "DELETE",
    });

    if (response.ok) {
      fetchUserData(); // Reîmprospătăm datele
    } else {
      alert("Eroare la retragere.");
    }
  } catch (err) {
    alert("Eroare de conexiune la server.");
  } finally {
    setShowWithdrawModal(false);
    setEnrollmentToWithdraw(null);
  }
};

// Deschide modalul si incarca participantii
const openParticipantsModal = async (event: Event) => {
  setSelectedEvent(event);
  setShowParticipantsModal(true);
  setLoadingParticipants(true);
  try {
    const response = await fetch(`http://localhost:8080/api/enrollments/event/${event.id}`);
    if (response.ok) {
      const data = await response.json();
      setParticipants(data);
    }
  } catch (error) {
    console.error("Eroare la încărcarea participanților:", error);
  } finally {
    setLoadingParticipants(false);
  }
};

// Accepta participant
// const handleApprove = async (enrollmentId: number) => {
//   try {
//     const response = await fetch(`http://localhost:8080/api/enrollments/${enrollmentId}/approve`, {
//       method: "PUT",
//     });
//     if (response.ok) {
//       // Reîncărcăm lista de participanți și datele userului (pentru a actualiza capacitatea în UI)
//       if (selectedEvent) openParticipantsModal(selectedEvent);
//       fetchUserData(); 
//     }
//   } catch (error) {
//     alert("Eroare la aprobare.");
//   }
// };

// // Respinge participant
// const handleReject = async (enrollmentId: number) => {
//   try {
//     const response = await fetch(`http://localhost:8080/api/enrollments/${enrollmentId}/reject`, {
//       method: "PUT",
//     });
//     if (response.ok) {
//       if (selectedEvent) openParticipantsModal(selectedEvent);
//       fetchUserData();
//     }
//   } catch (error) {
//     alert("Eroare la respingere.");
//   }
// };


const handleApprove = async (enrollmentId: number) => {
  try {
    const response = await fetch(`http://localhost:8080/api/enrollments/${enrollmentId}/approve`, {
      method: "PUT",
    });
    if (response.ok) {
      // 1. Reîmprospătăm imediat lista de participanți din modal
      if (selectedEvent) await refreshParticipantsList(selectedEvent.id);
      // 2. Reîmprospătăm datele generale (asta va actualiza și selectedEvent datorită logicii de la pasul 1)
      fetchUserData(); 
    }
  } catch (error) {
    alert("Eroare la aprobare.");
  }
};

const handleReject = async (enrollmentId: number) => {
  try {
    const response = await fetch(`http://localhost:8080/api/enrollments/${enrollmentId}/reject`, {
      method: "PUT",
    });
    if (response.ok) {
      if (selectedEvent) await refreshParticipantsList(selectedEvent.id);
      fetchUserData();
    }
  } catch (error) {
    alert("Eroare la respingere.");
  }
};

  if (loading)
    return <div className="profile-page-container">Se încarcă...</div>;
  if (error)
    return <div className="profile-page-container">Eroare: {error}</div>;
  if (!user)
    return (
      <div className="profile-page-container">
        Utilizatorul nu a fost găsit.
      </div>
    );

  // AICI ESTE STRUCTURA NOUĂ PENTRU A REZOLVA POZIȚIONAREA FOOTER-ULUI
  return (
    <div className="profile-wrapper">
      <Navbar />

      {/* Containerul paginii fără footer în interiorul lui */}
      <div className="profile-page-container">
        <div className="profile-layout">
          {/* coloana stanga: sidebar */}
          <aside className="profile-sidebar profile-card">
            <div className="profile-avatar-container">
              <AvatarWithInitials
                firstName={user.firstName}
                lastName={user.lastName}
                profilePicture={user.profilePicture}
              />
            </div>

            {!isEditing && !isChangingPassword ? (
              <>
                <h1 className="profile-name">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="profile-email">{user.email}</p>
                <p className="profile-bio">{user.bio || "Adaugă o descriere despre tine!"}</p>
                <div className="profile-actions">
                  <button
                    className="btn-edit-profile"
                    onClick={handleEditToggle}
                  >
                    Editează profilul
                  </button>
                  <button
                    className="btn-change-password"
                    onClick={handleChangePasswordToggle}
                  >
                    Schimbă parola
                  </button>
                  <button
                    className="btn-logout"
                    onClick={handleLogout}
                    style={{ marginTop: "10px", backgroundColor: "#ff4d4d" }}
                  >
                    Deconectare
                  </button>
                </div>
              </>
            ) : isEditing ? (
              <div className="edit-form">
                <h3>Editează Profilul</h3>
                <div className="input-group">
                  <label>Prenume</label>
                  <input
                    type="text"
                    name="firstName"
                    value={editData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="input-group">
                  <label>Nume</label>
                  <input
                    type="text"
                    name="lastName"
                    value={editData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="input-group">
                  <label>Despre mine</label>
                  <textarea
                    name="bio"
                    value={editData.bio}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Spune-le celorlalți despre tine..."
                  />
                </div>
                <div className="input-group">
                  <label>Poză de profil</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setSelectedProfilePic(e.target.files?.[0] || null)
                    }
                  />
                  {selectedProfilePic && (
                    <p style={{ fontSize: "0.8rem", color: "#a0c878", marginTop: "4px" }}>
                      ✓ {selectedProfilePic.name}
                    </p>
                  )}
                </div>
                <div className="profile-actions">
                  <button
                    className="btn-edit-profile save-btn"
                    onClick={handleSave}
                  >
                    Salvează
                  </button>
                  <button
                    className="btn-edit-profile cancel-btn"
                    onClick={handleEditToggle}
                  >
                    Anulează
                  </button>
                </div>
              </div>
            ) : (
              <div className="edit-form">
                <h3>Schimbă parola</h3>
                <div className="input-group">
                  <label>Parola actuală</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordInputChange}
                  />
                </div>
                <div className="input-group">
                  <label>Parola nouă</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordInputChange}
                  />
                </div>
                <div className="input-group">
                  <label>Confirmă parola nouă</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordInputChange}
                  />
                </div>
                <div className="profile-actions">
                  <button
                    className="btn-change-password save-btn"
                    onClick={handlePasswordSave}
                  >
                    Salvează parola
                  </button>
                  <button
                    className="btn-change-password cancel-btn"
                    onClick={handleChangePasswordToggle}
                  >
                    Anulează
                  </button>
                </div>
              </div>
            )}
          </aside>

          {/* coloana dreapta: main content */}
          <main className="profile-main-content">
            {/* sectiunea de statistici */}
            <section className="profile-stats-grid">
              <div className="stat-item profile-card">
                <span className="stat-value">{user.organizedEventsCount}</span>
                <span className="stat-label">Evenimente organizate</span>
              </div>
              <div className="stat-item profile-card">
                <span className="stat-value">{user.joinedEventsCount}</span>
                <span className="stat-label">Evenimente înscrise</span>
              </div>
              <div className="stat-item profile-card">
                <span className="stat-value">
                  {user.rating}
                  <StarIcon />
                </span>
                <span className="stat-label">Rating utilizator</span>
              </div>
            </section>

            {/* sectiunea de activitate cu tab-uri */}
            <section className="profile-activity-card profile-card">
              <div className="profile-tabs-header">
                <button
                  className={`tab-button ${activeTab === "organized" ? "active" : ""}`}
                  onClick={() => setActiveTab("organized")}
                >
                  Evenimentele mele
                </button>
                <button
                  className={`tab-button ${activeTab === "joined" ? "active" : ""}`}
                  onClick={() => setActiveTab("joined")}
                >
                  Istoric înscrieri
                </button>
                <button
                  className={`tab-button ${activeTab === "reports" ? "active" : ""}`}
                  onClick={() => setActiveTab("reports")}
                >
                  Raportări
                </button>
              </div>

              <div className="profile-tabs-content">
                {activeTab === "organized" && (
                  <div className="tab-pane">
                    <h3>Evenimente organizate de tine</h3>
                    {organizedEvents.length > 0 ? (
                      organizedEvents.map((event) => (
                        <div key={event.id} className="placeholder-list-item" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ flex: 1 }}>
                            <strong>{event.title}</strong> - {new Date(event.dateTime).toLocaleString("ro-RO", { 
                              day: "2-digit", 
                              month: "long", 
                              year: "numeric", 
                              hour: "2-digit", 
                              minute: "2-digit" 
                            })}
                            <div style={{ marginTop: "5px" }}>
                              <span className={`event-status-badge ${event.status?.toLowerCase() || "active"}`}>
                                {event.status || "Activ"}
                              </span>
                            </div>
                          </div>
                          <div className="event-actions">
                            <button 
                              className="btn-action btn-view-participants"
                              onClick={() => openParticipantsModal(event)}
                              style={{ backgroundColor: "#a0c878", color: "white" }}
                            >
                              Participanți
                            </button>
                            <button 
                              className="btn-action btn-edit-event"
                              onClick={() => handleEditEvent(event.id)}
                            >
                              Modifică
                            </button>
                            <button 
                              className="btn-action btn-delete-event"
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              Șterge
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>Nu ai organizat niciun eveniment încă.</p>
                    )}
                  </div>
                )}
                {activeTab === "joined" && (
                  <div className="tab-pane">
                    <h3>Evenimente la care ești înscris</h3>
                    {joinedEvents.length > 0 ? (
                      joinedEvents.map((enroll) => (
                        <div key={enroll.id} className="placeholder-list-item" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ flex: 1 }}>
                            <strong>{enroll.event.title}</strong> - {new Date(enroll.event.dateTime).toLocaleString("ro-RO", { 
                              day: "2-digit", 
                              month: "long", 
                              year: "numeric" 
                            })}
                            <div style={{ marginTop: "5px" }}>
                              <span className={`event-status-badge ${enroll.status.toLowerCase()}`}>
                                {enroll.status === "PENDING" && "În așteptare"}
                                {enroll.status === "CONFIRMED" && "Confirmat"}
                                {enroll.status === "REJECTED" && "Respins"}
                              </span>
                            </div>
                          </div>
                          <div className="event-actions">
                            <button 
                              className="btn-action btn-view-event"
                              onClick={() => navigate(`/events/${enroll.event.id}`)}
                              style={{ backgroundColor: "#e3f2fd", color: "#1976d2" }}
                            >
                              Vezi pagina
                            </button>
                            {/* Permitem retragerea doar daca nu a fost deja respins*/}
                            {enroll.status !== "REJECTED" && (
                              <button 
                                className="btn-action btn-delete-event"
                                onClick={() => openWithdrawModal(enroll.id)}
                              >
                                Retragere
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>Nu ești înscris la niciun eveniment.</p>
                    )}
                  </div>
                )}
                {activeTab === "reports" && (
                  <div className="tab-pane">
                    <h3>Istoricul raportărilor tale</h3>
                    <div className="placeholder-list-item">
                      Nu există raportări active.
                    </div>
                  </div>
                )}
              </div>
            </section>
          </main>
        </div>
        {showWithdrawModal && (
          <div className="modal-overlay">
            <div className="modal-card">
              <h2>Confirmare Retragere</h2>
              <p>Ești sigur că vrei să te retragi de la acest eveniment? Această acțiune nu poate fi anulată.</p>
              <div className="modal-buttons">
                <button className="btn-modal-confirm" onClick={confirmWithdraw}>
                  Da, retrage-mă
                </button>
                <button className="btn-modal-cancel" onClick={() => setShowWithdrawModal(false)}>
                  Nu, rămân
                </button>
              </div>
            </div>
          </div>
        )}

        {showParticipantsModal && selectedEvent && (
        <div className="modal-overlay">
          <div className="modal-card participants-modal">
            <div className="modal-header">
              <h2>{selectedEvent.title}</h2>
              <span className="spots-left-badge">{selectedEvent.capacity} locuri libere</span>
            </div>
            
            <div className="participants-list">
              {loadingParticipants ? (
                <p>Se încarcă...</p>
              ) : participants.length > 0 ? (
                participants.map((enroll) => (
                  <div key={enroll.id} className="participant-item">
                    <div className="participant-info">
                      <span>{enroll.user.firstName} {enroll.user.lastName}</span>
                      <span className={`status-small ${enroll.status.toLowerCase()}`}>
                        ({enroll.status === 'PENDING' ? 'În așteptare' : enroll.status})
                      </span>
                    </div>
                    <div className="participant-actions">
                      <button 
                        className="btn-text" 
                        onClick={() => navigate(`/profile/${enroll.user.id}`)}
                      >
                        Vezi profil
                      </button>
                      
                      {enroll.status === "PENDING" && (
                        <>
                          <button 
                            className="btn-approve" 
                            onClick={() => handleApprove(enroll.id)}
                            disabled={selectedEvent.capacity <= 0}
                          >
                            ✓
                          </button>
                          <button className="btn-reject" onClick={() => handleReject(enroll.id)}>✕</button>
                        </>
                      )}

                      {enroll.status === "CONFIRMED" && (
                        <button className="btn-reject" onClick={() => handleReject(enroll.id)}>Anulează</button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data">Nicio înscriere momentan.</p>
              )}
            </div>

            <button className="btn-modal-cancel" onClick={() => setShowParticipantsModal(false)}>
              Închide
            </button>
          </div>
        </div>
      )}
      </div>
      <Footer />
    </div>
  );
}
