import { getOptionalAuth } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import type { NewModification } from "@/lib/db/schema";
import { modifications, motorcycles } from "@/lib/db/schema";
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

// GET /api/modifications - Get all modifications for the single motorcycle
export async function GET() {
  try {
    await ensureSingleMotorcycle();
    const motorcycleId = getSingleMotorcycleId();

    const allModifications = await db
      .select()
      .from(modifications)
      .where(eq(modifications.motorcycleId, motorcycleId))
      .orderBy(modifications.installDate);

    return NextResponse.json(allModifications);
  } catch (error) {
    console.error("Error fetching modifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch modifications" },
      { status: 500 }
    );
  }
}

// POST /api/modifications - Create new modification
export async function POST(request: NextRequest) {
  try {
    await ensureSingleMotorcycle();
    const body = await request.json();
    const motorcycleId = getSingleMotorcycleId();

    // Validate required fields
    const { name, type, installDate } = body;
    if (!name || !type || !installDate) {
      return NextResponse.json(
        {
          error: "Missing required fields: name, type, installDate",
        },
        { status: 400 }
      );
    }

    const newModification: NewModification = {
      motorcycleId,
      name,
      type,
      description: body.description,
      installDate: new Date(installDate),
      cost: body.cost ? body.cost.toString() : undefined,
    };

    const [created] = await db
      .insert(modifications)
      .values(newModification)
      .returning();

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Error creating modification:", error);
    return NextResponse.json(
      { error: "Failed to create modification" },
      { status: 500 }
    );
  }
}
