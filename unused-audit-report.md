# Unused Files and Imports Audit

Generated before cleanup on 2026-05-30.

## Checks Run

- Listed all tracked project files with `rg --files`.
- Ran the project lint script: `npm run lint`.
- Ran static import/reference searches across `src`, `scripts`, `index.html`, and `public`.
- Ran production build: `npm run build`.

## Confirmed Unused Imports

1. `src/components/LatestInsights/LatestInsights.jsx`
   - `CalendarTodayIcon` from `@mui/icons-material/CalendarToday`
   - Evidence: ESLint reported `CalendarTodayIcon is defined but never used`.
   - Planned action: remove the import.

## Confirmed Unused Files

None found.

All source files under `src` are reachable from one of these entry points:

- `src/entry-client.jsx`
- `src/entry-server.jsx`
- `src/App.jsx`
- lazy imports in `src/pages/Home.jsx`
- route imports in `src/App.jsx`

The files in `public` are referenced by `index.html`, source components, or deployment/SEO behavior:

- `public/AslisiteLogo.svg` is referenced by `index.html`, navbar, and SEO metadata.
- `public/aslibooks-dashboard.png` is referenced by the Product component.
- `public/robots.txt` is needed for crawler directives.
- `public/sitemap.xml` is a static fallback; the build also generates `dist/sitemap.xml`.

## Unused Dependency Candidate

1. `react-helmet`
   - Evidence: no imports or references found in source.
   - The project uses `react-helmet-async` instead.
   - Planned action: remove `react-helmet` from dependencies.

## Other Lint Issues Found

These are not unused-file/import issues, but they currently fail `npm run lint`:

1. `src/components/LatestInsights/LatestInsights.jsx`
   - Prettier formatting errors.
2. `src/pages/NotFound.jsx`
   - Unescaped apostrophes in JSX text.

Planned action: fix these while cleaning up so the verification command passes.
