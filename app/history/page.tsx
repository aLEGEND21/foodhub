"use client";

import { useState, useEffect } from "react";
import type { DailyStats } from "@/types";
import { getHistoryMeals } from "@/lib/actions/meals";

export default function HistoryPage() {
  const [historyStats, setHistoryStats] = useState<DailyStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const stats = await getHistoryMeals();
      setHistoryStats(stats);
      setLoading(false);
    };
    fetchHistory();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <main className="max-w-md mx-auto w-full px-4 pt-6 pb-24 md:flex-1 md:overflow-y-auto md:scrollbar-hide md:pb-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">History</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto w-full px-4 pt-6 space-y-4 pb-24 md:flex-1 md:overflow-y-auto md:scrollbar-hide md:pb-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">History</h1>
      </div>

      {historyStats.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No meal history found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {historyStats.map((dayStats) => (
            <div
              key={dayStats.date}
              className="border border-black bg-white p-4 flex items-center justify-between rounded-none"
            >
              <div className="flex flex-col gap-1">
                <span className="text-base font-bold">
                  {formatDate(dayStats.date)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {dayStats.meals.length}{" "}
                  {dayStats.meals.length === 1 ? "meal" : "meals"}
                </span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-base font-bold">
                  {dayStats.totalCalories} cal
                </span>
                <span className="text-base font-bold">
                  {dayStats.totalProtein} g
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
