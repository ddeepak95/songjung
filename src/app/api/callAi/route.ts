import { NextRequest, NextResponse } from "next/server";
import { GooglePaLM } from "langchain/llms/googlepalm";
import { OpenAI } from "langchain/llms/openai";

type TrackInfo = {
  [key: string]: any; // This allows any property in the trackInfo, you should replace with specific properties.
};

interface Body {
  name: string;
  trackInfo: TrackInfo;
  personality: string;
}

async function callPalmApi(prompt: string) {
  const model = new GooglePaLM({
    apiKey: process.env.GOOGLE_PALM_API_KEY, // or set it in environment variable as `GOOGLE_PALM_API_KEY`
  });
  const res = await model.call(prompt);
  return res;
}

async function callOpenAi(prompt: string) {
  const model = new OpenAI({
    modelName: "text-davinci-003", // Defaults to "text-davinci-003" if no model provided.
    temperature: 0.9,
    openAIApiKey: process.env.OPEN_AI_API,
  });
  const res = await model.call(prompt);
  return res;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  return NextResponse.json({
    message: `Oops, no access this way!`,
  });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: Body = await req.json();
    let name = body.name;
    let trackInfo = body.trackInfo;
    let personality = body.personality;
    let prompt = `You are Trevor Noah who writes funny psychoanalysis of people with jokes. Start by making fun of the person but then give it a positive twist. Your task is to describe a person to other people based on the person's favourite song. Your analysis should not explicitly mention MBTI type of the person. The analysis should use 'they' as pronouns. Person's name is ${name}. Their MBTI personality is ${personality}. Their favorite song is ${trackInfo.trackName} by ${trackInfo.artistName}. The track is ${trackInfo.trackPopularity}. Lyrics from the track: ${trackInfo.trackLyrics}. Use the lyrics as puns. Make the analysis very very funny and witty in less than 400 words.`;

    const getAIResponse = await callPalmApi(prompt);

    return NextResponse.json({ response: getAIResponse }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: JSON.stringify(e) }, { status: 500 });
  }
}
