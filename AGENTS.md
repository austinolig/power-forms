# PowerForms Agent Guidelines

## Project Overview
PowerForms is a modern form builder and data collector built with Next.js, React, TypeScript, Tailwind CSS, and Postgres.

## Technology Stack
- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui
- **Forms**: React Hook Form, Zod validation, @dnd-kit for drag-and-drop
- **State**: Zustand for form builder state, TanStack Query for server state
- **Backend**: Next.js API routes, Prisma ORM, Neon Postgres
- **Deployment**: Vercel

## Build/Test Commands
Since the project is in initial planning phase, standard Next.js commands apply:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks
- `npm test` - Run tests (Jest/Vitest)
- `npm test -- --testNamePattern="specific test"` - Run single test

## Code Style Guidelines
- Use TypeScript for all files, avoid `any` type
- Follow Next.js App Router conventions with server/client components
- Use Tailwind CSS for styling with shadcn/ui components
- Implement React Hook Form with Zod validation for all forms
- Use Prisma for all database operations with proper error handling
- Follow naming: camelCase for variables/functions, PascalCase for components/types
- Use arrow functions for components and utilities
- Implement proper error handling with try/catch blocks and error boundaries
- Use JSON storage for flexible form configurations and submission data
- Follow the real-time preview architecture: shared JSON schema drives both builder and preview
- Implement conditional logic with client-side rule evaluation for performance
