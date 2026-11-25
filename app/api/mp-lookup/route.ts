import { NextResponse } from "next/server";
import {
  checkFormSubmissionRateLimit,
  clientIpFromRequest,
} from "@/lib/form-gate/rate-limit";
import { sanitiseOpenLetterPostcode } from "@/lib/open-letter/format";
import { lookupMpByPostcode } from "@/lib/write-to-mp/parliament";

const LOOKUP_LIMIT = 30;

const MESSAGES = {
  invalid_postcode: "Enter a full UK postcode, such as NE30 2HE.",
  rate_limited:
    "Too many lookups from this connection. Wait a while and try again.",
  not_found: "We couldn’t find an MP for that postcode. Check it and try again.",
  ambiguous:
    "That postcode matches more than one area. Enter the full postcode, including the letters at the end.",
  unavailable:
    "Parliament’s MP lookup is unavailable right now. Try again in a moment.",
} as const;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const postcodeResult = sanitiseOpenLetterPostcode(
    url.searchParams.get("postcode"),
  );
  if (!postcodeResult.ok) {
    return NextResponse.json(
      { error: "invalid_postcode", message: MESSAGES.invalid_postcode },
      { status: 400 },
    );
  }

  const ip = clientIpFromRequest(request);
  if (!checkFormSubmissionRateLimit(`mp-lookup:${ip}`, Date.now(), LOOKUP_LIMIT)) {
    return NextResponse.json(
      { error: "rate_limited", message: MESSAGES.rate_limited },
      { status: 429 },
    );
  }

  const result = await lookupMpByPostcode(postcodeResult.value);
  if (!result.ok) {
    const status = result.reason === "unavailable" ? 503 : 404;
    return NextResponse.json(
      { error: result.reason, message: MESSAGES[result.reason] },
      { status },
    );
  }

  return NextResponse.json({
    postcode: postcodeResult.value,
    mp: result.mp,
  });
}
