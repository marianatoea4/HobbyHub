import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
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

    const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");

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
        }
    }, [event]);

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/events/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setEvent(data);
                } else {
                    console.error("Evenimentul nu a fost găsit");
                }
            } catch (error) {
                console.error("Eroare fetch details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEventDetails();
    }, [id]);

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

    return (
        <div className="event-details-page">
            <Navbar />
            
            <main className="details-content">
                {/* Antet: Titlu și Categorie */}
                <div className="details-header-card">
                    <div className="header-left">
                        <h1 className="details-title">{event.title}</h1>
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
                                <button className="join-button" disabled={availableSpots <= 0}>
                                    {availableSpots > 0 ? "Înscrie-te acum" : "Locuri epuizate"}
                                </button>
                            )}
                            
                            {isOrganizer && (
                                <div className="organizer-badge">Ești organizatorul acestui eveniment</div>
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
        </div>
    );
}