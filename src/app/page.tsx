"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EpisodeLogger from "@/components/EpisodeLogger";
import RecentActivty from "@/components/RecentActivity";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import ProgressTracker from "@/components/ProgressTracker";
import DarkModeToggle from "@/components/DarkModeToggle";
import Image from "next/image";
import { useWatchHistory } from "@/hooks/useWatchHistory";

export default function HomePage() {
  const { refreshTrigger, triggerRefresh } = useWatchHistory();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 transition-colors">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-6 relative">
          <div className="absolute top-0 right-0">
            <DarkModeToggle />
          </div>
          <div className="flex justify-center py-6">
            <Image
              src="/luffy-outline.png"
              alt="Luffy"
              width={90}
              height={60}
              priority
            />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">
            One Piece Tracker
          </h1>
        </div>

        <ProgressTracker refreshTrigger={refreshTrigger} />

        {/* Analytics Section */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">
              Analytics Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsDashboard refreshTrigger={refreshTrigger} />
          </CardContent>
        </Card>

        {/* Log Episode Grid */}
        {/* Left Column - Episode Logger */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Log Episode</CardTitle>
          </CardHeader>
          <CardContent>
            <EpisodeLogger onEpisodeLogged={triggerRefresh} />
          </CardContent>
        </Card>

        {/* Right Column - Recent Activity */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivty
              refreshTrigger={refreshTrigger}
              onEntryDeleted={triggerRefresh}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
