import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { OpenRouterService } from "@/lib/openrouter-service";
import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  BarChart,
  Brain,
  CheckCircle,
  Lightbulb,
  ListChecks,
  Tag,
  Target,
  TrendingUp,
  Upload,
} from "lucide-react";
import { useState } from "react";
import type { ResumeAnalysis } from "types";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [userDetails, setUserDetails] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find((file) => file.type === "application/pdf");
    if (pdfFile) {
      setSelectedFile(pdfFile);
    }
  };

  const openRouterService = new OpenRouterService();

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);
    try {
      const result = await openRouterService.analyzeResume(
        selectedFile,
        userName,
        userDetails
      );
      setAnalysis(result);
    } catch (err: any) {
      console.error("Analysis error:", err);
      if (err.message.includes("parse")) {
        setError("Failed to parse AI response. Please try again.");
      } else {
        setError(err.message || "Failed to analyze resume.");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-slate-900">ResumeAI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost">Features</Button>
              <Button variant="ghost">Pricing</Button>
              <Button variant="outline">Sign In</Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="text-center my-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          AI-Powered Resume Analysis
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
          Get instant feedback on your resume with our advanced AI analyzer.
          Improve your chances of landing your dream job with actionable
          insights and optimization tips.
        </p>
        <div className="flex justify-center space-x-8 text-sm text-slate-500">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>ATS Optimization</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Score Analysis</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Instant Feedback</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-6 text-center text-red-600 font-semibold">
            {error}
          </div>
        )}
        {!analysis && (
          <Card className="max-w-2xl mx-auto mb-8">
            <CardHeader>
              <CardTitle className="text-center">Resume Details</CardTitle>
              <CardDescription className="text-center">
                Enter your name and a short description or job target
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <input
                  className="w-full border rounded px-3 py-2"
                  placeholder="Your Name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <textarea
                  className="w-full border rounded px-3 py-2"
                  placeholder="Describe your career goals, target job, or anything for context..."
                  rows={3}
                  value={userDetails}
                  onChange={(e) => setUserDetails(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        )}
        {!analysis && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Upload Your Resume</CardTitle>
              <CardDescription className="text-center">
                Drop your PDF resume here or click to browse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-300 hover:border-slate-400"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {isAnalyzing ? (
                  <div className="space-y-4">
                    <div className="animate-spin mx-auto w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                    <p className="text-slate-600">Analyzing your resume...</p>
                    <p className="text-sm text-slate-500">
                      This may take a few moments
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-16 h-16 text-slate-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-slate-700">
                        Drop your PDF resume here
                      </p>
                      <p className="text-slate-500">or</p>
                    </div>
                    <label htmlFor="file-upload">
                      <Button asChild>
                        <span>Browse Files</span>
                      </Button>
                      <input
                        id="file-upload"
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                    </label>
                    <p className="text-xs text-slate-500">
                      Supports PDF files up to 10MB
                    </p>
                  </div>
                )}
              </div>
              <Button
                className="w-full mt-6"
                onClick={handleAnalyze}
                disabled={isAnalyzing || !selectedFile || !userName}
              >
                Analyze
              </Button>
            </CardContent>
          </Card>
        )}
        {analysis && (
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Resume Analysis Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Score Section */}
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                  <BarChart className="h-5 w-5 text-blue-600" />
                  Scores
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(analysis.scores).map(([key, score]) => (
                    <div key={key} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium capitalize">{key}</span>
                        <span className="font-bold text-lg">
                          {score.score}/100
                        </span>
                      </div>
                      <Progress value={score.score} className="h-2 mb-2" />
                      <p className="text-sm text-slate-600">
                        {score.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Section */}
              <div>
                <h2 className="text-xl font-bold mb-3">Summary</h2>
                <p className="text-slate-700">{analysis.summary}</p>
              </div>

              {/* Strengths Section */}
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2 mb-3">
                  <ListChecks className="h-5 w-5 text-green-600" />
                  Strengths
                </h2>
                <ul className="space-y-2">
                  {analysis.strengths.map((strength, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 shrink-0" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses Section */}
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  Areas for Improvement
                </h2>
                <ul className="space-y-2">
                  {analysis.weaknesses.map((weakness, i) => (
                    <li key={i} className="flex items-start">
                      <span className="h-5 w-5 text-amber-500 mt-0.5 mr-2 shrink-0">
                        •
                      </span>
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suggestions Section */}
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2 mb-3">
                  <Lightbulb className="h-5 w-5 text-blue-600" />
                  Actionable Suggestions
                </h2>
                <ul className="space-y-2">
                  {analysis.suggestions.map((suggestion, i) => (
                    <li key={i} className="flex items-start">
                      <span className="h-5 w-5 text-blue-500 mt-0.5 mr-2 shrink-0">
                        {i + 1}.
                      </span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Keywords Section */}
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2 mb-3">
                  <Tag className="h-5 w-5 text-purple-600" />
                  Detected Keywords
                </h2>
                <div className="flex flex-wrap gap-2">
                  {analysis.detectedKeywords.map((keyword, i) => (
                    <Badge key={i} variant="secondary" className="text-sm py-1">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button
                className="mt-6"
                onClick={() => {
                  setAnalysis(null);
                  setSelectedFile(null);
                }}
              >
                Analyze Another Resume
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default App;
