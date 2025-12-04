import { useEffect, useState } from "react";

let googleMapsPromise: Promise<void> | null = null;
let googleMapsApiKey: string | null = null;

export function useGoogleMaps() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    const loadGoogleMaps = async () => {
      try {
        // Fetch API key from backend if not already fetched
        if (!googleMapsApiKey) {
          const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
          const response = await fetch(`${backendUrl}/api/config`);
          if (!response.ok) {
            throw new Error("Failed to fetch config");
          }
          const config = await response.json();
          googleMapsApiKey = config.googleMapsApiKey;
        }

        if (googleMapsPromise) {
          await googleMapsPromise;
          setIsLoaded(true);
          return;
        }

        googleMapsPromise = new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places&language=de`;
          script.async = true;
          script.defer = true;

          script.onload = () => {
            setIsLoaded(true);
            resolve();
          };

          script.onerror = () => {
            const error = new Error("Failed to load Google Maps script");
            setError(error);
            reject(error);
          };

          document.head.appendChild(script);
        });

        await googleMapsPromise;
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      }
    };

    loadGoogleMaps();
  }, []);

  return { isLoaded, error };
}
