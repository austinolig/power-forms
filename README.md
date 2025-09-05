# PowerForms

> A powerful form builder.

[Live Demo](https://power-forms.vercel.app/)

## Features

- **Real-time Preview** — editor, preview, and split view builder modes
- **Conditional Logic** — show/hide fields based on specific conditions (not yet implemented)
- **Validation** — custom field validation
- **Capture & Export** — collect submissions and export data
- **Publish & Share** — save and share forms via unique URLs
- **Mobile-Friendly Design** — responsive UI for all devices

## Technology Stack

- **React + Next.js**
- **TypeScript**
- **Tailwind CSS + shadcn/ui**
- **Zod Validation + React Hook Form**
- **Postgres + Prisma ORM**
- **Jest Testing Library**

## Getting Started

```bash
git clone https://github.com/austinolig/power-forms.git
cd power-forms
npm install
# add 'DATABASE_URL' environment variable
npm run db
npm run db:setup
npm run dev
```

## Available Scripts

```bash
npm run dev          # start dev server
npm run build        # build for production
npm run start        # start production server
npm run lint         # run ESLint
npm run type-check   # run TypeScript checks
npm test             # run tests
npm run format       # format code
npm run db           # run Postgres docker container
npm run db:setup     # run Prisma migrations and generate Prisma client
```
