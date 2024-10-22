// Middleware here can mock the x-zoom-app-context header

import { NextResponse, userAgent } from 'next/server'


export function middleware(request) {

    // mock a zoom app context when not on production
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