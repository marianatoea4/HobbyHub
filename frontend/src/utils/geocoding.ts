export const getAddressFromCoords = async (lat: number, lng: number): Promise<string> => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
            {
                headers: {
                    'Accept-Language': 'ro', // Rezultatele in romana
                    'User-Agent': 'HobbyHub-App'
                }
            }
        );
        const data = await response.json();
        
        if (data && data.display_name) {
            const parts = data.display_name.split(',');
            const shortAddress = parts.slice(0, 3).join(','); 
            return shortAddress;
        }
        return "Adresă necunoscută";
    } catch (error) {
        console.error("Reverse geocoding error:", error);
        return "Eroare la obținerea adresei";
    }
};