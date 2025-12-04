import { useEffect, useState } from "react";
import WidgetContainer from "./components/WidgetContainer";
import DebugWidget from "./components/Widgets/DebugWidget";
import ClockWidget from "./components/Widgets/ClockWidget";
import MapWidget from "./components/Widgets/MapWidget";
import QuoteWidget from "./components/Widgets/QuoteWidget";
import TransportWidget from "./components/Widgets/TransportWidget";
import AnniversaryWidget from "./components/Widgets/AnniversaryWidget";
import ForecastWeatherWidget from "./components/Widgets/ForecastWeatherWidget";
import CurrentWeatherWidget from "./components/Widgets/CurrentWeatherWidget";
import CalendarWidget from "./components/Widgets/CalendarWidget";
import SpotifyWidget from "./components/Widgets/SpotifyWidget";

interface WidgetConfig {
  widget: string;
  title: string;
  icon: string;
}

interface AppConfig {
  myName: string;
  anniversaryDate: string;
  googleMapsApiKey: string;
  googleMapsZoom: number;
  googleMapsStyle: string;
  location: {
    latitude: number;
    longitude: number;
  };
  leftWidgets: WidgetConfig[];
  rightWidgets: WidgetConfig[];
}

function App() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
        const response = await fetch(`${backendUrl}/api/config`);
        if (response.ok) {
          const data = await response.json();
          setConfig(data);
        }
      } catch (err) {
        console.error("Failed to fetch config:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const renderWidget = (widgetConfig: WidgetConfig) => {
    const { widget } = widgetConfig;
    
    if (!config) return null;
    
    switch (widget) {
      case "Map":
        return (
          <MapWidget
            zoom={config.googleMapsZoom}
            mapStyleId={config.googleMapsStyle}
          />
        );
      case "Anniversary":
        return <AnniversaryWidget />;
      case "Calendar":
        return <CalendarWidget />;
      case "Spotify":
        return <SpotifyWidget />;
      case "Quote":
        return <QuoteWidget />;
      case "Transport":
        return <TransportWidget />;
      case "CurrentWeather":
        return <CurrentWeatherWidget />;
      case "ForecastWeather":
        return <ForecastWeatherWidget />;
      case "Debug":
        return <DebugWidget />;
      default:
        return <div>Unknown widget: {widget}</div>;
    }
  };

  if (loading || !config) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-neutral-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-2 h-screen p-4">
      <WidgetContainer 
        title={config.leftWidgets[0]?.title} 
        icon={config.leftWidgets[0]?.icon} 
        className="row-span-3"
      >
        {config.leftWidgets.map((widgetConfig, index) => (
          <div key={index} className="w-full h-full">{renderWidget(widgetConfig)}</div>
        ))}
      </WidgetContainer>
      <div className="col-start-2 row-start-1 row-span-3 grid grid-rows-3 gap-2">
        <WidgetContainer className="row-span-1">
          <ClockWidget />
        </WidgetContainer>
        <WidgetContainer 
          title={config.rightWidgets[0]?.title} 
          icon={config.rightWidgets[0]?.icon} 
          className="row-span-2"
        >
          {config.rightWidgets.map((widgetConfig, index) => (
            <div key={index} className="w-full h-full">{renderWidget(widgetConfig)}</div>
          ))}
        </WidgetContainer>
      </div>
    </div>
  );
}

export default App;
