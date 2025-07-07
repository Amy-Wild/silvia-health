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
    // Direct patients to homepage where they can learn about SYLVIA and sign up if interested
    const homeUrl = `/?source=assessment&session=${sessionId}&focus=symptom-tracking`;
    window.open(homeUrl, '_blank');
  };

  const generateTrackerRecommendations = () => {
    if (!patientResults?.rawData) return getDefaultRecommendations();
    
    const rawData = patientResults.rawData;
    const recommendations = [];
    
    // Enhanced personalization based on specific assessment responses
    
    // Vasomotor symptoms - highly detailed based on frequency and severity
    if (rawData.hotFlashFrequency === 'daily' || rawData.hotFlashFrequency === 'multiple-daily') {
      recommendations.push({
        category: "Hot Flashes & Night Sweats",
        reason: "With daily hot flashes, tracking timing, triggers, and patterns can help optimize treatment and identify what helps most",
        priority: "high",
        icon: <Activity className="w-4 h-4" />,
        specificGuidance: "Record time of day, intensity (1-10), duration, potential triggers (food, stress, temperature), and what helps you cope"
      });
    } else if (rawData.hotFlashFrequency === 'weekly' || rawData.nightSweats === 'frequent') {
      recommendations.push({
        category: "Hot Flashes & Night Sweats", 
        reason: "Regular tracking can help identify patterns and show your GP how symptoms change over time",
        priority: "medium",
        icon: <Activity className="w-4 h-4" />,
        specificGuidance: "Note frequency, severity, and any lifestyle factors that seem to help or worsen symptoms"
      });
    }

    // Sleep quality - enhanced based on specific sleep issues
    if (rawData.sleepQuality === 'poor' || rawData.sleepQuality === 'very-poor') {
      recommendations.push({
        category: "Sleep Quality & Night Symptoms",
        reason: "Poor sleep affects all menopause symptoms - detailed tracking can identify specific sleep disruptors",
        priority: "high", 
        icon: <Clock className="w-4 h-4" />,
        specificGuidance: "Record bedtime, wake times, night sweats, bathroom visits, and morning energy levels"
      });
    } else if (rawData.sleepDisturbances?.includes('frequent-waking') || rawData.sleepDisturbances?.includes('early-waking')) {
      recommendations.push({
        category: "Sleep Patterns",
        reason: "Tracking sleep disruption patterns can help identify specific issues to address",
        priority: "medium",
        icon: <Clock className="w-4 h-4" />,
        specificGuidance: "Note what wakes you up, how often, and how you feel in the morning"
      });
    }
    
    // Mood and cognitive symptoms - detailed based on severity and type
    if (rawData.moodChanges === 'severe' || rawData.anxietyLevels === 'severe' || rawData.memoryIssues === 'frequent') {
      recommendations.push({
        category: "Mood & Cognitive Health",
        reason: "Tracking mood and memory patterns helps distinguish menopause symptoms from other factors and shows treatment progress",
        priority: "high",
        icon: <Brain className="w-4 h-4" />,
        specificGuidance: "Daily mood rating (1-10), specific memory incidents, anxiety triggers, and correlation with other symptoms"
      });
    } else if (rawData.moodChanges === 'moderate' || rawData.memoryIssues === 'occasional') {
      recommendations.push({
        category: "Mood & Memory Tracking",
        reason: "Monitor changes to see if symptoms improve with time or treatment",
        priority: "medium", 
        icon: <Brain className="w-4 h-4" />,
        specificGuidance: "Weekly mood check-ins and note any 'brain fog' episodes or concentration difficulties"
      });
    }

    // Physical symptoms - based on specific reported symptoms
    if (rawData.jointPain === 'severe' || rawData.headaches === 'frequent' || rawData.fatigue === 'severe') {
      recommendations.push({
        category: "Physical Symptoms",
        reason: "Tracking severe physical symptoms helps your GP understand the full impact on your daily life",
        priority: "high",
        icon: <Heart className="w-4 h-4" />,
        specificGuidance: "Rate daily energy levels, joint stiffness (morning vs evening), headache triggers, and activity limitations"
      });
    } else if (rawData.energyLevels === 'low' || rawData.physicalSymptoms?.length > 2) {
      recommendations.push({
        category: "Energy & Physical Wellbeing",
        reason: "Monitor how physical symptoms change with different activities and treatments",
        priority: "medium",
        icon: <Heart className="w-4 h-4" />,
        specificGuidance: "Track energy levels, physical activity, and how symptoms affect daily tasks"
      });
    }

    // Menstrual cycle tracking - enhanced for perimenopause
    if (rawData.menstrualStatus === 'irregular' || rawData.menstrualStatus === 'skipping-periods') {
      recommendations.push({
        category: "Menstrual Cycle Changes",
        reason: "Irregular periods in perimenopause - tracking helps your GP understand your transition stage",
        priority: "high",
        icon: <Calendar className="w-4 h-4" />,
        specificGuidance: "Record cycle length, flow changes, spotting, and how symptoms vary with cycle"
      });
    } else if (rawData.menstrualStatus === 'regular-but-changing') {
      recommendations.push({
        category: "Cycle Monitoring", 
        reason: "Track subtle changes that can help predict perimenopause progression",
        priority: "medium",
        icon: <Calendar className="w-4 h-4" />,
        specificGuidance: "Note any changes in flow, duration, or cycle-related symptoms"
      });
    }

    // Treatment tracking - if patient is interested in or using treatments
    if (rawData.currentTreatments?.length > 0 || rawData.treatmentPreferences?.includes('hrt')) {
      recommendations.push({
        category: "Treatment Response",
        reason: "Track how treatments are working to help optimize your care plan",
        priority: "high", 
        icon: <TrendingUp className="w-4 h-4" />,
        specificGuidance: "Note treatment timing, side effects, symptom improvements, and any concerns"
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

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>New to SYLVIA?</strong> You'll be taken to our homepage where you can learn about our 
              symptom tracking platform and sign up if you'd like to start monitoring your symptoms.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleLinkToTracker}
              className="flex-1 bg-[#425563] hover:bg-[#425563]/90"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Explore Symptom Tracking
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
