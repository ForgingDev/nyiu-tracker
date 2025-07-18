import { db } from "@/lib/db";
import { motorcycles, services } from "@/lib/db/schema";
import { getSingleMotorcycleId } from "@/lib/single-motorcycle";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET /api/services/[id] - Get single service
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [service] = await db
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
      .where(eq(services.id, id));

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json(
      { error: "Failed to fetch service" },
      { status: 500 }
    );
  }
}

// PUT /api/services/[id] - Update service
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const motorcycleId = getSingleMotorcycleId();

    // Check if service exists
    const [existing] = await db
      .select()
      .from(services)
      .where(eq(services.id, id));

    if (!existing) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // Prepare update data (motorcycleId is now fixed to the single motorcycle)
    const updateData = {
      motorcycleId, // Always use the single motorcycle ID
      date: body.date ? new Date(body.date) : existing.date,
      kilometers: body.kilometers
        ? parseInt(body.kilometers)
        : existing.kilometers,
      type: body.type || existing.type,
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
      nextServiceKm: body.nextServiceKm
        ? parseInt(body.nextServiceKm)
        : existing.nextServiceKm,
    };

    const [updated] = await db
      .update(services)
      .set(updateData)
      .where(eq(services.id, id))
      .returning();

    // Update motorcycle's current kilometers if this service has higher km
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
    console.error("Error updating service:", error);
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 }
    );
  }
}

// DELETE /api/services/[id] - Delete service
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check if service exists
    const [existing] = await db
      .select()
      .from(services)
      .where(eq(services.id, id));

    if (!existing) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // Delete service
    await db.delete(services).where(eq(services.id, id));

    return NextResponse.json(
      { message: "Service deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}
