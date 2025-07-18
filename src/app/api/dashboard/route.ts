import { db } from "@/lib/db";
import { events, modifications, motorcycles, services } from "@/lib/db/schema";
import {
  getSingleMotorcycleId,
  SINGLE_MOTORCYCLE,
} from "@/lib/single-motorcycle";
import { and, count, eq, gte, isNotNull, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

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

// GET /api/dashboard - Get dashboard statistics for single motorcycle
export async function GET() {
  try {
    await ensureSingleMotorcycle();

    const motorcycleId = getSingleMotorcycleId();

    // Get current date for filtering
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get motorcycle info
    const [motorcycle] = await db
      .select()
      .from(motorcycles)
      .where(eq(motorcycles.id, motorcycleId));

    // Aggregate all statistics in parallel for the single motorcycle
    const [
      servicesThisMonth,
      totalServices,
      totalEvents,
      totalServiceCost,
      totalEventCost,
      totalModificationCost,
      upcomingServices,
      recentServices,
      recentEvents,
    ] = await Promise.all([
      // Services this month for the single motorcycle
      db
        .select({ count: count() })
        .from(services)
        .where(
          and(
            eq(services.motorcycleId, motorcycleId),
            gte(services.date, startOfMonth)
          )
        ),

      // Total services count for the single motorcycle
      db
        .select({ count: count() })
        .from(services)
        .where(eq(services.motorcycleId, motorcycleId)),

      // Total events count for the single motorcycle
      db
        .select({ count: count() })
        .from(events)
        .where(eq(events.motorcycleId, motorcycleId)),

      // Total service costs for the single motorcycle
      db
        .select({
          total: sql<number>`COALESCE(SUM(CAST(${services.cost} AS DECIMAL)), 0)`,
        })
        .from(services)
        .where(eq(services.motorcycleId, motorcycleId)),

      // Total event costs for the single motorcycle
      db
        .select({
          total: sql<number>`COALESCE(SUM(CAST(${events.cost} AS DECIMAL)), 0)`,
        })
        .from(events)
        .where(eq(events.motorcycleId, motorcycleId)),

      // Total modification costs for the single motorcycle
      db
        .select({
          total: sql<number>`COALESCE(SUM(CAST(${modifications.cost} AS DECIMAL)), 0)`,
        })
        .from(modifications)
        .where(eq(modifications.motorcycleId, motorcycleId)),

      // Upcoming services (services with next_service_km set) for the single motorcycle
      db
        .select({ count: count() })
        .from(services)
        .where(
          and(
            eq(services.motorcycleId, motorcycleId),
            isNotNull(services.nextServiceKm)
          )
        ),

      // Recent services (last 5) for the single motorcycle
      db
        .select({
          id: services.id,
          date: services.date,
          type: services.type,
          motorcycleName: motorcycles.name,
          kilometers: services.kilometers,
          cost: services.cost,
        })
        .from(services)
        .leftJoin(motorcycles, eq(services.motorcycleId, motorcycles.id))
        .where(eq(services.motorcycleId, motorcycleId))
        .orderBy(sql`${services.date} DESC`)
        .limit(5),

      // Recent events (last 5) for the single motorcycle
      db
        .select({
          id: events.id,
          date: events.date,
          type: events.type,
          title: events.title,
          motorcycleName: motorcycles.name,
          kilometers: events.kilometers,
        })
        .from(events)
        .leftJoin(motorcycles, eq(events.motorcycleId, motorcycles.id))
        .where(eq(events.motorcycleId, motorcycleId))
        .orderBy(sql`${events.date} DESC`)
        .limit(5),
    ]);

    // Format the response for single motorcycle
    const dashboardData = {
      motorcycle: motorcycle || SINGLE_MOTORCYCLE,
      stats: {
        servicesThisMonth: servicesThisMonth[0]?.count || 0,
        totalServices: totalServices[0]?.count || 0,
        totalEvents: totalEvents[0]?.count || 0,
        upcomingServices: upcomingServices[0]?.count || 0,
        totalExpenses:
          Number(totalServiceCost[0]?.total || 0) +
          Number(totalEventCost[0]?.total || 0) +
          Number(totalModificationCost[0]?.total || 0),
        currentKilometers:
          motorcycle?.currentKilometers || SINGLE_MOTORCYCLE.currentKilometers,
      },
      recentActivity: {
        services: recentServices.map((service) => ({
          ...service,
          activityType: "service" as const,
        })),
        events: recentEvents.map((event) => ({
          ...event,
          activityType: "event" as const,
        })),
      },
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
