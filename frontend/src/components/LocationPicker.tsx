import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useState } from 'react';
import './LocationPicker.css';
import { useMap } from 'react-leaflet';
import { useEffect, useRef } from 'react';

const customGreenIcon = L.divIcon({
    className: 'custom-pin-wrapper', 
    iconSize: [30, 42],   
    iconAnchor: [15, 42],
    html: '<div class="pin-hole"></div>'
});

interface LocationPickerProps {
    onLocationSelect: (lat: number, lng: number) => void;
}

export default function LocationPicker({ onLocationSelect }: LocationPickerProps) {
    // Coordonate initiale (Centrul Bucurestiului)
    const [position, setPosition] = useState<[number, number]>([44.4323, 26.1063]);

    const updateLocation = (lat: number, lng: number) => {
        setPosition([lat, lng]);
        onLocationSelect(lat, lng);
    };

    // Componenta interna pentru a captura evenimentul de click
    function ClickHandler() {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setPosition([lat, lng]);
                onLocationSelect(lat, lng); // Trimitem datele la parinte (CreateEvent)
            },
        });
        return <Marker position={position} icon={customGreenIcon} />;
    }

    return (
        <MapContainer 
            center={position} 
            zoom={13} 
            zoomControl={false}
            style={{ height: "300px", width: "100%", borderRadius: "12px", border: "2px solid #ddeb9d" }}
        >
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            <SearchField onLocationFound={updateLocation} />
            <ClickHandler />
        </MapContainer>
    );
}


function SearchField({ onLocationFound }: { onLocationFound: (lat: number, lng: number) => void }) {
  const map = useMap();
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchContainerRef.current) {
      L.DomEvent.disableClickPropagation(searchContainerRef.current);
    }
  }, []);

  useEffect(() => {
    if (searchText.length < 3) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions(searchText);
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [searchText]);

  const fetchSuggestions = async (query: string) => {
    try {
      const viewbox = "25.95,44.55,26.25,44.35";
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=ro&viewbox=${viewbox}&bounded=1`,
        {
          headers: {
            'Accept': 'application/json',
          }
        }
      );

      if (response.status === 429) {
        console.error("Suntem blocați temporar! Prea multe cereri.");
        return;
      }

      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Eroare fetch:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const selectSuggestion = (sug: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    const lat = parseFloat(sug.lat);
    const lon = parseFloat(sug.lon);
    
    setSearchText(sug.display_name.split(',').slice(0, 3).join(','));
    setSuggestions([]);
    setShowSuggestions(false);
    
    map.flyTo([lat, lon], 16);
    onLocationFound(lat, lon);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      if (suggestions.length > 0) {
        selectSuggestion(suggestions[0]);
      } else {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}&countrycodes=ro&limit=1`);
        const data = await res.json();
        if (data.length > 0) selectSuggestion(data[0]);
      }
    }
  };

  return (
    <div className="map-search-wrapper" ref={searchContainerRef}>
      <div className="map-search-bar">
        <input
          type="text"
          placeholder="Caută adresa (ex: Splaiul Independentei)..."
          value={searchText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((sug, index) => (
            <li key={index} onClick={(e) => selectSuggestion(sug, e)}>
              {sug.display_name.split(',').slice(0, 3).join(',')}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}