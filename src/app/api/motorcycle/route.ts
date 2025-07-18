import { getOptionalAuth } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import { motorcycles } from "@/lib/db/schema";
import {
  getSingleMotorcycleId,
  SINGLE_MOTORCYCLE,
} from "@/lib/single-motorcycle";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// Ensure single motorcycle exists in database
async function ensureSingleMotorcycle() {
  const [existing] = await db
    .select()
    .from(motorcycles)
    .where(eq(motorcycles.id, SINGLE_MOTORCYCLE.id));

  if (!existing) {
    // Get current user ID or use a default
    const session = await getOptionalAuth();
    const userId = session?.user?.id || "default-user"; // Fallback for single-motorcycle app

    await db.insert(motorcycles).values({
      id: SINGLE_MOTORCYCLE.id,
      userId,
      name: SINGLE_MOTORCYCLE.name,
      brand: SINGLE_MOTORCYCLE.brand,
      model: SINGLE_MOTORCYCLE.model,
      year: SINGLE_MOTORCYCLE.year,
      currentKilometers: SINGLE_MOTORCYCLE.currentKilometers,
      engineSize: SINGLE_MOTORCYCLE.engineSize,
      color: SINGLE_MOTORCYCLE.color,
      licensePlate: SINGLE_MOTORCYCLE.licensePlate,
    });
  }
}

// GET /api/motorcycle - Get motorcycle details
export async function GET() {
  try {
    await ensureSingleMotorcycle();
    const motorcycleId = getSingleMotorcycleId();

    const [motorcycle] = await db
      .select()
      .from(motorcycles)
      .where(eq(motorcycles.id, motorcycleId));

    return NextResponse.json(motorcycle || SINGLE_MOTORCYCLE);
  } catch (error) {
    console.error("Error fetching motorcycle:", error);
    return NextResponse.json(
      { error: "Failed to fetch motorcycle" },
      { status: 500 }
    );
  }
}

// PUT /api/motorcycle - Update motorcycle details (only editable fields)
export async function PUT(request: NextRequest) {
  try {
    await ensureSingleMotorcycle();
    const motorcycleId = getSingleMotorcycleId();
    const body = await request.json();

    // Only allow updating license plate and current kilometers
    const updateData: {
      updatedAt: Date;
      licensePlate?: string;
      currentKilometers?: number;
    } = {
      updatedAt: new Date(),
    };

    if (body.licensePlate !== undefined) {
      updateData.licensePlate = body.licensePlate;
    }

    if (body.currentKilometers !== undefined) {
      updateData.currentKilometers = parseInt(body.currentKilometers);
    }

    const [updated] = await db
      .update(motorcycles)
      .set(updateData)
      .where(eq(motorcycles.id, motorcycleId))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating motorcycle:", error);
    return NextResponse.json(
      { error: "Failed to update motorcycle" },
      { status: 500 }
    );
  }
}
