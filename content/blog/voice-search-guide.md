---
title: "Implementing Real-Time Voice Search in Modern Web and Mobile Apps"
description: "A comprehensive guide to implementing real-time Voice Search across React, Next.js, and React Native (Expo) using the native Web Speech API, custom hooks, and mobile speech modules."
date: "2026-09-02"
coverImage: "/images/blog-5.png"
tags:
  - React
  - Next.js
  - Web Speech API
  - Voice Search
  - React Native
  - Expo
  - Frontend
  - TypeScript
featured: true
readTime: "12 min read"
category: "Web Development"
---

## Introduction

Voice search has evolved from a novelty feature into an essential accessibility and multimodal interaction pattern. Whether users are navigating an e-commerce catalog on mobile with hands occupied or quickly seeking documentation topics, speaking is often significantly faster and more intuitive than typing on a touchscreen keyboard.

Modern browsers now provide robust speech-to-text capabilities natively through the **Web Speech API** (`SpeechRecognition`), eliminating the need for expensive third-party speech recognition APIs, external server-side transcription proxies, or heavy JavaScript client bundles.

This guide explores the complete implementation of real-time voice search for both modern web environments (React, Next.js, Vite) and native mobile applications (React Native, Expo).

---

## 1. Web Speech API Fundamentals

The browser's native speech recognition engine runs directly inside the browser client. It connects into the operating system's audio capture pipeline and streams phonemes to the platform's speech recognition model.

```text
 User Speaks ────> Microphone Input ────> OS Audio Subsystem ────> Browser Speech Engine
                                                                            │
 React UI Component <──── State Updates <──── Interim / Final Transcripts <───┘
```

### Accessing the SpeechRecognition Interface

Because some Chromium browsers and older WebKit implementations still prefix the API, standard cross-browser detection is required:

```ts
const SpeechRecognition =
  (typeof window !== "undefined" &&
    ((window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition)) ||
  null;
```

> **Important Note:** In SSR frameworks like Next.js, always guard access to `window.SpeechRecognition` behind `typeof window !== "undefined"` or inside a `useEffect` hook to avoid hydration mismatches and server-side evaluation crashes.

---

## 2. Speech Recognition Lifecycle & Event Architecture

The recognition session follows a strict, well-defined event lifecycle:

```text
               recognition.start()
                       │
                       ▼
                 [ onstart ]  ─────────> isListening = true
                       │
                       ▼
                 [ onresult ] ─────────> Emits interim transcripts
                       │                 Updates search input in real time
                       ▼
                  [ onend ]   ─────────> isListening = false
                       │
                       ▼
               recognition.stop()
```

### Key Event Handlers

1. **`onstart`**: Triggered when the browser successfully acquires the microphone stream and begins listening. We use this to trigger visual cues (such as pulsing indicators or waveform animations).
2. **`onresult`**: Fires every time speech chunks are recognized. With `interimResults = true`, users see words populate the search bar in real time as they speak.
3. **`onerror`**: Catches permission denials (`not-allowed`), network disconnects (`network`), or audio capture timeouts (`no-speech`) and cleans up recording state.
4. **`onend`**: Automatically called when natural pauses are detected or when `.stop()` is invoked.

---

## 3. Building a Reusable Custom Hook (`useVoiceSearch`)

To keep UI components decoupled from speech recognition mechanics, we encapsulate the browser lifecycle in a reusable custom hook: `hooks/useVoiceSearch.ts`.

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

  // Check browser support on mount
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
      console.error("Failed to initialize speech recognition:", err);
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

  // Clean up instance on unmount to free microphone
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

## 4. Building the Interactive Search UI with Tailwind CSS

Next, we build a search input component (`components/VoiceSearchInput.tsx`) featuring real-time visual feedback, an active listening radar pulse, and clear/cancel buttons:

```tsx
"use client";

import React, { useState } from "react";
import { Search, Mic, X } from "lucide-react";
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
      {/* Search Icon */}
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

      {/* Main Text Input */}
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

      {/* Right Controls */}
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {/* Reset Query Button */}
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

        {/* Microphone Toggle Button */}
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
            <Mic className={`w-4 h-4 ${isListening ? "text-emerald-600 animate-pulse" : ""}`} />

            {/* Pulsing Recording Indicator */}
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

## 5. Native Mobile Implementation (React Native & Expo)

In mobile environments, web browser APIs like `window.SpeechRecognition` are unavailable. Instead, mobile apps interface with iOS **Speech Framework** and Android **SpeechRecognizer** using `expo-speech-recognition`:

### Step 1: Package Installation

```bash
npx expo install expo-speech-recognition
```

### Step 2: Configure System Permissions (`app.json`)

```json
{
  "expo": {
    "plugins": [
      [
        "expo-speech-recognition",
        {
          "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone for voice search.",
          "speechRecognitionPermission": "Allow $(PRODUCT_NAME) to transcribe speech into text."
        }
      ]
    ]
  }
}
```

### Step 3: React Native Component

```tsx
import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
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
    console.warn("Speech recognition error:", event.error);
    setIsRecognizing(false);
  });

  const handleToggleVoice = async () => {
    if (isRecognizing) {
      ExpoSpeechRecognitionModule.stop();
      return;
    }

    const permission = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!permission.granted) {
      alert("Microphone and speech recognition permissions are required.");
      return;
    }

    ExpoSpeechRecognitionModule.start({
      lang: "en-US",
      interimResults: true,
      continuous: false,
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder={isRecognizing ? "Listening..." : "Search products, articles..."}
        style={styles.input}
      />
      <TouchableOpacity onPress={handleToggleVoice} style={styles.button}>
        <Text style={styles.buttonText}>{isRecognizing ? "⏹ Stop" : "🎤 Voice"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 14,
    color: "#1F2937",
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
```

---

## 6. Edge Cases, Browser Compatibility & Best Practices

| Concern | Behavior | Solution / Recommendation |
| :--- | :--- | :--- |
| **HTTPS Security Context** | Browser security models disallow microphone access on unencrypted connections. | Ensure your application runs under `https://` (or `localhost` for development). |
| **Cross-Browser Support** | Fully supported in Chrome, Edge, Safari (iOS 14.5+ & macOS). Firefox requires experimental flags. | Always verify `isSupported` and retain standard keyboard text input as a reliable fallback. |
| **Internationalization** | Speech recognition quality degrades when matching speech to the wrong dialect. | Set `recognition.lang` dynamically according to your app's locale (e.g. `es-ES`, `hi-IN`, `fr-FR`). |
| **Lifecycle Teardown** | Navigating away without stopping speech can leave audio hardware engaged. | Always invoke `recognition.stop()` inside the component unmount / `useEffect` cleanup handler. |
| **Ambient Silence Timeout** | The browser terminates recognition if no sound is picked up within a few seconds. | Listen to `onerror` and `onend` to reset UI button state gracefully without leaving frozen "Listening..." indicators. |

---

## 7. Conclusion

Integrating voice search elevates standard user interfaces into dynamic, multimodal experiences. By capitalizing on the native **Web Speech API** on desktop/mobile browsers and using **`expo-speech-recognition`** for React Native, developers can deploy zero-latency, privacy-respecting, and free speech transcription without incurring heavy cloud API costs.
