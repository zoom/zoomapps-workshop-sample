import { NextResponse, userAgent } from 'next/server'

// mock a zoom app header when not on production
export function middleware(request) {
    if (process.env.NODE_ENV !== 'production') {
        const requestHeaders = new Headers(request.headers);
        const { ua } = userAgent(request);

        if (ua.endsWith("ZoomApps/1.0"))
            requestHeaders.set('x-zoom-app-device-type', 'desktop');

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        })
    }
}