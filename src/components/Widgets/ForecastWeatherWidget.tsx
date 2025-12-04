import { useEffect, useState } from "react";
import {
  Cloud,
  CloudRain,
  CloudSnow,
  Sun,
  CloudDrizzle,
  CloudLightning,
  CloudFog,
} from "lucide-react";

interface DayForecast {
  date: string;
  day: string;
  temp_max: number;
  temp_min: number;
  description: string;
  icon: string;
  humidity: number;
  pop: number; 
}

interface ForecastWeatherWidgetProps {
  className?: string;
}

function ForecastWeatherWidget({
  className = "",
}: ForecastWeatherWidgetProps) {
  const [forecast, setForecast] = useState<DayForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
        const response = await fetch(`${backendUrl}/api/weather/forecast`);

        if (!response.ok) {
          throw new Error("Failed to fetch forecast data");
        }

        const data = await response.json();
        setForecast(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      }
    };

    fetchForecast();
    
    const interval = setInterval(fetchForecast, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (iconCode: string, size: string = "w-10 h-10") => {
    const iconMap: { [key: string]: React.ReactElement } = {
      "01": <Sun className={size} />,
      "02": <Cloud className={size} />,
      "03": <Cloud className={size} />,
      "04": <Cloud className={size} />,
      "09": <CloudDrizzle className={size} />,
      "10": <CloudRain className={size} />,
      "11": <CloudLightning className={size} />,
      "13": <CloudSnow className={size} />,
      "50": <CloudFog className={size} />,
    };

    const iconPrefix = iconCode.slice(0, 2);
    return iconMap[iconPrefix] || <Cloud className={size} />;
  };

  if (loading) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center ${className}`}
      >
        <div className="text-neutral-500">Loading forecast...</div>
      </div>
    );
  }

  if (error || forecast.length === 0) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center ${className}`}
      >
        <div className="text-red-500">
          {error || "Failed to load forecast"}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full h-full flex flex-col p-4 justify-between ${className}`}
    >
      {forecast.map((day, index) => (
        <div key={day.date} className="flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="text-lg font-semibold text-black min-w-[60px]">
                {day.day}
              </div>
              <div className="text-black">{getWeatherIcon(day.icon)}</div>
              <div className="text-sm text-black flex-1">
                {day.description}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-neutral-500">
                {day.pop > 0 && `${day.pop}%`}
              </div>
              <div className="flex items-baseline gap-1 min-w-[70px] justify-end">
                <span className="text-xl font-bold text-black">
                  {day.temp_max}°
                </span>
                <span className="text-lg text-neutral-500">{day.temp_min}°</span>
              </div>
            </div>
          </div>
          {index < forecast.length - 1 && (
            <div className="w-full border-t-2 border-neutral-500 mt-2"></div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ForecastWeatherWidget;
