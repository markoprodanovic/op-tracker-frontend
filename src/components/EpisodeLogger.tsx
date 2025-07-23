"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Search, Plus } from "lucide-react";
import { format } from "date-fns";

interface EpisodeLoggerProps {
  onEpisodeLogged: () => void;
}

export default function EpisodeLogger({ onEpisodeLogged }: EpisodeLoggerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [episodes, setEpisodes] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [watchedDate, setWatchedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Enhanced search episodes function
  const searchEpisodes = async () => {
    if (!searchTerm.trim()) {
      setEpisodes([]);
      return;
    }

    try {
      // Check if search term is a number (episode ID)
      const isNumber = /^\d+$/.test(searchTerm.trim());

      let url = "/api/episodes?";

      if (isNumber) {
        // Search by episode ID
        url += `episode_id=${searchTerm.trim()}`;
      } else {
        // Search by title/arc
        url += `search=${encodeURIComponent(searchTerm)}&limit=10`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setEpisodes(data.episodes);
      } else {
        console.error("Failed to search episodes:", data.error);
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchEpisodes();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Rest of the component remains the same...
  const logEpisode = async () => {
    if (!selectedEpisode) return;

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/watch-history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          episode_id: selectedEpisode.id,
          watched_date: watchedDate,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(
          `✅ Successfully logged Episode ${selectedEpisode.id}: ${selectedEpisode.title}`
        );
        setSelectedEpisode(null);
        setSearchTerm("");
        setEpisodes([]);

        onEpisodeLogged();
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (error) {
      setMessage("❌ Failed to log episode");
      console.error("Log error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Updated Search Input with better placeholder */}
      <div className="space-y-2">
        <Label htmlFor="episode-search">Search Episodes</Label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="episode-search"
            placeholder="Search by episode number (e.g. 1000) or title/arc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        {/* Helper text */}
        <p className="text-xs text-gray-500">
          💡 Tip: Type a number to search by episode ID, or text to search
          titles/arcs
        </p>
      </div>

      {/* Rest of the component remains exactly the same... */}
      {episodes.length > 0 && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          <Label>Select Episode</Label>
          {episodes.map((episode) => (
            <Card
              key={episode.id}
              className={`cursor-pointer transition-colors p-1 ${
                selectedEpisode?.id === episode.id
                  ? "border-blue-500 bg-blue-50"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => setSelectedEpisode(episode)}
            >
              <CardContent className="p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">
                      Episode {episode.id}: {episode.title}
                    </p>
                    {episode.arc_title && (
                      <p className="text-sm text-gray-600">
                        Arc: {episode.arc_title}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedEpisode && (
        <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div>
            <Label className="text-blue-700">Selected Episode</Label>
            <p className="font-medium text-blue-900">
              Episode {selectedEpisode.id}: {selectedEpisode.title}
            </p>
            {selectedEpisode.arc_title && (
              <p className="text-sm text-blue-700">
                Arc: {selectedEpisode.arc_title}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="watched-date">Date Watched</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="watched-date"
                type="date"
                value={watchedDate}
                onChange={(e) => setWatchedDate(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Button onClick={logEpisode} disabled={isLoading} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            {isLoading ? "Logging..." : "Log Episode"}
          </Button>
        </div>
      )}

      {message && (
        <div
          className={`p-3 rounded-lg ${
            message.includes("✅")
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
