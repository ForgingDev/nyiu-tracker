import { db } from "@/lib/db";
import { motorcycles, NewService, services } from "@/lib/db/schema";
import {
  getSingleMotorcycleId,
  SINGLE_MOTORCYCLE,
} from "@/lib/single-motorcycle";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// Ensure single motorcycle exists in database
async function ensureSingleMotorcycle() {
  const [existing] = await db
    .select()
    .from(motorcycles)
    .where(eq(motorcycles.id, SINGLE_MOTORCYCLE.id));

  if (!existing) {
    await db.insert(motorcycles).values({
      id: SINGLE_MOTORCYCLE.id,
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

// GET /api/services - Get all services for the single motorcycle
export async function GET(request: NextRequest) {
  try {
    await ensureSingleMotorcycle();

    const motorcycleId = getSingleMotorcycleId();

    const allServices = await db
      .select({
        id: services.id,
        motorcycleId: services.motorcycleId,
        date: services.date,
        kilometers: services.kilometers,
        type: services.type,
        description: services.description,
        cost: services.cost,
        location: services.location,
        nextServiceKm: services.nextServiceKm,
        createdAt: services.createdAt,
        motorcycleName: motorcycles.name,
        motorcycleBrand: motorcycles.brand,
        motorcycleModel: motorcycles.model,
      })
      .from(services)
      .leftJoin(motorcycles, eq(services.motorcycleId, motorcycles.id))
      .where(eq(services.motorcycleId, motorcycleId))
      .orderBy(desc(services.date));

    return NextResponse.json(allServices);
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

// POST /api/services - Create new service for the single motorcycle
export async function POST(request: NextRequest) {
  try {
    await ensureSingleMotorcycle();

    const body = await request.json();
    const motorcycleId = getSingleMotorcycleId();

    // Validate required fields (motorcycleId is now automatic)
    const { date, kilometers, type } = body;
    if (!date || !kilometers || !type) {
      return NextResponse.json(
        {
          error: "Missing required fields: date, kilometers, type",
        },
        { status: 400 }
      );
    }

    // Get motorcycle record
    const [motorcycle] = await db
      .select()
      .from(motorcycles)
      .where(eq(motorcycles.id, motorcycleId));

    const newService: NewService = {
      motorcycleId,
      date: new Date(date),
      kilometers: parseInt(kilometers),
      type,
      description: body.description,
      cost: body.cost ? body.cost.toString() : undefined,
      location: body.location,
      nextServiceKm: body.nextServiceKm
        ? parseInt(body.nextServiceKm)
        : undefined,
    };

    const [created] = await db.insert(services).values(newService).returning();

    // Update motorcycle's current kilometers if this service has higher km
    if (motorcycle && parseInt(kilometers) > motorcycle.currentKilometers) {
      await db
        .update(motorcycles)
        .set({
          currentKilometers: parseInt(kilometers),
          updatedAt: new Date(),
        })
        .where(eq(motorcycles.id, motorcycleId));
    }

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}
