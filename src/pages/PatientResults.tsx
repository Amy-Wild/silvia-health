
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Heart, Info, AlertTriangle, Download, BookOpen, Calendar, Clock, Activity } from "lucide-react";
import TrackerIntegration from "@/components/TrackerIntegration";

const PatientResults = () => {
  const { sessionId } = useParams();

  // Mock results data - in real app this would come from API
  const results = {
    completedAt: new Date().toLocaleDateString(),
    riskLevel: "moderate",
    needsGPAppointment: true,
    hasRedFlags: false, // This would be determined from assessment
    keyFindings: [
      "You're experiencing some common menopause symptoms",
      "Your symptoms are affecting your daily life", 
      "There are effective treatments available to help"
    ],
    recommendations: [
      "Discuss treatment options that might work for you",
      "Explore lifestyle changes that can help with symptoms",
      "Ask about ways to support your bone health",
      "Learn about stress management techniques"
    ],
    nextSteps: [
      "Your GP will review your assessment before your appointment",
      "Think about questions you'd like to ask about treatment options",
      "Consider keeping a diary of your symptoms"
    ],
    educationalTopics: [
      "Understanding your treatment options",
      "Lifestyle tips for feeling better",
      "Supporting your bone health",
      "Preparing for your GP appointment"
    ],
    // New section for embedded recommendations
    personalizedActions: [
      {
        icon: <Calendar className="w-4 h-4" />,
        title: "Book a GP appointment",
        description: "Discuss your symptoms and treatment options with your doctor",
        priority: "high"
      },
      {
        icon: <Activity className="w-4 h-4" />,
        title: "Increase physical activity",
        description: "Regular exercise can help manage menopause symptoms",
        priority: "medium"
      },
      {
        icon: <Clock className="w-4 h-4" />,
        title: "Track your symptoms",
        description: "Keep a diary to identify patterns and triggers",
        priority: "medium"
      }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
                <p className="text-sm text-gray-600">Your health assessment results</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Completion Message */}
          <Card className="mb-8 bg-green-100 border-green-200">
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
              <h2 className="text-2xl font-bold mb-4 text-green-800">Thank You!</h2>
              <p className="text-lg mb-4 text-green-700">
                Your health assessment has been completed and shared with your GP.
              </p>
              <p className="text-green-600 text-sm">
                Completed on {results.completedAt} • Session: {sessionId?.slice(-8)}
              </p>
            </CardContent>
          </Card>

          {/* Gentle Red Flag Message */}
          {results.hasRedFlags && (
            <Card className="mb-6 bg-blue-100 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-800">
                  <Calendar className="w-5 h-5 mr-2" />
                  We'd Like You to See Your GP Soon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-700 mb-4">
                  Based on your responses, it would be helpful for you to have a conversation with your GP about your symptoms. 
                  This is quite common and nothing to worry about - your GP just wants to make sure you get the best care possible.
                </p>
                <p className="text-sm text-blue-600">
                  Your GP has all the information from your assessment and will be ready to discuss the next steps with you.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Key Findings with Embedded Personalized Actions */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="w-5 h-5 mr-2 text-purple-500" />
                Your Health Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-3">
                  {results.keyFindings.map((finding, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">{finding}</p>
                    </div>
                  ))}
                </div>

                {/* Embedded Personalized Actions */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Recommended Actions for You:</h3>
                  <div className="space-y-3">
                    {results.personalizedActions.map((action, index) => (
                      <div key={index} className={`p-3 rounded-lg border-l-4 ${
                        action.priority === 'high' 
                          ? 'bg-red-50 border-red-500' 
                          : 'bg-blue-50 border-blue-500'
                      }`}>
                        <div className="flex items-start space-x-3">
                          <div className={`p-1 rounded ${
                            action.priority === 'high' 
                              ? 'bg-red-100 text-red-600' 
                              : 'bg-blue-100 text-blue-600'
                          }`}>
                            {action.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-medium ${
                              action.priority === 'high' 
                                ? 'text-red-800' 
                                : 'text-blue-800'
                            }`}>
                              {action.title}
                            </h4>
                            <p className={`text-sm ${
                              action.priority === 'high' 
                                ? 'text-red-700' 
                                : 'text-blue-700'
                            }`}>
                              {action.description}
                            </p>
                          </div>
                          <Badge className={
                            action.priority === 'high' 
                              ? 'bg-red-500 text-white' 
                              : 'bg-blue-500 text-white'
                          }>
                            {action.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="w-5 h-5 mr-2 text-blue-500" />
                Things to Discuss with Your GP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Conversation topics for your appointment:</h3>
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
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-800">
                <BookOpen className="w-5 h-5 mr-2" />
                Learn More While You Wait
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 mb-4">
                Explore helpful resources about your symptoms and treatment options. 
                The more you know, the better conversations you can have with your GP.
              </p>
              <div className="space-y-2 mb-4">
                <h4 className="font-medium text-blue-800">Topics that might interest you:</h4>
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
                Explore Helpful Resources
              </Button>
            </CardContent>
          </Card>

          {/* Symptom Tracker Integration */}
          <TrackerIntegration 
            sessionId={sessionId}
            patientResults={results}
          />

          {/* Next Steps */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                What Happens Next
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.nextSteps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
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
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-center">
            <p className="text-sm text-gray-600">
              Your responses are secure and confidential. Only your GP will have access to the detailed results.
              If you have urgent concerns, please contact your GP directly or call 111.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientResults;
