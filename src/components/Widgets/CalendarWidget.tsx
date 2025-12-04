import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, AlertCircle } from "lucide-react";

interface CalendarEvent {
  date: string;
  time: string | null;
  is_all_day: boolean;
  title: string;
  description: string;
  location: string;
}

interface CalendarData {
  date: string;
  is_today: boolean;
  events: CalendarEvent[];
}

interface CalendarWidgetProps {
  className?: string;
}

function CalendarWidget({ className = "" }: CalendarWidgetProps) {
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCalendar = async () => {
    try {
      setError(null);
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
      const response = await fetch(`${backendUrl}/api/calendar/events`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCalendarData(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching calendar:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch calendar",
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar();

    const interval = setInterval(fetchCalendar, 300000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return null;
    
    const [hours, minutes] = timeStr.split(":");
    return `${hours}:${minutes}`;
  };

  if (loading) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center ${className}`}
      >
        <div className="text-neutral-500">Loading calendar...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center p-4 ${className}`}
      >
        <AlertCircle className="text-neutral-500 mb-2" size={32} />
        <div className="text-neutral-500 text-center">{error}</div>
      </div>
    );
  }

  if (!calendarData || calendarData.events.length === 0) {
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center p-4 ${className}`}
      >
        <Calendar className="text-neutral-500 mb-2" size={48} />
        <div className="text-neutral-500 text-center">No upcoming events</div>
      </div>
    );
  }

  const todayEvents = calendarData.events.filter((event) => {
    const eventDate = new Date(event.date);
    const today = new Date();
    
    if (eventDate.toDateString() !== today.toDateString()) {
      return false;
    }
    
    if (event.is_all_day) {
      return true;
    }
    
    if (event.time) {
      const [hours, minutes] = event.time.split(":").map(Number);
      const eventDateTime = new Date(eventDate);
      eventDateTime.setHours(hours, minutes, 0, 0);
      
      return eventDateTime >= today;
    }
    
    return true;
  });

  if (todayEvents.length === 0) {
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center p-4 ${className}`}
      >
        <Calendar className="text-neutral-500 mb-2" size={48} />
        <div className="text-neutral-500 text-center">Keine Ereignisse heute</div>
      </div>
    );
  }

  return (
    <div
      className={`w-full h-full flex flex-col p-4 overflow-hidden ${className}`}
    >
      <div className="flex-1 overflow-y-auto space-y-4">
        {todayEvents.map((event, index) => (
          <div
            key={index}
            className="border-l-2 border-neutral-500 pl-3 py-2"
          >
            <div className="flex items-start justify-between mb-1">
              <h3 className="text-lg font-semibold text-black">
                {event.title}
              </h3>
              {!event.is_all_day && event.time && (
                <div className="flex items-center gap-1 text-neutral-500 text-sm">
                  <Clock size={14} />
                  <span>{formatTime(event.time)}</span>
                </div>
              )}
              {event.is_all_day && (
                <div className="text-neutral-500 text-sm">Ganztägig</div>
              )}
            </div>

            {event.location && (
              <div className="flex items-center gap-1 text-neutral-500 text-sm mb-1">
                <MapPin size={14} />
                <span>{event.location}</span>
              </div>
            )}

            {event.description && (
              <p className="text-neutral-500 text-sm mt-2 line-clamp-2">
                {event.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CalendarWidget;
