"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

export function TheDream() {
  const [quote, setQuote] = useState("");
  const [dream, setDream] = useState("");
  const [debouncedQuote, setDebouncedQuote] = useState("");
  const [loading, setLoading] = useState(false);
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_KEY!);

  function cleanUpText(text: string) {
    // Remove special characters except for allowed punctuation
    return text.replace(/[^\w\s.,!?'"-]/g, "");
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuote(dream);
    }, 600);

    return () => {
      clearTimeout(handler);
    };
  }, [dream]);

  useEffect(() => {
    if (debouncedQuote) {
      getTheQoute(debouncedQuote);
    }
  }, [debouncedQuote]);

  async function getTheQoute(dreamText: string) {
    try {
      setLoading(true);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const prompt = `Provide a simple quote with a very simpler meaning and make sure to make the qoute a happy one  along with the poet's name and no additional text that matches the dream described: "${dreamText}"`;

      const result = await model.generateContent(prompt);
      setQuote(cleanUpText(result.response.text()));
      console.log(result.response.text());
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center bg-no-repeat opacity-50" />
      <Card className="relative z-10 bg-gradient-to-br from-[#111111] to-[#141414] p-6 grid gap-6 text-white border-none">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <h3 className="text-3xl font-semibold">
              <input
                placeholder="Your dream in short"
                className="text-gray-200 placeholder:text-gray-600 bg-transparent border-none w-full outline-none py-2"
              />
            </h3>
            <div className="text-muted-foreground text-xl">
              <textarea
                placeholder="the actual dream..."
                className="text-gray-200 placeholder:text-gray-600 bg-transparent border-none w-full outline-none py-2 h-24"
                onChange={(e) => setDream(e.target.value)}
              />
            </div>
            <blockquote className="text-muted-foreground italic">
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              ) : quote ? (
                quote
              ) : (
                "Dream a little dream..."
              )}
            </blockquote>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="font-medium">
              <input
                placeholder="Your name ?"
                className="text-gray-200 placeholder:text-gray-600 bg-transparent border-none w-full outline-none py-2"
              />
            </div>
          </div>
        </div>
        <div className="absolute bottom-2 right-2 text-sm text-muted-foreground">
          @vineetwts
        </div>
      </Card>
    </div>
  );
}
