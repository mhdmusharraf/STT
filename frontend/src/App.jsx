import React, { useState, useEffect } from "react";
import { FaMicrophone, FaMicrophoneSlash, FaRedo } from "react-icons/fa";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getDatabase, ref, set, onValue } from "firebase/database";
import "./index.css";

// Firebase Configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyDWTG1z1MSUfSpDpCv4N-pWZ424H9SEvAY",
//   authDomain: "webrtc-b3c00.firebaseapp.com",
//   projectId: "webrtc-b3c00",
//   storageBucket: "webrtc-b3c00.appspot.com",
//   messagingSenderId: "455174698088",
//   appId: "1:455174698088:web:7f1b8639b2ee1ef66837dd",
//   measurementId: "G-NSQT0ELCZP"
// };
// const firebaseConfig = {
//   apiKey: "AIzaSyC7MNKl3D5u9iT5ASWPRD5m-M66wT_u5dA",
//   authDomain: "call-center-stt.firebaseapp.com",
//   databaseURL: "https://call-center-stt-default-rtdb.firebaseio.com",
//   projectId: "call-center-stt",
//   storageBucket: "call-center-stt.appspot.com",
//   messagingSenderId: "459088429960",
//   appId: "1:459088429960:web:2775665658e2e4737df03d",
//   measurementId: "G-LB1PSQXY16"
// };

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getDatabase(app);
// const analytics = getAnalytics(app);

const App = () => {
  const [language, setLanguage] = useState("en-US"); // Default language is English (US)
  // const [localStream, setLocalStream] = useState(null);
  // const [remoteStream, setRemoteStream] = useState(null);
  // const [peerConnection, setPeerConnection] = useState(null);

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

  // const startCall = async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  //     setLocalStream(stream);

  //     const pc = new RTCPeerConnection({
  //       iceServers: [{ urls: "stun:stun1.l.google.com:19302" }],
  //     });
  //     stream.getTracks().forEach((track) => pc.addTrack(track, stream));

  //     pc.ontrack = (event) => {
  //       setRemoteStream(event.streams[0]);
  //     };

  //     const offer = await pc.createOffer();
  //     await pc.setLocalDescription(offer);
  //     setPeerConnection(pc);
  //     set(ref(db, "call/offer"), offer);

  //     // Listen for answer
  //     onValue(ref(db, "call/answer"), async (snapshot) => {
  //       const answer = snapshot.val();
  //       if (answer) {
  //         await pc.setRemoteDescription(new RTCSessionDescription(answer));
  //       }
  //     });
  //   } catch (error) {
  //     console.error("Error starting call", error);
  //   }
  // };

  // const startListeningFromCall = () => {
  //   if (remoteStream) {
  //     const mediaRecorder = new MediaRecorder(remoteStream);
  //     mediaRecorder.ondataavailable = (event) => {
  //       const audioBlob = event.data;
  //       const audioUrl = URL.createObjectURL(audioBlob);

  //       // Use SpeechRecognition to transcribe audio from the call
  //       const audioContext = new (window.AudioContext ||
  //         window.webkitAudioContext)();
  //       const source = audioContext.createMediaStreamSource(remoteStream);
  //       source.connect(audioContext.destination);

  //       SpeechRecognition.startListening({
  //         continuous: true,
  //         language,
  //       });
  //     };

  //     mediaRecorder.start();
  //   }
  // };

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

      {/* <div className="flex space-x-6 mb-8">
        <button
          onClick={startCall}
          className="p-5 bg-green-600 hover:bg-green-700 rounded-full text-3xl transition duration-300 ease-in-out shadow-lg transform hover:scale-105"
        >
          Start Call
        </button>
        <button
          onClick={startListeningFromCall}
          className="p-5 bg-blue-600 hover:bg-blue-700 rounded-full text-3xl transition duration-300 ease-in-out shadow-lg transform hover:scale-105"
        >
          Transcribe Call Audio
        </button>
      </div> */}

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
