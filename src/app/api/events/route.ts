import { db } from "@/lib/db";
import { events, motorcycles, NewEvent } from "@/lib/db/schema";
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

// GET /api/events - Get all events for the single motorcycle
export async function GET(request: NextRequest) {
  try {
    await ensureSingleMotorcycle();

    const motorcycleId = getSingleMotorcycleId();

    const allEvents = await db
      .select({
        id: events.id,
        motorcycleId: events.motorcycleId,
        date: events.date,
        kilometers: events.kilometers,
        type: events.type,
        title: events.title,
        description: events.description,
        cost: events.cost,
        location: events.location,
        createdAt: events.createdAt,
        motorcycleName: motorcycles.name,
        motorcycleBrand: motorcycles.brand,
        motorcycleModel: motorcycles.model,
      })
      .from(events)
      .leftJoin(motorcycles, eq(events.motorcycleId, motorcycles.id))
      .where(eq(events.motorcycleId, motorcycleId))
      .orderBy(desc(events.date));

    return NextResponse.json(allEvents);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// POST /api/events - Create new event for the single motorcycle
export async function POST(request: NextRequest) {
  try {
    await ensureSingleMotorcycle();

    const body = await request.json();
    const motorcycleId = getSingleMotorcycleId();

    // Validate required fields (motorcycleId is now automatic)
    const { date, kilometers, type, title } = body;
    if (!date || !kilometers || !type || !title) {
      return NextResponse.json(
        {
          error: "Missing required fields: date, kilometers, type, title",
        },
        { status: 400 }
      );
    }

    // Get motorcycle record
    const [motorcycle] = await db
      .select()
      .from(motorcycles)
      .where(eq(motorcycles.id, motorcycleId));

    const newEvent: NewEvent = {
      motorcycleId,
      date: new Date(date),
      kilometers: parseInt(kilometers),
      type,
      title,
      description: body.description,
      cost: body.cost ? body.cost.toString() : undefined,
      location: body.location,
    };

    const [created] = await db.insert(events).values(newEvent).returning();

    // Update motorcycle's current kilometers if this event has higher km
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
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
