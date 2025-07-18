CREATE TYPE "public"."modification_type" AS ENUM('protection', 'performance', 'aesthetic', 'comfort', 'storage', 'electronics', 'other');--> statement-breakpoint
CREATE TABLE "modifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"motorcycle_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"type" "modification_type" NOT NULL,
	"description" text,
	"install_date" timestamp NOT NULL,
	"cost" numeric(10, 2),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "modifications" ADD CONSTRAINT "modifications_motorcycle_id_motorcycles_id_fk" FOREIGN KEY ("motorcycle_id") REFERENCES "public"."motorcycles"("id") ON DELETE cascade ON UPDATE no action;