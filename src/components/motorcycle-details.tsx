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
import { useMotorcycle, type Modification } from "@/hooks/use-motorcycle";
import { formatCurrency } from "@/lib/utils";
import {
  Armchair,
  Edit3,
  Package,
  Palette,
  Plus,
  Save,
  Settings,
  Shield,
  Smartphone,
  Trash2,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

const MODIFICATION_TYPES = [
  { value: "protection", label: "Protection", icon: Shield },
  { value: "performance", label: "Performance", icon: Zap },
  { value: "aesthetic", label: "Aesthetic", icon: Palette },
  { value: "comfort", label: "Comfort", icon: Armchair },
  { value: "storage", label: "Storage", icon: Package },
  { value: "electronics", label: "Electronics", icon: Smartphone },
  { value: "other", label: "Other", icon: Settings },
];

interface MotorcycleDetailsProps {
  onUpdate?: () => void;
}

export function MotorcycleDetails({ onUpdate }: MotorcycleDetailsProps) {
  const {
    motorcycle,
    modifications,
    loading,
    error,
    updateMotorcycle,
    addModification,
    deleteModification,
    updateModification,
  } = useMotorcycle();

  const [editingBasic, setEditingBasic] = useState(false);
  const [basicForm, setBasicForm] = useState({
    licensePlate: "",
    currentKilometers: "",
  });

  const [showAddModification, setShowAddModification] = useState(false);
  const [modificationForm, setModificationForm] = useState({
    name: "",
    type: "other",
    description: "",
    installDate: new Date().toISOString().split("T")[0],
    cost: "",
  });

  const [saving, setSaving] = useState(false);
  const [editingModification, setEditingModification] = useState<string | null>(
    null
  );
  const [editModificationForm, setEditModificationForm] = useState({
    name: "",
    type: "other",
    description: "",
    installDate: "",
    cost: "",
  });

  const handleEditBasic = () => {
    if (motorcycle) {
      setBasicForm({
        licensePlate: motorcycle.licensePlate || "",
        currentKilometers: motorcycle.currentKilometers.toString(),
      });
      setEditingBasic(true);
    }
  };

  const handleSaveBasic = async () => {
    if (!motorcycle) return;

    setSaving(true);
    try {
      await updateMotorcycle({
        licensePlate: basicForm.licensePlate || undefined,
        currentKilometers: parseInt(basicForm.currentKilometers),
      });
      setEditingBasic(false);
      onUpdate?.();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update motorcycle");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelBasic = () => {
    setEditingBasic(false);
    setBasicForm({
      licensePlate: motorcycle?.licensePlate || "",
      currentKilometers: motorcycle?.currentKilometers.toString() || "",
    });
  };

  const handleAddModification = async () => {
    if (!modificationForm.name || !modificationForm.type) {
      alert("Please fill in required fields");
      return;
    }

    setSaving(true);
    try {
      await addModification({
        name: modificationForm.name,
        type: modificationForm.type,
        description: modificationForm.description || undefined,
        installDate: modificationForm.installDate,
        cost: modificationForm.cost
          ? parseFloat(modificationForm.cost)
          : undefined,
      });
      setShowAddModification(false);
      setModificationForm({
        name: "",
        type: "other",
        description: "",
        installDate: new Date().toISOString().split("T")[0],
        cost: "",
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add modification");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteModification = async (id: string) => {
    if (!confirm("Are you sure you want to delete this modification?")) return;

    try {
      await deleteModification(id);
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Failed to delete modification"
      );
    }
  };

  const handleEditModification = (modification: Modification) => {
    setEditingModification(modification.id);
    setEditModificationForm({
      name: modification.name,
      type: modification.type,
      description: modification.description || "",
      installDate: new Date(modification.installDate)
        .toISOString()
        .split("T")[0],
      cost: modification.cost || "",
    });
  };

  const handleSaveModification = async () => {
    if (!editingModification || !editModificationForm.name) {
      alert("Please fill in required fields");
      return;
    }

    setSaving(true);
    try {
      await updateModification(editingModification, {
        name: editModificationForm.name,
        type: editModificationForm.type as Modification["type"],
        description: editModificationForm.description || undefined,
        installDate: editModificationForm.installDate,
        cost: editModificationForm.cost ? editModificationForm.cost : undefined,
      });
      setEditingModification(null);
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Failed to update modification"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingModification(null);
    setEditModificationForm({
      name: "",
      type: "other",
      description: "",
      installDate: "",
      cost: "",
    });
  };

  const getModificationIcon = (type: string) => {
    const modType = MODIFICATION_TYPES.find((t) => t.value === type);
    return modType?.icon || Settings;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Loading Motorcycle Details...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-400">Error</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!motorcycle) return null;

  return (
    <div className="space-y-6">
      {/* Basic Motorcycle Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Motorcycle Details
              </CardTitle>
              <CardDescription>
                Information about your {motorcycle.brand} {motorcycle.model}
              </CardDescription>
            </div>
            {!editingBasic && (
              <Button variant="outline" size="sm" onClick={handleEditBasic}>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Static Fields */}
            <div>
              <p className="text-sm font-medium text-gray-400">Engine Size</p>
              <p className="text-lg font-semibold text-gray-100">
                {motorcycle.engineSize ? `${motorcycle.engineSize}cc` : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Color</p>
              <p className="text-lg font-semibold text-gray-100">
                {motorcycle.color || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Year</p>
              <p className="text-lg font-semibold text-gray-100">
                {motorcycle.year}
              </p>
            </div>

            {/* Editable Fields */}
            <div>
              <p className="text-sm font-medium text-gray-400">License Plate</p>
              {editingBasic ? (
                <Input
                  value={basicForm.licensePlate}
                  onChange={(e) =>
                    setBasicForm((prev) => ({
                      ...prev,
                      licensePlate: e.target.value,
                    }))
                  }
                  placeholder="License plate"
                  className="mt-1"
                />
              ) : (
                <p className="text-lg font-semibold text-gray-100">
                  {motorcycle.licensePlate || "Not set"}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm font-medium text-gray-400">
              Current Kilometers
            </p>
            {editingBasic ? (
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="number"
                  value={basicForm.currentKilometers}
                  onChange={(e) =>
                    setBasicForm((prev) => ({
                      ...prev,
                      currentKilometers: e.target.value,
                    }))
                  }
                  placeholder="Current kilometers"
                  className="max-w-xs"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveBasic} disabled={saving}>
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelBasic}
                    disabled={saving}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-lg font-semibold text-gray-100 mt-1">
                {motorcycle.currentKilometers.toLocaleString()} km
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Modifications
              </CardTitle>
              <CardDescription>
                Custom parts and modifications on your motorcycle
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddModification(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Modification
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {modifications.length === 0 ? (
            <div className="text-center py-8">
              <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">
                No modifications recorded yet
              </p>
              <Button onClick={() => setShowAddModification(true)}>
                Add Your First Modification
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {modifications.map((mod) => {
                const Icon = getModificationIcon(mod.type);
                const isEditing = editingModification === mod.id;

                return (
                  <div
                    key={mod.id}
                    className={`p-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl border border-gray-600/50 ${
                      isEditing ? "ring-2 ring-blue-500/50" : ""
                    }`}
                  >
                    {isEditing ? (
                      // Edit form
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-100 flex items-center gap-2">
                            <Icon className="h-5 w-5 text-blue-400" />
                            Edit Modification
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                              Name *
                            </label>
                            <Input
                              value={editModificationForm.name}
                              onChange={(e) =>
                                setEditModificationForm((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                              placeholder="e.g., Frame Sliders, Crash Bars"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                              Type *
                            </label>
                            <select
                              value={editModificationForm.type}
                              onChange={(e) =>
                                setEditModificationForm((prev) => ({
                                  ...prev,
                                  type: e.target.value,
                                }))
                              }
                              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                              {MODIFICATION_TYPES.map((type) => (
                                <option key={type.value} value={type.value}>
                                  {type.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                              Install Date *
                            </label>
                            <Input
                              type="date"
                              value={editModificationForm.installDate}
                              onChange={(e) =>
                                setEditModificationForm((prev) => ({
                                  ...prev,
                                  installDate: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                              Cost
                            </label>
                            <Input
                              type="number"
                              step="0.01"
                              value={editModificationForm.cost}
                              onChange={(e) =>
                                setEditModificationForm((prev) => ({
                                  ...prev,
                                  cost: e.target.value,
                                }))
                              }
                              placeholder="0.00"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                              Description
                            </label>
                            <textarea
                              value={editModificationForm.description}
                              onChange={(e) =>
                                setEditModificationForm((prev) => ({
                                  ...prev,
                                  description: e.target.value,
                                }))
                              }
                              placeholder="Optional details about the modification"
                              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              rows={3}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={handleSaveModification}
                            disabled={saving}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </Button>
                          <Button
                            variant="outline"
                            onClick={handleCancelEdit}
                            disabled={saving}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // Display mode
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
                            <Icon className="h-5 w-5 text-blue-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-100">
                              {mod.name}
                            </p>
                            <p className="text-sm text-gray-400">
                              {
                                MODIFICATION_TYPES.find(
                                  (t) => t.value === mod.type
                                )?.label
                              }{" "}
                              • {new Date(mod.installDate).toLocaleDateString()}
                              {mod.cost &&
                                ` • ${formatCurrency(Number(mod.cost))}`}
                            </p>
                            {mod.description && (
                              <p className="text-sm text-gray-500 mt-1">
                                {mod.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditModification(mod)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteModification(mod.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Add Modification Form */}
          {showAddModification && (
            <div className="mt-6 p-4 bg-gray-800/50 rounded-xl border border-gray-600/50">
              <h4 className="font-semibold text-gray-100 mb-4">
                Add New Modification
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Name *
                  </label>
                  <Input
                    value={modificationForm.name}
                    onChange={(e) =>
                      setModificationForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="e.g., Frame Sliders, Crash Bars"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Type *
                  </label>
                  <select
                    value={modificationForm.type}
                    onChange={(e) =>
                      setModificationForm((prev) => ({
                        ...prev,
                        type: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {MODIFICATION_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Install Date *
                  </label>
                  <Input
                    type="date"
                    value={modificationForm.installDate}
                    onChange={(e) =>
                      setModificationForm((prev) => ({
                        ...prev,
                        installDate: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Cost
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={modificationForm.cost}
                    onChange={(e) =>
                      setModificationForm((prev) => ({
                        ...prev,
                        cost: e.target.value,
                      }))
                    }
                    placeholder="0.00"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Description
                  </label>
                  <textarea
                    value={modificationForm.description}
                    onChange={(e) =>
                      setModificationForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Optional details about the modification"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleAddModification} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Modification
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddModification(false)}
                  disabled={saving}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
