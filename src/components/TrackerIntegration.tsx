
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar } from "lucide-react";

interface TrackerIntegrationProps {
  sessionId?: string;
  patientResults?: any;
}

const TrackerIntegration = ({ sessionId, patientResults }: TrackerIntegrationProps) => {
  const handleLinkToTracker = () => {
    // Generate link to educational website symptom tracker with session data
    const trackerUrl = `https://silvia-education.com/symptom-tracker?session=${sessionId}&source=assessment`;
    window.open(trackerUrl, '_blank');
  };

  const generateTrackerRecommendations = () => {
    if (!patientResults) return [];
    
    const recommendations = [];
    
    // Recommend tracking based on assessment results
    if (patientResults.clinicalSummary?.vasomotor?.severity !== 'None') {
      recommendations.push({
        category: "Hot Flashes & Night Sweats",
        reason: "Track patterns to identify triggers and optimize treatment timing",
        priority: "high"
      });
    }
    
    if (patientResults.clinicalSummary?.psychological?.severity !== 'None') {
      recommendations.push({
        category: "Mood & Cognitive Symptoms", 
        reason: "Monitor patterns to distinguish menopause symptoms from other factors",
        priority: "medium"
      });
    }
    
    return recommendations;
  };

  return (
    <div className="space-y-4">
      {/* Tracker Integration Card */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center text-purple-800">
            <TrendingUp className="w-5 h-5 mr-2" />
            Continue Your Journey with Symptom Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-purple-700">
            Based on your assessment results, ongoing symptom tracking can help you and your GP 
            monitor treatment effectiveness and identify patterns.
          </p>
          
          {/* Personalized Tracking Recommendations */}
          {generateTrackerRecommendations().length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-purple-800">Recommended for you to track:</h4>
              <div className="space-y-2">
                {generateTrackerRecommendations().map((rec, index) => (
                  <div key={index} className="bg-white p-3 rounded border-l-4 border-purple-500">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-medium text-purple-800">{rec.category}</span>
                        <p className="text-sm text-purple-600 mt-1">{rec.reason}</p>
                      </div>
                      <Badge className={rec.priority === 'high' ? 'bg-red-500' : 'bg-blue-500'}>
                        {rec.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleLinkToTracker}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Start Symptom Tracking
            </Button>
            
            <Button 
              variant="outline"
              className="flex-1 border-purple-300 text-purple-700"
              onClick={() => window.open('/education/symptom-tracking-guide', '_blank')}
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
