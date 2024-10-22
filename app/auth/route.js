import {verifySession} from "@/app/lib/dal";
import {handleError} from "@/app/lib/routing";
import {getDeeplink, getToken} from "@/app/lib/zoom-api";
import {deleteSession} from "@/app/lib/session";

export async function GET(request) {
    const { searchParams } = request.nextUrl;
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    const session = await verifySession();

    if (!session)
        return handleError(500,'invalid session');

    if (!code)
        return handleError(404,'invalid code parameter');

    if (!state || state !== session.state)
        return handleError(404,'invalid state parameter');

    const {verifier} = session;

    // get Access Token from Zoom
    const {access_token} = await getToken(code, verifier);

    // fetch deeplink from Zoom API
    const deeplink = await getDeeplink(access_token);

    await deleteSession();

    return Response.redirect(deeplink);
}
