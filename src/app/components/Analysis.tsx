import React, { useRef } from "react";
import * as htmlToImage from "html-to-image";

interface AnalysisProps {
  userName: string;
  trackName: string;
  artistName: string;
  message: string;
  albumArt: string;
}

const Analysis: React.FC<AnalysisProps> = ({
  userName,
  trackName,
  artistName,
  message,
  albumArt,
}) => {
  const jungAnalysis = useRef(null);

  const downloadImage = async () => {
    if (jungAnalysis.current) {
      const dataUrl = await htmlToImage.toPng(jungAnalysis.current);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "songjung_analysis.png"; // Name of the downloaded file
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <div ref={jungAnalysis} className="p-4 bg-slate-900 m-auto">
        <div className="flex flex-nowrap items-center mx-4">
          <div className="mr-2 w-1/5">
            <img className="rounded" src={albumArt} alt="album art" />
          </div>
          <div className="w-4/5">
            <p className="truncate font-bold text-sm text-slate-400">
              {userName.charAt(0).toUpperCase()}'s Analysis by Dr. Jung🎵
            </p>
            <p className="text-lg truncate text-slate-400 ">
              {trackName}, {artistName}
            </p>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-slate-800 my-4">
          <p className="text-sm text-white text-justify">{message}</p>
        </div>
        <div className="text-sm text-center">
          <p className="text-slate-300">Get analyzed by Dr. Song Jung🎵 at</p>
          <p className="text-pink-300 font-mono font-bold">songjung.fun</p>
        </div>
      </div>
      <div className="text-center">
        <button
          onClick={() => {
            downloadImage();
          }}
          type="button"
          className="mt-4 text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        >
          Share Analysis 🎉
        </button>
      </div>
    </div>
  );
};

export default Analysis;
