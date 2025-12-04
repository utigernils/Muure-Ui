import { useEffect, useRef, useState } from "react";
import { useGoogleMaps } from "../../hooks/useGoogleMaps";

interface MapWidgetProps {
  zoom?: number;
  mapStyleId?: string;
}

interface PositionData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string | null;
}

function MapWidget({
  zoom = 15,
  mapStyleId = undefined,
}: MapWidgetProps) {
  const { isLoaded, error } = useGoogleMaps();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const [position, setPosition] = useState<PositionData | null>(null);
  const [positionError, setPositionError] = useState<string | null>(null);

  // Fetch position data from API
  useEffect(() => {
    const fetchPosition = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/position");
        if (!response.ok) {
          throw new Error("Failed to fetch position");
        }
        const data: PositionData = await response.json();
        setPosition(data);
        setPositionError(null);
      } catch (err) {
        console.error("Error fetching position:", err);
        setPositionError("Failed to fetch position");
      }
    };

    // Fetch immediately
    fetchPosition();

    // Set up interval to fetch every 30 seconds
    const intervalId = setInterval(fetchPosition, 30000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Initialize map when Google Maps loads and position is available
  useEffect(() => {
    if (!mapRef.current || !isLoaded || !position) return;

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: position.latitude, lng: position.longitude },
      zoom: zoom,
      mapId: mapStyleId,
      disableDefaultUI: true,
      gestureHandling: "greedy",
    });

    mapInstanceRef.current = map;

    const svgMarker = {
      path: google.maps.SymbolPath.CIRCLE,
      strokeColor: "#000000ff",
      strokeWeight: 2,
      fillColor: "#ffffffff",
      fillOpacity: 1,
      scale: 8,
    };

    const marker = new google.maps.Marker({
      position: { lat: position.latitude, lng: position.longitude },
      map: map,
      icon: svgMarker,
    });

    markerRef.current = marker;

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, [isLoaded, position, zoom, mapStyleId]);

  // Update marker position when position changes
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current && position) {
      const newPosition = { lat: position.latitude, lng: position.longitude };
      markerRef.current.setPosition(newPosition);
      mapInstanceRef.current.panTo(newPosition);
    }
  }, [position]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-red-500">
        Failed to load Google Maps
      </div>
    );
  }

  if (positionError) {
    return (
      <div className="w-full h-full flex items-center justify-center text-red-500">
        {positionError}
      </div>
    );
  }

  if (!isLoaded || !position) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        Loading map...
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-full" />;
}

export default MapWidget;
