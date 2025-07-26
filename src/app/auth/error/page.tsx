"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuthError() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-red-600 dark:text-red-400">
            Access Denied
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400">
            You don&#39;t have permission to access this application.
          </p>
        </CardHeader>
        <CardContent>
          <Link href="/">
            <Button className="w-full">Return to Analytics</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
