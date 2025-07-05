
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ExternalLink, Lightbulb, Heart, Brain, Moon, Thermometer } from "lucide-react";

const TrackerEducation = () => {
  const educationalContent = [
    {
      category: "Hot Flashes & Night Sweats",
      icon: Thermometer,
      color: "text-red-500",
      articles: [
        {
          title: "Understanding Hot Flash Triggers",
          description: "Learn about common triggers and how to identify your personal patterns.",
          readTime: "5 min read",
          level: "Beginner"
        },
        {
          title: "Cooling Strategies That Actually Work",
          description: "Evidence-based approaches to managing heat symptoms.",
          readTime: "7 min read",
          level: "Intermediate"
        }
      ]
    },
    {
      category: "Sleep & Rest",
      icon: Moon,
      color: "text-indigo-500",
      articles: [
        {
          title: "Sleep Hygiene During Menopause",
          description: "Create the perfect environment for better sleep quality.",
          readTime: "6 min read",
          level: "Beginner"
        },
        {
          title: "When Night Sweats Disrupt Sleep",
          description: "Practical solutions for staying cool and comfortable at night.",
          readTime: "8 min read",
          level: "Intermediate"
        }
      ]
    },
    {
      category: "Mood & Memory",
      icon: Brain,
      color: "text-purple-500",
      articles: [
        {
          title: "Brain Fog: What's Really Happening",
          description: "The science behind cognitive changes during menopause.",
          readTime: "10 min read",
          level: "Intermediate"
        },
        {
          title: "Managing Mood Swings Naturally",
          description: "Techniques for emotional regulation without medication.",
          readTime: "9 min read",
          level: "Beginner"
        }
      ]
    },
    {
      category: "Physical Health",
      icon: Heart,
      color: "text-blue-500",
      articles: [
        {
          title: "Joint Pain and Menopause",
          description: "Why joints ache more and what you can do about it.",
          readTime: "7 min read",
          level: "Intermediate"
        },
        {
          title: "Energy Levels and Fatigue",
          description: "Understanding and combating menopause-related tiredness.",
          readTime: "6 min read",
          level: "Beginner"
        }
      ]
    }
  ];

  const trackingTips = [
    {
      title: "Be Consistent",
      description: "Track at the same time each day for the most accurate patterns.",
      icon: "🕐"
    },
    {
      title: "Note Everything",
      description: "Small details like weather, meals, or stress can reveal important triggers.",
      icon: "📝"
    },
    {
      title: "Look for Patterns",
      description: "Weekly and monthly patterns can be just as important as daily ones.",
      icon: "📊"
    },
    {
      title: "Share with Your GP",
      description: "Your tracking data helps your doctor make better treatment decisions.",
      icon: "👩‍⚕️"
    }
  ];

  const handleArticleClick = (title: string) => {
    // In a real app, this would navigate to the full article
    console.log(`Opening article: ${title}`);
    alert(`This would open the article: "${title}"`);
  };

  return (
    <div className="space-y-6">
      {/* Tracking Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
            Tracking Tips for Better Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trackingTips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-2xl">{tip.icon}</span>
                <div>
                  <h4 className="font-semibold mb-1">{tip.title}</h4>
                  <p className="text-sm text-gray-600">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Educational Content by Category */}
      {educationalContent.map((category, categoryIndex) => (
        <Card key={categoryIndex}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <category.icon className={`w-5 h-5 mr-2 ${category.color}`} />
              {category.category}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.articles.map((article, articleIndex) => (
                <div key={articleIndex} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{article.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {article.level}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{article.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{article.readTime}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleArticleClick(article.title)}
                    >
                      <BookOpen className="w-3 h-3 mr-1" />
                      Read
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Additional Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ExternalLink className="w-5 h-5 mr-2 text-green-500" />
            Additional Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-semibold text-blue-800 mb-2">Preparing for Your GP Appointment</h4>
              <p className="text-sm text-blue-700 mb-3">
                Use your tracking data to have more productive conversations with your healthcare provider.
              </p>
              <Button variant="outline" size="sm" className="border-blue-300 text-blue-700">
                <BookOpen className="w-3 h-3 mr-1" />
                View Guide
              </Button>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
              <h4 className="font-semibold text-purple-800 mb-2">Understanding Your Patterns</h4>
              <p className="text-sm text-purple-700 mb-3">
                Learn how to interpret your symptom data and identify meaningful trends.
              </p>
              <Button variant="outline" size="sm" className="border-purple-300 text-purple-700">
                <BookOpen className="w-3 h-3 mr-1" />
                Learn More
              </Button>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <h4 className="font-semibold text-green-800 mb-2">Lifestyle Modifications</h4>
              <p className="text-sm text-green-700 mb-3">
                Evidence-based lifestyle changes that can help reduce symptom severity.
              </p>
              <Button variant="outline" size="sm" className="border-green-300 text-green-700">
                <BookOpen className="w-3 h-3 mr-1" />
                Explore Options
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrackerEducation;
