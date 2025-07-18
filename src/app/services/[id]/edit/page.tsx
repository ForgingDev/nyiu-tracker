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
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface Service {
  id: string;
  motorcycleId: string;
  date: string;
  kilometers: number;
  type: string;
  description?: string;
  cost?: string;
  location?: string;
  nextServiceKm?: number;
  motorcycleName: string;
  motorcycleBrand: string;
  motorcycleModel: string;
}

const SERVICE_TYPES = [
  { value: "oil_change", label: "Oil Change" },
  { value: "tire_change", label: "Tire Change" },
  { value: "brake_service", label: "Brake Service" },
  { value: "chain_maintenance", label: "Chain Maintenance" },
  { value: "general_maintenance", label: "General Maintenance" },
  { value: "repair", label: "Repair" },
  { value: "inspection", label: "Inspection" },
  { value: "other", label: "Other" },
];

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [loadingService, setLoadingService] = useState(true);
  const [service, setService] = useState<Service | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    date: "",
    kilometers: "",
    type: "",
    description: "",
    cost: "",
    location: "",
    nextServiceKm: "",
  });

  const fetchService = useCallback(async () => {
    try {
      const response = await fetch(`/api/services/${serviceId}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError("Service not found");
        } else {
          throw new Error("Failed to fetch service");
        }
        return;
      }

      const data = await response.json();
      setService(data);
      setFormData({
        date: new Date(data.date).toISOString().split("T")[0],
        kilometers: data.kilometers.toString(),
        type: data.type,
        description: data.description || "",
        cost: data.cost || "",
        location: data.location || "",
        nextServiceKm: data.nextServiceKm?.toString() || "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoadingService(false);
    }
  }, [serviceId]);

  useEffect(() => {
    if (serviceId) {
      fetchService();
    }
  }, [serviceId, fetchService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.date || !formData.kilometers || !formData.type) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: formData.date,
          kilometers: parseInt(formData.kilometers),
          type: formData.type,
          description: formData.description || undefined,
          cost: formData.cost ? parseFloat(formData.cost) : undefined,
          location: formData.location || undefined,
          nextServiceKm: formData.nextServiceKm
            ? parseInt(formData.nextServiceKm)
            : undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update service");
      }

      // Redirect to services list
      router.push("/services");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update service");
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

  if (loadingService) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="h-8 w-8 animate-spin text-green-400" />
        <span className="ml-2 text-gray-300">Loading service...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/services">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-100">Edit Service</h1>
          </div>
        </div>

        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-100 mb-2">Error</h3>
            <p className="text-red-400 mb-6">{error}</p>
            <Link href="/services">
              <Button>Back to Services</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!service) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/services">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Edit Service</h1>
          <p className="mt-2 text-gray-400">
            Update service for {SINGLE_MOTORCYCLE.name} (
            {SINGLE_MOTORCYCLE.brand} {SINGLE_MOTORCYCLE.model}{" "}
            {SINGLE_MOTORCYCLE.year})
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
          <CardDescription>
            Update the service information for your {SINGLE_MOTORCYCLE.brand}{" "}
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
                    Service Type *
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full h-10 px-3 py-2 border border-gray-600/60 bg-gray-800/80 text-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400"
                    required
                  >
                    <option value="">Select service type</option>
                    {SERVICE_TYPES.map((type) => (
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
                    Service Date *
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
                  placeholder="Details about the service performed..."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-600/60 bg-gray-800/80 text-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 resize-none placeholder:text-gray-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    Service Location
                  </label>
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="e.g., ABC Motors"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="nextServiceKm"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Next Service (km)
                  </label>
                  <Input
                    id="nextServiceKm"
                    name="nextServiceKm"
                    type="number"
                    placeholder="e.g., 20000"
                    min="0"
                    value={formData.nextServiceKm}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6">
              <Link href="/services">
                <Button variant="outline" disabled={loading}>
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating Service...
                  </>
                ) : (
                  "Update Service"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
