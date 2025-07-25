"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Calendar } from "lucide-react";
import { format, parseISO } from "date-fns";
import EditWatchEntry from "./EditWatchEntry";

interface RecentActivityProps {
  refreshTrigger: number;
  onEntryDeleted: () => void;
}

export default function RecentActivity({
  refreshTrigger,
  onEntryDeleted,
}: RecentActivityProps) {
  const [watchHistory, setWatchHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingEntry, setEditingEntry] = useState(null);

  // Fetch recent watch history
  const fetchRecentActivity = async () => {
    try {
      const response = await fetch("/api/watch-history?limit=10");
      const data = await response.json();

      if (response.ok) {
        setWatchHistory(data.watchHistory);
      } else {
        setError(data.error || "Failed to fetch recent activity");
      }
    } catch (error) {
      setError("Failed to fetch recent activity");
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete watch entry
  const deleteEntry = async (entryId) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      const response = await fetch(`/api/watch-history/${entryId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setWatchHistory((prev) => prev.filter((entry) => entry.id !== entryId));
        onEntryDeleted();
      } else {
        const data = await response.json();
        alert(`Failed to delete: ${data.error}`);
      }
    } catch (error) {
      alert("Failed to delete entry");
      console.error("Delete error:", error);
    }
  };

  // Update watch entry
  const updateEntry = async (entryId: number, newDate: string) => {
    try {
      const response = await fetch(`/api/watch-history/${entryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          watched_date: newDate,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setWatchHistory((prev) =>
          prev.map((entry) =>
            entry.id === entryId ? { ...entry, watched_date: newDate } : entry
          )
        );
        setEditingEntry(null);
      } else {
        alert(`Failed to update: ${data.error}`);
      }
    } catch (error) {
      alert("Failed to update entry");
      console.error("Update error:", error);
    }
  };

  useEffect(() => {
    fetchRecentActivity();
  }, [refreshTrigger]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500 dark:text-gray-400 transition-colors">
          Loading recent activity...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 dark:text-red-400 text-center py-4 transition-colors">
        {error}
      </div>
    );
  }

  if (watchHistory.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400 transition-colors">
        <Calendar className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4 transition-colors" />
        <p>No episodes watched yet.</p>
        <p className="text-sm">
          Start logging episodes to see your activity here!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
      {watchHistory.map((entry) => (
        <div key={entry.id}>
          {editingEntry === entry.id ? (
            <EditWatchEntry
              entry={entry}
              onSave={updateEntry}
              onCancel={() => setEditingEntry(null)}
            />
          ) : (
            <Card className="p-0 dark:bg-gray-800 dark:border-gray-700 transition-colors">
              <CardContent className="p-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-sm dark:text-white transition-colors">
                      Episode {entry.episode?.id}: {entry.episode?.title}
                    </p>
                    {entry.episode?.arc_title && (
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5 transition-colors">
                        Arc: {entry.episode.arc_title}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors">
                      Watched:{" "}
                      {format(parseISO(entry.watched_date), "MMM dd, yyyy")}
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setEditingEntry(entry.id)}
                    >
                      <Pencil className="h-3 w-3 dark:text-gray-300" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 transition-colors"
                      onClick={() => deleteEntry(entry.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ))}

      {watchHistory.length === 10 && (
        <div className="text-center pt-2">
          <Button
            variant="outline"
            size="sm"
            className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            View All History
          </Button>
        </div>
      )}
    </div>
  );
}
