# PowerForms Agent Guidelines

## Build/Lint/Test Commands

- **Build**: `npm run build` - Build production app
- **Lint**: `npm run lint` - Run ESLint with Next.js rules
- **Type check**: `npm run type-check` - TypeScript compilation check
- **Test**: `npm test` - Run all tests with Jest
- **Test single**: `npm test -- --testNamePattern="test name"` or `npm test -- path/to/test.test.ts`
- **Format**: `npm run format` - Auto-format with Prettier

## Code Style

- **User Interface**: Use Tailwind CSS and focus on beautiful designs with best principles
- **User Experience**: Use best practices with intuitive user flows
- **Type Safety**: Use TypeScript with strict typing, explicit return types for functions
- **Imports**: Use `@/` alias for project root, group external then internal imports
- **Naming**: camelCase for variables/functions, PascalCase for types/components, kebab-case for files
- **Error handling**: Use try-catch with typed errors, return structured responses via `errorResponse()`
- **Database**: Use Prisma with typed operations, handle `PrismaClientKnownRequestError`
- **API**: Next.js App Router, typed request/response with `NextRequest`/`NextResponse`
- **Types**: Define in `/types/` directory, use union types for responses

## Architecture

- Next.js 15 with App Router, React 19, Prisma ORM, PostgreSQL
- API routes in `app/api/`, database operations in `lib/db-operations.ts`
- Use existing utility functions from `@/lib/utils`

## GitHub Issue Workflow

When working with GitHub issues:

1. **Issue Research**: Use `gh` CLI to read the specified issue details
2. **Requirements Review**: Reference `@PowerForms-MVP-Requirements.md` for full project context and requirements
3. **Branch Creation**: Create appropriately named branch based on issue directive (e.g., `feature/issue-123-form-builder` or `fix/issue-456-validation-bug`)
4. **Development**: Implement features according to issue requirements and MVP specifications
5. **Pull Request**: Create PR that:
   - Closes the original issue with `Closes #issue-number`
   - Includes description of implemented features based on actual code changes
   - References relevant sections from requirements document if applicable
