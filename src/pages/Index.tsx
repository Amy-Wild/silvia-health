
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Shield, Users, BookOpen, FileText, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: "Clinical Assessment",
      description: "Evidence-based symptom triage with red flag detection",
      color: "bg-red-50 text-red-600"
    },
    {
      icon: FileText,
      title: "Dual Reporting",
      description: "Clinical reports for GPs and patient summaries",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: BookOpen,
      title: "Education Hub",
      description: "Video library and educational resources",
      color: "bg-green-50 text-green-600"
    },
    {
      icon: Users,
      title: "Partner Zone",
      description: "Support guidance for partners and family",
      color: "bg-purple-50 text-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white border-b border-blue-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">NHS Menopause Triage</h1>
                <p className="text-sm text-gray-600">Professional Assessment Tool</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              NHS Compatible
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Comprehensive Perimenopause & Menopause 
            <span className="text-blue-600"> Assessment Platform</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Evidence-based triage tool designed for NHS GPs to assess symptoms, 
            identify red flags, and empower women with knowledge and advocacy tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/assessment')}
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            >
              Start Assessment
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              onClick={() => navigate('/education')}
              variant="outline" 
              size="lg"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3"
            >
              Education Hub
            </Button>
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
        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0">
          <CardContent className="p-12 text-center">
            <h3 className="text-3xl font-bold mb-6">Ready to Transform Patient Care?</h3>
            <p className="text-xl mb-8 opacity-90">
              Join the healthcare professionals already using our evidence-based assessment tools
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/assessment')}
                size="lg" 
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3"
              >
                Begin Patient Assessment
              </Button>
              <Button 
                onClick={() => navigate('/partner-zone')}
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3"
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
              © 2024 NHS Menopause Triage Tool. Designed for healthcare professionals.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Evidence-based • Clinically Validated • NHS Compatible
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
