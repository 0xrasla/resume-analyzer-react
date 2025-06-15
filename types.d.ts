export interface ResumeAnalysis {
  scores: {
    overall: { score: number; explanation: string };
    ats: { score: number; explanation: string };
    skills: { score: number; explanation: string };
    formatting: { score: number; explanation: string };
  };
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  detectedKeywords: string[];
}
