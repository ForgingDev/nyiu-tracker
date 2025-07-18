"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SINGLE_MOTORCYCLE } from "@/lib/single-motorcycle";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const EVENT_TYPES = [
  { value: "trip", label: "Trip" },
  { value: "accident", label: "Accident" },
  { value: "modification", label: "Modification" },
  { value: "purchase", label: "Purchase" },
  { value: "insurance", label: "Insurance" },
  { value: "registration", label: "Registration" },
  { value: "other", label: "Other" },
];

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0], // Today's date
    kilometers: SINGLE_MOTORCYCLE.currentKilometers.toString(),
    type: "",
    title: "",
    description: "",
    cost: "",
    location: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.date ||
      !formData.kilometers ||
      !formData.type ||
      !formData.title
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: formData.date,
          kilometers: parseInt(formData.kilometers),
          type: formData.type,
          title: formData.title,
          description: formData.description || undefined,
          cost: formData.cost ? parseFloat(formData.cost) : undefined,
          location: formData.location || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create event");
      }

      // Redirect to events list
      router.push("/events");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/events">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Add Event</h1>
          <p className="mt-2 text-gray-400">
            Record an event for {SINGLE_MOTORCYCLE.name} (
            {SINGLE_MOTORCYCLE.brand} {SINGLE_MOTORCYCLE.model}{" "}
            {SINGLE_MOTORCYCLE.year})
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardDescription>
            Fill in the event information for your {SINGLE_MOTORCYCLE.brand}{" "}
            {SINGLE_MOTORCYCLE.model}. Required fields are marked with *.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-100">
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Event Type *
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full h-10 px-3 py-2 border border-gray-600/60 bg-gray-800/80 text-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400"
                    required
                  >
                    <option value="">Select event type</option>
                    {EVENT_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Event Date *
                  </label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Event Title *
                  </label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="e.g., Weekend trip to mountains"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="kilometers"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Kilometers *
                  </label>
                  <Input
                    id="kilometers"
                    name="kilometers"
                    type="number"
                    placeholder="e.g., 15000"
                    min="0"
                    value={formData.kilometers}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-100">
                Additional Information
              </h3>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  placeholder="Details about the event..."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-600/60 bg-gray-800/80 text-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 resize-none placeholder:text-gray-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="cost"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Cost
                  </label>
                  <Input
                    id="cost"
                    name="cost"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 150.00"
                    min="0"
                    value={formData.cost}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Location
                  </label>
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="e.g., Brasov, Romania"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6">
              <Link href="/events">
                <Button variant="outline" disabled={loading}>
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding Event...
                  </>
                ) : (
                  "Add Event"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
