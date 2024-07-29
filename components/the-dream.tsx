"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Image from "next/image";

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
            <div className="absolute right-2 top-2 h-10 w-10">
              {" "}
              <a href="https://github.com/vineetagarwal-code">
              <Image src="https://img.icons8.com/?size=100&id=12599&format=png&color=25272b " width={40} alt="Github" height={40}/>
              </a>
            </div>

            <div className="text-muted-foreground text-xl">
              <textarea
                placeholder="Elaborate your Dream..."
                className="text-gray-200 placeholder:text-gray-600 bg-transparent border-none w-full outline-none py-2 h-24 resize-none"
                onChange={(e) => setDream(e.target.value)}
              />
            </div>
            <blockquote className="text-muted-foreground italic">
              {loading ? (
                <div className="flex items-center justify-center">
                  Thinking a dream...
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
                placeholder="Your name?"
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
