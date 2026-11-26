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

    const interval = setInterval(() => {
      setMapUrl(`${backendUrl}/api/map?t=${Date.now()}`);
      fetchLocationData();
    }, 30000);

    return () => clearInterval(interval);
  }, [backendUrl]);

  return (
    <div>
      <img src={mapUrl} alt="Karte" className="w-full h-full object-cover" />
      <p>{location?.address}</p>
      <p>{location?.city}</p>
      <p>{location?.country}</p>
    </div>
  );
}

export default MapWidget;

