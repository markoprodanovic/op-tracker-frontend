"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, TrendingUp } from "lucide-react";
import Image from "next/image";

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
      <Card>
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
      <Card>
        <CardContent className="p-6">
          <div className="text-red-600 text-center">{error}</div>
        </CardContent>
      </Card>
    );
  }

  if (!progressData) {
    return (
      <Card>
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
  } = progressData;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          One Piece Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Progress Bar with Ship */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              Series Progress
            </span>
            <span
              className={`text-sm font-bold ${
                isCaughtUp ? "text-green-600" : "text-blue-600"
              }`}
            >
              {progressPercentage}%
            </span>
          </div>

          {/* <div className="relative"> */}
          <Progress
            value={progressPercentage}
            className="h-3 bg-blue-100 [&>div]:bg-gradient-to-r [&>div]:from-sky-400 [&>div]:to-blue-600 [&>div]:shadow-md"
          />

          <div className="flex justify-between text-xs text-gray-500">
            <span>Episode 1</span>
            <span>Episode {latestAvailable} (Latest)</span>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Highest Watched */}
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">
                Highest Watched
              </span>
            </div>
            <p className="text-lg font-bold text-blue-900">
              Episode {highestWatched}
            </p>
          </div>

          {/* Total Episodes */}
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Trophy className="h-4 w-4 text-purple-600" />
              <span className="text-xs font-medium text-purple-700">
                Episodes Tracked
              </span>
            </div>
            <p className="text-lg font-bold text-purple-900">{totalWatched}</p>
          </div>

          {/* Episodes Behind */}
          <div
            className={`text-center p-3 rounded-lg ${
              isCaughtUp ? "bg-green-50" : "bg-orange-50"
            }`}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <Target
                className={`h-4 w-4 ${
                  isCaughtUp ? "text-green-600" : "text-orange-600"
                }`}
              />
              <span
                className={`text-xs font-medium ${
                  isCaughtUp ? "text-green-700" : "text-orange-700"
                }`}
              >
                {isCaughtUp ? "Status" : "Episodes Behind"}
              </span>
            </div>
            <p
              className={`text-lg font-bold ${
                isCaughtUp ? "text-green-900" : "text-orange-900"
              }`}
            >
              {isCaughtUp ? "Caught Up!" : latestAvailable - highestWatched}
            </p>
          </div>
        </div>

        {/* Status Message */}
        <div
          className={`text-center p-3 rounded-lg border ${
            isCaughtUp
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-blue-50 border-blue-200 text-blue-800"
          }`}
        >
          {isCaughtUp ? (
            <p className="text-sm font-medium">
              🎉 Congratulations! You&apos;re caught up with One Piece!
            </p>
          ) : (
            <p className="text-sm">
              <span className="font-medium">
                {latestAvailable - highestWatched} episodes
              </span>{" "}
              until you&apos;re caught up with the latest release
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
