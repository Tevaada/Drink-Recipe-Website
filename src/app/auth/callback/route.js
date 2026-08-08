import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request) {
    const code = request.nextUrl.searchParams.get("code");
    const requestedNext =
        request.nextUrl.searchParams.get("next") || "/member";
    const nextPath =
        requestedNext.startsWith("/") &&
        !requestedNext.startsWith("//")
            ? requestedNext
            : "/member";

    if (code) {
        const supabase = await createClient();
        const { error } =
            await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            return NextResponse.redirect(
                new URL(nextPath, request.url),
            );
        }
    }

    return NextResponse.redirect(
        new URL("/member?authError=invalid-link", request.url),
    );
}
