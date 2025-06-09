import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simply pass through all requests without any processing
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

// Minimal matcher to reduce scope
export const config = {
  matcher: [],
};

