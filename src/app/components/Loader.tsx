import React, { useState, useEffect } from "react";
import { HypnosisLoader } from "react-loaders-kit";

interface LoaderProps {
  songName?: string;
  analysisText?: string;
  onAnalysisDone?: () => void;
}

const delayTime = 2000;

const Loader: React.FC<LoaderProps> = ({
  songName,
  analysisText,
  onAnalysisDone,
}) => {
  const initialMessages = ["Let's get started", "Look who's here"];
  const [currentMessageIndex, setCurrentMessageIndex] = useState(
    Math.floor(Math.random() * initialMessages.length)
  );
  const [currentMessages, setCurrentMessages] = useState(initialMessages);
  const [loadingPhase, setLoadingPhase] = useState(0);

  const songMessagesFunc = (song: string) => [
    `Ah ${song}, I see.`,
    `Who still listens to ${song}?`,
    `Do you seriously like ${song}?`,
    `Wow, looks like we have a ${song} fan here`,
  ];
  const analyzingMessageSets = [
    ["Going deep inside your mind", "Oh my god. So dark", "Analyzing deeply"],
    [
      "Analyzing the lyrics",
      "Watch the circles carefully",
      "Cruising through your mind",
    ],
    [
      "Concentrate on the circles",
      "Revisiting your childhood",
      "Some dark memories here",
      "Some light ones too",
      "Analyzing your mind",
    ],
  ];
  const analysisDoneMessages = [
    "Here's your analysis",
    "Got your results",
    "Analysis complete",
  ];

  useEffect(() => {
    const handlePhaseTransition = async () => {
      switch (loadingPhase) {
        case 0:
          await delay(delayTime);
          if (songName) {
            setCurrentMessages(songMessagesFunc(songName));
            setCurrentMessageIndex(Math.floor(Math.random() * 2));
            setLoadingPhase(1);
          }
          break;
        case 1:
          await delay(delayTime);
          setCurrentMessages(
            analyzingMessageSets[
              Math.floor(Math.random() * analyzingMessageSets.length)
            ]
          );
          setCurrentMessageIndex(0);
          setLoadingPhase(2);
          break;
        case 2:
          if (currentMessageIndex < currentMessages.length - 1) {
            await delay(delayTime);
            setCurrentMessageIndex((prevIndex) => prevIndex + 1);
          } else {
            // Instead of transitioning to analysisText, move to phase 2.5
            setLoadingPhase(2.5);
          }
          break;

        // New phase (2.5) introduced
        case 2.5:
          await delay(delayTime * 2); // You can modify the delay time here. E.g., if you want to wait 3 times longer.
          if (analysisText) {
            setCurrentMessages(analysisDoneMessages);
            setCurrentMessageIndex(Math.floor(Math.random() * 3));
            setLoadingPhase(3);
          }
          break;
        case 3:
          await delay(1000); // Wait for 3 seconds to show the analysis done message
          setLoadingPhase(4);
          break;
        case 4:
          onAnalysisDone && onAnalysisDone();
          break;
        default:
          break;
      }
    };
    handlePhaseTransition();
  }, [loadingPhase, currentMessageIndex, songName, analysisText]);

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  return (
    <div className="text-center p-8 bg-slate-800 rounded-3xl">
      <div className="flex justify-center mb-4">
        <HypnosisLoader loading colors={["#ffffff", "#000000"]} />
      </div>
      <p className="h-4">{currentMessages[currentMessageIndex]}</p>
    </div>
  );
};

export default Loader;
