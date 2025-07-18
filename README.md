# 🏍️ MotoTracker - Motorcycle Maintenance Tracker

A minimalist full-stack application for tracking motorcycle maintenance, services, events, and expenses.

## 🚀 Tech Stack

- **Frontend/Backend**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **ORM**: Drizzle
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Radix UI primitives
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## ✅ Phase 1 Complete - Project Setup

### What's Been Implemented:

- ✅ **Project Configuration**: Next.js + TypeScript + Tailwind CSS
- ✅ **Database Setup**: Drizzle ORM configuration with PostgreSQL schema
- ✅ **UI Components**: Basic Card, Button, Input components
- ✅ **Layout**: Header navigation and responsive layout
- ✅ **Dashboard**: Initial homepage with stats cards and quick actions
- ✅ **Database Schema**: Motorcycles, Services, Events tables with relationships

### Project Structure:

```
src/
├── app/
│   ├── layout.tsx          # Root layout with header
│   └── page.tsx            # Dashboard homepage
├── components/
│   ├── layout/
│   │   └── header.tsx      # Navigation header
│   └── ui/                 # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       └── input.tsx
├── lib/
│   ├── db/
│   │   ├── schema.ts       # Database schema definitions
│   │   └── index.ts        # Database client
│   ├── supabase/
│   │   └── client.ts       # Supabase client setup
│   └── utils.ts            # Utility functions
```

## 🛠️ Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Database
DATABASE_URL=your-supabase-database-url
```

### 2. Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Copy your project URL and keys to `.env.local`
3. Generate and push the database schema:

```bash
pnpm db:generate
pnpm db:push
```

### 3. Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open Drizzle Studio (database GUI)
pnpm db:studio
```

## 📋 Next Development Phases

### Phase 2: Database Schema & Migrations

- [ ] Set up Supabase project
- [ ] Run database migrations
- [ ] Create seed data

### Phase 3: API Routes

- [ ] CRUD operations for motorcycles
- [ ] Service tracking endpoints
- [ ] Event logging endpoints
- [ ] Dashboard data aggregation

### Phase 4: UI Components & Pages

- [ ] Motorcycle management pages
- [ ] Service logging forms
- [ ] Event tracking interface
- [ ] Data visualization

### Phase 5: Features & Polish

- [ ] Charts and analytics
- [ ] Export functionality
- [ ] Mobile responsiveness
- [ ] Error handling

## 🎯 Core Features (Planned)

### Motorcycle Management

- Add/edit motorcycle details
- Track current kilometers
- Multiple motorcycle support

### Service Tracking

- Log maintenance services
- Track service costs
- Set service reminders

### Event Logging

- Record trips and events
- Track modifications
- Document accidents/incidents

### Dashboard & Analytics

- Service history overview
- Cost tracking
- Maintenance schedules
- Visual charts and graphs

## 🧩 Database Schema

### Tables:

- **motorcycles**: Basic motorcycle information
- **services**: Maintenance and service records
- **events**: Trips, modifications, and other events

### Key Features:

- UUID primary keys
- Proper foreign key relationships
- Enum types for service and event categories
- Timestamps for audit trail

## 📱 Responsive Design

The application is designed to be mobile-first and responsive, working well on:

- Desktop computers
- Tablets
- Mobile phones

## 🤝 Contributing

This is a personal project, but feel free to fork and customize for your own needs.

## 📄 License

MIT License - feel free to use this code for your own projects.
