
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  BookOpen, 
  Users, 
  Video, 
  ArrowRight, 
  CheckCircle,
  Stethoscope,
  Brain,
  Moon,
  Activity,
  UserCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  const handleTrackSymptoms = () => {
    navigate("/auth");
  };

  const handleHealthcareLogin = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Hero Section */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center mr-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">SILVIA Health</h1>
                <p className="text-sm text-gray-600 mt-1">Your digital health companion</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={handleTrackSymptoms} className="bg-pink-500 hover:bg-pink-600">
                <Activity className="w-4 h-4 mr-2" />
                Track My Symptoms
              </Button>
              <Button onClick={handleHealthcareLogin} variant="outline">
                <UserCheck className="w-4 h-4 mr-2" />
                Healthcare Login
              </Button>
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Comprehensive menopause education, symptom tracking, and wellness tools 
              to help you navigate your health journey with confidence. Connect with healthcare 
              professionals and access personalised support.
            </p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              { id: "overview", label: "Overview", icon: Heart },
              { id: "symptoms", label: "Understanding Symptoms", icon: Activity },
              { id: "wellness", label: "Wellness Tools", icon: Brain },
              { id: "support", label: "Support & Community", icon: Users }
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center"
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Call to Action Cards */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-gradient-to-r from-pink-100 to-purple-100 border-pink-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <Activity className="w-6 h-6 mr-3 text-pink-600" />
                      Start Tracking Your Symptoms
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">
                      Monitor your menopause journey with our comprehensive symptom tracker. 
                      Identify patterns, share insights with your healthcare provider, and take control of your health.
                    </p>
                    <Button onClick={handleTrackSymptoms} className="w-full bg-pink-500 hover:bg-pink-600">
                      <Activity className="w-4 h-4 mr-2" />
                      Begin Symptom Tracking
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-blue-100 to-teal-100 border-blue-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <Stethoscope className="w-6 h-6 mr-3 text-blue-600" />
                      Healthcare Professional Access
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">
                      Access your clinical dashboard to manage patient assessments, 
                      review symptom data, and provide personalised care recommendations.
                    </p>
                    <Button onClick={handleHealthcareLogin} variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
                      <UserCheck className="w-4 h-4 mr-2" />
                      Healthcare Login
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Information Cards */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                      Learn About Menopause
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Comprehensive guides covering symptoms, stages, and what to expect during your journey.
                    </p>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => navigate("/education?tab=resources")}
                    >
                      Explore Guides
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Video className="w-5 h-5 mr-2 text-green-600" />
                      Video Library
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Expert interviews, exercise routines, and practical tips from healthcare professionals.
                    </p>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => navigate("/education?tab=videos")}
                    >
                      Watch Videos
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Heart className="w-5 h-5 mr-2 text-pink-600" />
                      Partner Zone
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Resources and support for partners, family and friends to understand and help during the menopause journey.
                    </p>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => navigate("/partner-zone")}
                    >
                      Visit Partner Zone
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Assessment Integration Notice */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Stethoscope className="w-6 h-6 text-blue-600 mr-3" />
                    <h3 className="text-lg font-semibold text-blue-900">Referred by Your GP?</h3>
                  </div>
                  <p className="text-blue-800 mb-4">
                    If you've completed a health assessment with your GP, you may have been directed here 
                    to explore additional resources and educational content tailored to your needs.
                  </p>
                  <div className="flex items-center text-sm text-blue-700">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span>Personalized content based on your assessment</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Symptoms Tab */}
          {activeTab === "symptoms" && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Common Symptoms</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "Hot flashes and night sweats",
                      "Irregular periods",
                      "Sleep disturbances",
                      "Mood changes",
                      "Memory and concentration issues",
                      "Physical aches and pains"
                    ].map((symptom, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        <span>{symptom}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Understanding Your Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Every woman's menopause journey is unique. Learn about the different stages 
                    and how symptoms can vary from person to person.
                  </p>
                  <Button onClick={() => navigate("/education?tab=resources")}>
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Read Full Guide
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Wellness Tab */}
          {activeTab === "wellness" && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Symptom Tracker
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Monitor your symptoms and identify patterns.</p>
                  <Button onClick={handleTrackSymptoms} className="w-full">Start Tracking</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Moon className="w-5 h-5 mr-2" />
                    Sleep Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Tools and tips for better sleep during menopause.</p>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => navigate("/education?tab=resources")}
                  >
                    Explore Tools
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="w-5 h-5 mr-2" />
                    Mindfulness
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Meditation and relaxation techniques.</p>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => navigate("/education?tab=resources")}
                  >
                    Try Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Support Tab */}
          {activeTab === "support" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Connect with Others</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Join our supportive community where you can share experiences, 
                    ask questions, and learn from others going through similar journeys.
                  </p>
                  <Button>Join Community Forum</Button>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-3 gap-4">
                <Card className="text-center">
                  <CardContent className="p-6">
                    <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Discussion Groups</h3>
                    <p className="text-sm text-gray-600">Topic-focused conversations</p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="p-6">
                    <Heart className="w-8 h-8 text-pink-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Peer Support</h3>
                    <p className="text-sm text-gray-600">One-on-one connections</p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="p-6">
                    <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Expert Q&A</h3>
                    <p className="text-sm text-gray-600">Professional guidance</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <div className="flex items-center justify-center mb-4">
              <Heart className="w-5 h-5 text-pink-500 mr-2" />
              <span className="font-semibold">SILVIA Health</span>
            </div>
            <p className="text-sm">
              Supporting your health journey with evidence-based information and community connection.
            </p>
            <p className="text-xs mt-2 text-gray-500">
              Always consult with your healthcare provider for personalised medical advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
