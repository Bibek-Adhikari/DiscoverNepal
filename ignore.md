# Discover Nepal - Project Documentation (ignore.md)

This document provides a comprehensive overview of the Discover Nepal application's architecture, module structure, and dependencies.

---

## 🏗️ Project Architecture

The application is built with **React 19**, **TypeScript**, and **Vite**. It follows a modular, section-based architecture for a smooth single-page scrolling experience.

### 📁 Directory Structure

```text
app/
├── src/
│   ├── components/       # Shared UI components
│   │   ├── ui/           # Low-level UI primitives (Radix/Shadcn)
│   │   └── Header.tsx    # Navigation and site header
│   ├── sections/         # Major page sections (The "building blocks")
│   ├── contexts/         # Global state management
│   ├── hooks/            # Custom reusable logic (Data fetching, Theme)
│   ├── data/             # Static fallback data and type definitions
│   ├── lib/              # Utility functions, Supabase client, Seeding logic
│   ├── types/            # Global TypeScript interfaces
│   ├── App.tsx           # root App component (Layout & Global Scroll)
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles and Tailwind directives
├── public/               # Static assets (Images, SVGs)
└── package.json          # Dependencies and scripts
```

---

## 🧩 Core Modules & Sections

### 1. Sections (`src/sections/`)

Each section represents a distinct part of the homepage:

- **`HeroSection.tsx`**: The landing area with immersive video/image and CTA.
- **`NewsExplorer.tsx`**: Dynamic news feed related to Nepal's tourism and environment.
- **`TerritoryExplorer.tsx`**: Region-based exploration of provinces and districts.
- **`ImpactDashboard.tsx`**: Visualized data (graphs) on tourism impact and conservation.
- **`InteractiveMap.tsx`**: A custom-built geographic map with destination markers.
- **`DestinationHighlights.tsx`**: Curated list of top destinations.
- **`PlanYourVisit.tsx`**: Interactive form/guide for visitors.
- **`Footer.tsx`**: Site navigation, social links, and legal info.

### 2. Contexts (`src/contexts/`)

- **`DataContext.tsx`**: Manages data flow. Prioritizes **Supabase** data while automatically falling back to static data from `nepalData.ts` if offline or loading fails.
- **`ThemeContext.tsx`**: Handles Dark/Light mode state.

### 3. Data Flow (`src/hooks/` & `src/lib/`)

- **`useNepalData.ts`**: Contains TanStack Query hooks for fetching provinces, destinations, and metrics from Supabase.
- **`supabase.ts`**: Initializes the Supabase client using environment variables.
- **`seedData.ts`**: Utilities for migrating static local data to the Supabase database.

---

## 📦 Dependencies

### Core Frameworks

- **React 19**: Modern UI library.
- **TypeScript**: Typed JavaScript for better developer experience and reliability.
- **Vite**: Fast build tool and dev server.

### UI & Styling

- **Tailwind CSS**: Utility-first styling.
- **GSAP**: Industry-standard animation engine for smooth scroll-triggered reveals and pins.
- **Framer Motion**: React-centric animation library for micro-interactions.
- **Lucide React**: Premium icon set.
- **Radix UI**: Accessible, unstyled UI primitives.
- **Sonner**: High-performance toast notifications.

### Data & Visualization

- **@supabase/supabase-js**: Backend-as-a-Service integration for database and auth.
- **@tanstack/react-query**: Powerful data synchronization and caching.
- **Recharts**: Responsive chart library for the Impact Dashboard.

### Forms & Utilities

- **React Hook Form**: Performant form management.
- **Zod**: Schema-based validation for TypeScript.
- **date-fns**: Comprehensive date manipulation.
- **clsx / tailwind-merge**: Conditional class management.

---

## 🗄️ Database Setup (Supabase)

The app uses Supabase for dynamic content management. Below is the simplified schema:

### Tables & Schema

- **`provinces`**: Root table for Nepal's administrative regions.
  - `id` (slug), `name`, `capital`, `area`, `population`
- **`districts`**: Linked to provinces.
  - `id` (slug), `name`, `province_id` (FK), `headquarters`, `area`, `population`
- **`destinations`**: Main content table for tourist spots.
  - `id` (slug), `name`, `province_id` (FK), `district_id` (FK), `category`, `elevation`, `best_months` (text[]), `description`, `cultural_significance`, `image` (path/URL), `coordinates` (JSONB), `weather_condition`, `temperature`
- **`impact_metrics`**: Sustainability data for the dashboard.
  - `id`, `label`, `value`, `unit`, `change`, `change_label`
- **`monthly_visitor_data`**: Chronological chart data.
  - `id`, `month`, `visitors`, `carbon_offset`

### Data Seeding

Local data from `src/data/nepalData.ts` can be migrated to Supabase using the `seedSupabaseData()` function in `src/lib/seedData.ts`. This utility handles idempotent upserts to ensure data consistency without duplicates.

---

## 🛠️ Key Design Patterns

1. **Supabase-First with Static Fallback**: Ensures a "never-empty" UI by using local JSON-like data if the live DB is unreachable.
2. **Scroll-Triggered Animations**: Uses GSAP `ScrollTrigger` to create a premium, immersive narrative as the user scrolls.
3. **Centralized Data Context**: All major components subscribe to `useData()` to ensure a single source of truth across the app.
