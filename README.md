# Drink Recipe

A Next.js drink-discovery website built with TheCocktailDB, USDA FoodData Central, and Supabase. Visitors can browse recipes, search and filter drinks, view nutrition estimates, use preparation timers, and save favorites. Supabase provides member accounts, synchronized favorites, profiles, and contact submissions.

## Requirements

- Node.js 20.9 or newer
- A Supabase project
- A USDA FoodData Central API key (optional during development)

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and add your credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your-key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   USDA_API_KEY=your-data-gov-key
   ```

3. Run `supabase/schema.sql` in the Supabase SQL Editor.

4. In Supabase Authentication URL Configuration, use `http://localhost:3000` as the Site URL and add `http://localhost:3000/**` as a redirect URL.

5. Start the development server:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## Deploying from GitHub

1. Create an empty GitHub repository without adding a README, `.gitignore`, or license.
2. Add the repository as this project's `origin` remote and push the `main` branch.
3. Import the GitHub repository into your hosting provider.
4. Add all variables from `.env.example` to the hosting provider. Set
   `NEXT_PUBLIC_SITE_URL` to the deployed HTTPS URL.
5. In Supabase Authentication URL Configuration, change the Site URL to the
   deployed URL and add `https://your-domain.example/**` as a redirect URL.

Never upload `.env.local` or a Supabase service-role key.

## Commands

```bash
npm run dev
npm run lint
npm test
npm run build
npm run start
```

Run `npm run build` before `npm run start`.

## Main routes

- `/` — home, hero carousel, trending drinks, and categories
- `/recipes` — recipe search, filters, and load-more collection
- `/recipes/[id]` — recipe details, nutrition, timer, and favorites
- `/favorites` — guest or member favorites
- `/member` — sign-up, login, and profile management
- `/about` — project vision
- `/contact` — contact form

## Data and security

- Drink data comes from TheCocktailDB.
- Nutrition values use the closest USDA match and are estimates per 100 g.
- Guest favorites remain in browser storage until migrated into a member account.
- Supabase Row Level Security limits profiles and favorites to their owner.
- `.env.local` is ignored by Git. Never expose secret or service-role keys through `NEXT_PUBLIC_` variables.
