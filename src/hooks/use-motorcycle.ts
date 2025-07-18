import { useEffect, useState } from "react";

export interface Motorcycle {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  currentKilometers: number;
  engineSize?: number;
  color?: string;
  licensePlate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Modification {
  id: string;
  motorcycleId: string;
  name: string;
  type:
    | "protection"
    | "performance"
    | "aesthetic"
    | "comfort"
    | "storage"
    | "electronics"
    | "other";
  description?: string;
  installDate: string;
  cost?: string;
  createdAt: string;
}

export function useMotorcycle() {
  const [motorcycle, setMotorcycle] = useState<Motorcycle | null>(null);
  const [modifications, setModifications] = useState<Modification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMotorcycle = async () => {
    try {
      const response = await fetch("/api/motorcycle");
      if (!response.ok) {
        throw new Error("Failed to fetch motorcycle");
      }
      const data = await response.json();
      setMotorcycle(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const fetchModifications = async () => {
    try {
      const response = await fetch("/api/modifications");
      if (!response.ok) {
        throw new Error("Failed to fetch modifications");
      }
      const data = await response.json();
      setModifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const updateMotorcycle = async (updates: {
    licensePlate?: string;
    currentKilometers?: number;
  }) => {
    try {
      const response = await fetch("/api/motorcycle", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update motorcycle");
      }

      const updated = await response.json();
      setMotorcycle(updated);
      return updated;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const addModification = async (modification: {
    name: string;
    type: string;
    description?: string;
    installDate: string;
    cost?: number;
  }) => {
    try {
      const response = await fetch("/api/modifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(modification),
      });

      if (!response.ok) {
        throw new Error("Failed to add modification");
      }

      const created = await response.json();
      setModifications((prev) => [...prev, created]);
      return created;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const updateModification = async (
    id: string,
    updates: Partial<Modification>
  ) => {
    try {
      const response = await fetch(`/api/modifications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update modification");
      }

      const updated = await response.json();
      setModifications((prev) =>
        prev.map((mod) => (mod.id === id ? updated : mod))
      );
      return updated;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const deleteModification = async (id: string) => {
    try {
      const response = await fetch(`/api/modifications/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete modification");
      }

      setModifications((prev) => prev.filter((mod) => mod.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "An error occurred");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([fetchMotorcycle(), fetchModifications()]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return {
    motorcycle,
    modifications,
    loading,
    error,
    updateMotorcycle,
    addModification,
    updateModification,
    deleteModification,
    refetch: () => {
      fetchMotorcycle();
      fetchModifications();
    },
  };
}
