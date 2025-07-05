
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Heart } from "lucide-react";

interface Step5MentalHealthProps {
  data: any;
  onUpdate: (key: string, value: any) => void;
}

const Step5MentalHealth = ({ data, onUpdate }: Step5MentalHealthProps) => {
  return (
    <div className="space-y-6">
      {/* Mood & Memory Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Mood & Memory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium mb-3 block">
              Have you experienced changes in your mood recently?
            </Label>
            <RadioGroup 
              value={data.moodSymptoms || ""} 
              onValueChange={(value) => onUpdate("moodSymptoms", value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="mood-none" />
                <Label htmlFor="mood-none">No changes in mood</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mild" id="mood-mild" />
                <Label htmlFor="mood-mild">Mild mood changes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moderate" id="mood-moderate" />
                <Label htmlFor="mood-moderate">Moderate mood swings or irritability</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="severe" id="mood-severe" />
                <Label htmlFor="mood-severe">Severe mood changes affecting daily life</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-medium mb-3 block">
              Do you experience any cognitive symptoms (memory, concentration)?
            </Label>
            <RadioGroup 
              value={data.cognitiveSymptoms || ""} 
              onValueChange={(value) => onUpdate("cognitiveSymptoms", value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="cognitive-none" />
                <Label htmlFor="cognitive-none">No cognitive changes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mild" id="cognitive-mild" />
                <Label htmlFor="cognitive-mild">Mild forgetfulness or concentration issues</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moderate" id="cognitive-moderate" />
                <Label htmlFor="cognitive-moderate">Noticeable memory or concentration problems</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="severe" id="cognitive-severe" />
                <Label htmlFor="cognitive-severe">Significant cognitive difficulties</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-medium mb-3 block">
              How much do your mood changes impact your daily activities?
            </Label>
            <RadioGroup 
              value={data.moodImpact || ""} 
              onValueChange={(value) => onUpdate("moodImpact", value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="impact-none" />
                <Label htmlFor="impact-none">No impact on daily life</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mild" id="impact-mild" />
                <Label htmlFor="impact-mild">Slight impact, but manageable</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moderate" id="impact-moderate" />
                <Label htmlFor="impact-moderate">Moderate impact on work or relationships</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="severe" id="impact-severe" />
                <Label htmlFor="impact-severe">Severe impact on most activities</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Mental Health Safety Screening */}
      <Card className="border-l-4 border-blue-500 bg-blue-50">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Heart className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-blue-800">Mental Health & Wellbeing</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-white p-4 rounded-lg border">
            <Label className="text-base font-medium mb-3 block">
              In the past few weeks, have you had thoughts of harming yourself or ending your life?
            </Label>
            <RadioGroup 
              value={data.selfHarmRisk || ""} 
              onValueChange={(value) => onUpdate("selfHarmRisk", value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="selfharm-no" />
                <Label htmlFor="selfharm-no">No, I have not had these thoughts</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="occasional" id="selfharm-occasional" />
                <Label htmlFor="selfharm-occasional">I have had some passing thoughts</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="frequent" id="selfharm-frequent" />
                <Label htmlFor="selfharm-frequent">Yes, I have had these thoughts frequently</Label>
              </div>
            </RadioGroup>
          </div>

          {(data.selfHarmRisk === "occasional" || data.selfHarmRisk === "frequent") && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-red-800 font-medium">Important Support Information</p>
                  <p className="text-red-700 text-sm mt-1">
                    If you're having thoughts of self-harm, please reach out for support:
                  </p>
                  <ul className="text-red-700 text-sm mt-2 space-y-1">
                    <li>• Samaritans: 116 123 (free, 24/7)</li>
                    <li>• Crisis Text Line: Text SHOUT to 85258</li>
                    <li>• Contact your GP immediately</li>
                    <li>• Go to A&E if you're in immediate danger</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div>
            <Label className="text-base font-medium mb-3 block">
              How would you rate your overall mental wellbeing currently?
            </Label>
            <RadioGroup 
              value={data.mentalWellbeing || ""} 
              onValueChange={(value) => onUpdate("mentalWellbeing", value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excellent" id="wellbeing-excellent" />
                <Label htmlFor="wellbeing-excellent">Excellent - feeling very positive</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="good" id="wellbeing-good" />
                <Label htmlFor="wellbeing-good">Good - generally feeling well</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fair" id="wellbeing-fair" />
                <Label htmlFor="wellbeing-fair">Fair - ups and downs</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="poor" id="wellbeing-poor" />
                <Label htmlFor="wellbeing-poor">Poor - struggling most days</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Step5MentalHealth;
