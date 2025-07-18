CREATE TYPE "public"."event_type" AS ENUM('trip', 'accident', 'modification', 'purchase', 'insurance', 'registration', 'other');--> statement-breakpoint
CREATE TYPE "public"."service_type" AS ENUM('oil_change', 'tire_change', 'brake_service', 'chain_maintenance', 'general_maintenance', 'repair', 'inspection', 'other');--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"motorcycle_id" uuid NOT NULL,
	"date" timestamp NOT NULL,
	"kilometers" integer NOT NULL,
	"type" "event_type" NOT NULL,
	"title" varchar(100) NOT NULL,
	"description" text,
	"cost" numeric(10, 2),
	"location" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "motorcycles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"brand" varchar(50) NOT NULL,
	"model" varchar(50) NOT NULL,
	"year" integer NOT NULL,
	"current_kilometers" integer DEFAULT 0 NOT NULL,
	"engine_size" integer,
	"color" varchar(30),
	"license_plate" varchar(20),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"motorcycle_id" uuid NOT NULL,
	"date" timestamp NOT NULL,
	"kilometers" integer NOT NULL,
	"type" "service_type" NOT NULL,
	"description" text,
	"cost" numeric(10, 2),
	"location" varchar(100),
	"next_service_km" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_motorcycle_id_motorcycles_id_fk" FOREIGN KEY ("motorcycle_id") REFERENCES "public"."motorcycles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_motorcycle_id_motorcycles_id_fk" FOREIGN KEY ("motorcycle_id") REFERENCES "public"."motorcycles"("id") ON DELETE cascade ON UPDATE no action;