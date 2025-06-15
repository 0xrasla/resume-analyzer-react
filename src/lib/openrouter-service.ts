import OpenAI from "openai";
import * as pdjjsdist from "pdfjs-dist";
import pdfjsworkder from "pdfjs-dist/build/pdf.worker?url";
import type { ResumeAnalysis } from "types";
import { OPENAI_KEY } from "./env";

pdjjsdist.GlobalWorkerOptions.workerSrc = pdfjsworkder;

export class OpenRouterService {
  private client: OpenAI | null = null;

  constructor() {
    try {
      this.client = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        dangerouslyAllowBrowser: true,
        apiKey: OPENAI_KEY,
        defaultHeaders: {
          "X-Title": "Resume Analysis",
        },
      });
    } catch (error) {
      console.error("Failed to initialize OpenRouter client:", error);
    }
  }

  async extractTextFromPdf(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdjjsdist.getDocument({
        data: arrayBuffer,
      }).promise;

      let text = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item: any) => item.str).join(" ");
      }

      return text;
    } catch (error) {
      console.error("Failed to extract text from PDF:", error);
      return "";
    }
  }

  createPrompt(name: string, details: string) {
    return `
        You are a professional resume analyzer ai. The user name is ${name}.
        The user seeking for a job, and its Job Description is ${details}.
        
        Analyze the resume and provide a detailed analysis of the following:
        
        1. ATS Optimization
        2. Score Analysis
        3. Instant Feedback

        Analyze it properly and return JSON object with the following structure:

        {
            "scores": {
                "overall": { "score": 100, "explanation": "Brief explanation" },
                "ats": { "score": 80, "explanation": "Brief explanation" },
                "skills": { "score": 90, "explanation": "Brief explanation" },
                "formatting": { "score": 85, "explanation": "Brief explanation" },
            },
            "summary": "Summary text about the resume",
            "strengths": ["Strength 1", "Strength 2", "Strength 3"],
            "weaknesses": ["Weakness 1", "Weakness 2", "Weakness 3"],
            "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"],
            "detectedKeywords": ["Keyword 1", "Keyword 2", "Keyword 3"],
        }

        IMPORTANT: You must return only JSON object. Do not return any other text. Dont add any other extra quote or any other extra text.
    `;
  }

  async analyzeResume(
    file: File,
    name: string,
    details: string
  ): Promise<ResumeAnalysis> {
    try {
      if (!this.client)
        throw new Error("Failed to initialize OpenRouter client");

      const resumeText = await this.extractTextFromPdf(file);

      const prompt =
        this.createPrompt(name, details) +
        "\n\n" +
        "This is the extracted resume text: \n\n" +
        resumeText;

      const completion = await this.client.chat.completions.create({
        model: "meta-llama/llama-4-maverick:free",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
            ],
          },
        ],
      });

      let content = completion.choices[0].message.content || "";

      try {
        if (content.includes("```")) {
          const jsonMatch = content.match(/```json(?:js)?(.*?)```/s);
          if (jsonMatch && jsonMatch[1]) {
            content = jsonMatch[1].trim();
          }
        }

        return JSON.parse(content);
      } catch (error) {
        console.error("Failed to parse AI response:", error);
        throw error;
      }

      return JSON.parse(content);
    } catch (error) {
      console.error("Failed to analyze resume:", error);
      throw error;
    }
  }
}
