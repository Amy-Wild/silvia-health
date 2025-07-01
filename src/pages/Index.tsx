
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, Stethoscope, BookOpen, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Menopause Assessment</h1>
                <p className="text-sm text-gray-600">Supporting your health journey</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/instructions')}
              className="flex items-center"
            >
              <Info className="w-4 h-4 mr-2" />
              Instructions
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Understanding Your Menopause Journey
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            A comprehensive assessment tool designed to help you and your healthcare provider 
            better understand your symptoms and create a personalized care plan.
          </p>
        </div>

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-pink-600" />
              </div>
              <CardTitle>For Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Take a comprehensive health assessment to help your GP understand your symptoms and provide better care.
              </p>
              <Button 
                onClick={() => navigate('/assessment')}
                className="w-full bg-pink-500 hover:bg-pink-600"
              >
                Start Assessment
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Stethoscope className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>For Healthcare Providers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Create assessment sessions for patients and review detailed clinical reports with risk assessments.
              </p>
              <Button 
                onClick={() => navigate('/gp-dashboard')}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                GP Dashboard
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Learn & Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Access educational resources and support materials for understanding menopause.
              </p>
              <Button 
                onClick={() => navigate('/education')}
                variant="outline"
                className="w-full"
              >
                Educational Resources
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">
            Why Use Our Assessment Tool?
          </h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-pink-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Comprehensive</h4>
              <p className="text-gray-600">Covers all aspects of menopause symptoms and health factors</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Evidence-Based</h4>
              <p className="text-gray-600">Follows NHS NICE guidelines for menopause care</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Secure & Private</h4>
              <p className="text-gray-600">Anonymous assessments with medical-grade security</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
