"use client";

import { MotorcycleDetails } from "@/components/motorcycle-details";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDashboard } from "@/hooks/use-dashboard";
import { useSession } from "@/lib/auth-client";
import { formatCurrency, formatKilometers } from "@/lib/utils";
import { Calendar, Loader2, Shield, TrendingUp, Wrench } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const { data: session, isPending: sessionLoading } = useSession();
  const { data, loading, error, refetch } = useDashboard();

  // Show loading for session check
  if (sessionLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-green-500/30 rounded-full animate-pulse"></div>
            <Loader2 className="w-8 h-8 text-green-400 animate-spin absolute top-4 left-4" />
          </div>
          <span className="text-gray-300 font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  // Show landing page for unauthenticated users
  if (!session?.user) {
    return (
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center py-16">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <span className="text-white font-bold text-3xl">N</span>
              </div>
              <div className="text-left">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
                  Nyiu Tracker
                </h1>
                <p className="text-gray-400 text-xl">
                  Your Motorcycle Management Hub
                </p>
              </div>
            </div>
          </div>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            Track maintenance, services, and events for your motorcycle with
            ease. Never miss a service interval or forget important maintenance
            again.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
              >
                Get Started Free
              </Button>
            </Link>
            <Link href="/signin">
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="group hover:scale-105 transition-transform duration-200">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <Wrench className="h-6 w-6 text-green-400" />
              </div>
              <CardTitle>Service Tracking</CardTitle>
              <CardDescription>
                Keep track of all maintenance and services for your motorcycle
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:scale-105 transition-transform duration-200">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <Calendar className="h-6 w-6 text-blue-400" />
              </div>
              <CardTitle>Event Logging</CardTitle>
              <CardDescription>
                Record trips, modifications, and important events
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:scale-105 transition-transform duration-200">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <TrendingUp className="h-6 w-6 text-orange-400" />
              </div>
              <CardTitle>Expense Tracking</CardTitle>
              <CardDescription>
                Monitor costs and track your motorcycle expenses
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Security Notice */}
        <Card className="bg-gradient-to-r from-green-900/20 to-green-800/20 border-green-500/30">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500/30 to-green-600/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-green-400" />
            </div>
            <CardTitle className="text-green-400">Secure & Private</CardTitle>
            <CardDescription className="text-gray-300">
              Your motorcycle data is encrypted and securely stored. Only you
              have access to your information.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Show dashboard for authenticated users
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-green-500/30 rounded-full animate-pulse"></div>
            <Loader2 className="w-8 h-8 text-green-400 animate-spin absolute top-4 left-4" />
          </div>
          <span className="text-gray-300 font-medium">
            Loading dashboard...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-red-400 mb-4 font-medium">
            Failed to load dashboard: {error}
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const motorcycle = data?.motorcycle;
  const stats = data?.stats || {
    servicesThisMonth: 0,
    totalServices: 0,
    totalEvents: 0,
    upcomingServices: 0,
    totalExpenses: 0,
    currentKilometers: 0,
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <div className="mb-4">
          <div className="inline-flex items-center space-x-3">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">N</span>
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
                Welcome back, {session.user.name || session.user.email}
              </h1>
              <p className="text-gray-400 text-lg">
                {motorcycle?.name && `Managing ${motorcycle.name} - `}
                {motorcycle?.brand} {motorcycle?.model} {motorcycle?.year}
              </p>
            </div>
          </div>
        </div>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Your motorcycle dashboard is ready. Track maintenance, services, and
          events with ease.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="group hover:scale-105 transition-transform duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                Current Kilometers
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-100 mb-1">
              {formatKilometers(stats.currentKilometers)}
            </div>
            <p className="text-xs text-gray-500">Total distance covered</p>
          </CardContent>
        </Card>

        <Card className="group hover:scale-105 transition-transform duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                Total Services
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Wrench className="h-5 w-5 text-green-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-100 mb-1">
              {stats.totalServices}
            </div>
            <p className="text-xs text-gray-500">
              {stats.totalServices === 0
                ? "No services recorded"
                : "Services completed"}
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:scale-105 transition-transform duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                Total Events
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Calendar className="h-5 w-5 text-blue-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-100 mb-1">
              {stats.totalEvents}
            </div>
            <p className="text-xs text-gray-500">
              {stats.totalEvents === 0 ? "No events recorded" : "Events logged"}
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:scale-105 transition-transform duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                Total Expenses
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <TrendingUp className="h-5 w-5 text-orange-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-100 mb-1">
              {formatCurrency(stats.totalExpenses)}
            </div>
            <p className="text-xs text-gray-500">
              {stats.totalExpenses === 0
                ? "No expenses tracked"
                : "All-time spending"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Motorcycle Details with Editing */}
      <MotorcycleDetails onUpdate={refetch} />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Quick Actions
          </CardTitle>
          <CardDescription>
            Log services and track events for your{" "}
            {motorcycle?.name || "motorcycle"}.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link href="/services/new">
            <Button size="lg" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Log Service
            </Button>
          </Link>
          <Link href="/events/new">
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Add Event
            </Button>
          </Link>
          <Link href="/services">
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
            >
              <Wrench className="h-4 w-4" />
              View Services
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {data?.recentActivity && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest services and events for{" "}
              {motorcycle?.name || "your motorcycle"}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.recentActivity.services.length === 0 &&
            data.recentActivity.events.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-400 text-center mb-6">
                  No recent activity. Start by logging your first service!
                </p>
                <Link href="/services/new">
                  <Button>Get Started</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  ...data.recentActivity.services,
                  ...data.recentActivity.events,
                ]
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .slice(0, 5)
                  .map((activity) => (
                    <div
                      key={`${activity.activityType}-${activity.id}`}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl border border-gray-600/50 hover:shadow-md hover:shadow-green-500/10 transition-all duration-200"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            activity.activityType === "service"
                              ? "bg-gradient-to-br from-green-500/20 to-green-600/20"
                              : "bg-gradient-to-br from-blue-500/20 to-blue-600/20"
                          }`}
                        >
                          {activity.activityType === "service" ? (
                            <Wrench className="h-5 w-5 text-green-400" />
                          ) : (
                            <Calendar className="h-5 w-5 text-blue-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-100">
                            {activity.activityType === "service"
                              ? `${activity.type.replace("_", " ")} Service`
                              : "title" in activity
                              ? activity.title
                              : "Event"}
                          </p>
                          <p className="text-sm text-gray-400">
                            {new Date(activity.date).toLocaleDateString()} •{" "}
                            {formatKilometers(activity.kilometers)}
                          </p>
                        </div>
                      </div>
                      {activity.activityType === "service" &&
                        "cost" in activity &&
                        activity.cost && (
                          <span className="text-sm font-semibold text-green-400 bg-green-500/10 px-3 py-1 rounded-lg">
                            {formatCurrency(Number(activity.cost))}
                          </span>
                        )}
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
