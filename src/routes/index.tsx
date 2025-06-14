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
import { createFileRoute } from "@tanstack/react-router";
import {
  AlertCircle,
  Brain,
  CheckCircle,
  FileText,
  Star,
  Target,
  TrendingUp,
  Upload,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: App,
});

interface AnalysisResult {
  overallScore: number;
  sections: {
    name: string;
    score: number;
    feedback: string;
    status: "excellent" | "good" | "needs-improvement";
  }[];
  keywords: string[];
  suggestions: string[];
  strengths: string[];
  fileName: string;
}

function App() {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find((file) => file.type === "application/pdf");

    if (pdfFile) {
      analyzeResume(pdfFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      analyzeResume(file);
    }
  };

  const analyzeResume = async (file: File) => {
    setIsAnalyzing(true);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const mockAnalysis: AnalysisResult = {
      overallScore: 78,
      fileName: file.name,
      sections: [
        {
          name: "Contact Information",
          score: 95,
          feedback:
            "Complete contact details with professional email and LinkedIn profile.",
          status: "excellent",
        },
        {
          name: "Professional Summary",
          score: 72,
          feedback:
            "Good summary but could be more specific about achievements and quantifiable results.",
          status: "good",
        },
        {
          name: "Work Experience",
          score: 85,
          feedback:
            "Strong work history with relevant experience. Consider adding more metrics and achievements.",
          status: "excellent",
        },
        {
          name: "Skills Section",
          score: 68,
          feedback:
            "Skills are listed but lack context. Consider organizing by categories and proficiency levels.",
          status: "needs-improvement",
        },
        {
          name: "Education",
          score: 90,
          feedback:
            "Education section is well-formatted with relevant details and achievements.",
          status: "excellent",
        },
        {
          name: "Formatting & Design",
          score: 75,
          feedback:
            "Clean layout but could benefit from better use of white space and consistent formatting.",
          status: "good",
        },
      ],
      keywords: [
        "JavaScript",
        "React",
        "Node.js",
        "Python",
        "AWS",
        "Project Management",
        "Agile",
        "SQL",
      ],
      suggestions: [
        "Add quantifiable achievements to work experience (e.g., 'Increased sales by 25%')",
        "Include relevant certifications or professional development courses",
        "Optimize for ATS by using standard section headings",
        "Add a projects section to showcase technical skills",
        "Consider adding volunteer work or leadership experience",
      ],
      strengths: [
        "Strong technical background with relevant programming languages",
        "Consistent work history with progressive responsibility",
        "Good educational foundation",
        "Professional contact information and online presence",
      ],
    };

    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "good":
        return <Star className="w-4 h-4 text-yellow-600" />;
      case "needs-improvement":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!analysis && (
          <div className="text-center mb-12">
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
            </CardContent>
          </Card>
        )}

        {analysis && (
          <div className="space-y-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <FileText className="w-6 h-6 text-slate-600" />
                <h2 className="text-2xl font-bold text-slate-900">
                  {analysis.fileName}
                </h2>
              </div>
              <div className="flex items-center justify-center space-x-4">
                <div className="text-center">
                  <div
                    className={`text-4xl font-bold ${getScoreColor(analysis.overallScore)}`}
                  >
                    {analysis.overallScore}
                  </div>
                  <div className="text-sm text-slate-500">Overall Score</div>
                </div>
                <div className="w-32">
                  <Progress value={analysis.overallScore} className="h-2" />
                </div>
              </div>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setAnalysis(null)}
              >
                Analyze Another Resume
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Section Analysis</CardTitle>
                <CardDescription>
                  Detailed breakdown of each resume section
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {analysis.sections.map((section, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(section.status)}
                        <span className="font-medium">{section.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`font-bold ${getScoreColor(section.score)}`}
                        >
                          {section.score}
                        </span>
                        <div className="w-20">
                          <Progress value={section.score} className="h-1" />
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 ml-6">
                      {section.feedback}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Detected Keywords</CardTitle>
                  <CardDescription>
                    Important keywords found in your resume
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Strengths</CardTitle>
                  <CardDescription>What your resume does well</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Improvement Suggestions</CardTitle>
                <CardDescription>
                  Actionable recommendations to enhance your resume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
