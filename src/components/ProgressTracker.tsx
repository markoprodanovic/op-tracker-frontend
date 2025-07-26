"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, TrendingUp } from "lucide-react";

interface ProgressTrackerProps {
  refreshTrigger: number;
}

export default function ProgressTracker({
  refreshTrigger,
}: ProgressTrackerProps) {
  const [progressData, setProgressData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProgress = async () => {
    try {
      const response = await fetch("/api/progress");
      const data = await response.json();

      if (response.ok) {
        setProgressData(data);
      } else {
        setError(data.error || "Failed to fetch progress");
      }
    } catch (error) {
      setError("Failed to fetch progress");
      console.error("Progress fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [refreshTrigger]);

  if (isLoading) {
    return (
      <Card className="dark:bg-gray-800 transition-colorsj">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-gray-500">Loading progress...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="dark:bg-gray-800 transition-colors">
        <CardContent className="p-6">
          <div className="text-red-600 text-center">{error}</div>
        </CardContent>
      </Card>
    );
  }

  if (!progressData) {
    return (
      <Card className="dark:bg-gray-800 transition-colors">
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            No progress data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const {
    latestAvailable,
    highestWatched,
    progressPercentage,
    totalWatched,
    isCaughtUp,
    lastWatchedReleaseDate,
  } = progressData;

  return (
    <Card className="dark:bg-gray-800 transition-colors">
      <CardContent className="space-y-6">
        {/* Main Progress Bar */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
              Series Progress
            </span>
            <span
              className={`text-sm font-bold transition-colors ${
                isCaughtUp
                  ? "text-green-600 dark:text-green-400"
                  : "text-blue-600 dark:text-blue-400"
              }`}
            >
              {progressPercentage}%
            </span>
          </div>

          <Progress
            value={progressPercentage}
            className="h-3 bg-blue-100 dark:bg-gray-700 [&>div]:bg-gradient-to-r [&>div]:from-sky-400 [&>div]:to-blue-600 dark:[&>div]:from-blue-400 dark:[&>div]:to-cyan-400 [&>div]:shadow-md transition-colors"
          />

          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-50 transition-colors">
            <span>Episode 1</span>
            <span>Episode {latestAvailable} (Latest)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Latest Watched */}
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30 transition-colors">
            <div className="flex items-center justify-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                Latest Watched
              </span>
            </div>
            <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
              Episode {highestWatched}
            </p>
          </div>

          {/* Total Episodes */}
          <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800/30 transition-colors">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Trophy className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                Episodes Tracked
              </span>
            </div>
            <p className="text-lg font-bold text-purple-900 dark:text-purple-100">
              {totalWatched}
            </p>
          </div>

          {/* Episodes Remaining */}
          <div
            className={`text-center p-3 rounded-lg border transition-colors ${
              isCaughtUp
                ? "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800/30"
                : "bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800/30"
            }`}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <Target
                className={`h-4 w-4 ${
                  isCaughtUp
                    ? "text-green-600 dark:text-green-400"
                    : "text-orange-600 dark:text-orange-400"
                }`}
              />
              <span
                className={`text-xs font-medium ${
                  isCaughtUp
                    ? "text-green-700 dark:text-green-300"
                    : "text-orange-700 dark:text-orange-300"
                }`}
              >
                {isCaughtUp ? "Status" : "Episodes Remaining"}
              </span>
            </div>
            <p
              className={`text-lg font-bold ${
                isCaughtUp
                  ? "text-green-900 dark:text-green-100"
                  : "text-orange-900 dark:text-orange-100"
              }`}
            >
              {isCaughtUp ? "Caught Up!" : latestAvailable - highestWatched}
            </p>
          </div>
        </div>

        {/* Status Message */}
        <div
          className={`text-center p-3 rounded-lg border transition-colors ${
            isCaughtUp
              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30 text-green-800 dark:text-green-200"
              : "bg-pink-50 dark:bg-pink-800/20 border-pink-200 dark:border-pink-700/30 text-pink-800 dark:text-pink-200"
          }`}
        >
          {isCaughtUp ? (
            <p className="text-sm font-medium">
              🎉 Congratulations! You&apos;re caught up with One Piece!
            </p>
          ) : (
            <p className="text-sm">
              Last episode you watched came out on{" "}
              <span className="font-medium">{lastWatchedReleaseDate}</span>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
