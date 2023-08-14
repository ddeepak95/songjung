import React from "react";

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
  return (
    <div className="p-4 bg-slate-900 rounded-xl m-auto">
      <div className="flex flex-nowrap items-center mx-4">
        <div className="mr-2 w-1/5">
          <img className="rounded" src={albumArt} alt="album art" />
        </div>
        <div className="w-4/5">
          <p className="truncate font-bold text-sm text-slate-400">
            {userName.charAt(0).toUpperCase()}'s Analysis by Dr. Jung
          </p>
          <p className="text-lg truncate text-slate-400 ">
            {trackName}, {artistName}
          </p>
        </div>
      </div>
      <div className="p-4 rounded-xl bg-slate-800 my-4">
        <p className="text-sm text-justify">{message}</p>
      </div>
      {/* <div className="text-sm text-center">
        <p>Get Song Jung'd</p>
        <p>songjung.fun</p>
      </div> */}
    </div>
  );
};

export default Analysis;
