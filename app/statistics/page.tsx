"use client";

export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";

export default function StatisticsPage() {
  const [stats, setStats] = useState<{
    books: number;
    earliestPublicationYear: number;
    latestPublicationYear: number;
  }>();

  const fetchStats = async () => {
    const response = await fetch("/api/books/stats");
    const data = await response.json();

    setStats(data);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (!stats)
    return <p className="text-lg text-gray-500">No statstics available</p>;

  return (
    <Card className="flex flex-col w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Books Database Statistics</CardTitle>
        <CardDescription>
          Essential metrics for the books database.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <h2 className="font-semibold text-base">Total Books</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              All books in the database
            </p>
          </div>
          <div className="flex items-center justify-end">
            <h3 className="font-semibold text-2xl">{stats.books}</h3>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <h2 className="font-semibold text-base">
              Earliest Publication Year
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              First year a book was published
            </p>
          </div>
          <div className="flex items-center justify-end">
            <h3 className="font-semibold text-2xl">
              {stats.earliestPublicationYear}
            </h3>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <h2 className="font-semibold text-base">Latest Publication Year</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Most recent year a book was published
            </p>
          </div>
          <div className="flex items-center justify-end">
            <h3 className="font-semibold text-2xl">
              {stats.latestPublicationYear}
            </h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
