# Toolix (toolix.dev): Production Specification & Technical Blueprint

Toolix is an ultra-fast, zero-compute web utility suite built with Astro, Tailwind CSS. Every utility runs directly within the user's browser using WebAssembly (WASM) and Web Workers. No files or personal inputs ever touch a remote server, eliminating cloud infrastructure costs while providing absolute data privacy.

---

## 1. Brand Identity & Market Positioning

### Core Information

- **Product Name:** Toolix
- **Target Domain:** toolix.dev
- **Core Hook:** 100% Free Online Tools: No Sign-Up, No Installation, 100% Private.

### Value Proposition & Messaging

- **No Sign-Up Barrier:** Unlike competing platforms that restrict usage behind forced email collection or paywalls, Toolix delivers immediate access: open the page, drop in the data, and get the result instantly.
- **Zero-Upload Privacy Moat:** Traditional utilities process files on remote servers, exposing documents to data liabilities. Toolix executes all processing on the client's device, ensuring private documents, images, and text never leave the local browser tab.
- **Predictable Zero-Compute Economics:** Because compute resources are supplied by the end-user's device, running the site for 50,000 daily visitors costs the same as running it for 5: a flat static edge hosting tier under $10 per month.

---

## 2. Impeccable Frontend Design System & Anti-Slop Protocol

To avoid generic, forgettable AI layouts, such as purple gradients, un-tinted neutrals, and repetitive bento cards, Toolix integrates the Impeccable frontend design system across development.

### Impeccable Setup & Tooling Configuration

- **Installation:** Added to the development workflow via `npx impeccable install` and initialized using `/impeccable init` to establish project context.
- **Core Context Document (`PRODUCT.md`):** Records the target audience (power users, students, remote workers, developers), project constraints (sub-second load, 0 CLS, client-side execution), and brand voice (focused, fast, restrained).
- **Design Audit Suite:** Quality is verified using `npx impeccable detect` in continuous integration to catch automated anti-patterns, paired with interactive commands (`/impeccable audit`, `/impeccable polish`, `/impeccable typeset`, `/impeccable layout`) during component construction.

### The Two Operating Modes

#### The "Operate" Mode (Tool Interfaces)

- **Purpose:** The user arrives to complete an explicit micro-task.
- **Rule:** Utility and scannability take precedence over decorative flair. Inputs, conversion toggles, and action buttons are placed prominently above the fold.
- **Restraint:** Zero unneeded container nesting, decorative badge clutter, or visual distractions around the workspace.

#### The "Persuade" Mode (Homepage & Category Indexes)

- **Purpose:** Guides users to the exact tool they need while communicating privacy and zero-signup guarantees.
- **Rule:** Asymmetric visual hierarchy, crisp typography, and an interactive, keyboard-navigable tool directory grid.

### Impeccable Design Standards & Anti-Patterns

| Design Dimension | Mandatory Impeccable Standard | Saturated Anti-Pattern to Avoid |
| --- | --- | --- |
| **Color System** | Warm, tinted neutrals (slate-tinted whites and obsidian dark tones). Single vibrant accent: Electric Blue. | Pure harsh black (#000000), pure bleach white (#FFFFFF), or purple-to-blue gradients. |
| **Typography** | Crisp modern sans-serif (Geist Sans or Inter Display) with tight negative tracking on major headers. | Generic system font stacks, Arial, or overused heavy monospace as lazy "developer" styling. |
| **Layout & Rhythm** | Purposeful section dividers, asymmetric data alignment, and flat content groups separated by whitespace. | Wrapping every feature in rounded cards, or nesting cards inside cards with identical icon tiles. |
| **Theme Default** | Light Mode by default (clean slate background), with an accessible manual toggle to Dark Mode. | Forcing dark-only interfaces or low-contrast gray text on colored containers. |
| **Motion & State** | Subtle 150ms ease-out transitions for interactive states (button active states, drag-and-drop focus rings). | Bouncy or elastic keyframe physics, slide-ins that block interaction, or slow layout animations. |

---

## 3. Technology Architecture & Stack

- **Core Framework:** Astro (Static Site Generation, SSG). Emits pure static HTML by default with 0 KB client-side runtime JavaScript for all static content, headers, footers, and SEO wrappers.
- **Interactive Layer:** React (Astro Islands). Hydrated selectively using `client:idle` or `client:visible` only over the specific tool interactive widgets, preventing main-thread blocking.
- **UI Components:** custom styled components, use shadcn llike scc taiwliwnd confg to handle themes properly and later on more themes easily, use tailwind css.
- **Processing Engines:** Web Workers & WebAssembly (WASM). CPU-intensive operations (PDF byte manipulation, image transcoding, anagram searching) are handled off the main browser thread to maintain an Interaction to Next Paint (INP) score under 100ms.
- **Client-Side Persistence:** IndexedDB & localStorage. Preserves user preferences, streak counters, and recent tool inputs locally without requiring an account or server database.
- **Delivery:** Global Edge CDN (Cloudflare Pages or Vercel). Delivers static assets from data centers close to the user with a Time to First Byte (TTFB) below 50ms.

---

## 4. Complete Project Directory Structure

```text
.
├── public/                 # Static assets, favicon, responsive PWA icons (192px and 512px),
│                           # robots.txt, compressed dictionary asset (words_alpha.json)
├── src/
│   ├── components/
│   │   ├── ads/            # Layout-stable horizontal banner placeholders (0 CLS) and
│   │   │                   # viewability-refreshing sidebar ad containers
│   │   ├── core/           # Global header with "No Sign-Up" status badges, footer with legal
│   │   │                   # and trust links, theme switcher, shared ToolLayout wrapper
│   │   ├── seo/            # Canonical link generators, social graph metadata cards,
│   │   │                   # programmatic WebApplication and FAQPage JSON-LD schemas
│   │   ├── tools/
│   │   │   ├── unscrambler/  # Interactive Trie word search UI and background Web Worker
│   │   │   ├── sleep/        # Circadian calculation interface and dynamic timeline visualizer
│   │   │   ├── pdf/          # Canvas-based PDF page manipulation UI and pdf-lib execution thread
│   │   │   ├── image/        # Drag-and-drop batch HEIC/WebP transcode UI and libheif WASM worker
│   │   │   └── pomodoro/     # Timer canvas, sound generator, background interval tick worker
│   │   └── ui/             # Refined ui components (buttons, cards, inputs, tabs,
│   │                       # badges, dialogs)
│   ├── content/
│   │   └── guides/         # 800 to 1,200 word Markdown editorial wrappers per tool
│   │                       # (to clear AdSense review)
│   ├── layouts/            # Base HTML layout with font loaders and PWA service worker
│   │                       # registrations
│   ├── lib/                # Trie algorithms, local storage wrappers, class merge utilities
│   └── pages/              # Main directory index, programmatic SEO routes
│                           # (/word-unscrambler/[slug], /pdf-tools/[action]), standalone
│                           # tool pages, trust pages (about, contact, privacy, terms)
└── .impeccable/            # Local Impeccable design rules, tokens, and references
    └── PRODUCT.md          # Durable design context parsed by AI coding tools
```

---

## 5. Detailed Specifications for the 5 Initial Tools

### Tool 1: Anagram & Word Unscrambler

- **Search Targets:** "word unscrambler", "scrabble word finder", "unscramble letters".
- **Core Logic:** Implements an in-memory Prefix Tree (Trie) loaded into a Web Worker. As the user inputs letters and wildcards (`?`), the worker evaluates valid permutations against the dictionary, sorting matches by word length and Scrabble point scores.
- **Programmatic SEO:** Generates static pages via Astro's `getStaticPaths()` targeting high-volume query variants (e.g., `/word-unscrambler/5-letter-words`, `/word-unscrambler/words-starting-with-c`).
- **Zero Compute:** The compressed dictionary file is downloaded once, cached in IndexedDB, and traversed in client memory.

### Tool 2: Circadian Rhythm & Sleep Cycle Calculator

- **Search Targets:** "sleep calculator", "what time should I go to bed", "sleep cycles".
- **Core Logic:** Models human 90-minute ultradian sleep rhythms combined with an adjustable 14-minute average sleep latency window. Calculates optimal bedtimes based on target wake-up times, and optimal wake-up times for users going to sleep immediately.
- **User Interface:** Renders an interactive circadian cycle curve displaying Light Sleep, Deep Sleep, and REM phases.
- **Retention Feature:** Saves preferred sleep schedules to localStorage, displaying sleep consistency metrics over time.

### Tool 3: Privacy-Preserving PDF Utility Suite (Merge, Split, Compress)

- **Search Targets:** "merge pdf online", "compress pdf without losing quality", "split pdf pages".
- **Core Logic:** Uses `pdf-lib` and `pdfjs-dist` running in a dedicated Web Worker.
  - **Merge:** Concatenates independent PDF binary arrays into a single document.
  - **Split:** Parses the document into an interactive page thumbnail grid, allowing selective page extraction or removal.
  - **Compress:** Analyzes embedded image streams, downsamples raster elements via canvas operations, and strips redundant metadata streams.
- **Privacy Assurance:** Displays a prominent badge: "100% Client-Side. Your files never touch a server."

### Tool 4: In-Browser HEIC & WebP Image Transcoder

- **Search Targets:** "convert heic to jpg", "heic to png", "batch convert heic free".
- **Core Logic:** Uses `libheif-js` compiled to WebAssembly to decode Apple HEIC/HEIF containers in local memory. Decoded image frames are drawn to an off-screen canvas and exported to JPEG, PNG, or WebP formats at user-selected compression qualities.
- **Batch Execution:** Supports dragging dozens of files simultaneously, with output files bundled into an exportable `.zip` archive via `jszip`.

### Tool 5: Deep-Work Pomodoro Focus Timer

- **Search Targets:** "pomodoro timer online", "study timer", "focus clock".
- **Core Logic:** Uses a dedicated Web Worker tick thread to manage time intervals. Standard `setInterval` functions in JavaScript are throttled down to once per minute by operating systems when browser tabs are hidden; the worker tick thread ensures accurate, uninterrupted countdowns even in background tabs.
- **Audio Alerts:** Generates completion tones using the browser's native Web Audio API synthesizer, eliminating the need to load external audio files.
- **Retention Tracking:** Includes a local task management checklist and session streak counter saved in localStorage.

---

## 6. Zero-Compute Security & Privacy Architecture

Because users process personal documents, images, and text, Toolix operates with strict client-side data isolation.

- **Content Security Policy (CSP):** Configured via edge HTTP response headers:
  - Restricts scripts exclusively to self-hosted sources and authorized Google AdSense endpoints.
  - Prohibits form submissions to external endpoints (`form-action 'none'`).
  - Blocks object embedding (`object-src 'none'`) and authorizes worker creation only from local blob scripts (`worker-src 'self' blob:`).
- **Volatile Memory Handling:** Files are loaded using browser FileReader APIs as temporary binary ArrayBuffers. When the browser tab is closed or refreshed, all file data is purged from memory.
- **No External Fonts or Trackers:** Typography is bundled locally using `@fontsource` packages. The platform runs zero third-party behavioral trackers or analytics cookies, maximizing privacy and page load speed.

---

## 7. Display Advertising Architecture & AdSense Compliance

Display advertising revenue requires balancing ad inventory with strong user experience and page speed.

### Zero Cumulative Layout Shift (CLS = 0.00)

Ads that push page elements around as they load harm search engine rankings and user experience.

- **Top/Bottom Leaderboards:** Wrapped in a fixed container reserving a minimum height of 90px on desktop and 50px on mobile.
- **Sidebar Ad Units:** Wrapped in a fixed container reserving 300px by 600px desktop dimensions.
- **Background Placeholders:** Unfilled ad slots maintain neutral slate background placeholders with a subtle "Advertisement" label, preventing content jumps when ads finish loading.

### Viewability Auto-Refresh Implementation

For long user sessions (such as active Pomodoro work blocks or extended anagram solving), sidebar ad slots include an automated refresh script.

- **Visibility Threshold:** The script checks that at least 50% of the ad unit is visible within the viewport using an `IntersectionObserver`.
- **Activity Verification:** Auto-refresh pauses immediately when the user minimizes the tab or remains idle.
- **Refresh Frequency:** Displays reload on a policy-compliant 35-second timer, multiplying ad impressions during extended sessions without layout shifts.

### The 800 to 1,200 Word Editorial Wrapper

To prevent rejection by Google AdSense for "Low-Value Content" or "Thin Content," every tool page features structured educational content below the interactive canvas.

- **Detailed Technical Explanations:** Explains the underlying math, formulas, or conversion standards.
- **Step-by-Step Instructions:** Guides users through edge cases and format choices.
- **FAQ Section with Schema:** Answers common user questions, paired with structured `FAQPage` and `WebApplication` JSON-LD schema to secure Google Rich Snippets in search results.

---

## 8. Progressive Web App (PWA) Operational Standards

Toolix is configured as an installable Progressive Web App via `@vite-pwa/astro` and Workbox.

- **Offline Functionality:** Service workers pre-cache all static CSS, HTML, JavaScript bundles, WebAssembly runtimes, and dictionary assets. Once visited, all 5 core tools operate without an active internet connection.
- **Application Manifest:** Configured for standalone window mode, allowing desktop and mobile users to install Toolix as a native app on their home screen or dock.

---

## 9. Comprehensive Implementation Checklist

### Phase 1: Environment Setup & Core Foundations

- [ ] Initialize repository: Astro + TypeScript + Tailwind CSS (`npm create astro@latest`).
- [ ] Install the Impeccable skill pack (`npx impeccable install`) and run `/impeccable init`.
- [ ] Complete `PRODUCT.md` with target audience, brand constraints, and design tokens.
- [ ] Add ui components (button, card, input, tabs, badge, dialog).
- [ ] Install self-hosted typography via `@fontsource/geist-sans`.
- [ ] Configure light/dark theme variables with Light mode as the default in `globals.css`.
- [ ] Build global `Header.astro` featuring the "No Sign-Up Required" badge, tool search, and theme toggle.
- [ ] Build global `Footer.astro` containing About, Contact, Terms, and Privacy links.

### Phase 2: Tool Engineering (Client-Side & Zero Compute)

- [ ] Word Unscrambler: Implement Trie algorithm in a Web Worker (`unscramble.worker.ts`).
- [ ] Word Unscrambler: Compress English word dictionary and store in `/public/dictionaries/`.
- [ ] Sleep Calculator: Implement 90-minute circadian cycle algorithm with latency offsets.
- [ ] Sleep Calculator: Build responsive SVG circadian wave component with sleep-stage markers.
- [ ] PDF Utility: Integrate `pdf-lib` in a Web Worker for local Merge, Split, and Compress.
- [ ] PDF Utility: Create client-side visual page thumbnail grid.
- [ ] HEIC Converter: Compile `libheif-js` WebAssembly build for browser-based image transcoding.
- [ ] HEIC Converter: Add batch queue handling and `.zip` archive generation via `jszip`.
- [ ] Pomodoro Timer: Create un-throttled Web Worker interval timer tick thread.
- [ ] Pomodoro Timer: Add synthesized Web Audio alert chimes and local storage task tracker.

### Phase 3: PWA & Offline Support

- [ ] Install `@vite-pwa/astro` and configure Web App Manifest.
- [ ] Generate responsive icons (192x192, 512x512) and place in `/public`.
- [ ] Verify offline service worker caching for all JS, CSS, and dictionary assets.

### Phase 4: SEO, Rich Snippets & Content Wrappers

- [ ] Write 800 to 1,200 words of technical guidance for each tool page (formulas, instructions, FAQs).
- [ ] Build `SchemaJsonLd.astro` component outputting `WebApplication` and `FAQPage` schemas.
- [ ] Create programmatic route template for Word Unscrambler long-tail routes (`[slug].astro`).
- [ ] Implement self-referential canonical tags and OpenGraph tags across all layouts.
- [ ] Verify Core Web Vitals on mobile (LCP < 1.2s, CLS = 0.00, INP < 100ms).

### Phase 5: Legal Trust & AdSense Compliance Pages

- [ ] Deploy `privacy.astro` with explicit cookie handling and programmatic ad policies.
- [ ] Deploy `about.astro` detailing editorial standards, mission, and "Zero Upload" architecture.
- [ ] Deploy `terms.astro` stating zero-upload local data processing policies.
- [ ] Deploy `contact.astro` with an active contact form or domain email address.

### Phase 6: Monetization Deployment & Launch

- [ ] Deploy site to Cloudflare Pages or Vercel and map the custom domain toolix.dev.
- [ ] Integrate 0-CLS ad placeholder wrappers (`AdBanner.astro` & `StickySidebarAd.tsx`).
- [ ] Run `npx impeccable detect` across all pages to eliminate design anti-patterns before launch.
- [ ] Submit XML sitemap to Google Search Console and verify indexing of all programmatic routes.
- [ ] Submit verified toolix.dev domain to Google AdSense for publisher review.
- [ ] Activate viewability-based 35-second ad auto-refresh upon ad network approval.
