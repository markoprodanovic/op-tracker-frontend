"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EpisodeLogger from "@/components/EpisodeLogger";
import RecentActivty from "@/components/RecentActivity";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import ProgressTracker from "@/components/ProgressTracker";
import DarkModeToggle from "@/components/DarkModeToggle";
import Image from "next/image";
import { useWatchHistory } from "@/hooks/useWatchHistory";
import { useAuth } from "@/hooks/useAuth";
import { signIn, signOut } from "next-auth/react";
import { testConnection } from "@/lib/database-test";

export default function HomePage() {
  const { refreshTrigger, triggerRefresh } = useWatchHistory();
  const { isAdmin, isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-white"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 transition-colors">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center py-6 relative">
          <div className="absolute top-0 right-0 flex items-center gap-2">
            {isAuthenticated && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {user?.email}
                </span>
                <Button onClick={() => signOut()} variant="outline" size="sm">
                  Sign Out
                </Button>
              </div>
            )}
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

        {isAdmin ? (
          <>
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Log Episode</CardTitle>
              </CardHeader>
              <CardContent>
                <EpisodeLogger onEpisodeLogged={triggerRefresh} />
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RecentActivty
                  refreshTrigger={refreshTrigger}
                  onEntryDeleted={triggerRefresh}
                />
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Admin Features</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Want to log episodes and manage the tracker?
              </p>
              <Button onClick={() => signIn()}>Sign in as Admin</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
