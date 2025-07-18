import { useEffect, useState } from "react";

interface Motorcycle {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  currentKilometers: number;
  engineSize?: number;
  color?: string;
  licensePlate?: string;
}

interface DashboardStats {
  servicesThisMonth: number;
  totalServices: number;
  totalEvents: number;
  upcomingServices: number;
  totalExpenses: number;
  currentKilometers: number;
}

interface RecentActivity {
  services: Array<{
    id: string;
    date: string;
    type: string;
    motorcycleName: string;
    kilometers: number;
    cost: string | null;
    activityType: "service";
  }>;
  events: Array<{
    id: string;
    date: string;
    type: string;
    title: string;
    motorcycleName: string;
    kilometers: number;
    activityType: "event";
  }>;
}

interface DashboardData {
  motorcycle: Motorcycle;
  stats: DashboardStats;
  recentActivity: RecentActivity;
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/dashboard");
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const dashboardData = await response.json();
      setData(dashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchDashboard,
  };
}
