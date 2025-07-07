
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, Clock, Activity, Heart, Brain } from "lucide-react";

interface TrackerIntegrationProps {
  sessionId?: string;
  patientResults?: any;
}

const TrackerIntegration = ({ sessionId, patientResults }: TrackerIntegrationProps) => {
  const handleLinkToTracker = () => {
    // Generate link to symptom tracker with session data and recommended categories
    const recommendedCategories = generateTrackerRecommendations().map(rec => rec.category.toLowerCase().replace(/\s+/g, '-'));
    const trackerUrl = `/symptom-tracker?session=${sessionId}&source=assessment&focus=${recommendedCategories.join(',')}&patientId=${sessionId}`;
    window.open(trackerUrl, '_blank');
  };

  const generateTrackerRecommendations = () => {
    if (!patientResults?.rawData) return getDefaultRecommendations();
    
    const rawData = patientResults.rawData;
    const recommendations = [];
    
    // Vasomotor symptoms - personalized based on severity
    if (rawData.hotFlashFrequency === 'severe' || rawData.nightSweats === 'severe') {
      recommendations.push({
        category: "Hot Flashes & Night Sweats",
        reason: "Track timing, triggers, and severity to help optimize treatment and identify patterns",
        priority: "high",
        icon: <Activity className="w-4 h-4" />,
        specificGuidance: "Record frequency, intensity (1-10), duration, and potential triggers like food, stress, or temperature"
      });
    } else if (rawData.hotFlashFrequency === 'moderate' || rawData.nightSweats === 'moderate') {
      recommendations.push({
        category: "Hot Flashes & Night Sweats",
        reason: "Monitor patterns to see if symptoms are improving or worsening over time",
        priority: "medium",
        icon: <Activity className="w-4 h-4" />,
        specificGuidance: "Track daily frequency and note any lifestyle factors that might help or worsen symptoms"
      });
    }
    
    // Mood and cognitive symptoms - based on assessment responses
    if (rawData.moodSymptoms === 'severe' || rawData.cognitiveSymptoms === 'severe') {
      recommendations.push({
        category: "Mood & Cognitive Health",
        reason: "Monitor mood patterns and memory issues to distinguish menopause symptoms from other factors",
        priority: "high",
        icon: <Brain className="w-4 h-4" />,
        specificGuidance: "Rate daily mood (1-10), note memory incidents, and track sleep quality correlation"
      });
    } else if (rawData.moodSymptoms === 'moderate' || rawData.cognitiveSymptoms === 'moderate') {
      recommendations.push({
        category: "Mood & Cognitive Health",
        reason: "Track mood changes to identify patterns and potential triggers",
        priority: "medium",
        icon: <Brain className="w-4 h-4" />,
        specificGuidance: "Daily mood rating and note any brain fog or concentration difficulties"
      });
    }

    // Sleep quality tracking - if poor sleep reported
    if (rawData.sleepQuality === 'poor' || rawData.sleepQuality === 'very-poor') {
      recommendations.push({
        category: "Sleep Quality",
        reason: "Poor sleep affects all menopause symptoms - tracking can help identify improvement strategies",
        priority: "high",
        icon: <Clock className="w-4 h-4" />,
        specificGuidance: "Record bedtime, wake time, night sweats, and sleep quality rating"
      });
    }

    // Physical symptoms - if multiple reported
    if (rawData.physicalSymptoms?.length > 2) {
      recommendations.push({
        category: "Physical Symptoms",
        reason: "Track various physical symptoms to show your GP the full picture of your experience",
        priority: "medium",
        icon: <Heart className="w-4 h-4" />,
        specificGuidance: "Note daily energy levels, joint pain, headaches, and other physical symptoms"
      });
    }

    // Cycle tracking for perimenopause
    if (rawData.menstrualStatus === 'irregular' || rawData.menstrualStatus === 'regular') {
      recommendations.push({
        category: "Menstrual Cycle",
        reason: "Track cycle changes to help your GP understand your perimenopause stage",
        priority: "high",
        icon: <Calendar className="w-4 h-4" />,
        specificGuidance: "Record cycle length, flow changes, and cycle-related symptoms"
      });
    }

    return recommendations.length > 0 ? recommendations : getDefaultRecommendations();
  };

  const getDefaultRecommendations = () => [
    {
      category: "General Symptoms",
      reason: "Track your daily symptoms to help your GP understand your experience",
      priority: "medium",
      icon: <Heart className="w-4 h-4" />,
      specificGuidance: "Record daily symptoms and their impact on your quality of life"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-amber-500 text-white';
      default: return 'bg-blue-500 text-white';
    }
  };

  const recommendations = generateTrackerRecommendations();

  return (
    <div className="space-y-4">
      <Card className="border-[#ede9fe] bg-[#ede9fe]">
        <CardHeader>
          <CardTitle className="flex items-center text-[#425563]">
            <TrendingUp className="w-5 h-5 mr-2" />
            Continue Your Journey with Symptom Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-[#425563]">
            Based on your assessment results, ongoing symptom tracking can help you and your GP 
            monitor treatment effectiveness and identify patterns that matter to your care.
          </p>
          
          {/* Personalized Tracking Recommendations */}
          <div className="space-y-2">
            <h4 className="font-semibold text-[#425563]">Recommended for you to track:</h4>
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div key={index} className="bg-white p-4 rounded border-l-4 border-[#425563]">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-1 bg-[#425563] rounded text-white">
                        {rec.icon}
                      </div>
                      <span className="font-medium text-[#425563]">{rec.category}</span>
                    </div>
                    <Badge className={getPriorityColor(rec.priority)}>
                      {rec.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-[#425563] mb-2">{rec.reason}</p>
                  <p className="text-xs text-[#425563] opacity-80 italic">
                    💡 {rec.specificGuidance}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleLinkToTracker}
              className="flex-1 bg-[#425563] hover:bg-[#425563]/90"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Start Symptom Tracking
            </Button>
            
            <Button 
              variant="outline"
              className="flex-1 border-[#425563] text-[#425563] hover:bg-[#425563] hover:text-white"
              onClick={() => window.open('/education?focus=symptom-tracking', '_blank')}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Learn About Tracking
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrackerIntegration;
