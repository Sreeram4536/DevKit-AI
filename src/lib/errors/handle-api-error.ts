import { NextResponse } from "next/server";

export function handleApiError(error: unknown) {
    console.log('API Error', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
}