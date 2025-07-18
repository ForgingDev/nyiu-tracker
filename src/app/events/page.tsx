"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency, formatDate, formatKilometers } from "@/lib/utils";
import { Calendar, Edit, Loader2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Event {
  id: string;
  motorcycleId: string;
  date: string;
  kilometers: number;
  type: string;
  title: string;
  description?: string;
  cost?: string;
  location?: string;
  createdAt: string;
  motorcycleName: string;
  motorcycleBrand: string;
  motorcycleModel: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/events");
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (eventId: string, eventTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${eventTitle}"?`)) {
      return;
    }

    setDeleting(eventId);

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      // Remove the event from the list
      setEvents(events.filter((event) => event.id !== eventId));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete event");
    } finally {
      setDeleting(null);
    }
  };

  const formatEventType = (type: string) => {
    return type
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "trip":
        return "text-green-400 bg-green-500/20";
      case "accident":
        return "text-red-400 bg-red-500/20";
      case "modification":
        return "text-purple-400 bg-purple-500/20";
      case "purchase":
        return "text-blue-400 bg-blue-500/20";
      case "insurance":
        return "text-orange-400 bg-orange-500/20";
      case "registration":
        return "text-indigo-400 bg-indigo-500/20";
      default:
        return "text-gray-400 bg-gray-500/20";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="h-8 w-8 animate-spin text-green-400" />
        <span className="ml-2 text-gray-300">Loading events...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">Failed to load events: {error}</p>
        <Button onClick={fetchEvents}>Try Again</Button>
      </div>
    );
  }

  const motorcycleName = events.length > 0 ? events[0].motorcycleName : "Nyiu";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Events</h1>
          <p className="mt-2 text-gray-400">
            Track trips, modifications, and other events for {motorcycleName}
          </p>
        </div>
        <Link href="/events/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Event
          </Button>
        </Link>
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-100 mb-2">
              No events recorded
            </h3>
            <p className="text-gray-400 mb-6">
              Start tracking your motorcycle events by adding your first event.
            </p>
            <Link href="/events/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Event
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <Card
              key={event.id}
              className="hover:shadow-md hover:shadow-green-500/10 transition-shadow"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(
                        event.type
                      )}`}
                    >
                      {formatEventType(event.type)}
                    </span>
                    <div>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <CardDescription>
                        {event.motorcycleName} ({event.motorcycleBrand}{" "}
                        {event.motorcycleModel})
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right mr-4">
                      <div className="text-sm font-medium text-gray-100">
                        {formatDate(new Date(event.date))}
                      </div>
                      <div className="text-sm text-gray-400">
                        {formatKilometers(event.kilometers)}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link href={`/events/${event.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(event.id, event.title)}
                        disabled={deleting === event.id}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        {deleting === event.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {event.description && (
                    <div className="md:col-span-2">
                      <h4 className="text-sm font-medium text-gray-300 mb-1">
                        Description
                      </h4>
                      <p className="text-sm text-gray-400">
                        {event.description}
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    {event.cost && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-300">
                          Cost
                        </h4>
                        <p className="text-sm font-medium text-green-400">
                          {formatCurrency(Number(event.cost))}
                        </p>
                      </div>
                    )}

                    {event.location && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-300">
                          Location
                        </h4>
                        <p className="text-sm text-gray-400">
                          {event.location}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
