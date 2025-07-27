This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Admin Dashboard

A comprehensive admin dashboard for managing admissions, courses, and web content.

## Environment Variables

This project uses environment variables for API configuration. Create a `.env.local` file in the root directory with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=NEXT_PUBLIC_base_url
```

### Environment Files

- `.env.local` - Local development environment (not committed to git)
- `.env.example` - Example environment file (committed to git)

### API Configuration

The project uses a centralized API configuration system:

- **Base URL**: Configured via `NEXT_PUBLIC_API_BASE_URL` environment variable
- **Utility Functions**: Located in `lib/api-config.ts`
  - `buildApiUrl(endpoint)` - Builds complete API URLs
  - `getApiHeaders()` - Returns common headers for API requests

### Switching Environments

To switch between different API environments:

1. **Development**: Use `.env.local` with your development API URL
2. **Production**: Set environment variables in your hosting platform
3. **Staging**: Create `.env.staging` for staging environment

## Features

- **Admissions Management**: View and manage student applications
- **Course Management**: Manage courses and programs
- **Content Management**: Manage testimonials, blogs, and other web content
- **User Management**: Admin user interface

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install` or `pnpm install`
3. Copy `.env.example` to `.env.local` and configure your API URL
4. Run the development server: `npm run dev` or `pnpm dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Integration

The dashboard is designed to work with a backend API. Currently using mock data for admissions, but ready for real API integration by updating the API functions in:

- `app/dashboard/admissions/apis.tsx`
- `app/dashboard/webdata/testimonials/apis.tsx`
- `constants/apis.ts`

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **UI**: Tailwind CSS with shadcn/ui components
- **Language**: TypeScript
- **Package Manager**: pnpm

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
