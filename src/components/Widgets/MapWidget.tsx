import { useEffect, useState } from "react";

function MapWidget() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
  const [mapUrl, setMapUrl] = useState(`${backendUrl}/api/map`);

  useEffect(() => {
    // Refresh the image every minute. The server only refetches from
    // Google when the position has changed.
    const interval = setInterval(() => {
      setMapUrl(`${backendUrl}/api/map?t=${Date.now()}`);
    }, 60000);

    return () => clearInterval(interval);
  }, [backendUrl]);

  return <img src={mapUrl} alt="Karte" className="w-full h-full object-cover" />;
}

export default MapWidget;

