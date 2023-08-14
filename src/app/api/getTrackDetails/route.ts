import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
export const preferredRegion = "sfo1";

interface Body {
  trackId: string;
}
interface Fetch {
  headers: {
    "Content-Type": string;
    "x-api-key": string;
  };
  method: string;
  body: string;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  return NextResponse.json({
    message: `Oops, no access this way!`,
  });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: Body = await req.json();

    const fetchOptions: Fetch = {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.LAMBDA_API_KEY || "defaultKeyValue",
      },
      method: "POST",
      body: JSON.stringify({
        trackId: body.trackId,
      }),
    };

    const getTrackDetails = await fetch(
      "https://1rw8ruho4e.execute-api.us-west-2.amazonaws.com/dev/get-track-details-from-spotify",
      fetchOptions
    );

    const trackDetails = await getTrackDetails.json();

    return NextResponse.json(
      {
        track: trackDetails.track,
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json({ error: JSON.stringify(e) }, { status: 500 });
  }
}
