# Guesthouse Osaka Website Rebuild

**August 2025 – January 2026**

## Technology Stack

TanStack Start with React 19 (React Compiler) and TypeScript, hosted on Cloudflare Workers. Sanity CMS with Portable Text and live preview, Tailwind CSS 4, Base UI components, use-intl for internationalization (English/Japanese/French/Simplified Chinese/Traditional Chinese), Vitest and Playwright for testing, Resend for transactional emails, and the Google Maps API.

## Role & Responsibilities

Sole developer and technical lead. I was approached by the share house manager to modernize their website. My responsibilities included auditing the legacy system, designing the new architecture, implementing the frontend and CMS integration, configuring DNS and deployment pipelines, setting up automated testing (E2E and unit), and training staff on content management.

## Technical Challenges & Solutions

The existing WordPress site ran on PHP and WP versions that hadn't been updated in 10 years, with hardcoded content in themes and posts stored as raw HTML with translations duplicated manually—making updates error-prone and tedious. The client needed rich text editing (reordering images, text formatting) rather than simple text updates, which led me to integrate Sanity CMS with Portable Text, with images served through Sanity's image CDN. This gave them full content independence while I maintained the codebase. Pages are cached at Cloudflare's edge, and every branch gets its own preview deployment that editors can open from the Studio. I implemented lazy loading for the Google Maps component, proper JSON-LD structured data, and comprehensive test automation. The final site achieves a 100% Lighthouse score, is fully responsive, and content updates no longer require developer intervention.
