import {getInstallURL} from "@/app/lib/zoom-api";
import {createSession} from "@/app/lib/session";

export async function GET() {
    const { url, state, verifier } = getInstallURL();

    await createSession({state, verifier});

    return Response.redirect(url);
}
