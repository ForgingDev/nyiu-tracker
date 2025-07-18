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
import { Edit, Loader2, Plus, Trash2, Wrench } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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
  createdAt: string;
  motorcycleName: string;
  motorcycleBrand: string;
  motorcycleModel: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/services");
      if (!response.ok) {
        throw new Error("Failed to fetch services");
      }

      const data = await response.json();
      setServices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (
    id: string,
    type: string,
    motorcycleName: string
  ) => {
    const serviceType = type
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

    if (
      !confirm(
        `Are you sure you want to delete the "${serviceType}" service for ${motorcycleName}?`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/services/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete service");
      }

      // Refresh the list
      fetchServices();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete service");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const formatServiceType = (type: string) => {
    return type
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="h-8 w-8 animate-spin text-green-400" />
        <span className="ml-2 text-gray-300">Loading services...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">Failed to load services: {error}</p>
        <Button onClick={fetchServices}>Try Again</Button>
      </div>
    );
  }

  const motorcycleName =
    services.length > 0 ? services[0].motorcycleName : "Nyiu";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Services</h1>
          <p className="mt-2 text-gray-400">
            Track maintenance and service history for {motorcycleName}
          </p>
        </div>
        <Link href="/services/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Log Service
          </Button>
        </Link>
      </div>

      {/* Services List */}
      {services.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <Wrench className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-100 mb-2">
              No services recorded
            </h3>
            <p className="text-gray-400 mb-6">
              Start tracking your motorcycle maintenance by logging your first
              service.
            </p>
            <Link href="/services/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Log Your First Service
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {services.map((service) => (
            <Card
              key={service.id}
              className="hover:shadow-md hover:shadow-green-500/10 transition-shadow"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {formatServiceType(service.type)}
                    </CardTitle>
                    <CardDescription>
                      {service.motorcycleName} ({service.motorcycleBrand}{" "}
                      {service.motorcycleModel})
                    </CardDescription>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-100">
                        {formatDate(new Date(service.date))}
                      </div>
                      <div className="text-sm text-gray-400">
                        {formatKilometers(service.kilometers)}
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Link href={`/services/${service.id}/edit`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleDelete(
                            service.id,
                            service.type,
                            service.motorcycleName
                          )
                        }
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {service.description && (
                    <div className="md:col-span-2">
                      <h4 className="text-sm font-medium text-gray-300 mb-1">
                        Description
                      </h4>
                      <p className="text-sm text-gray-400">
                        {service.description}
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    {service.cost && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-300">
                          Cost
                        </h4>
                        <p className="text-sm font-medium text-green-400">
                          {formatCurrency(Number(service.cost))}
                        </p>
                      </div>
                    )}

                    {service.location && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-300">
                          Location
                        </h4>
                        <p className="text-sm text-gray-400">
                          {service.location}
                        </p>
                      </div>
                    )}

                    {service.nextServiceKm && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-300">
                          Next Service
                        </h4>
                        <p className="text-sm text-gray-400">
                          {formatKilometers(service.nextServiceKm)}
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
