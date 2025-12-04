import { useEffect, useState } from "react";
import {
  Cloud,
  CloudRain,
  CloudSnow,
  Sun,
  CloudDrizzle,
  CloudLightning,
  Wind,
  CloudFog,
} from "lucide-react";

interface WeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
  description: string;
  icon: string;
  wind_speed: number;
  city: string;
}

interface CurrentWeatherWidgetProps {
  className?: string;
}

function CurrentWeatherWidget({ className = "" }: CurrentWeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
        const response = await fetch(`${backendUrl}/api/weather/current`);

        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }

        const data = await response.json();
        setWeather(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      }
    };

    fetchWeather();

    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (iconCode: string) => {

    const iconMap: { [key: string]: React.ReactElement } = {
      "01": <Sun className="w-16 h-16" />,
      "02": <Cloud className="w-16 h-16" />,
      "03": <Cloud className="w-16 h-16" />,
      "04": <Cloud className="w-16 h-16" />,
      "09": <CloudDrizzle className="w-16 h-16" />,
      "10": <CloudRain className="w-16 h-16" />,
      "11": <CloudLightning className="w-16 h-16" />,
      "13": <CloudSnow className="w-16 h-16" />,
      "50": <CloudFog className="w-16 h-16" />,
    };

    const iconPrefix = iconCode.slice(0, 2);
    return iconMap[iconPrefix] || <Cloud className="w-16 h-16" />;
  };

  if (loading) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center ${className}`}
      >
        <div className="text-neutral-500">Loading weather...</div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center ${className}`}
      >
        <div className="text-red-500">
          {error || "Failed to load weather"}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full h-full flex flex-col items-start p-4 justify-between ${className}`}
    >
      <div className="flex items-start justify-between w-full">
        <div className="flex flex-col">
          <div className="text-6xl font-bold text-black">{weather.temp}°</div>
          <div className="text-xl text-neutral-500 mt-1">
            Feels like {weather.feels_like}°
          </div>
        </div>
        <div className="text-black">{getWeatherIcon(weather.icon)}</div>
      </div>

      <div className="w-full">
        <div className="text-xl font-medium text-black mb-2">
          {weather.description}
        </div>
        <div className="w-full border-t-2 border-neutral-500 mb-3"></div>
        <div className="flex justify-between text-neutral-500">
          <div className="flex items-center gap-2">
            <Wind className="w-5 h-5" />
            <span>{weather.wind_speed} km/h</span>
          </div>
          <div className="flex items-center gap-2">
            <CloudDrizzle className="w-5 h-5" />
            <span>{weather.humidity}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CurrentWeatherWidget;
