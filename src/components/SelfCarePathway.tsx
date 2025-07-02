
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, BookOpen, Calendar, CheckCircle } from "lucide-react";

interface SelfCarePathwayProps {
  treatmentPreferences: string[];
  symptomLevel: 'mild' | 'moderate' | 'severe';
  onContinueToEducation: () => void;
  onBookGPAppointment?: () => void;
}

const SelfCarePathway = ({ 
  treatmentPreferences, 
  symptomLevel, 
  onContinueToEducation,
  onBookGPAppointment 
}: SelfCarePathwayProps) => {
  const getPersonalizedMessage = () => {
    if (treatmentPreferences.includes('non-hormonal')) {
      return {
        title: "Great choice exploring natural approaches",
        description: "Natural and lifestyle approaches can be very effective for managing menopause symptoms. Let's get you started with evidence-based strategies."
      };
    }
    
    if (treatmentPreferences.includes('cbt')) {
      return {
        title: "Cognitive Behavioral Therapy is an excellent option",
        description: "CBT has strong evidence for helping with menopause symptoms, particularly mood changes and hot flashes. We have resources to help you get started."
      };
    }
    
    return {
      title: "You can start managing your symptoms today",
      description: "Based on your assessment, there are several effective approaches you can try to improve how you're feeling."
    };
  };

  const message = getPersonalizedMessage();

  const getSelfCareRecommendations = () => {
    const recommendations = [];
    
    if (treatmentPreferences.includes('non-hormonal')) {
      recommendations.push({
        category: "Lifestyle Changes",
        items: [
          "Regular exercise - particularly helpful for mood and sleep",
          "Cooling strategies - fans, light clothing, cool showers",
          "Dietary adjustments - limit spicy foods, caffeine, alcohol",
          "Stress management techniques - meditation, yoga, deep breathing"
        ]
      });
      
      recommendations.push({
        category: "Natural Supplements",
        items: [
          "Learn about black cohosh and red clover",
          "Understand which supplements have evidence",
          "How to safely combine natural approaches",
          "When to check with healthcare providers"
        ]
      });
    }
    
    if (treatmentPreferences.includes('cbt')) {
      recommendations.push({
        category: "CBT Techniques",
        items: [
          "Cognitive strategies for managing hot flashes",
          "Behavioral techniques for better sleep",
          "Mood management and anxiety reduction",
          "Building resilience and coping skills"
        ]
      });
      
      recommendations.push({
        category: "Self-Help Resources",
        items: [
          "Guided CBT exercises and worksheets",
          "Mindfulness and relaxation techniques",
          "Sleep hygiene strategies",
          "Progress tracking tools"
        ]
      });
    }
    
    // Universal recommendations
    recommendations.push({
      category: "General Wellness",
      items: [
        "Understanding your menopause journey",
        "Tracking symptoms to identify patterns",
        "Building a support network",
        "When to seek additional help"
      ]
    });
    
    return recommendations;
  };

  const recommendations = getSelfCareRecommendations();

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <Card className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
        <CardContent className="p-6 text-center">
          <Heart className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">{message.title}</h2>
          <p className="text-lg opacity-90">{message.description}</p>
        </CardContent>
      </Card>

      {/* Your Action Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            Your Personalized Action Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((category, index) => (
              <div key={index} className="border-l-4 border-l-blue-500 pl-4">
                <h3 className="font-semibold text-lg mb-2">{category.category}</h3>
                <ul className="space-y-1">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-purple-600" />
            What Happens Next
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-medium">Explore Your Educational Resources</p>
                <p className="text-gray-600">Access personalized resources for your chosen approach</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-medium">Try the Strategies for 4-6 Weeks</p>
                <p className="text-gray-600">Give your chosen approaches time to work</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-medium">Track Your Progress</p>
                <p className="text-gray-600">Notice which strategies help you feel better</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                4
              </div>
              <div>
                <p className="font-medium">Consider a GP Appointment if Needed</p>
                <p className="text-gray-600">If you'd like to explore other options or have concerns</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={onContinueToEducation}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Access Your Resources
        </Button>
        
        {onBookGPAppointment && (
          <Button 
            variant="outline"
            onClick={onBookGPAppointment}
            className="flex-1"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book GP Appointment Anyway
          </Button>
        )}
      </div>

      {/* Safety Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">ℹ️</span>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Important to Remember</h4>
              <p className="text-blue-800 text-sm">
                If your symptoms worsen, you develop new symptoms, or you're concerned about anything, 
                please don't hesitate to contact your GP. You can always book an appointment for additional support.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SelfCarePathway;
