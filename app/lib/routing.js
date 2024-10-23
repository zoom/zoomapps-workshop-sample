import {NextResponse} from "next/server";

export function handleError(status, message) {
    return NextResponse.json({error: message}, { status });
}