// https://nextjs.org/docs/app/building-your-application/authentication#creating-a-data-access-layer-dal
import 'server-only'

import { cookies } from 'next/headers'
import { decrypt } from '@/app/lib/session'
import {redirect} from "next/navigation";
import {cache} from "react";

export const verifySession = cache(async () => {
    const cookie = (await cookies()).get('session')?.value
    const session = await decrypt(cookie)

    if (!session.verifier) {
        redirect('/')
    }

    return {
        state: session.state,
        verifier: session.verifier
    };
})