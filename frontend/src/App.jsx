import React, { useState } from "react";
import { FaMicrophone, FaMicrophoneSlash, FaRedo } from "react-icons/fa";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import axios from "axios";
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

  const saveTranscript = async () => {
    try {
      await axios.post("http://localhost:5000/api/transcripts/save", {
        text: transcript,
      });
      alert("Transcript saved successfully!");
    } catch (error) {
      console.error("Error saving transcript:", error);
      alert("Failed to save transcript.");
    }
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

      <button
        onClick={saveTranscript}
        className="p-4 bg-blue-600 hover:bg-blue-700 rounded-lg mt-6"
      >
        Save Transcript
      </button>
    </div>
  );
};

export default App;

// import React, { useRef, useEffect, useState } from "react";
// import { db } from "./firebase"; // Firestore reference
// import {
//   collection,
//   doc,
//   setDoc,
//   getDoc,
//   onSnapshot,
//   updateDoc,
// } from "firebase/firestore";
// import SpeechRecognition, {
//   useSpeechRecognition,
// } from "react-speech-recognition";

// const App = () => {
//   const peerConnectionRef = useRef(null);
//   const [callId, setCallId] = useState(""); // Unique call ID for each session
//   const [joinCallId, setJoinCallId] = useState(""); // Input for joining call
//   const [transcript, setTranscript] = useState(""); // Transcript of conversation
//   const { transcript: speechTranscript, resetTranscript } =
//     useSpeechRecognition();

//   useEffect(() => {
//     const setupPeerConnection = async () => {
//       peerConnectionRef.current = new RTCPeerConnection();

//       // Handle incoming ICE candidates
//       peerConnectionRef.current.onicecandidate = (event) => {
//         if (event.candidate) {
//           // This part would need to store and retrieve ICE candidates from Firestore
//         }
//       };

//       // Handle incoming data from the other peer
//       peerConnectionRef.current.ondatachannel = (event) => {
//         const receiveChannel = event.channel;
//         receiveChannel.onmessage = (e) => {
//           setTranscript((prev) => prev + "\n" + e.data);
//         };
//       };
//     };

//     setupPeerConnection();
//   }, []);

//   // Start a call by creating an offer
//   const startCall = async () => {
//     const callDocRef = doc(collection(db, "calls"));
//     setCallId(callDocRef.id); // Display generated ID for signaling

//     const offer = await peerConnectionRef.current.createOffer();
//     await peerConnectionRef.current.setLocalDescription(offer);

//     // Store the offer in Firestore directly
//     await setDoc(callDocRef, { offer });

//     // Listen for an answer from the other instance
//     onSnapshot(callDocRef, (snapshot) => {
//       const data = snapshot.data();
//       if (data?.answer && !peerConnectionRef.current.currentRemoteDescription) {
//         peerConnectionRef.current.setRemoteDescription(
//           new RTCSessionDescription(data.answer)
//         );
//       }
//     });

//     // Start speech recognition and keep it active
//     SpeechRecognition.startListening({ continuous: true, language: "en-US" });
//   };

//   // Respond to an incoming call by creating an answer
//   const joinCall = async () => {
//     if (!joinCallId) return;
//     const callDocRef = doc(db, "calls", joinCallId);
//     const callData = (await getDoc(callDocRef)).data();

//     await peerConnectionRef.current.setRemoteDescription(
//       new RTCSessionDescription(callData.offer)
//     );

//     const answer = await peerConnectionRef.current.createAnswer();
//     await peerConnectionRef.current.setLocalDescription(answer);

//     // Store the answer in Firestore directly
//     await updateDoc(callDocRef, { answer });

//     // Request microphone access
//     navigator.mediaDevices
//       .getUserMedia({ audio: true })
//       .then(() => {
//         SpeechRecognition.startListening({
//           continuous: true,
//           language: "en-US",
//         });
//         console.log("Microphone access granted.");
//       })
//       .catch((err) => {
//         console.error("Error accessing microphone:", err);
//         alert(
//           "Microphone access is required to join the call. Please check your microphone settings."
//         );
//       });
//   };

//   // End the call for both ends
//   const endCall = () => {
//     peerConnectionRef.current.close();
//     peerConnectionRef.current = null;
//     setCallId("");
//     setJoinCallId("");
//     setTranscript("");
//     SpeechRecognition.stopListening();
//     console.log("Call ended.");
//   };

//   // Update transcript with speech recognition result
//   useEffect(() => {
//     if (speechTranscript) {
//       setTranscript((prev) => prev + (prev ? "\n" : "") + speechTranscript);
//       resetTranscript(); // Reset transcript after adding
//     }
//   }, [speechTranscript]);

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white p-6">
//       <h1 className="text-4xl font-bold mb-8">WebRTC Call App</h1>

//       <div className="w-full max-w-md">
//         <button
//           onClick={startCall}
//           className="w-full py-3 mb-6 bg-green-500 hover:bg-green-600 rounded-lg text-xl font-semibold transition duration-200"
//         >
//           Start Call
//         </button>

//         {/* Display the Call ID for sharing */}
//         {callId && (
//           <p className="bg-white text-black p-4 rounded-md mb-6 text-center">
//             Call ID (Share this to join): <strong>{callId}</strong>
//           </p>
//         )}

//         {/* Input field to join a call */}
//         <input
//           type="text"
//           value={joinCallId}
//           onChange={(e) => setJoinCallId(e.target.value)}
//           placeholder="Enter Call ID to Join"
//           className="w-full p-3 rounded-md text-black mb-4"
//         />

//         <button
//           onClick={joinCall}
//           className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-xl font-semibold transition duration-200"
//         >
//           Join Call
//         </button>

//         <button
//           onClick={endCall}
//           className="w-full py-3 bg-red-500 hover:bg-red-600 rounded-lg text-xl font-semibold transition duration-200 mt-4"
//         >
//           End Call
//         </button>

//         {/* Transcript display area */}
//         <textarea
//           value={transcript}
//           readOnly
//           className="w-full p-4 mt-6 bg-white text-black rounded-md h-40"
//           placeholder="Conversation transcript will appear here..."
//         ></textarea>
//       </div>
//     </div>
//   );
// };

// export default App;
