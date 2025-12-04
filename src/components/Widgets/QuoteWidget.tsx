import { useEffect, useState } from "react";

interface Quote {
  text: string;
  author: string;
}

interface QuoteWidgetProps {
  className?: string;
}

function QuoteWidget({ className = "" }: QuoteWidgetProps) {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        setLoading(true);
        setError(null);
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
        const response = await fetch(`${backendUrl}/api/quote`);

        if (!response.ok) {
          throw new Error("Failed to fetch quote");
        }

        const data = await response.json();
        setQuote(data);
      } catch (err) {
        setError("Zitat konnte nicht geladen werden");
        console.error("Error fetching quote:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
    const interval = setInterval(fetchQuote, 24 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center ${className}`}
      >
        <div className="text-neutral-500">Lädt...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center ${className}`}
      >
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!quote) {
    return null;
  }

  return (
    <div
      className={`w-full h-full flex flex-col items-start justify-between p-4 ${className}`}
    >
      <div className="flex-1 flex items-center">
        <p className="text-lg text-black italic leading-relaxed">
          "{quote.text}"
        </p>
      </div>
      <div className="w-full border-t-2 border-neutral-500 mt-4 pt-3">
        <p className="text-sm text-neutral-500 font-medium text-right">
          — {quote.author}
        </p>
      </div>
    </div>
  );
}

export default QuoteWidget;
