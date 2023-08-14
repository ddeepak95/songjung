import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
export const preferredRegion = "sfo1";

interface Body {
  trackId: string;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  return NextResponse.json({
    message: `Oops, no access this way!`,
  });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: Body = await req.json();

    const getLyrics = await fetch(
      `https://spotify-lyrics-11632be0e2b4.herokuapp.com/?trackid=${body.trackId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
      }
    );

    const lyrics = await getLyrics.json();

    return NextResponse.json(lyrics, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: JSON.stringify(e) }, { status: 500 });
  }
}
