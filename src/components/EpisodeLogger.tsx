"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon, Search, Plus } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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

  // Log episode function
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
          watched_date: format(watchedDate, "yyyy-MM-dd"), // Format for API
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
      {/* Search Input with Dark Mode */}
      <div className="space-y-2">
        <Label htmlFor="episode-search" className="dark:text-gray-200">
          Search Episodes
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <Input
            id="episode-search"
            placeholder="Search by episode number (e.g. 1000) or title/arc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
          />
        </div>
        {/* Helper text */}
        <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
          💡 Tip: Type a number to search by episode ID, or text to search
          titles/arcs
        </p>
      </div>

      {/* Search Results with Dark Mode */}
      {episodes.length > 0 && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          <Label className="dark:text-gray-200">Select Episode</Label>
          {episodes.map((episode) => (
            <Card
              key={episode.id}
              className={`cursor-pointer transition-colors p-0 border ${
                selectedEpisode?.id === episode.id
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 dark:border-gray-600"
              }`}
              onClick={() => setSelectedEpisode(episode)}
            >
              <CardContent className="p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium dark:text-white transition-colors">
                      Episode {episode.id}: {episode.title}
                    </p>
                    {episode.arc_title && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors">
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

      {/* Selected Episode Section with Dark Mode */}
      {selectedEpisode && (
        <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/30 transition-colors">
          <div>
            <Label className="text-blue-700 dark:text-blue-300 transition-colors">
              Selected Episode
            </Label>
            <p className="font-medium text-blue-900 dark:text-blue-100 transition-colors">
              Episode {selectedEpisode.id}: {selectedEpisode.title}
            </p>
            {selectedEpisode.arc_title && (
              <p className="text-sm text-blue-700 dark:text-blue-300 transition-colors">
                Arc: {selectedEpisode.arc_title}
              </p>
            )}
          </div>

          {/* ShadCN Date Picker */}
          <div className="space-y-2">
            <Label className="dark:text-blue-300 transition-colors">
              Date Watched
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700",
                    !watchedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {watchedDate ? (
                    format(watchedDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 dark:bg-gray-800 dark:border-gray-600"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={watchedDate}
                  onSelect={(date) => date && setWatchedDate(date)}
                  initialFocus
                  className="dark:bg-gray-800"
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button
            onClick={logEpisode}
            disabled={isLoading}
            className="w-full dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            {isLoading ? "Logging..." : "Log Episode"}
          </Button>
        </div>
      )}

      {/* Success/Error Message with Dark Mode */}
      {message && (
        <div
          className={`p-3 rounded-lg border transition-colors ${
            message.includes("✅")
              ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800/30"
              : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800/30"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
