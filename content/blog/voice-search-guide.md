# Complete Voice Search Implementation Guide

This guide explains in detail how **Voice Search** is implemented in this project and how you can implement it cleanly and robustly into any other Web (React / Next.js / Vanilla JS) or Mobile (React Native / Expo) application.

---

## Table of Contents
1. [How Voice Search Works in this Project](#1-how-voice-search-works-in-this-project)
   - [Location in Codebase](#location-in-codebase)
   - [Core Mechanism (Web Speech API)](#core-mechanism-web-speech-api)
   - [Lifecycle & Flow Breakdown](#lifecycle--flow-breakdown)
2. [Step-by-Step Implementation Guide for Other Web Apps (React / Next.js / Vite)](#2-step-by-step-implementation-guide-for-other-web-apps-react--nextjs--vite)
   - [Option A: Reusable Custom React Hook (`useVoiceSearch`)](#option-a-reusable-custom-react-hook-usevoicesearch)
   - [Option B: Complete Search Input Component with UI & Animations](#option-b-complete-search-input-component-with-ui--animations)
3. [Implementation Guide for React Native / Expo Mobile Apps](#3-implementation-guide-for-react-native--expo-mobile-apps)
4. [Important Edge Cases, Browser Support & Best Practices](#4-important-edge-cases-browser-support--best-practices)

---

## 1. How Voice Search Works in this Project

### Location in Codebase
The voice search feature is located in:
- [`src/components/sections/feature18.tsx`](file:///Users/avkalan/eigenstudio/github/mananwellness_website/src/components/sections/feature18.tsx#L226-L288)

### Core Mechanism (Web Speech API)
The project utilizes the native browser **Web Speech API** (`SpeechRecognition` / `webkitSpeechRecognition`). No external backend, paid AI transcription service, or heavy npm package is needed for modern web browsers.

```ts
const SpeechRecognition =
  (window as any).SpeechRecognition ||
  (window as any).webkitSpeechRecognition;
```

### Lifecycle & Flow Breakdown

1. **Browser Compatibility Check**:
   - Checks if `window` is defined (to avoid Next.js SSR / hydration errors).
   - Looks for standard `window.SpeechRecognition` or WebKit prefix `window.webkitSpeechRecognition`.
   - If not found (e.g. older Firefox or unsupported environments), alerts or informs the user.

2. **State Management**:
   - `searchQuery`: Stores the text string (updated in real-time as user speaks).
   - `isListening`: Boolean flag to trigger animations (pulsing dot, color changes, placeholder change).
   - `recognitionRef`: A `useRef` to store the active `SpeechRecognition` instance so it can be stopped programmatically or cleaned up on unmount.

3. **Event Listeners**:
   - `onstart`: Sets `isListening = true`.
   - `onresult`: Captures transcription chunks (`event.results`). With `interimResults = true`, transcript updates in real-time as words are spoken.
   - `onerror`: Catches microphone permissions denials, network timeouts, or silence errors and resets `isListening = false`.
   - `onend`: Automatically sets `isListening = false` when speech ends.

4. **Component Cleanup**:
   - `useEffect` cleanup hook ensures `recognition.stop()` is invoked if the user navigates away while recording.

---

## 2. Step-by-Step Implementation Guide for Other Web Apps (React / Next.js / Vite)

### Option A: Reusable Custom React Hook (`useVoiceSearch`)

Create a custom hook `hooks/useVoiceSearch.ts` that can be reused anywhere in your application:

```tsx
import { useState, useEffect, useRef, useCallback } from "react";

interface UseVoiceSearchOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (transcript: string) => void;
  onError?: (error: any) => void;
}

export function useVoiceSearch(options: UseVoiceSearchOptions = {}) {
  const {
    lang = "en-US",
    continuous = false,
    interimResults = true,
    onResult,
    onError,
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  // Check support on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      setIsSupported(!!SpeechRecognition);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice search is not supported in your browser. Please use Chrome, Safari, or Edge.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.lang = lang;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const currentTranscript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join("");

        setTranscript(currentTranscript);
        if (onResult) {
          onResult(currentTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
        if (onError) onError(event);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Failed to start voice recognition:", err);
      setIsListening(false);
    }
  }, [continuous, interimResults, lang, onResult, onError]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    setTranscript,
    isSupported,
    startListening,
    stopListening,
    toggleListening,
  };
}
```

---

### Option B: Complete Search Input Component with UI & Animations

Here is a complete component using Tailwind CSS and `lucide-react` icons (e.g. `components/VoiceSearchInput.tsx`):

```tsx
"use client";

import React, { useState, useEffect } from "react";
import { Search, Mic, MicOff, X } from "lucide-react";
import { useVoiceSearch } from "@/hooks/useVoiceSearch";

interface VoiceSearchInputProps {
  placeholder?: string;
  onSearchChange?: (query: string) => void;
  className?: string;
}

export const VoiceSearchInput: React.FC<VoiceSearchInputProps> = ({
  placeholder = "Search anything...",
  onSearchChange,
  className = "",
}) => {
  const [query, setQuery] = useState("");

  const { isListening, toggleListening, isSupported } = useVoiceSearch({
    onResult: (text) => {
      setQuery(text);
      if (onSearchChange) onSearchChange(text);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (onSearchChange) onSearchChange(e.target.value);
  };

  const handleClear = () => {
    setQuery("");
    if (onSearchChange) onSearchChange("");
  };

  return (
    <div className={`relative w-full max-w-md ${className}`}>
      {/* Left Search Icon */}
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

      {/* Input Field */}
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={isListening ? "Listening... Speak now" : placeholder}
        className={`h-11 w-full rounded-xl border bg-white pl-10 pr-20 text-sm transition-all focus:outline-none ${
          isListening
            ? "border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-900 font-medium placeholder:text-emerald-600"
            : "border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
        }`}
      />

      {/* Action Buttons (Right) */}
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 text-gray-400 hover:text-gray-700 transition-colors rounded-full"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Mic Button */}
        {isSupported && (
          <button
            type="button"
            onClick={toggleListening}
            title={isListening ? "Stop listening" : "Search by voice"}
            className={`relative p-2 rounded-lg transition-all flex items-center justify-center ${
              isListening
                ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-400"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
            }`}
          >
            {isListening ? (
              <Mic className="w-4 h-4 text-emerald-600 animate-pulse" />
            ) : (
              <Mic className="w-4 h-4" />
            )}

            {/* Live recording indicator radar pulse */}
            {isListening && (
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
```

---

## 3. Implementation Guide for React Native / Expo Mobile Apps

In native mobile environments (iOS / Android), `window.SpeechRecognition` does not exist. You should use **`@react-native-voice/voice`** or **`expo-speech-recognition`**.

### Using `expo-speech-recognition`:

1. **Install package**:
   ```bash
   npx expo install expo-speech-recognition
   ```

2. **Add permissions to `app.json`**:
   ```json
   {
     "expo": {
       "plugins": [
         [
           "expo-speech-recognition",
           {
             "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone for voice search.",
             "speechRecognitionPermission": "Allow $(PRODUCT_NAME) to recognize your speech."
           }
         ]
       ]
     }
   }
   ```

3. **React Native Component**:
   ```tsx
   import React, { useState, useEffect } from "react";
   import { View, TextInput, TouchableOpacity, Text } from "react-native";
   import {
     ExpoSpeechRecognitionModule,
     useSpeechRecognitionEvent,
   } from "expo-speech-recognition";

   export function MobileVoiceSearch() {
     const [isRecognizing, setIsRecognizing] = useState(false);
     const [searchQuery, setSearchQuery] = useState("");

     useSpeechRecognitionEvent("start", () => setIsRecognizing(true));
     useSpeechRecognitionEvent("end", () => setIsRecognizing(false));
     useSpeechRecognitionEvent("result", (event) => {
       setSearchQuery(event.results[0]?.transcript || "");
     });
     useSpeechRecognitionEvent("error", (event) => {
       console.warn("Speech error:", event.error);
       setIsRecognizing(false);
     });

     const handleToggleVoice = async () => {
       if (isRecognizing) {
         ExpoSpeechRecognitionModule.stop();
         return;
       }

       const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
       if (!result.granted) {
         alert("Microphone permission is required.");
         return;
       }

       ExpoSpeechRecognitionModule.start({
         lang: "en-US",
         interimResults: true,
         continuous: false,
       });
     };

     return (
       <View style={{ flexDirection: "row", alignItems: "center", borderWidth: 1, padding: 8, borderRadius: 10 }}>
         <TextInput
           value={searchQuery}
           onChangeText={setSearchQuery}
           placeholder={isRecognizing ? "Listening..." : "Search..."}
           style={{ flex: 1 }}
         />
         <TouchableOpacity onPress={handleToggleVoice} style={{ padding: 8 }}>
           <Text>{isRecognizing ? "🔴 Stop" : "🎤 Mic"}</Text>
         </TouchableOpacity>
       </View>
     );
   }
   ```

---

## 4. Important Edge Cases, Browser Support & Best Practices

| Requirement | Best Practice / Solution |
| :--- | :--- |
| **HTTPS Requirement** | The Web Speech API requires a secure context (`https://` or `localhost`). In insecure HTTP contexts, browser will block the microphone. |
| **Browser Compatibility** | Full support in Google Chrome, Edge, Safari, iOS Safari, Android Chrome. Firefox does not enable Web Speech recognition by default. Always provide a fallback text input. |
| **Next.js SSR Hydration** | Always wrap `SpeechRecognition` access inside `typeof window !== "undefined"` or inside a `useEffect` to prevent server crash during SSR. |
| **Multi-Language Support** | You can dynamically set `recognition.lang = "hi-IN"`, `"es-ES"`, `"fr-FR"`, etc. based on user locale. |
| **Resource Cleanup** | Always stop the active recognition instance on component unmount to free the user's microphone. |
