import { db } from "@/lib/db";
import { modifications } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET /api/modifications/[id] - Get modification by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [modification] = await db
      .select()
      .from(modifications)
      .where(eq(modifications.id, id));

    if (!modification) {
      return NextResponse.json(
        { error: "Modification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(modification);
  } catch (error) {
    console.error("Error fetching modification:", error);
    return NextResponse.json(
      { error: "Failed to fetch modification" },
      { status: 500 }
    );
  }
}

// PUT /api/modifications/[id] - Update modification
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if modification exists
    const [existing] = await db
      .select()
      .from(modifications)
      .where(eq(modifications.id, id));

    if (!existing) {
      return NextResponse.json(
        { error: "Modification not found" },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData = {
      name: body.name || existing.name,
      type: body.type || existing.type,
      description:
        body.description !== undefined
          ? body.description
          : existing.description,
      installDate: body.installDate
        ? new Date(body.installDate)
        : existing.installDate,
      cost:
        body.cost !== undefined
          ? body.cost
            ? body.cost.toString()
            : null
          : existing.cost,
    };

    const [updated] = await db
      .update(modifications)
      .set(updateData)
      .where(eq(modifications.id, id))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating modification:", error);
    return NextResponse.json(
      { error: "Failed to update modification" },
      { status: 500 }
    );
  }
}

// DELETE /api/modifications/[id] - Delete modification
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check if modification exists
    const [existing] = await db
      .select()
      .from(modifications)
      .where(eq(modifications.id, id));

    if (!existing) {
      return NextResponse.json(
        { error: "Modification not found" },
        { status: 404 }
      );
    }

    await db.delete(modifications).where(eq(modifications.id, id));

    return NextResponse.json({ message: "Modification deleted successfully" });
  } catch (error) {
    console.error("Error deleting modification:", error);
    return NextResponse.json(
      { error: "Failed to delete modification" },
      { status: 500 }
    );
  }
}
