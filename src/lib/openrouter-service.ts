import { OPENAI_KEY } from "@/lib/env";
import OpenAI from "openai";
import * as pdfjsLib from "pdfjs-dist";
import pdfJSWorkerURL from "pdfjs-dist/build/pdf.worker?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfJSWorkerURL;

export interface ScoreDetail {
  score: number;
  explanation: string;
}

export interface ResumeAnalysis {
  scores: {
    overall: ScoreDetail;
    ats: ScoreDetail;
    skills: ScoreDetail;
    formatting: ScoreDetail;
    [key: string]: ScoreDetail;
  };
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  detectedKeywords: string[];
}

export class OpenRouterService {
  private client: OpenAI | null = null;
  constructor() {
    try {
      this.client = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        dangerouslyAllowBrowser: true,
        apiKey: OPENAI_KEY,
        defaultHeaders: {
          "X-Title": "Resume Analyzer",
        },
      });
    } catch (error) {
      console.error("Failed to initialize OpenRouterService: ", error);
    }
  }

  async extractTextFromPDF(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(" ") + "\n";
    }
    return text;
  }

  createPrompt(name: string, details: string): string {
    return `You are a professional resume analyzer AI. The user name is: ${name}. Here are additional details: ${details}.

Analyze the provided resume PDF and return a JSON object with the following structure:
{
  "scores": {
    "overall": { "score": 85, "explanation": "Brief explanation" },
    "ats": { "score": 80, "explanation": "Brief explanation" },
    "skills": { "score": 90, "explanation": "Brief explanation" },
    "formatting": { "score": 85, "explanation": "Brief explanation" }
  },
  "summary": "Summary text about the resume",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "weaknesses": ["Weakness 1", "Weakness 2", "Weakness 3"],
  "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"],
  "detectedKeywords": ["Keyword 1", "Keyword 2", "Keyword 3"]
}

IMPORTANT: You MUST respond with ONLY raw, valid JSON that follows this exact structure. 
DO NOT use markdown formatting, backticks, or any other text outside of the JSON object itself.`;
  }

  async analyzeResumeJSON(
    file: File,
    name: string,
    details: string
  ): Promise<ResumeAnalysis> {
    if (!this.client) throw new Error("OpenRouter client not initialized");
    const text = await this.extractTextFromPDF(file);
    const prompt =
      this.createPrompt(name, details) +
      "\n\nHere is the extracted resume text:\n" +
      text;
    const completions = await this.client.chat.completions.create({
      model: "meta-llama/llama-4-maverick:free",
      messages: [
        {
          role: "user",
          content: [{ type: "text", text: prompt }],
        },
      ],
    });

    let content = completions.choices?.[0]?.message?.content || "";

    try {
      // Check if the content is wrapped in backticks (markdown code blocks)
      if (content.includes("```")) {
        // Extract JSON from code blocks (assuming format like ```json or ``` followed by JSON)
        const jsonMatch = content.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
        if (jsonMatch && jsonMatch[1]) {
          content = jsonMatch[1].trim();
        }
      }

      return JSON.parse(content);
    } catch (error) {
      console.error("Failed to parse JSON response:", error, content);
      throw new Error("Failed to parse analysis results. Please try again.");
    }
  }
}
