import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Heart, Brain, Target, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const faqData = [
    {
      question: "What is perimenopause?",
      answer: "Perimenopause is the transitional time leading up to menopause. During this time, your ovaries gradually begin to produce less estrogen."
    },
    {
      question: "What are common symptoms of menopause?",
      answer: "Common symptoms include hot flashes, night sweats, mood changes, sleep disturbances, vaginal dryness, and changes in libido."
    },
    {
      question: "How long does menopause last?",
      answer: "Menopause is defined as the point when you have not had a period for 12 consecutive months. The menopausal transition can last for several years."
    },
    {
      question: "What treatments are available for menopause symptoms?",
      answer: "Treatment options include hormone therapy, non-hormonal medications, lifestyle changes, and complementary therapies."
    },
    {
      question: "When should I see a doctor about menopause?",
      answer: "You should see a doctor if your symptoms are bothersome, affecting your quality of life, or if you have concerns about your health."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Menopause Support</h1>
                <p className="text-sm text-gray-600 hidden sm:block">Educational resources and support</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Button variant="ghost" onClick={() => navigate('/education')} className="text-gray-700 hover:text-pink-600">
                Education
              </Button>
              <Button variant="ghost" onClick={() => navigate('/partner-zone')} className="text-gray-700 hover:text-pink-600">
                Partner Zone
              </Button>
              <Button variant="outline" onClick={() => navigate('/gp-dashboard')} className="border-pink-200 text-pink-700 hover:bg-pink-50">
                GP Portal
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section - Updated messaging */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Badge className="bg-pink-100 text-pink-800 border-pink-200 mb-4">
              NHS-Approved Educational Resources
            </Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Understanding Your 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600"> Menopause Journey</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Evidence-based educational resources, self-help tools, and support to help you navigate 
              perimenopause and menopause with confidence. Empowering you with knowledge for informed 
              healthcare conversations.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              onClick={() => navigate('/education')}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Explore Educational Resources
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/partner-zone')}
              className="border-pink-200 text-pink-700 hover:bg-pink-50 px-8 py-3"
            >
              <Users className="w-5 h-5 mr-2" />
              Support for Partners
            </Button>
          </div>

          {/* Key Benefits */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-white/70 backdrop-blur-sm border-pink-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Evidence-Based Learning</h3>
                <p className="text-gray-600">NHS-approved educational content based on the latest clinical research and guidelines.</p>
              </CardContent>
            </Card>
            <Card className="bg-white/70 backdrop-blur-sm border-pink-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Personalized Support</h3>
                <p className="text-gray-600">Tailored resources and guidance based on your specific needs and preferences.</p>
              </CardContent>
            </Card>
            <Card className="bg-white/70 backdrop-blur-sm border-pink-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Holistic Wellness</h3>
                <p className="text-gray-600">Comprehensive approach including lifestyle, mental health, and treatment options.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works - Updated for educational focus */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Your Path to Understanding Menopause
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-pink-500 rounded-full text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Learn & Understand</h3>
                <p className="text-gray-600">Access comprehensive educational resources about menopause symptoms, treatments, and lifestyle approaches.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Track & Monitor</h3>
                <p className="text-gray-600">Use our tools to track symptoms and understand patterns to discuss with your healthcare provider.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Take Action</h3>
                <p className="text-gray-600">Apply evidence-based strategies and have informed conversations with your GP about your care.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Explore Our Resources</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-white/70 backdrop-blur-sm border-pink-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Educational Articles</h3>
                <p className="text-gray-600">In-depth articles covering various aspects of perimenopause and menopause.</p>
                <Button variant="link" className="mt-4">
                  Learn More
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-white/70 backdrop-blur-sm border-pink-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Symptom Tracker</h3>
                <p className="text-gray-600">Track your symptoms to identify patterns and discuss them with your healthcare provider.</p>
                <Button variant="link" className="mt-4">
                  Start Tracking
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-white/70 backdrop-blur-sm border-pink-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Treatment Options</h3>
                <p className="text-gray-600">Explore different treatment options available for managing menopause symptoms.</p>
                <Button variant="link" className="mt-4">
                  View Options
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-white/70 backdrop-blur-sm border-pink-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Lifestyle Tips</h3>
                <p className="text-gray-600">Discover lifestyle changes that can help alleviate menopause symptoms.</p>
                <Button variant="link" className="mt-4">
                  Explore Tips
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-white/70 backdrop-blur-sm border-pink-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Partner Resources</h3>
                <p className="text-gray-600">Resources and support for partners to understand and support women through menopause.</p>
                <Button variant="link" className="mt-4">
                  Learn More
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-white/70 backdrop-blur-sm border-pink-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">FAQ</h3>
                <p className="text-gray-600">Answers to frequently asked questions about perimenopause and menopause.</p>
                <Button variant="link" className="mt-4">
                  Read FAQs
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqData.map((item, index) => (
                <Card key={index} className="bg-white/70 backdrop-blur-sm border-pink-100 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.question}</h3>
                    <p className="text-gray-600">{item.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GP Portal Notice */}
      <section className="bg-blue-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center mb-4">
              <ShieldCheck className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-blue-900">Healthcare Professionals</h2>
            </div>
            <p className="text-blue-800 mb-6">
              Access our secure GP portal for patient assessment tools, clinical decision support, 
              and intelligent triage to optimize menopause care delivery.
            </p>
            <Button 
              onClick={() => navigate('/gp-dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Access GP Portal
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-pink-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Menopause Support. All rights reserved.
            </p>
            <nav className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-pink-600">
                Terms of Service
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-pink-600">
                Privacy Policy
              </Button>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
