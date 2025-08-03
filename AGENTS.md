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

## Development Workflow

### Feature Implementation Process
1. **Planning Phase**: Define testing strategy and acceptance criteria before coding
2. **Implementation Phase**: Write tests alongside code, not after
3. **Completion Phase**: Verify test coverage meets quality gates
4. **Documentation Phase**: Update all relevant docs before feature is considered done

### Testing Requirements
**Before Starting Any Feature:**
- Identify what needs testing (components, logic, integrations, edge cases)
- Define measurable acceptance criteria with clear pass/fail outcomes
- Choose appropriate testing approaches (unit/integration/e2e)
- Document testing plan in feature branch or PR description

### Live Documentation Standards
**All Documentation Must Stay Current:**
- Update AGENTS.md when adding new tools, patterns, or conventions
- Update README.md when changing core functionality or user experience
- Update requirements when scope, features, or architecture changes
- No feature is complete without corresponding documentation updates

### Definition of Done
**Feature Completion Checklist:**
- [ ] Tests written and passing for new functionality
- [ ] Existing tests still pass (regression testing)
- [ ] Documentation updated to reflect changes
- [ ] Code reviewed and approved
- [ ] Integration tested with existing features
- [ ] Performance impact assessed and acceptable

### Continuous Delivery Practices
**Always Maintain Working State:**
- Run full test suite before every commit
- Ensure main branch always builds and deploys successfully
- Use feature flags or branches for incomplete features
- Deploy frequently with confidence through automated testing

## GitHub Workflow

### Label System
**Issue Type:**
- `feature` - New functionality or capability
- `enhancement` - Improving existing functionality  
- `bug` - Error fixes and unexpected behavior
- `documentation` - Writing/updating docs
- `chore` - Maintenance tasks (dependencies, tooling)

**Priority (aligned with MVP phases):**
- `priority: critical` - Blockers that prevent development
- `priority: high` - Phase 1 (Core MVP) features
- `priority: medium` - Phase 2 (Enhanced MVP) features  
- `priority: low` - Phase 3 (Polish & Optimization) features

**Development Phase:**
- `phase-1: core-mvp` - Must-have foundation features
- `phase-2: enhanced-mvp` - Should-have advanced features
- `phase-3: polish` - Nice-to-have optimization features

**Technical Area:**
- `area: frontend` - UI/UX, React components, styling
- `area: backend` - API routes, database, server logic
- `area: database` - Schema, migrations, data modeling
- `area: infrastructure` - Build, deploy, monitoring
- `area: testing` - Test implementation and coverage

**Status (GitHub workflow states):**
- `status: ready` - Planned and ready to start
- `status: in-progress` - Actively being worked on
- `status: in-review` - PR open, awaiting review
- `status: blocked` - Cannot proceed due to dependencies

### Issue-Driven Development Process
1. **Create Issue**: Document feature/bug with acceptance criteria and appropriate labels
2. **Create Branch**: Branch from main using `issue-{number}-{brief-description}` format
3. **Follow Development Workflow**: Execute the 4-phase **Feature Implementation Process** above
4. **Update Status**: Change label from `status: ready` to `status: in-progress`
5. **Commit & Push**: Run **Build/Test Commands** before commits, push to feature branch
6. **Create Pull Request**: Include testing summary, change label to `status: in-review`
7. **Code Review**: Ensure **Definition of Done** checklist is complete
8. **Merge & Close**: Squash merge to main, maintaining **Continuous Delivery Practices**

### Branch Naming Convention
- Format: `issue-{number}-{brief-description}`
- Examples: `issue-23-add-conditional-logic`, `issue-45-fix-mobile-preview`
- Use camelCase for descriptions (consistent with **Code Style Guidelines**)

### Pull Request Requirements
**Must satisfy Definition of Done before merge:**
- [ ] All **Build/Test Commands** pass (`npm test`, `npm run lint`, `npm run type-check`)
- [ ] **Live Documentation Standards** met (AGENTS.md, README.md, requirements updated)
- [ ] Code follows **Code Style Guidelines** (TypeScript, naming conventions, error handling)
- [ ] Testing plan documented and executed per **Testing Requirements**
- [ ] **Continuous Delivery Practices** maintained (main branch stays deployable)
