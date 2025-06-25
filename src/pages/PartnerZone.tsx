
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, MessageCircle, BookOpen, ArrowLeft, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PartnerZone = () => {
  const navigate = useNavigate();

  const supportStrategies = [
    {
      title: "Listen Without Trying to Fix",
      description: "Sometimes she just needs to be heard and validated, not offered solutions.",
      icon: MessageCircle
    },
    {
      title: "Learn About the Symptoms",
      description: "Understanding what she's experiencing helps you provide better support.",
      icon: BookOpen
    },
    {
      title: "Be Patient with Mood Changes",
      description: "Hormonal fluctuations can cause emotional ups and downs that aren't in her control.",
      icon: Heart
    },
    {
      title: "Support Lifestyle Changes",
      description: "Join her in healthy habits like exercise, good nutrition, and stress management.",
      icon: Lightbulb
    }
  ];

  const commonChallenges = [
    {
      challenge: "Sleep Disruption",
      impact: "Night sweats and insomnia affect both partners",
      support: "Consider separate bedding, room temperature control, and patience with sleep patterns"
    },
    {
      challenge: "Mood Changes",
      impact: "Irritability, anxiety, and depression can strain relationships",
      support: "Remain calm, avoid taking things personally, and encourage professional help if needed"
    },
    {
      challenge: "Physical Intimacy",
      impact: "Changes in libido and physical comfort can affect relationships",
      support: "Open communication, patience, and exploring alternative forms of intimacy"
    },
    {
      challenge: "Social Situations",
      impact: "Hot flashes and mood changes may make social events challenging",
      support: "Have exit strategies, carry fans/cooling items, and be understanding about event attendance"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              Partner Support
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Partner Support Zone
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A dedicated space for partners, family, and friends to understand perimenopause 
              and menopause, and learn how to provide meaningful support during this important life transition.
            </p>
          </div>

          {/* Support Strategies */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How to Support Your Partner</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {supportStrategies.map((strategy, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <strategy.icon className="w-6 h-6 text-purple-600" />
                    </div>
                    <CardTitle className="text-lg">{strategy.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {strategy.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Common Challenges */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Understanding Common Challenges</h2>
            <div className="space-y-6">
              {commonChallenges.map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <h3 className="font-semibold text-lg text-purple-700 mb-2">{item.challenge}</h3>
                        <p className="text-gray-600 text-sm">{item.impact}</p>
                      </div>
                      <div className="md:col-span-2">
                        <h4 className="font-medium text-gray-900 mb-2">How You Can Help:</h4>
                        <p className="text-gray-700">{item.support}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Educational Resources */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Educational Resources for Partners</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">What Is Perimenopause?</CardTitle>
                  <CardDescription>Understanding the transition phase and its symptoms</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Watch Video (8:30)
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">Supporting Mental Health</CardTitle>
                  <CardDescription>How to help with mood changes and emotional support</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Watch Video (12:15)
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">Relationship & Intimacy</CardTitle>
                  <CardDescription>Maintaining connection during hormonal changes</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Watch Video (10:45)
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Quick Tips */}
          <section>
            <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Quick Support Tips</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Do:</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Ask how you can help</li>
                      <li>• Be patient with temperature preferences</li>
                      <li>• Offer to attend medical appointments</li>
                      <li>• Celebrate small victories</li>
                      <li>• Research treatment options together</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Don't:</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Dismiss symptoms as "just hormones"</li>
                      <li>• Take mood changes personally</li>
                      <li>• Assume you know what's best</li>
                      <li>• Compare to other women's experiences</li>
                      <li>• Make decisions about her health</li>
                    </ul>
                  </div>
                </div>
                <div className="text-center mt-8">
                  <Button 
                    onClick={() => navigate('/education')}
                    size="lg" 
                    variant="secondary"
                    className="bg-white text-purple-600 hover:bg-gray-100"
                  >
                    Explore Full Education Hub
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PartnerZone;
