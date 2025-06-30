
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Shield, Users, BookOpen, FileText, ChevronRight, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: "Anonymous Assessment",
      description: "Secure UUID-based patient assessments with no login required",
      color: "bg-red-50 text-red-600"
    },
    {
      icon: FileText,
      title: "Dual Reporting",
      description: "Clinical dashboards for GPs and patient-friendly summaries",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: BookOpen,
      title: "NICE Compliant",
      description: "Follows NG23 guidelines with red flag detection",
      color: "bg-green-50 text-green-600"
    },
    {
      icon: Users,
      title: "Partner Support",
      description: "Education and guidance for partners and family",
      color: "bg-purple-50 text-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white border-b border-blue-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Menopause Assessment Tool</h1>
                <p className="text-sm text-gray-600">Patient-First Healthcare Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                NICE NG23 Compliant
              </Badge>
              <Button 
                onClick={() => navigate('/gp-dashboard')}
                variant="outline"
                className="flex items-center"
              >
                <Stethoscope className="w-4 h-4 mr-2" />
                GP Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Empowering Women Through 
            <span className="text-pink-600"> Menopause</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            A patient-centered assessment platform that enables GPs to send secure, anonymous assessment links to patients, providing comprehensive menopause support and NICE-compliant clinical insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/gp-dashboard')}
              size="lg" 
              className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3"
            >
              GP Dashboard
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              onClick={() => navigate('/education')}
              variant="outline" 
              size="lg"
              className="border-pink-500 text-pink-600 hover:bg-pink-50 px-8 py-3"
            >
              Patient Education
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16 bg-white rounded-lg mx-4 shadow-sm">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h3>
          <p className="text-lg text-gray-600">Simple, secure, and effective</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-pink-600">1</span>
            </div>
            <h4 className="text-lg font-semibold mb-2">GP Creates Assessment</h4>
            <p className="text-gray-600">GP generates a secure, anonymous assessment link in seconds</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">2</span>
            </div>
            <h4 className="text-lg font-semibold mb-2">Patient Completes Assessment</h4>
            <p className="text-gray-600">Patient completes comprehensive health assessment at home</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-green-600">3</span>
            </div>
            <h4 className="text-lg font-semibold mb-2">GP Reviews Results</h4>
            <p className="text-gray-600">GP receives clinical report with risk flags and recommendations</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Comprehensive Care Platform</h3>
          <p className="text-lg text-gray-600">Supporting both healthcare professionals and patients</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 rounded-full ${feature.color} flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0">
          <CardContent className="p-12 text-center">
            <h3 className="text-3xl font-bold mb-6">Ready to Transform Patient Care?</h3>
            <p className="text-xl mb-8 opacity-90">
              Join healthcare professionals using our evidence-based, patient-centered assessment platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/gp-dashboard')}
                size="lg" 
                variant="secondary"
                className="bg-white text-pink-600 hover:bg-gray-100 px-8 py-3"
              >
                Start Using GP Dashboard
              </Button>
              <Button 
                onClick={() => navigate('/partner-zone')}
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-pink-600 px-8 py-3"
              >
                Partner Support Zone
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2024 Menopause Assessment Tool. Patient-centered healthcare technology.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              NICE NG23 Compliant • Anonymous & Secure • Evidence-Based
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
