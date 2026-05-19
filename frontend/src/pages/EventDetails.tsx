import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ReportModal from '../components/ReportModal';
import StarRating from '../components/StarRating';
import RatingModal from '../components/RatingModal';
import './EventDetails.css';

// Pin-ul personalizat (refolosit de la LocationPicker)
const customGreenIcon = L.divIcon({
    className: 'custom-pin-wrapper',
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    html: '<div class="pin-hole"></div>'
});

export default function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState<any>(null);
    const [currentImgIndex, setCurrentImgIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [address, setAddress] = useState<string>("Se încarcă adresa...");
    const [averageRating, setAverageRating] = useState<number>(0);

    const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");

    const [enrollmentStatus, setEnrollmentStatus] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [participants, setParticipants] = useState<any[]>([]);

    // State pentru raportare
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [reportType, setReportType] = useState<"USER" | "EVENT">("EVENT");
    const [reportTargetId, setReportTargetId] = useState(0);
    const [reportTargetLabel, setReportTargetLabel] = useState("");

    // State pentru rating
    const [ratingModalOpen, setRatingModalOpen] = useState(false);
    const [ratingTargetType, setRatingTargetType] = useState<'USER' | 'EVENT'>('EVENT');
    const [ratingTargetId, setRatingTargetId] = useState(0);
    const [ratingTargetLabel, setRatingTargetLabel] = useState("");

    const fetchAverageRating = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/ratings/event/${id}/average`);
            if (response.ok) {
                const data = await response.json();
                setAverageRating(data);
            }
        } catch (error) {
            console.error("Eroare fetch average rating:", error);
        }
    };

    useEffect(() => {
        const fetchAddress = async () => {
            if (!event?.lat || !event?.lng) return;

            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${event.lat}&lon=${event.lng}`
                );
                const data = await response.json();
                // Extragem o varianta lizibila a adresei (ex: Strada, Oras)
                setAddress(data.display_name || "Adresă necunoscută");
            } catch (error) {
                console.error("Eroare la obținerea adresei:", error);
                setAddress("Nu s-a putut încărca adresa.");
            }
        };

        if (event) {
            fetchAddress();
            fetchAverageRating();
        }
    }, [event]);

    useEffect(() => {
        const checkEnrollmentStatus = async () => {
            if (!loggedInUser.id || !id) return;

            try {
                const response = await fetch(`http://localhost:8080/api/enrollments/status?userId=${loggedInUser.id}&eventId=${id}`);
                if (response.ok) {
                    const status = await response.text();
                    setEnrollmentStatus(status || null);
                }
            } catch (error) {
                console.error("Eroare verificare status înscriere:", error);
            }
        };
        checkEnrollmentStatus();
    }, [id, loggedInUser.id]);

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/events/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setEvent(data);
                    // Fetch participants after event details
                    fetchParticipants();
                } else {
                    console.error("Evenimentul nu a fost găsit");
                }
            } catch (error) {
                console.error("Eroare fetch details:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchParticipants = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/enrollments/event/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    // We only want confirmed participants for rating purposes
                    setParticipants(data.filter((p: any) => p.status === 'CONFIRMED'));
                }
            } catch (error) {
                console.error("Eroare fetch participants:", error);
            }
        };

        fetchEventDetails();
    }, [id]);

    const handleEnroll = async () => {
        if (!loggedInUser.id) {
            alert("Trebuie să fii autentificat pentru a te înscrie!");
            navigate("/login");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch("http://localhost:8080/api/enrollments/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: loggedInUser.id,
                    eventId: event.id
                })
            });

            if (response.ok) {
                setEnrollmentStatus("PENDING");
                //alert("Cererea de înscriere a fost trimisă! Așteaptă confirmarea organizatorului.");
            } else {
                const errorMsg = await response.text();
                alert(errorMsg);
            }
        } catch (error) {
            alert("Eroare de rețea. Încearcă din nou.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const nextImage = () => {
        if (event?.images) {
            setCurrentImgIndex((prev) => (prev + 1) % event.images.length);
        }
    };

    const prevImage = () => {
        if (event?.images) {
            setCurrentImgIndex((prev) => (prev - 1 + event.images.length) % event.images.length);
        }
    };

    if (loading) return <div className="loading-screen">Se încarcă detaliile...</div>;
    if (!event) return <div className="error-screen">Evenimentul nu a fost găsit.</div>;

    const isOrganizer = loggedInUser.id === event.organizer?.id;
    const availableSpots = event.capacity - (event.participantsCount || 0);
    const isConfirmed = enrollmentStatus === "CONFIRMED";

    return (
        <div className="event-details-page">
            <Navbar />

            <main className="details-content">
                {/* Antet: Titlu și Categorie */}
                <div className="details-header-card">
                    <div className="header-left">
                        <div className="title-rating-row">
                            <h1 className="details-title">{event.title}</h1>
                            {averageRating > 0 && (
                                <div className="event-avg-rating">
                                    <StarRating rating={Math.round(averageRating)} />
                                    <span>({averageRating.toFixed(1)})</span>
                                </div>
                            )}
                        </div>
                        <span className="details-category">{event.category}</span>
                    </div>

                    <div className="header-right">
                        <p className="organizer-label">Organizat de:</p>
                        <p className="organizer-real-name">
                            {event.organizer?.firstName} {event.organizer?.lastName}
                        </p>
                    </div>
                </div>

                <div className="details-grid">
                    {/* Partea Stanga: Media si Info */}
                    <div className="details-main-col">
                        <section className="image-carousel-section">
                            {event.images && event.images.length > 0 ? (
                                <div className="carousel-container">
                                    <img 
                                        src={`http://localhost:8080${event.images[currentImgIndex].imageUrl}`} 
                                        alt="Event" 
                                        className="carousel-image"
                                    />
                                    {event.images.length > 1 && (
                                        <>
                                            <button className="nav-arrow left" onClick={prevImage}>‹</button>
                                            <button className="nav-arrow right" onClick={nextImage}>›</button>
                                        </>
                                    )}
                                    <div className="image-counter">
                                        {currentImgIndex + 1} / {event.images.length}
                                    </div>
                                </div>
                            ) : (
                                <div className="no-images-msg">
                                    <p>Organizatorul nu a încărcat poze pentru acest eveniment.</p>
                                </div>
                            )}
                        </section>

                        <section className="description-section">
                            <h3 className="description-card-title">Despre eveniment</h3>
                            <p className="description-text">{event.description}</p>
                        </section>
                    </div>

                    {/* Partea Dreapta: Card cu Status, Buton si Harta */}
                    <div className="details-side-col">
                        <div className="action-card">
                            <div className="info-row">
                                <span className="icon">📅</span>
                                <div>
                                    <strong>Data și ora</strong>
                                    <p>{new Date(event.dateTime).toLocaleString('ro-RO', { dateStyle: 'full', timeStyle: 'short' })}</p>
                                </div>
                            </div>

                            <div className="info-row">
                                <span className="icon">👥</span>
                                <div>
                                    <strong>Locuri disponibile</strong>
                                    <p>{availableSpots > 0 ? `${availableSpots} locuri rămase` : "Eveniment plin"}</p>
                                </div>
                            </div>

                            {!isOrganizer && (
                                <button 
                                    className={`join-button ${enrollmentStatus ? 'enrolled' : ''}`} 
                                    onClick={handleEnroll}
                                    disabled={availableSpots <= 0 || enrollmentStatus !== null || isSubmitting}
                                >
                                    {isSubmitting ? "Se procesează..." : 
                                     enrollmentStatus === "PENDING" ? "În așteptare (Cerere trimisă)" :
                                     enrollmentStatus === "CONFIRMED" ? "Te-ai înscris deja" :
                                     availableSpots > 0 ? "Înscrie-te acum" : "Locuri epuizate"}
                                </button>
                            )}

                            {isOrganizer && (
                                <div className="organizer-badge">Ești organizatorul acestui eveniment</div>
                            )}

                            {/* Secțiune Rating (pentru participanți confirmați) */}
                            {isConfirmed && (
                                <div className="rating-buttons-section">
                                    <button 
                                        className="btn-action-rating btn-rate-event"
                                        onClick={() => {
                                            setRatingTargetType('EVENT');
                                            setRatingTargetId(event.id);
                                            setRatingTargetLabel(event.title);
                                            setRatingModalOpen(true);
                                        }}
                                    >
                                        ⭐ Evaluează evenimentul
                                    </button>
                                    <button 
                                        className="btn-action-rating btn-rate-user"
                                        onClick={() => {
                                            setRatingTargetType('USER');
                                            setRatingTargetId(event.organizer.id);
                                            setRatingTargetLabel(`${event.organizer.firstName} ${event.organizer.lastName}`);
                                            setRatingModalOpen(true);
                                        }}
                                    >
                                        ⭐ Evaluează organizatorul
                                    </button>
                                </div>
                            )}

                            {/* Secțiune Rating Participanți (pentru participanți confirmați sau organizator) */}
                            {(isConfirmed || isOrganizer) && participants.length > 0 && (
                                <div className="participants-rating-section">
                                    <h4>Evaluează {isOrganizer ? 'participanții' : 'alți participanți'}:</h4>
                                    <div className="participants-mini-list">
                                        {participants
                                            .filter(p => p.user.id !== loggedInUser.id)
                                            .map(p => (
                                                <div key={p.user.id} className="participant-rating-item">
                                                    <span>{p.user.firstName} {p.user.lastName}</span>
                                                    <button 
                                                        className="btn-rate-small"
                                                        onClick={() => {
                                                            setRatingTargetType('USER');
                                                            setRatingTargetId(p.user.id);
                                                            setRatingTargetLabel(`${p.user.firstName} ${p.user.lastName}`);
                                                            setRatingModalOpen(true);
                                                        }}
                                                    >
                                                        ⭐ Evaluează
                                                    </button>
                                                </div>
                                            ))
                                        }
                                        {participants.filter(p => p.user.id !== loggedInUser.id).length === 0 && (
                                            <p className="no-other-participants">Niciun participant de evaluat momentan.</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Butoane de raportare */}
                            {!isOrganizer && loggedInUser.id && (
                                <div className="report-buttons-section">
                                    <button
                                        className="btn-report btn-report-event"
                                        onClick={() => {
                                            setReportType("EVENT");
                                            setReportTargetId(event.id);
                                            setReportTargetLabel(event.title);
                                            setReportModalOpen(true);
                                        }}
                                    >
                                        🚩 Raportează evenimentul
                                    </button>
                                    {event.organizer && (
                                        <button
                                            className="btn-report btn-report-user"
                                            onClick={() => {
                                                setReportType("USER");
                                                setReportTargetId(event.organizer.id);
                                                setReportTargetLabel(`${event.organizer.firstName} ${event.organizer.lastName}`);
                                                setReportModalOpen(true);
                                            }}
                                        >
                                            🚩 Raportează organizatorul
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="map-card">
                            <h3>Locație</h3>
                            <span className="event-address">{address}</span>
                            <div className="mini-map-container">
                                <MapContainer center={[event.lat, event.lng]} zoom={15} zoomControl={false} style={{height: '100%', width: '100%'}}>
                                    <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                                    <Marker position={[event.lat, event.lng]} icon={customGreenIcon} />
                                </MapContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />

            {/* Modal raportare */}
            <ReportModal
                isOpen={reportModalOpen}
                onClose={() => setReportModalOpen(false)}
                reportType={reportType}
                targetId={reportTargetId}
                targetLabel={reportTargetLabel}
                reporterId={loggedInUser.id}
            />

            {/* Modal rating */}
            <RatingModal
                isOpen={ratingModalOpen}
                onClose={() => setRatingModalOpen(false)}
                onSuccess={fetchAverageRating}
                targetType={ratingTargetType}
                targetId={ratingTargetId}
                targetLabel={ratingTargetLabel}
                evaluatorId={loggedInUser.id}
                eventId={event.id}
            />
        </div>
    );
}