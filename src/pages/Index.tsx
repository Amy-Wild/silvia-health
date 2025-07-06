
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Heart, 
  Brain, 
  Activity, 
  Users, 
  BookOpen, 
  Calendar,
  Stethoscope
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";

const Index = () => {
  const { userRole } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Comprehensive Menopause
            <span className="text-soft-coral-dark"> Assessment</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Evidence-based menopause assessment tool designed for healthcare professionals and patients. 
            Get personalized insights and treatment recommendations.
          </p>
          
          {/* Different CTAs based on user role */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {userRole === 'patient' ? (
              <>
                <Button size="lg" className="bg-soft-coral-dark hover:bg-soft-coral-dark/80 text-white border-0" asChild>
                  <Link to="/symptom-tracker">
                    <Calendar className="w-5 h-5 mr-2" />
                    Track My Symptoms
                  </Link>
                </Button>
                <div className="text-center mt-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <Stethoscope className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <p className="text-blue-800 font-medium">Health assessments are available through your GP</p>
                    <p className="text-blue-600 text-sm mt-1">Contact your healthcare provider for a comprehensive menopause assessment</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Button size="lg" className="bg-soft-coral-dark hover:bg-soft-coral-dark/80 text-white border-0" asChild>
                  <Link to="/gp-dashboard">
                    <Heart className="w-5 h-5 mr-2" />
                    Clinical Portal
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-gentle-blue-dark text-gentle-blue-dark hover:bg-gentle-blue" asChild>
                  <Link to="/education">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Learn More
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-gentle-blue border-gentle-blue-dark/20 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-gentle-blue-dark rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-gray-900">Comprehensive Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Complete symptom evaluation covering physical, emotional, and lifestyle factors affecting menopause.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-soft-green border-soft-green-dark/20 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-soft-green-dark rounded-lg flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-gray-900">Evidence-Based</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Built on clinical guidelines and research-backed assessment criteria for accurate evaluation.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-light-purple border-light-purple-dark/20 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-light-purple-dark rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-gray-900">Patient & Provider</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Designed for both patients and healthcare providers with secure data sharing capabilities.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access Section for Patients */}
        {userRole === 'patient' && (
          <div className="bg-gentle-blue/50 rounded-2xl p-8 mb-16 border border-gentle-blue-dark/10">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Track Your Journey</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 border-gray-300 hover:bg-soft-coral hover:border-soft-coral-dark" asChild>
                <Link to="/symptom-tracker">
                  <Calendar className="w-6 h-6" />
                  <span>Daily Tracking</span>
                </Link>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 border-gray-300 hover:bg-light-purple hover:border-light-purple-dark" asChild>
                <Link to="/education">
                  <Brain className="w-6 h-6" />
                  <span>Education</span>
                </Link>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 border-gray-300 hover:bg-soft-green hover:border-soft-green-dark" asChild>
                <Link to="/partner-zone">
                  <Users className="w-6 h-6" />
                  <span>Partner Zone</span>
                </Link>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 border-gray-300 hover:bg-gentle-blue hover:border-gentle-blue-dark" asChild>
                <Link to="/instructions">
                  <BookOpen className="w-6 h-6" />
                  <span>Instructions</span>
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Quick Access Section for Healthcare Providers */}
        {(userRole === 'gp' || userRole === 'clinical_admin') && (
          <div className="bg-gentle-blue/50 rounded-2xl p-8 mb-16 border border-gentle-blue-dark/10">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Clinical Tools</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 border-gray-300 hover:bg-soft-coral hover:border-soft-coral-dark" asChild>
                <Link to="/gp-dashboard">
                  <Stethoscope className="w-6 h-6" />
                  <span>Clinical Portal</span>
                </Link>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 border-gray-300 hover:bg-light-purple hover:border-light-purple-dark" asChild>
                <Link to="/instructions">
                  <Brain className="w-6 h-6" />
                  <span>Guidelines</span>
                </Link>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 border-gray-300 hover:bg-soft-green hover:border-soft-green-dark" asChild>
                <Link to="/education">
                  <BookOpen className="w-6 h-6" />
                  <span>Resources</span>
                </Link>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 border-gray-300 hover:bg-gentle-blue hover:border-gentle-blue-dark" asChild>
                <Link to="/clinical-dashboard">
                  <Activity className="w-6 h-6" />
                  <span>Management</span>
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center bg-soft-coral/30 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Begin?</h3>
          <p className="text-gray-600 mb-6">
            {userRole === 'patient' 
              ? "Start tracking your symptoms today and share insights with your healthcare provider."
              : "Empower your patients with comprehensive menopause assessment and tracking tools."
            }
          </p>
          <Button size="lg" className="bg-soft-coral-dark hover:bg-soft-coral-dark/80 text-white" asChild>
            <Link to={userRole === 'patient' ? "/symptom-tracker" : "/gp-dashboard"}>
              {userRole === 'patient' ? "Start Tracking Now" : "Access Clinical Portal"}
            </Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gentle-blue/20 border-t border-gentle-blue-dark/20 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 SYLVIA Health. Supporting women through their menopause journey.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
