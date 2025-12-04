import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";

interface Departure {
  name: string;
  category: string;
  to: string;
  departure: string;
  platform: string;
  delay?: number;
}

interface TransportWidgetProps {
  className?: string;
}

function TransportWidget({ className = "" }: TransportWidgetProps) {
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartures = async () => {
    try {
      setError(null);
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
      const response = await fetch(`${backendUrl}/api/transport/departures`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setDepartures(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching departures:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch departures",
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartures();

    const interval = setInterval(fetchDepartures, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("de-CH", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center ${className}`}
      >
        <div className="text-neutral-600">Loading departures...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center p-4 ${className}`}
      >
        <AlertCircle className="text-red-500 mb-2" size={32} />
        <div className="text-red-600 text-center">{error}</div>
        <button
          onClick={fetchDepartures}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      className={`w-full h-full flex flex-col p-3 overflow-hidden ${className}`}
    >
      <div className="flex-1 overflow-hidden">
        {departures.length === 0 ? (
          <div className="flex items-center justify-center h-full text-neutral-500">
            No departures found
          </div>
        ) : (
          <div className="space-y-4">
            {departures.map((departure, index) => {
              const isDelayed = (departure.delay ?? 0) > 0;

              return (
                <div key={index} className="flex flex-col">
                  <div className="flex items-baseline justify-between mb-2">
                    <div className="text-3xl font-bold text-black">
                      {formatTime(departure.departure)}
                    </div>
                    {isDelayed && (
                      <span className="text-neutral-500 text-lg font-medium">
                        +{departure.delay}'
                      </span>
                    )}
                  </div>
                  <div className="border-t-2 border-neutral-500 mb-2"></div>
                  <div className="flex items-center justify-between text-lg">
                    <div className="text-neutral-500 font-medium truncate flex-1">
                      {departure.to}
                    </div>
                    <div className="text-neutral-500 font-medium ml-4">
                      Gleis {departure.platform}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default TransportWidget;
