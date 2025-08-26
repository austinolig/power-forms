# PowerForms Agent Guidelines

## Build/Lint/Test Commands

- **Build**: `npm run build` - Build production app
- **Lint**: `npm run lint` - Run ESLint with Next.js rules
- **Type check**: `npm run type-check` - TypeScript compilation check
- **Test**: `npm test` - Run all tests with Jest
- **Test single**: `npm test -- --testNamePattern="test name"` or `npm test -- path/to/test.test.ts`
- **Format**: `npm run format` - Auto-format with Prettier

## Code Style

- **User Interface**: Use shadcn/ui components and Tailwind CSS to focus on making beautiful designs with best principles
- **User Experience**: Use best practices with intuitive user flows
- **Type Safety**: Use TypeScript with strict typing, explicit return types for functions
- **Imports**: Use `@/` alias for project root, group external then internal imports
- **Naming**: camelCase for variables/functions, PascalCase for types/components, kebab-case for files
- **Error handling**: Use try-catch with typed errors, return structured responses via `errorResponse()`
- **Database**: Use Prisma with typed operations, handle `PrismaClientKnownRequestError`
- **API**: Next.js App Router, typed request/response with `NextRequest`/`NextResponse`
- **Types**: Define in `/types/` directory, use union types for responses
- **Issue Research**: Use `gh` CLI to read the specified issue details and reference `@PowerForms-MVP-Requirements.md` for full project context and requirements
- **Branch Creation**: Create appropriately named branch based on issue directive (e.g., `feature/issue-123-form-builder` or `fix/issue-456-validation-bug`)
- **Development**: Implement features according to issue requirements and `@PowerForms-MVP-Requirements.md` specifications
- **Pull Requests**: Create PR that closes the original issue with `Closes #issue-number`, includes description of implemented features based on actual code changes, and references relevant sections from requirements document if applicable

## Architecture

- Next.js 15 with App Router, React 19, Prisma ORM, PostgreSQL
- API routes in `app/api/`, database operations in `lib/db.ts`
- Use existing utility functions from `@/lib/utils`
