import { useEffect, useState } from "react";

interface ClockWidgetProps {
  className?: string;
}

function ClockWidget({ className = "" }: ClockWidgetProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <div
      className={`w-full h-full flex flex-col items-start p-3 justify-center ${className}`}
    >
      <div className="text-5xl font-bold text-black mb-3">
        {formatTime(time)}
      </div>
      <div className="w-full border-t-2 border-neutral-500 mb-3"></div>
      <div className="text-xl font-medium text-neutral-500 ">
        {formatDate(time)}
      </div>
    </div>
  );
}

export default ClockWidget;
