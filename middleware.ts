import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  try {
    // Add logging to debug routing issues
    console.log('Middleware processing path:', request.nextUrl.pathname);
    
    // Continue with normal request handling
    return NextResponse.next();
  } catch (error) {
    // Log the error and return a fallback response
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

// Limit middleware to specific paths to reduce potential issues
export const config = {
  matcher: [
    // Match all paths except static files, api routes, etc.
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_vercel).*)',
  ],
};
