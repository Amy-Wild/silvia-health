
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Stethoscope, 
  Heart, 
  Brain, 
  Activity, 
  Users, 
  BookOpen, 
  Calendar,
  UserPlus,
  LogIn,
  LogOut
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";

const Index = () => {
  const { user, userRole, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SILVIA Health</h1>
                <p className="text-sm text-gray-600">
                  <strong>S</strong>ymptom <strong>I</strong>ntake & <strong>L</strong>iaison for <strong>V</strong>ital <strong>I</strong>nsight & <strong>A</strong>ssessment
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                    <Activity className="w-4 h-4 mr-1" />
                    {userRole === 'gp' ? 'GP Account' : userRole === 'clinical_admin' ? 'Admin' : 'Patient'}
                  </Badge>
                  {userRole === 'gp' && (
                    <Button asChild>
                      <Link to="/gp/dashboard">GP Dashboard</Link>
                    </Button>
                  )}
                  {userRole === 'clinical_admin' && (
                    <Button asChild>
                      <Link to="/clinical/dashboard">Clinical Dashboard</Link>
                    </Button>
                  )}
                  <Button variant="outline" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="outline" asChild>
                    <Link to="/auth">
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link to="/auth">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Sign Up
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Comprehensive Menopause
            <span className="text-blue-600"> Assessment</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Evidence-based menopause assessment tool designed for healthcare professionals and patients. 
            Get personalized insights and treatment recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link to="/patient-assessment/new">
                <Heart className="w-5 h-5 mr-2" />
                Start Assessment
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/education">
                <BookOpen className="w-5 h-5 mr-2" />
                Learn More
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Comprehensive Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Complete symptom evaluation covering physical, emotional, and lifestyle factors affecting menopause.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Evidence-Based</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Built on clinical guidelines and research-backed assessment criteria for accurate evaluation.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Patient & Provider</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Designed for both patients and healthcare providers with secure data sharing capabilities.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Quick Access</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" asChild>
              <Link to="/instructions">
                <BookOpen className="w-6 h-6" />
                <span>Instructions</span>
              </Link>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" asChild>
              <Link to="/education">
                <Brain className="w-6 h-6" />
                <span>Education</span>
              </Link>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" asChild>
              <Link to="/partner-zone">
                <Users className="w-6 h-6" />
                <span>Partner Zone</span>
              </Link>
            </Button>
            
            {user && userRole === 'patient' && (
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" asChild>
                <Link to="/symptom-tracker">
                  <Calendar className="w-6 h-6" />
                  <span>Symptom Tracker</span>
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Begin?</h3>
          <p className="text-gray-600 mb-6">
            Take the first step towards understanding your menopause journey with our comprehensive assessment.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link to="/patient-assessment/new">
              Start Your Assessment Now
            </Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 SILVIA Health. Supporting women through their menopause journey.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
