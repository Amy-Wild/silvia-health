
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Heart, Info, AlertTriangle, Download, BookOpen } from "lucide-react";

const PatientResults = () => {
  const { sessionId } = useParams();

  // Mock results data - in real app this would come from API
  const results = {
    completedAt: new Date().toLocaleDateString(),
    riskLevel: "moderate",
    needsGPAppointment: true,
    keyFindings: [
      "Moderate menopause symptoms affecting daily life",
      "Some cardiovascular risk factors present",
      "Bone health may need attention"
    ],
    recommendations: [
      "Discuss hormone replacement therapy options with your GP",
      "Consider lifestyle changes for better symptom management",
      "Ask about bone density screening",
      "Explore stress management techniques"
    ],
    nextSteps: [
      "Your GP will review these results before your appointment",
      "Prepare questions about treatment options",
      "Consider keeping a symptom diary until your appointment"
    ],
    educationalTopics: [
      "Understanding HRT options",
      "Lifestyle modifications for symptom relief",
      "Bone health in menopause",
      "Preparing for your GP appointment"
    ]
  };

  const handleDownloadResults = () => {
    // In real app, this would generate a PDF
    console.log("Downloading patient results summary");
  };

  const handleExploreEducation = () => {
    window.open(`/education?sessionId=${sessionId}&source=results`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <h1 className="text-xl font-bold text-gray-900">Assessment Complete</h1>
                <p className="text-sm text-gray-600">Your results are ready</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Completion Message */}
          <Card className="mb-8 bg-gradient-to-r from-green-500 to-teal-600 text-white">
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
              <p className="text-lg opacity-90 mb-4">
                Your health assessment has been completed and sent to your GP.
              </p>
              <p className="opacity-80 text-sm">
                Completed on {results.completedAt} • Session: {sessionId?.slice(-8)}
              </p>
            </CardContent>
          </Card>

          {/* Key Findings */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="w-5 h-5 mr-2 text-pink-500" />
                Your Health Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.keyFindings.map((finding, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">{finding}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="w-5 h-5 mr-2 text-blue-500" />
                What This Means For You
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Things to discuss with your GP:</h3>
                  <ul className="space-y-2">
                    {results.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Educational Resources Integration */}
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-800">
                <BookOpen className="w-5 h-5 mr-2" />
                Learn More While You Wait
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 mb-4">
                Explore educational resources tailored to your assessment results. 
                Understanding your condition better will help you have more informed conversations with your GP.
              </p>
              <div className="space-y-2 mb-4">
                <h4 className="font-medium text-blue-800">Recommended topics for you:</h4>
                <div className="flex flex-wrap gap-2">
                  {results.educationalTopics.map((topic, index) => (
                    <Badge key={index} variant="outline" className="border-blue-300 text-blue-700">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button 
                onClick={handleExploreEducation}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Explore Educational Resources
              </Button>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
                What Happens Next
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.nextSteps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-700">{step}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleDownloadResults}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Your Summary
            </Button>
            <Button 
              variant="outline"
              className="flex-1"
              onClick={() => window.close()}
            >
              Close Window
            </Button>
          </div>

          {/* Footer Info */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-sm text-gray-600">
              Your responses are secure and confidential. Only your GP will have access to the detailed results.
              If you have urgent concerns, please contact your GP directly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientResults;
