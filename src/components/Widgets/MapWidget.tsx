import { useEffect, useState } from "react";

interface Location {
  address: string,
  city: string,
  country: string
}

function MapWidget() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
  const [mapUrl, setMapUrl] = useState(`${backendUrl}/api/map`);
  const [location, setLocation] = useState<Location | null>(null);

  useEffect(() => {
    const fetchLocationData = async() => {
      try {
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
        const response = await fetch(`${backendUrl}/api/map/position`);

        if (!response.ok) {
          throw new Error("Failed to fetch Location data");
        }

        const data = await response.json();
        setLocation(data);
      } catch (err) {
        console.error("Error fetching Location data:", err);
      }
    };

    fetchLocationData();

    const interval = setInterval(() => {
      setMapUrl(`${backendUrl}/api/map?t=${Date.now()}`);
      fetchLocationData();
    }, 30000);

    return () => clearInterval(interval);
  }, [backendUrl]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      <img src={mapUrl} alt="Karte" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute bottom-4 left-4 z-10 bg-white rounded-2xl p-4 mr-4">
          <p className="text-lg text-center m-0">
            {location ? `${location.address}, ${location.city}, ${location.country}` : "Lädt..."}
          </p>
        </div>
    </div>
  );
}

export default MapWidget;

