import React, { useState } from "react";
import { FaMicrophone, FaMicrophoneSlash, FaRedo } from "react-icons/fa";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "./index.css";

const App = () => {
  const [language, setLanguage] = useState("en-US"); // Default language is English (US)

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Your browser doesn't support Speech to Text</span>;
  }

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value); // Update the language based on the user's selection
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-6">
      <h1 className="text-red-600 text-5xl font-bold mb-12 text-center">
        Speech to Text App
      </h1>

      {/* Language Selection Dropdown */}
      <div className="mb-6">
        <label className="mr-2 text-lg font-semibold">Select Language: </label>
        <select
          value={language}
          onChange={handleLanguageChange}
          className="p-2 rounded bg-white text-black"
        >
          <option value="en-US">English (US)</option>
          <option value="en-GB">English (UK)</option>
          <option value="fr-FR">French</option>
          <option value="es-ES">Spanish</option>
          <option value="de-DE">German</option>
          <option value="it-IT">Italian</option>
          <option value="ta-IN">Tamil (India)</option>
          <option value="si-LK">Sinhala (Sri Lanka)</option>
        </select>
      </div>

      <div className="flex space-x-6 mb-8">
        <button
          onClick={() =>
            SpeechRecognition.startListening({ continuous: true, language })
          }
          className={`p-5 rounded-full text-3xl transition duration-300 ease-in-out shadow-lg transform hover:scale-105 ${
            listening
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {listening ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </button>
        <button
          onClick={SpeechRecognition.stopListening}
          className="p-5 bg-yellow-500 hover:bg-yellow-600 rounded-full text-3xl transition duration-300 ease-in-out shadow-lg transform hover:scale-105"
        >
          <FaMicrophoneSlash />
        </button>
        <button
          onClick={resetTranscript}
          className="p-5 bg-blue-500 hover:bg-blue-600 rounded-full text-3xl transition duration-300 ease-in-out shadow-lg transform hover:scale-105"
        >
          <FaRedo />
        </button>
      </div>

      <p className="mb-6 text-xl font-semibold">
        Microphone: {listening ? "On" : "Off"}
      </p>

      <p className="bg-white text-black p-6 rounded-lg w-full max-w-xl text-center shadow-md">
        {transcript || "Your speech will appear here..."}
      </p>
    </div>
  );
};

export default App;
