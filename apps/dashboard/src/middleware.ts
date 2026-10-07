import { auth } from './auth';
import { NextResponse } from 'next/server';

const BOT_OWNER_IDS = (process.env.BOT_OWNER_IDS || '').split(',');

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;
  
  const isDashboardRoute = nextUrl.pathname.startsWith('/dashboard');
  const isAdminRoute = nextUrl.pathname.startsWith('/admin') || nextUrl.pathname.startsWith('/api/admin');
  const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth');

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if ((isDashboardRoute || nextUrl.pathname.startsWith('/api/guilds')) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/', nextUrl));
  }

  if (isAdminRoute) {
    if (!isAuthenticated || !BOT_OWNER_IDS.includes(req.auth?.user?.id || '')) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
  }

  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  return response;
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
