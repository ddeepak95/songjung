import React from "react";
import { useEffect, useRef } from "react";
import Dropdown from "./units/Dropdown";
import Analysis from "./Analysis";
import Loader from "./Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Function to Spotify Song ID from a the song link and return error if the link is not valid
function getSpotifyTrackId(link: string) {
  const spotifyLink = link.split("/");
  if (spotifyLink[2] !== "open.spotify.com") {
    return "Error";
  }
  const spotifyId = spotifyLink[4].split("?")[0];
  return spotifyId;
}

async function getTrackDetails(trackId: string) {
  let response = await fetch("/api/getTrackDetails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({
      trackId: trackId,
    }),
  });

  let status = response.status;
  if (status === 200) {
    let data = await response.json();
    return data.track;
  } else {
    let data = await response.json();
    throw data.error;
  }
}

async function getSongLyrics(trackId: string) {
  let response = await fetch("/api/getLyrics", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({
      trackId: trackId,
    }),
  });

  let status = response.status;
  if (status === 200) {
    let data = await response.json();
    return data;
  } else {
    let data = await response.json();
    throw data.error;
  }
}

type TrackInfo = {
  [key: string]: any; // This allows any property in the trackInfo, you should replace with specific properties.
};

type AskAiParams = {
  name: string;
  trackInfo: TrackInfo;
  personality: string;
};

async function askAi({
  name,
  trackInfo,
  personality,
}: AskAiParams): Promise<any> {
  let response = await fetch("/api/callAi", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({
      name: name,
      trackInfo: trackInfo,
      personality: personality,
    }),
  });

  let status = response.status;
  if (status === 200) {
    let data = await response.json();
    return data;
  } else {
    let data = await response.json();
    throw data.error;
  }
}

type Lyrics = { words: string }[];

function joinLyricsToParagraph(lyrics: Lyrics): string {
  let song = "";

  for (let i = 0; i < Math.min(lyrics.length, 12); i++) {
    song += lyrics[i].words + " \n";
  }

  // Trim extra spaces from start and end
  return song.trim();
}

function assignPopularityTagBasedonScore(score: number) {
  if (score < 10) {
    return "Unpopular";
  } else if (score < 25) {
    return "Not Popular";
  } else if (score < 50) {
    return "Somewhat Popular";
  } else if (score < 75) {
    return "Popular";
  } else {
    return "Very Popular";
  }
}

async function getSongData(trackId: string) {
  let trackDetails = await getTrackDetails(trackId);
  let trackLyricsRes = await getSongLyrics(trackId);

  let trackLyrics;
  if (trackLyricsRes?.error === true) {
    trackLyrics = "Lyrics not found";
  } else {
    trackLyrics = joinLyricsToParagraph(trackLyricsRes.lines);
  }

  return {
    trackName: trackDetails.name,
    artistName: trackDetails.artists[0].name,
    albumName: trackDetails.album.name,
    albumArt: trackDetails.album.images[0].url,
    trackPopularity: assignPopularityTagBasedonScore(trackDetails.popularity),
    trackLyrics: trackLyrics,
  };
}

const SongJung: React.FC = () => {
  const [analysis, setAnalysis] = React.useState<string>("Coming Soon");
  const [isAnalysisComplete, setIsAnalysisComplete] =
    React.useState<boolean>(false);
  const [isAnalysisLoading, setIsAnalysisLoading] =
    React.useState<boolean>(false);
  const [trackArt, setTrackArt] = React.useState<string>("");
  const [name, setName] = React.useState<string>("");
  const [songLink, setSongLink] = React.useState<string>("");
  const [personality, setPersonality] = React.useState<string>("");
  const [songName, setSongName] = React.useState<string>("");
  const [artistName, setArtistName] = React.useState<string>("");
  const analyserSection = useRef<HTMLDivElement>(null);
  const [showForm, setShowForm] = React.useState<boolean>(true);

  const personalityOptions = [
    { value: "I don't care", label: "I don't care" },
    { value: "INTP", label: "INTP" },
    { value: "INTJ", label: "INTJ" },
    { value: "INFJ", label: "INFJ" },
    { value: "INFP", label: "INFP" },
    { value: "ISTJ", label: "ISTJ" },
    { value: "ISFJ", label: "ISFJ" },
    { value: "ISTP", label: "ISTP" },
    { value: "ISFP", label: "ISFP" },
    { value: "ENTP", label: "ENTP" },
    { value: "ENTJ", label: "ENTJ" },
    { value: "ENFJ", label: "ENFJ" },
    { value: "ENFP", label: "ENFP" },
    { value: "ESTJ", label: "ESTJ" },
    { value: "ESFJ", label: "ESFJ" },
    { value: "ESTP", label: "ESTP" },
    { value: "ESFP", label: "ESFP" },
  ];

  const handleSelect = (selectedValue: string) => {
    setPersonality(selectedValue);
  };

  const doStuff = async () => {
    try {
      let trackId = getSpotifyTrackId(songLink);

      let songData = await getSongData(trackId);
      setSongName(songData.trackName);
      setTrackArt(songData.albumArt);
      setArtistName(songData.artistName);
      askAi({
        name: name,
        trackInfo: songData,
        personality: personality,
      }).then((aiResponse) => {
        setAnalysis(aiResponse.response);
      });
    } catch (error) {
      console.error("There was an error fetching the data:", error);
    }
  };

  return (
    <div className="py-28">
      <ToastContainer />

      <div className="flex min-h-screen">
        <div className="text-center ">
          <div className="mb-20">
            <p className="text-3xl font-bold">
              I'm <span className="text-purple-500">Dr. Song Jung</span>
            </p>
            <p>Carl Jung's Wiser Cousin🧠</p>
          </div>
          <p className="text-xl">
            I psychoanalyze people with their favorite song🎵
          </p>
          <button
            onClick={() => {
              analyserSection.current?.scrollIntoView({ behavior: "smooth" });
            }}
            type="button"
            className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg  px-6 py-3.5 text-center mr-2 my-6"
          >
            Get Started
          </button>
        </div>
      </div>
      <div className="min-h-screen py-20" ref={analyserSection}>
        {showForm ? (
          <div>
            <div className="mb-6">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your Name
              </label>
              <input
                type="text"
                id="name"
                className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="dropdown"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Select Your Personality✨
              </label>
              <Dropdown
                id="dropdown"
                options={personalityOptions}
                onSelect={handleSelect}
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="large-input"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your Favorite Song's Spotify Link🎵
              </label>
              <input
                type="text"
                id="large-input"
                className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={(e) => setSongLink(e.target.value)}
              />
            </div>
            <div className="text-center">
              <button
                onClick={() => {
                  if (name === "" || personality === "" || songLink === "") {
                    toast("Oops! Looks like you missed filling something!");
                    return;
                  }
                  setAnalysis("Getting stuff done!");
                  setIsAnalysisComplete(false);
                  setShowForm(false);
                  setIsAnalysisLoading(true);
                  doStuff();
                }}
                className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800"
              >
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                  Get Analyzed
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div>
            {isAnalysisLoading && (
              <Loader
                songName={songName}
                analysisText={analysis}
                onAnalysisDone={() => {
                  setIsAnalysisComplete(true);
                  setIsAnalysisLoading(false);
                }}
              />
            )}
            {isAnalysisComplete && (
              <div>
                <Analysis
                  message={analysis}
                  albumArt={trackArt}
                  userName={name}
                  trackName={songName}
                  artistName={artistName}
                />
                <div className="text-center my-4">
                  <button
                    onClick={() => {
                      setShowForm(true);
                      setIsAnalysisComplete(false);
                      setSongName("");
                      setTrackArt("");
                      setArtistName("");
                    }}
                    className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800"
                  >
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                      Get Analyzed Again
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div>
        <div className="flex flex-col text-xs text-center items-center justify-center p-4 dark:bg-slate-900 bg-slate-300 rounded-3xl">
          <p>
            made by{" "}
            <a
              href="https://ddeepak95.com"
              className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              target="_blank"
              rel="norefferer"
            >
              ddeepak95
            </a>
            🤓
          </p>
          <p>
            with{" "}
            <a
              href="https://js.langchain.com/docs/get_started/introduction"
              className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              target="_blank"
              rel="norefferer"
            >
              langchain (google palm)
            </a>
            {", "}
            <a
              href="https://github.com/akashrchandran/spotify-lyrics-api"
              className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              target="_blank"
              rel="norefferer"
            >
              spotify-lyrics-api
            </a>
            {", and "}
            <a
              href="https://developer.spotify.com/documentation/web-api"
              className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              target="_blank"
              rel="norefferer"
            >
              spotify
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SongJung;
