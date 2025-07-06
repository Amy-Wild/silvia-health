
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Heart, 
  Brain, 
  Activity, 
  Users, 
  BookOpen, 
  Calendar,
  Stethoscope,
  ArrowRight,
  CheckCircle,
  Info
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";

const PublicHome = () => {
  const { user, userRole } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-soft-coral to-light-purple text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              SYLVIA Health
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Comprehensive Menopause Assessment & Support Platform
            </p>
            <p className="text-lg mb-10 text-white/80 max-w-2xl mx-auto">
              Evidence-based menopause assessment tool designed for healthcare professionals and patients. 
              Get personalized insights, track symptoms, and access educational resources.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user ? (
                <>
                  <Button size="lg" variant="secondary" className="bg-white text-soft-coral-dark hover:bg-white/90" asChild>
                    <Link to="/auth">
                      <Calendar className="w-5 h-5 mr-2" />
                      Track My Symptoms
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-soft-coral-dark" asChild>
                    <Link to="/auth">
                      <Stethoscope className="w-5 h-5 mr-2" />
                      Healthcare Login
                    </Link>
                  </Button>
                </>
              ) : userRole === 'patient' ? (
                <Button size="lg" variant="secondary" className="bg-white text-soft-coral-dark hover:bg-white/90" asChild>
                  <Link to="/symptom-tracker">
                    <Calendar className="w-5 h-5 mr-2" />
                    Go to Symptom Tracker
                  </Link>
                </Button>
              ) : (
                <Button size="lg" variant="secondary" className="bg-white text-soft-coral-dark hover:bg-white/90" asChild>
                  <Link to={userRole === 'gp' ? "/gp-dashboard" : "/clinical-dashboard"}>
                    <Stethoscope className="w-5 h-5 mr-2" />
                    Go to Clinical Portal
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Breadcrumb */}
      <nav className="bg-gray-50 py-4 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link to="/" className="text-soft-coral-dark hover:text-soft-coral font-medium">
              Home
            </Link>
            <Link to="/education" className="text-gray-600 hover:text-soft-coral-dark">
              Learn
            </Link>
            <Link to="/instructions" className="text-gray-600 hover:text-soft-coral-dark">
              Resources
            </Link>
            <Link to="/partner-zone" className="text-gray-600 hover:text-soft-coral-dark">
              Partner Zone
            </Link>
            {!user ? (
              <>
                <Link to="/auth" className="text-gray-600 hover:text-soft-coral-dark">
                  Track Symptoms
                </Link>
                <Link to="/auth" className="text-gray-600 hover:text-soft-coral-dark">
                  Healthcare Login
                </Link>
              </>
            ) : userRole === 'patient' ? (
              <Link to="/symptom-tracker" className="text-gray-600 hover:text-soft-coral-dark">
                Track Symptoms
              </Link>
            ) : (
              <Link to={userRole === 'gp' ? "/gp-dashboard" : "/clinical-dashboard"} className="text-gray-600 hover:text-soft-coral-dark">
                Clinical Portal
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        {/* Key Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Comprehensive Menopause Care
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gentle-blue border-gentle-blue-dark/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gentle-blue-dark rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-gray-900">Comprehensive Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Complete symptom evaluation covering physical, emotional, and lifestyle factors affecting menopause.
                </p>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <Info className="w-5 h-5 text-blue-600 mb-2" />
                  <p className="text-blue-800 text-sm font-medium">Available through your GP</p>
                  <p className="text-blue-600 text-xs mt-1">Contact your healthcare provider for assessment</p>
                </div>
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
        </section>

        {/* Patient Resources */}
        <section className="mb-16">
          <div className="bg-soft-coral/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">For Patients</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 border-gray-300 hover:bg-soft-coral hover:border-soft-coral-dark" asChild>
                <Link to={user ? "/symptom-tracker" : "/auth"}>
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
        </section>

        {/* Healthcare Provider Section */}
        <section className="mb-16">
          <div className="bg-gentle-blue/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">For Healthcare Providers</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-gentle-blue-dark/20">
                <CardHeader>
                  <Stethoscope className="w-8 h-8 text-gentle-blue-dark mb-2" />
                  <CardTitle className="text-lg">Clinical Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Generate secure assessment links for patients and review comprehensive results.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to={user && (userRole === 'gp' || userRole === 'clinical_admin') ? "/gp-dashboard" : "/auth"}>
                      Access Portal
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-light-purple-dark/20">
                <CardHeader>
                  <Brain className="w-8 h-8 text-light-purple-dark mb-2" />
                  <CardTitle className="text-lg">Clinical Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Access evidence-based guidelines and best practice recommendations.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/instructions">
                      View Guidelines
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-soft-green-dark/20">
                <CardHeader>
                  <BookOpen className="w-8 h-8 text-soft-green-dark mb-2" />
                  <CardTitle className="text-lg">Educational Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Comprehensive educational materials for patient consultation and support.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/education">
                      Browse Resources
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Key Benefits */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why Choose SYLVIA?</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Evidence-Based Approach</h4>
                  <p className="text-gray-600">Built on the latest clinical research and guidelines for menopause care.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Comprehensive Assessment</h4>
                  <p className="text-gray-600">Covers all aspects of menopause including physical, emotional, and lifestyle factors.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Secure & Private</h4>
                  <p className="text-gray-600">Healthcare-grade security with patient data protection at the core.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Patient-Centered</h4>
                  <p className="text-gray-600">Designed with patient experience and empowerment in mind.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Professional Support</h4>
                  <p className="text-gray-600">Seamless integration with healthcare provider workflows.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Ongoing Tracking</h4>
                  <p className="text-gray-600">Long-term symptom monitoring and progress tracking capabilities.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-soft-coral/30 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Begin Your Journey?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Whether you're seeking symptom tracking or professional assessment tools, 
            SYLVIA Health provides the comprehensive support you need for menopause care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user ? (
              <>
                <Button size="lg" className="bg-soft-coral-dark hover:bg-soft-coral-dark/80 text-white" asChild>
                  <Link to="/auth">
                    <Calendar className="w-5 h-5 mr-2" />
                    Start Tracking Symptoms
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-gentle-blue-dark text-gentle-blue-dark hover:bg-gentle-blue" asChild>
                  <Link to="/auth">
                    <Stethoscope className="w-5 h-5 mr-2" />
                    Healthcare Professional Login
                  </Link>
                </Button>
              </>
            ) : userRole === 'patient' ? (
              <Button size="lg" className="bg-soft-coral-dark hover:bg-soft-coral-dark/80 text-white" asChild>
                <Link to="/symptom-tracker">
                  <Calendar className="w-5 h-5 mr-2" />
                  Continue Tracking
                </Link>
              </Button>
            ) : (
              <Button size="lg" className="bg-soft-coral-dark hover:bg-soft-coral-dark/80 text-white" asChild>
                <Link to={userRole === 'gp' ? "/gp-dashboard" : "/clinical-dashboard"}>
                  <Stethoscope className="w-5 h-5 mr-2" />
                  Access Clinical Portal
                </Link>
              </Button>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gentle-blue/20 border-t border-gentle-blue-dark/20 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 SYLVIA Health. Supporting women through their menopause journey.</p>
            <div className="mt-4 flex justify-center space-x-6 text-sm">
              <Link to="/privacy-policy" className="hover:text-soft-coral-dark">Privacy Policy</Link>
              <Link to="/instructions" className="hover:text-soft-coral-dark">Guidelines</Link>
              <Link to="/education" className="hover:text-soft-coral-dark">Education</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicHome;
