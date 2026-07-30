import { NextResponse } from "next/server";

/**
 * Open letter signing is temporarily paused for a privacy / data-handling review.
 * Restore the previous route implementation when ready to collect signatures again.
 */
export async function POST() {
  return NextResponse.json(
    {
      error: "not_configured",
      message:
        "Open letter signing is temporarily paused while we review how signature data is handled.",
    },
    { status: 503 },
  );
}
