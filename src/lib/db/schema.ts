import { relations } from "drizzle-orm";
import {
  boolean,
  decimal,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// Auth tables for better-auth
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").default(false),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  expiresAt: timestamp("expiresAt"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// Enums
export const serviceTypeEnum = pgEnum("service_type", [
  "oil_change",
  "tire_change",
  "brake_service",
  "chain_maintenance",
  "general_maintenance",
  "repair",
  "inspection",
  "other",
]);

export const eventTypeEnum = pgEnum("event_type", [
  "trip",
  "accident",
  "modification",
  "purchase",
  "insurance",
  "registration",
  "other",
]);

export const modificationTypeEnum = pgEnum("modification_type", [
  "protection",
  "performance",
  "aesthetic",
  "comfort",
  "storage",
  "electronics",
  "other",
]);

// Tables
export const motorcycles = pgTable("motorcycles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  brand: varchar("brand", { length: 50 }).notNull(),
  model: varchar("model", { length: 50 }).notNull(),
  year: integer("year").notNull(),
  currentKilometers: integer("current_kilometers").notNull().default(0),
  engineSize: integer("engine_size"), // in cc
  color: varchar("color", { length: 30 }),
  licensePlate: varchar("license_plate", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const services = pgTable("services", {
  id: uuid("id").primaryKey().defaultRandom(),
  motorcycleId: uuid("motorcycle_id")
    .references(() => motorcycles.id, { onDelete: "cascade" })
    .notNull(),
  date: timestamp("date").notNull(),
  kilometers: integer("kilometers").notNull(),
  type: serviceTypeEnum("type").notNull(),
  description: text("description"),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  location: varchar("location", { length: 100 }),
  nextServiceKm: integer("next_service_km"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  motorcycleId: uuid("motorcycle_id")
    .references(() => motorcycles.id, { onDelete: "cascade" })
    .notNull(),
  date: timestamp("date").notNull(),
  kilometers: integer("kilometers").notNull(),
  type: eventTypeEnum("type").notNull(),
  title: varchar("title", { length: 100 }).notNull(),
  description: text("description"),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  location: varchar("location", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const modifications = pgTable("modifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  motorcycleId: uuid("motorcycle_id")
    .references(() => motorcycles.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  type: modificationTypeEnum("type").notNull(),
  description: text("description"),
  installDate: timestamp("install_date").notNull(),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  motorcycles: many(motorcycles),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const motorcyclesRelations = relations(motorcycles, ({ many, one }) => ({
  user: one(user, {
    fields: [motorcycles.userId],
    references: [user.id],
  }),
  services: many(services),
  events: many(events),
  modifications: many(modifications),
}));

export const servicesRelations = relations(services, ({ one }) => ({
  motorcycle: one(motorcycles, {
    fields: [services.motorcycleId],
    references: [motorcycles.id],
  }),
}));

export const eventsRelations = relations(events, ({ one }) => ({
  motorcycle: one(motorcycles, {
    fields: [events.motorcycleId],
    references: [motorcycles.id],
  }),
}));

export const modificationsRelations = relations(modifications, ({ one }) => ({
  motorcycle: one(motorcycles, {
    fields: [modifications.motorcycleId],
    references: [motorcycles.id],
  }),
}));

// Types
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;
export type Account = typeof account.$inferSelect;
export type NewAccount = typeof account.$inferInsert;
export type Verification = typeof verification.$inferSelect;
export type NewVerification = typeof verification.$inferInsert;
export type Motorcycle = typeof motorcycles.$inferSelect;
export type NewMotorcycle = typeof motorcycles.$inferInsert;
export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type Modification = typeof modifications.$inferSelect;
export type NewModification = typeof modifications.$inferInsert;
