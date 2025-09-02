# Overview

CityCatalyst is a React-based dashboard application for visualizing and managing 100 high-impact climate actions across 50 cities worldwide. The application provides a comprehensive interface for exploring climate mitigation and adaptation initiatives, allowing users to filter, search, and analyze actions by various criteria including city, sector, cost, and implementation status. Built with modern web technologies, it features an elegant landing page design with KPI cards, interactive charts, data tables, and detailed action views through a drawer interface.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The application uses a **React + Vite** setup with TypeScript for type safety and modern development tooling. The frontend follows a component-based architecture with:

- **Component Structure**: Modular React components using shadcn/ui for consistent design
- **State Management**: React Query (@tanstack/react-query) for server state management and data fetching
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **UI Components**: Radix UI primitives wrapped in custom components for accessibility

## Data Management
The application currently operates with **static JSON data** loaded from `/public/actions.json`:

- **Data Schema**: Zod schemas define type-safe data structures for climate actions
- **Filtering Logic**: Client-side filtering and search functionality
- **URL State**: Query parameters persist filter state for shareable URLs
- **CSV Support**: Build script converts CSV data to JSON format

## Backend Architecture
The backend uses **Express.js** with a minimal API surface:

- **Static File Serving**: Serves the JSON data file and built frontend assets
- **Development Mode**: Vite middleware integration for hot module replacement
- **Future Extensibility**: Prepared structure for adding status update endpoints

## Database Design
Currently uses **in-memory storage** with hooks for future database integration:

- **Drizzle ORM**: Configured for PostgreSQL with Neon Database support
- **Schema Ready**: Database schema defined but not yet implemented
- **Migration Support**: Drizzle Kit configured for schema migrations

## Component Architecture
The UI follows a **layered component approach**:

- **Pages**: Dashboard and 404 routes
- **Feature Components**: KpiCards, Charts, DataTable, Filters, ActionDrawer
- **UI Primitives**: shadcn/ui components for consistent design system
- **Responsive Design**: Mobile-first approach with adaptive layouts

## State and Data Flow
The application uses **unidirectional data flow**:

- **Server State**: React Query manages API data and caching
- **Local State**: React hooks for UI state (filters, modals, pagination)
- **URL State**: Custom hooks sync filters with browser URL
- **Derived State**: Computed KPIs and filtered data from raw actions

# External Dependencies

## Core Framework
- **React 18**: Component framework with hooks and modern features
- **Vite**: Build tool and development server
- **TypeScript**: Type safety and developer experience

## UI and Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Headless UI primitives for accessibility
- **shadcn/ui**: Pre-built component library
- **Lucide React**: Icon library
- **Recharts**: Chart and data visualization library

## Data and State
- **React Query**: Server state management and caching
- **Zod**: Runtime type validation and schema definition
- **Wouter**: Lightweight routing solution

## Database and ORM
- **Drizzle ORM**: Type-safe database toolkit
- **Neon Database**: Serverless PostgreSQL (configured but not active)
- **PostgreSQL**: Target database for future backend integration

## Development Tools
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Autoprefixer
- **date-fns**: Date manipulation utilities

## Replit Integration
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Code exploration tools (development only)