# Overview

This is a full-stack Viking-themed NFT marketplace and staking platform called "Valhalla". The application allows users to browse, collect, and stake Viking warrior NFTs while earning $ODIN tokens. It features a modern dark theme with Nordic gold accents and includes comprehensive functionality for NFT management, staking rewards, and a token faucet system.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built with React 18 and TypeScript using Vite as the build tool. The application uses a component-based architecture with the following key patterns:

- **Router**: Wouter for client-side routing with pages for home, collection, staking, faucet, and roadmap
- **State Management**: TanStack Query (React Query) for server state management with custom query client configuration
- **UI Framework**: Shadcn/ui components built on top of Radix UI primitives for accessibility and customization
- **Styling**: Tailwind CSS with custom CSS variables for theming, including Nordic/Viking-inspired color schemes
- **Forms**: React Hook Form with Zod validation for type-safe form handling

## Backend Architecture
The backend uses Express.js with TypeScript in ESM module format:

- **API Design**: RESTful API with routes for NFTs, users, staking, and faucet operations
- **Storage Layer**: Abstracted storage interface with in-memory implementation for development
- **Error Handling**: Centralized error handling middleware with proper HTTP status codes
- **Request Logging**: Custom middleware for API request logging with response capture

## Data Storage Solutions
The application is configured to use PostgreSQL with Drizzle ORM:

- **Schema Definition**: Comprehensive database schema with tables for users, NFTs, staking rewards, and faucet claims
- **ORM**: Drizzle ORM with type-safe query building and schema validation
- **Database Provider**: Configured for Neon Database (serverless PostgreSQL)
- **Migrations**: Drizzle Kit for database schema migrations

## Authentication and Authorization
The current implementation uses a simplified demo user system, but the architecture supports full authentication:

- **User Management**: User accounts with username/password and optional wallet addresses
- **Session Handling**: Express session configuration with PostgreSQL session storage
- **Authorization**: Role-based access patterns in the storage layer

## External Dependencies

### Database and ORM
- **Neon Database**: Serverless PostgreSQL database hosting (@neondatabase/serverless)
- **Drizzle ORM**: Type-safe ORM with PostgreSQL dialect (drizzle-orm)
- **Drizzle Kit**: Database migration and introspection tool

### UI and Styling
- **Radix UI**: Comprehensive set of accessible UI primitives for React
- **Tailwind CSS**: Utility-first CSS framework with custom Viking theme
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Utility for creating variant-based component APIs

### Development and Build Tools
- **Vite**: Fast build tool with HMR and TypeScript support
- **Replit Integration**: Development environment plugins for cartographer and error overlay
- **ESBuild**: Fast bundler for production builds

### Form Handling and Validation
- **React Hook Form**: Performant forms library with minimal re-renders
- **Zod**: TypeScript-first schema validation library
- **Hookform Resolvers**: Integration between React Hook Form and Zod

### State Management and Data Fetching
- **TanStack Query**: Powerful data synchronization for React applications
- **Custom Query Client**: Configured with credentials and error handling

### Date and Utility Libraries
- **Date-fns**: Modern JavaScript date utility library
- **Nanoid**: URL-safe unique string ID generator
- **CLSX**: Utility for constructing className strings conditionally