import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
 
const intlMiddleware = createMiddleware(routing);
 
export default function middleware(request: any) {
  console.log('MIDDLEWARE REQUEST:', request.nextUrl.pathname);
  const response = intlMiddleware(request);
  console.log('MIDDLEWARE RESPONSE:', response?.headers?.get('location') || 'No redirect');
  return response;
}
 
export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ar|en)/:path*', '/((?!api|uploads|_next|_vercel|.*\\..*).*)']
};
