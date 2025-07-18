import { db } from "@/lib/db";
import { events, motorcycles } from "@/lib/db/schema";
import { getSingleMotorcycleId } from "@/lib/single-motorcycle";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET /api/events/[id] - Get single event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [event] = await db
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
      .where(eq(events.id, id));

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

// PUT /api/events/[id] - Update event
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const motorcycleId = getSingleMotorcycleId();

    // Check if event exists
    const [existing] = await db.select().from(events).where(eq(events.id, id));

    if (!existing) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Prepare update data (motorcycleId is now fixed to the single motorcycle)
    const updateData = {
      motorcycleId, // Always use the single motorcycle ID
      date: body.date ? new Date(body.date) : existing.date,
      kilometers: body.kilometers
        ? parseInt(body.kilometers)
        : existing.kilometers,
      type: body.type || existing.type,
      title: body.title || existing.title,
      description:
        body.description !== undefined
          ? body.description
          : existing.description,
      cost:
        body.cost !== undefined
          ? body.cost
            ? body.cost.toString()
            : null
          : existing.cost,
      location: body.location !== undefined ? body.location : existing.location,
    };

    const [updated] = await db
      .update(events)
      .set(updateData)
      .where(eq(events.id, id))
      .returning();

    // Update motorcycle's current kilometers if this event has higher km
    const [motorcycle] = await db
      .select()
      .from(motorcycles)
      .where(eq(motorcycles.id, motorcycleId));

    if (motorcycle && updateData.kilometers > motorcycle.currentKilometers) {
      await db
        .update(motorcycles)
        .set({
          currentKilometers: updateData.kilometers,
          updatedAt: new Date(),
        })
        .where(eq(motorcycles.id, motorcycleId));
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

// DELETE /api/events/[id] - Delete event
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check if event exists
    const [existing] = await db.select().from(events).where(eq(events.id, id));

    if (!existing) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Delete event
    await db.delete(events).where(eq(events.id, id));

    return NextResponse.json(
      { message: "Event deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
