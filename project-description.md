# Guesthouse Osaka Website Rebuild

**August 2025 – January 2026**

## Technology Stack

Next.js 16 with React 19 (React Compiler), TypeScript, Sanity CMS with embedded Studio, Tailwind CSS 4, Radix UI components, next-intl for internationalization (English/Japanese/French), Vitest and Playwright for testing, Vercel for hosting, Resend for transactional emails, and Google Maps API.

## Role & Responsibilities

Sole developer and technical lead. I was approached by the share house manager to modernize their website. My responsibilities included auditing the legacy system, designing the new architecture, implementing the frontend and CMS integration, configuring DNS and deployment pipelines, setting up automated testing (E2E and unit), and training staff on content management.

## Technical Challenges & Solutions

The existing WordPress site ran on PHP and WP versions that hadn't been updated in 10 years, with hardcoded content in themes and posts stored as raw HTML with translations duplicated manually—making updates error-prone and tedious. After an initial prototype using TanStack Start on Cloudflare revealed image optimization limitations, I migrated to Next.js for its mature ecosystem and built-in image optimization. The client needed rich text editing capabilities (reordering images, text formatting) rather than simple text updates, which led me to integrate Sanity CMS with Portable Text. This gave them full content independence while I maintained the codebase. I implemented lazy loading for the Google Maps component, proper JSON-LD structured data, and comprehensive test automation. The final site achieves a 100% Lighthouse score, is fully responsive, and content updates no longer require developer intervention.
