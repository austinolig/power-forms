# PowerForms Agent Guidelines

## Project Overview
PowerForms is a modern form builder and data collector built with Next.js, React, TypeScript, Tailwind CSS, and Postgres.

## Technology Stack
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, shadcn/ui
- **Forms**: React Hook Form, Zod validation, @dnd-kit for drag-and-drop
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
- Use TypeScript for all files
- Follow Next.js app router conventions
- Use Tailwind CSS for styling with shadcn/ui components
- Implement React Hook Form with Zod validation
- Use Prisma for database operations
- Follow naming: camelCase for variables/functions, PascalCase for components
- Use arrow functions for components and utilities
- Implement proper error handling with try/catch blocks
- Use proper TypeScript types, avoid `any`
- Follow the component structure defined in the requirements document