# CodeArena Guidelines

## Build & Test Commands
- `npm run dev`: Starts Vite local development server at port 3000
- `npm run build`: Compiles production build
- `npm run preview`: Previews built application

## Code Style & Architecture
- All React components follow modern functional component patterns with Hooks.
- Tailwind CSS is used for utility-first styling with dark theme support (`bg-slate-950`, `bg-slate-900`, `border-slate-800`).
- Role-based routing enforces authorization checks for `student`, `faculty`, and `admin`.
