// Single motorcycle configuration for Kawasaki Z900 2025 "Nyiu"
export const SINGLE_MOTORCYCLE = {
  id: "550e8400-e29b-41d4-a716-446655440000", // Fixed UUID format
  name: "Nyiu",
  brand: "Kawasaki",
  model: "Z900",
  year: 2025,
  currentKilometers: 0,
  engineSize: 948, // Z900 engine size
  color: "Black",
  licensePlate: "",
} as const;

export const getSingleMotorcycleId = () => SINGLE_MOTORCYCLE.id;
