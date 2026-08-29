import { Mic, MicOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

type Props = {
  onResult: (text: string) => void;
  lang?: string;
  label?: string;
};

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: any) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

export function VoiceInput({ onResult, lang = "hi-IN", label = "Speak your answer" }: Props) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    const w = window as any;
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (Ctor) setSupported(true);
  }, []);

  const toggle = () => {
    const w = window as any;
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) return;

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition: SpeechRecognitionLike = new Ctor();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results as ArrayLike<any>)
        .map((r: any) => r[0].transcript)
        .join(" ");
      onResult(transcript.trim());
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  if (!supported) return null;

  return (
    <Button
      type="button"
      variant={listening ? "destructive" : "soft"}
      size="lg"
      onClick={toggle}
      aria-label={listening ? "Stop voice input" : label}
      aria-pressed={listening}
      className="min-h-11 gap-2"
    >
      {listening ? <MicOff className="size-5" /> : <Mic className="size-5" />}
      <span>{listening ? "Listening… tap to stop" : label}</span>
      {listening && (
        <span className="ml-1 inline-block size-2 animate-ping rounded-full bg-current" aria-hidden />
      )}
    </Button>
  );
}
