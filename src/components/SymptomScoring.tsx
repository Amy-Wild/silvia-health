
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Thermometer, Heart, Brain, Moon, Zap } from "lucide-react";

interface SymptomScore {
  name: string;
  score: number;
  severity: string;
  description: string;
  category: 'vasomotor' | 'physical' | 'psychological' | 'sleep' | 'sexual';
}

interface SymptomScoringProps {
  symptoms: SymptomScore[];
}

const SymptomScoring = ({ symptoms }: SymptomScoringProps) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'vasomotor': return <Thermometer className="w-5 h-5 text-red-500" />;
      case 'physical': return <Heart className="w-5 h-5 text-blue-500" />;
      case 'psychological': return <Brain className="w-5 h-5 text-purple-500" />;
      case 'sleep': return <Moon className="w-5 h-5 text-indigo-500" />;
      case 'sexual': return <Zap className="w-5 h-5 text-pink-500" />;
      default: return <Heart className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (score: number) => {
    if (score >= 8) return "bg-red-500";
    if (score >= 6) return "bg-orange-500";
    if (score >= 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Symptom Assessment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {symptoms.map((symptom, index) => (
            <div key={index} className="border-l-4 border-gray-200 pl-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(symptom.category)}
                  <h4 className="font-semibold">{symptom.name}</h4>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={`${getSeverityColor(symptom.score)} text-white`}>
                    {symptom.score}/10
                  </Badge>
                  <Badge variant="outline">{symptom.severity}</Badge>
                </div>
              </div>
              <Progress value={symptom.score * 10} className="mb-2" />
              <p className="text-sm text-gray-600">{symptom.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SymptomScoring;
