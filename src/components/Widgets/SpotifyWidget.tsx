import { useEffect, useState } from "react";
import { Music } from "lucide-react";

interface SpotifyTrack {
  is_playing: boolean;
  track_name?: string;
  artists?: string[];
  album_name?: string;
  album_art_url?: string;
  duration_ms?: number;
  progress_ms?: number;
}

interface SpotifyWidgetProps {
  className?: string;
}

function SpotifyWidget({ className = "" }: SpotifyWidgetProps) {
  const [track, setTrack] = useState<SpotifyTrack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        setError(null);
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
        const response = await fetch(`${backendUrl}/api/spotify/now-playing`);

        if (!response.ok) {
          throw new Error("Failed to fetch Spotify data");
        }

        const data = await response.json();
        setTrack(data);
      } catch (err) {
        setError("Spotify konnte nicht geladen werden");
        console.error("Error fetching Spotify data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNowPlaying();
    // Refresh every 30 seconds to stay current
    const interval = setInterval(fetchNowPlaying, 30000);

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
        <div className="text-red-500 text-sm text-center px-4">{error}</div>
      </div>
    );
  }

  if (!track || !track.is_playing) {
    return (
      <div
        ref={(el: HTMLDivElement | null) => {
          if (el) {
            const h = el.getBoundingClientRect().height;
            setHeight(h);
          }
        }}
        className={`w-full h-full flex flex-col items-center justify-center p-4 ${className}`}
      >
        <Music className="text-neutral-500 mb-2" size={48} />
        <div className="text-neutral-500 text-center">Nichts läuft gerade</div>
      </div>
    );
  }

  // If height is less than 380, render simplified version
  if (height > 0 && height < 380) {
    return (
      <div
        ref={(el: HTMLDivElement | null) => {
          if (el) {
            const h = el.getBoundingClientRect().height;
            setHeight(h);
          }
        }}
        className={`w-full h-full flex flex-row p-4 ${className}`}
      >
        {/* Album art and track info container - responsive layout based on height */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-4">
            {/* Album art */}
            {track.album_art_url && (
              <div className="flex-shrink-0 flex items-start justify-center">
                <img
                  src={track.album_art_url}
                  alt={track.album_name}
                  className="w-32 h-auto object-cover rounded-lg grayscale"
                />
              </div>
            )}
            {/* Track information */}
            <div className="flex-1 flex flex-col justify-start min-w-0">
              <div className="space-y-2">
                {/* Artists */}
                {track.artists && track.artists.length > 0 && (
                  <p className="text-sm sm:text-base max-h-[300px]:text-sm text-neutral-600 truncate">
                    {track.artists.join(", ")}
                  </p>
                )}

                {/* Album name */}
                {track.album_name && (
                  <p className="text-xs sm:text-sm max-h-[300px]:text-xs text-neutral-600 truncate">
                    {track.album_name}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="w-full border-t-2 border-neutral-500"></div>
          {/* Track name */}
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-black truncate">
            {track.track_name}
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={(el: HTMLDivElement | null) => {
        if (el) {
          const h = el.getBoundingClientRect().height;
          setHeight(h);
        }
      }}
      className={`w-full h-full flex flex-col p-4 ${className}`}
    >
      {/* Album art and track info container - responsive layout based on height */}
      <div className="flex flex-col">
        {/* Album art */}
        {track.album_art_url && (
          <div className="flex-shrink-0 flex items-center justify-center">
            <img
              src={track.album_art_url}
              alt={track.album_name}
              className="w-56 h-auto object-cover rounded-lg grayscale mb-4"
            />
          </div>
        )}

        {/* Track information */}
        <div className="flex-1 flex flex-col justify-start min-w-0">
          <div className="space-y-2">
            {/* Track name */}
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-black truncate">
              {track.track_name}
            </h3>

            <div className="w-full border-t-2 border-neutral-500 mt-4 mb-4"></div>

            {/* Artists */}
            {track.artists && track.artists.length > 0 && (
              <p className="text-sm sm:text-base max-h-[300px]:text-sm text-neutral-600 truncate">
                {track.artists.join(", ")}
              </p>
            )}

            {/* Album name */}
            {track.album_name && (
              <p className="text-xs sm:text-sm max-h-[300px]:text-xs text-neutral-600 truncate">
                {track.album_name}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpotifyWidget;
