# PowerForms

> A modern form builder that just works

PowerForms is a fast, intuitive form builder and data collector designed for non-technical users who need professional-looking forms without the complexity of traditional form builders.

## 🎯 Vision

**"A form builder that just works"** - PowerForms eliminates the frustration of clunky, unresponsive form builders by delivering speed, modern UX, and simplicity with Gmail-level ease of use.

### Key Features

- **⚡ Real-time Preview**: Split-screen live preview with instant updates
- **🎨 Modern Interface**: Responsive, contemporary design that feels fast and intuitive
- **🧠 Conditional Logic**: Smart show/hide functionality based on user responses
- **📱 Mobile-First**: Optimized for all devices with seamless mobile experience
- **🚀 No Authentication**: Create and share forms instantly without sign-up

## 🛠 Technology Stack

### Frontend
- **Next.js** - Full-stack React framework with App Router
- **React** - Component-based UI with TypeScript
- **Tailwind CSS** - Utility-first styling framework
- **shadcn/ui** - Modern component library
- **@dnd-kit** - Drag-and-drop form builder interface

### Forms & Validation
- **React Hook Form** - Performant form handling
- **Zod** - Schema validation for type-safe forms

### Backend & Database
- **Next.js API Routes** - Serverless backend functions
- **Prisma ORM** - Type-safe database operations
- **Neon Postgres** - Managed PostgreSQL database

### Deployment
- **Vercel** - Edge-optimized hosting with automatic deployments

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (Neon recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/power-forms.git
cd power-forms

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Set up database
npx prisma migrate dev
npx prisma generate

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
npm test             # Run tests
npm test -- --testNamePattern="specific test"  # Run single test
```

## 📋 Core Features

### Form Builder
- **Drag-and-Drop Interface**: Visual field placement with intuitive controls
- **Field Types**: textarea, select, radio group, checkbox
- **Real-Time Preview**: Live preview updates as you build
- **Field Configuration**: Labels, placeholders, validation, help text
- **Conditional Logic**: Show/hide fields based on previous responses
- **Styling Options**: Basic color customization for branding

### Dashboard
- **Public Forms Gallery**: No authentication required
- **Form Management**: Edit, duplicate, delete, and share forms
- **Quick Statistics**: Submission counts and completion rates
- **Responsive Design**: Works on desktop and mobile

### Response Management
- **Data Collection**: Anonymous form submissions
- **Response Viewer**: Clean table view of all submissions
- **CSV Export**: Download responses for external analysis
- **Basic Analytics**: Submission statistics and insights

## 🎨 User Experience

### Core User Flows

1. **Form Creation**: Visit dashboard → Create new form → Drag-and-drop builder → Real-time preview → Publish
2. **Form Sharing**: Generate shareable link → Copy and distribute via any channel
3. **Response Collection**: Users fill forms → Conditional logic guides experience → Data captured
4. **Data Management**: View responses → Export to CSV → Analyze externally

### Target Users
- HR managers and recruiters
- Event organizers and coordinators  
- Marketing teams and agencies
- Operations and administrative staff
- Anyone needing quick data collection

## 🏗 Database Schema

### Forms Table
```sql
forms {
  id: uuid (primary key)
  title: string
  description: text
  fields: json[]        -- Field configurations
  settings: json        -- Colors, expiration, limits
  created_at: timestamp
  updated_at: timestamp
}
```

### Submissions Table
```sql
submissions {
  id: uuid (primary key)
  form_id: uuid (foreign key)
  data: json           -- Response key-value pairs
  submitted_at: timestamp
  ip_address: string   -- Basic analytics
}
```

## 🎯 Development Roadmap

### Phase 1: Core MVP ✅
- [x] Project setup and planning
- [ ] Drag-and-drop form builder
- [ ] Four core field types
- [ ] Real-time preview
- [ ] Public dashboard
- [ ] Form sharing

### Phase 2: Enhanced Features
- [ ] Conditional logic implementation
- [ ] Form expiration and limits  
- [ ] Color customization
- [ ] Response management dashboard
- [ ] CSV export functionality

### Phase 3: Polish & Optimization
- [ ] Performance optimization
- [ ] Advanced analytics
- [ ] Accessibility improvements
- [ ] Cross-browser testing

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Guidelines
- Use TypeScript for all files
- Follow Next.js App Router conventions
- Use Tailwind CSS with shadcn/ui components
- Implement React Hook Form with Zod validation
- Follow camelCase for variables/functions, PascalCase for components
- Use proper error handling with try/catch blocks

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Requirements Document](PowerForms-MVP-Requirements.md) - Detailed project specifications
- [Agent Guidelines](AGENTS.md) - Development guidelines for AI agents
- [Live Demo](#) - Coming soon
- [Documentation](#) - Coming soon

---

**PowerForms** - Building forms should be simple, fast, and beautiful.