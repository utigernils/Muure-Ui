import { useEffect, useState } from "react";

interface AnniversaryWidgetProps {
  className?: string;
}

interface TimeSpan {
  years: number;
  months: number;
  days: number;
}

function AnniversaryWidget({ className = "" }: AnniversaryWidgetProps) {
  const [timespan, setTimespan] = useState<TimeSpan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [myName, setMyName] = useState<string>("");

  useEffect(() => {
    const fetchConfigAndCalculate = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
        const response = await fetch(`${backendUrl}/api/config`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch config");
        }

        const config = await response.json();
        setMyName(config.myName);

        if (!config.anniversaryDate) {
          setError("Jubiläumsdatum nicht konfiguriert");
          return;
        }

        const startDate = new Date(config.anniversaryDate);
        const today = new Date();

        if (isNaN(startDate.getTime())) {
          setError("Ungültiges Datum");
          return;
        }

        let years = today.getFullYear() - startDate.getFullYear();
        let months = today.getMonth() - startDate.getMonth();
        let days = today.getDate() - startDate.getDate();

        if (days < 0) {
          months--;
          const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
          days += lastMonth.getDate();
        }

        if (months < 0) {
          years--;
          months += 12;
        }

        setTimespan({ years, months, days });
        setError(null);
      } catch (err) {
        setError("Fehler bei der Berechnung");
        console.error("Error calculating timespan:", err);
      }
    };

    fetchConfigAndCalculate();
    const interval = setInterval(fetchConfigAndCalculate, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center ${className}`}
      >
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!timespan) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center ${className}`}
      >
        <div className="text-neutral-500">Lädt...</div>
      </div>
    );
  }

  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center p-4 ${className}`}
    >
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-neutral-500 mb-2">
          Du und {myName} sind zusammen seit:
        </h3>
      </div>
      <div className="flex gap-8 items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="text-4xl font-bold text-black">{timespan.years}</div>
          <div className="text-lg text-neutral-500 mt-1">
            {timespan.years === 1 ? "Jahr" : "Jahre"}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-4xl font-bold text-black">{timespan.months}</div>
          <div className="text-lg text-neutral-500 mt-1">
            {timespan.months === 1 ? "Monat" : "Monate"}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-4xl font-bold text-black">{timespan.days}</div>
          <div className="text-lg text-neutral-500 mt-1">
            {timespan.days === 1 ? "Tag" : "Tage"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnniversaryWidget;
