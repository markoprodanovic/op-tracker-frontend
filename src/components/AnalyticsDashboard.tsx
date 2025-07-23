"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, TrendingUp, BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, subDays, subMonths } from "date-fns";

interface AnalyticsDashboardProps {
  refreshTrigger: number;
}

const colors = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7c7c",
  "#8dd1e1",
  "#d084d0",
  "#ffb366",
  "#87d68d",
  "#ffaaaa",
  "#aabbcc",
  "#ff9999",
  "#66b3ff",
  "#99ff99",
  "#ffcc99",
  "#ff99cc",
];

export default function AnalyticsDashboard({
  refreshTrigger,
}: AnalyticsDashboardProps) {
  const [chartData, setChartData] = useState([]);
  const [totalEpisodes, setTotalEpisodes] = useState(0);
  const [episodesThisWeek, setEpisodesThisWeek] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("30days"); // '7days', '30days', '3months', 'all'

  // Get unique arcs for dynamic colors
  const [arcColors, setArcColors] = useState({});

  // Fetch analytics data
  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    try {
      let url = "/api/analytics";

      // Add date filters based on time range
      if (timeRange !== "all") {
        const endDate = new Date();
        let startDate: Date;

        switch (timeRange) {
          case "7days":
            startDate = subDays(endDate, 7);
            break;
          case "30days":
            startDate = subDays(endDate, 30);
            break;
          case "3months":
            startDate = subMonths(endDate, 3);
            break;
          default:
            startDate = subDays(endDate, 30);
        }

        url += `?start_date=${format(
          startDate,
          "yyyy-MM-dd"
        )}&end_date=${format(endDate, "yyyy-MM-dd")}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setChartData(data.chartData || []);
        setTotalEpisodes(data.totalEpisodes || 0);
        setEpisodesThisWeek(data.episodesThisWeek || 0);

        // Generate colors for arcs
        const arcs = new Set();
        data.chartData?.forEach((day) => {
          Object.keys(day).forEach((key) => {
            if (key !== "date" && key !== "fullDate") {
              arcs.add(key);
            }
          });
        });

        const newArcColors = {};
        Array.from(arcs).forEach((arc, index) => {
          newArcColors[arc as string] = colors[index % colors.length];
        });
        setArcColors(newArcColors);
      } else {
        setError(data.error || "Failed to fetch analytics data");
      }
    } catch (error) {
      setError("Failed to fetch analytics data");
      console.error("Analytics fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [refreshTrigger, fetchAnalytics]);

  // Custom tooltip with gap handling
  const CustomTooltip = (props) => {
    const { active, payload, label } = props;

    if (active && payload && payload.length) {
      const total = payload.reduce((sum, entry) => sum + (entry.value || 0), 0);

      // Handle days with no episodes
      if (total === 0) {
        return (
          <div className="bg-white p-3 border rounded-lg shadow-lg">
            <p className="font-medium text-gray-900">{label}</p>
            <p className="text-sm text-gray-500 italic">No episodes watched</p>
          </div>
        );
      }

      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-sm text-gray-600 mb-2">Total: {total} episodes</p>
          {payload
            .filter((entry) => entry.value > 0)
            .map((entry, index) => (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {entry.dataKey}: {entry.value} episodes
              </p>
            ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 animate-pulse" />
          Loading analytics...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center py-8">
        <BarChart3 className="mx-auto h-12 w-12 text-red-300 mb-4" />
        <p>{error}</p>
      </div>
    );
  }

  if (totalEpisodes === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <BarChart3 className="mx-auto h-16 w-16 text-gray-300 mb-4" />
        <p className="text-lg font-medium">No viewing data yet</p>
        <p className="text-sm">Start logging episodes to see your analytics!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Episodes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalEpisodes}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CalendarDays className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">
                  {episodesThisWeek}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={timeRange === "7days" ? "default" : "outline"}
          size="sm"
          onClick={() => setTimeRange("7days")}
        >
          Last 7 Days
        </Button>
        <Button
          variant={timeRange === "30days" ? "default" : "outline"}
          size="sm"
          onClick={() => setTimeRange("30days")}
        >
          Last 30 Days
        </Button>
        <Button
          variant={timeRange === "3months" ? "default" : "outline"}
          size="sm"
          onClick={() => setTimeRange("3months")}
        >
          Last 3 Months
        </Button>
        <Button
          variant={timeRange === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setTimeRange("all")}
        >
          All Time
        </Button>
      </div>

      {/* Chart */}
      {chartData.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Episodes Watched by Arc</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />

                  {/* Dynamic bars for each arc */}
                  {Object.keys(arcColors).map((arc) => (
                    <Bar
                      key={arc}
                      dataKey={arc}
                      stackId="episodes"
                      fill={arcColors[arc]}
                      name={arc}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-12 text-gray-500">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p>No data for selected time range</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
