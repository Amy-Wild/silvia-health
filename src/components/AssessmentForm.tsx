
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Info } from "lucide-react";

interface AssessmentFormProps {
  step: number;
  data: any;
  onDataChange: (data: any) => void;
  onRiskChange: (risk: string) => void;
}

const AssessmentForm = ({ step, data, onDataChange, onRiskChange }: AssessmentFormProps) => {
  const [formData, setFormData] = useState(data);

  const updateData = (key: string, value: any) => {
    const newData = { ...formData, [key]: value };
    setFormData(newData);
    onDataChange(newData);
    
    // Basic risk assessment logic
    assessRisk(newData);
  };

  const assessRisk = (data: any) => {
    // Red flag conditions
    const redFlags = [
      data.postmenopausalBleeding === "yes",
      data.severeHeadaches === "yes",
      data.chestPain === "yes",
      data.suicidalThoughts === "yes",
      data.bonePain === "severe"
    ];

    if (redFlags.some(flag => flag)) {
      onRiskChange("red");
    } else if (data.symptomSeverity === "severe" || data.qualityOfLifeImpact === "severe") {
      onRiskChange("amber");
    } else {
      onRiskChange("green");
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium mb-4">Patient Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age || ""}
                  onChange={(e) => updateData("age", e.target.value)}
                  placeholder="Patient age"
                />
              </div>
              <div>
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  value={formData.occupation || ""}
                  onChange={(e) => updateData("occupation", e.target.value)}
                  placeholder="Patient occupation"
                />
              </div>
            </div>
            <div>
              <Label>Primary concern today</Label>
              <Textarea
                value={formData.primaryConcern || ""}
                onChange={(e) => updateData("primaryConcern", e.target.value)}
                placeholder="What is the main reason for this assessment?"
                className="mt-2"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium mb-4">Menstrual History</h3>
            
            <div>
              <Label>Current menstrual status</Label>
              <RadioGroup
                value={formData.menstrualStatus}
                onValueChange={(value) => updateData("menstrualStatus", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="regular" id="regular" />
                  <Label htmlFor="regular">Regular periods</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="irregular" id="irregular" />
                  <Label htmlFor="irregular">Irregular periods</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="stopped" id="stopped" />
                  <Label htmlFor="stopped">Periods have stopped</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>If periods have stopped, how long ago?</Label>
              <Select onValueChange={(value) => updateData("periodsStopped", value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3-6months">3-6 months</SelectItem>
                  <SelectItem value="6-12months">6-12 months</SelectItem>
                  <SelectItem value="1-2years">1-2 years</SelectItem>
                  <SelectItem value="2+years">More than 2 years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <Label className="text-red-800 font-medium">Red Flag Question</Label>
              </div>
              <div className="mt-2">
                <Label>Any bleeding after periods have stopped for 12+ months?</Label>
                <RadioGroup
                  value={formData.postmenopausalBleeding}
                  onValueChange={(value) => updateData("postmenopausalBleeding", value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="bleeding-yes" />
                    <Label htmlFor="bleeding-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="bleeding-no" />
                    <Label htmlFor="bleeding-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium mb-4">Vasomotor Symptoms</h3>
            
            <div>
              <Label>Hot flashes/flushes frequency</Label>
              <RadioGroup
                value={formData.hotFlashFrequency}
                onValueChange={(value) => updateData("hotFlashFrequency", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="hot-none" />
                  <Label htmlFor="hot-none">None</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mild" id="hot-mild" />
                  <Label htmlFor="hot-mild">Mild (1-2 per day)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderate" id="hot-moderate" />
                  <Label htmlFor="hot-moderate">Moderate (3-5 per day)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="severe" id="hot-severe" />
                  <Label htmlFor="hot-severe">Severe (6+ per day)</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Night sweats severity</Label>
              <RadioGroup
                value={formData.nightSweats}
                onValueChange={(value) => updateData("nightSweats", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="sweats-none" />
                  <Label htmlFor="sweats-none">None</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mild" id="sweats-mild" />
                  <Label htmlFor="sweats-mild">Mild - occasional</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderate" id="sweats-moderate" />
                  <Label htmlFor="sweats-moderate">Moderate - need to change clothes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="severe" id="sweats-severe" />
                  <Label htmlFor="sweats-severe">Severe - change bedding</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Impact on daily activities</Label>
              <Textarea
                value={formData.vasomotorImpact || ""}
                onChange={(e) => updateData("vasomotorImpact", e.target.value)}
                placeholder="How do hot flashes/night sweats affect work, sleep, social activities?"
                className="mt-2"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium mb-4">Physical Symptoms</h3>
            
            <div>
              <Label className="text-base font-medium">Please check all symptoms experienced:</Label>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                {[
                  "Joint aches and pains",
                  "Muscle aches",
                  "Breast tenderness",
                  "Headaches",
                  "Bloating",
                  "Weight gain",
                  "Dry skin",
                  "Hair thinning",
                  "Fatigue",
                  "Dizziness"
                ].map((symptom) => (
                  <div key={symptom} className="flex items-center space-x-2">
                    <Checkbox
                      id={symptom}
                      checked={formData.physicalSymptoms?.includes(symptom)}
                      onCheckedChange={(checked) => {
                        const current = formData.physicalSymptoms || [];
                        const updated = checked 
                          ? [...current, symptom]
                          : current.filter((s: string) => s !== symptom);
                        updateData("physicalSymptoms", updated);
                      }}
                    />
                    <Label htmlFor={symptom} className="text-sm">{symptom}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <Label className="text-red-800 font-medium">Red Flag Questions</Label>
              </div>
              <div className="space-y-4 mt-3">
                <div>
                  <Label>Severe headaches with visual changes?</Label>
                  <RadioGroup
                    value={formData.severeHeadaches}
                    onValueChange={(value) => updateData("severeHeadaches", value)}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="headache-yes" />
                      <Label htmlFor="headache-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="headache-no" />
                      <Label htmlFor="headache-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label>Chest pain or cardiac symptoms?</Label>
                  <RadioGroup
                    value={formData.chestPain}
                    onValueChange={(value) => updateData("chestPain", value)}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="chest-yes" />
                      <Label htmlFor="chest-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="chest-no" />
                      <Label htmlFor="chest-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium mb-4">Psychological & Mood Changes</h3>
            
            <div>
              <Label>Mood changes experienced</Label>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                {[
                  "Anxiety",
                  "Depression", 
                  "Irritability",
                  "Mood swings",
                  "Low confidence",
                  "Memory problems",
                  "Difficulty concentrating",
                  "Brain fog"
                ].map((mood) => (
                  <div key={mood} className="flex items-center space-x-2">
                    <Checkbox
                      id={mood}
                      checked={formData.moodSymptoms?.includes(mood)}
                      onCheckedChange={(checked) => {
                        const current = formData.moodSymptoms || [];
                        const updated = checked 
                          ? [...current, mood]
                          : current.filter((s: string) => s !== mood);
                        updateData("moodSymptoms", updated);
                      }}
                    />
                    <Label htmlFor={mood} className="text-sm">{mood}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <Label className="text-red-800 font-medium">Mental Health Red Flag</Label>
              </div>
              <div className="mt-2">
                <Label>Any thoughts of self-harm or suicide?</Label>
                <RadioGroup
                  value={formData.suicidalThoughts}
                  onValueChange={(value) => updateData("suicidalThoughts", value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="suicide-yes" />
                    <Label htmlFor="suicide-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="suicide-no" />
                    <Label htmlFor="no">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div>
              <Label>Impact on work/daily life</Label>
              <Textarea
                value={formData.psychologicalImpact || ""}
                onChange={(e) => updateData("psychologicalImpact", e.target.value)}
                placeholder="How are mood changes affecting daily activities, work, relationships?"
                className="mt-2"
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium mb-4">Sexual Health & Sleep</h3>
            
            <div>
              <Label>Sleep quality</Label>
              <RadioGroup
                value={formData.sleepQuality}
                onValueChange={(value) => updateData("sleepQuality", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="good" id="sleep-good" />
                  <Label htmlFor="sleep-good">Good - rarely disrupted</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fair" id="sleep-fair" />
                  <Label htmlFor="sleep-fair">Fair - some disruption</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="poor" id="sleep-poor" />
                  <Label htmlFor="sleep-poor">Poor - frequently disrupted</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="severe" id="sleep-severe" />
                  <Label htmlFor="sleep-severe">Severe - chronic insomnia</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Sexual health changes</Label>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                {[
                  "Reduced libido",
                  "Vaginal dryness",
                  "Pain during intercourse",
                  "Reduced arousal",
                  "Urinary symptoms",
                  "Recurrent UTIs"
                ].map((symptom) => (
                  <div key={symptom} className="flex items-center space-x-2">
                    <Checkbox
                      id={symptom}
                      checked={formData.sexualHealthSymptoms?.includes(symptom)}
                      onCheckedChange={(checked) => {
                        const current = formData.sexualHealthSymptoms || [];
                        const updated = checked 
                          ? [...current, symptom]
                          : current.filter((s: string) => s !== symptom);
                        updateData("sexualHealthSymptoms", updated);
                      }}
                    />
                    <Label htmlFor={symptom} className="text-sm">{symptom}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Overall quality of life impact</Label>
              <RadioGroup
                value={formData.qualityOfLifeImpact}
                onValueChange={(value) => updateData("qualityOfLifeImpact", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="minimal" id="qol-minimal" />
                  <Label htmlFor="qol-minimal">Minimal impact</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderate" id="qol-moderate" />
                  <Label htmlFor="qol-moderate">Moderate impact</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="significant" id="qol-significant" />
                  <Label htmlFor="qol-significant">Significant impact</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="severe" id="qol-severe" />
                  <Label htmlFor="qol-severe">Severe impact</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium mb-4">Assessment Summary</h3>
            
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-800">Assessment Complete</span>
                </div>
                <p className="text-blue-700">
                  Thank you for completing the comprehensive assessment. Your responses will be used to generate detailed reports for both clinical and patient use.
                </p>
              </CardContent>
            </Card>

            <div>
              <Label>Additional concerns or information</Label>
              <Textarea
                value={formData.additionalConcerns || ""}
                onChange={(e) => updateData("additionalConcerns", e.target.value)}
                placeholder="Any other symptoms, concerns, or information you'd like to include?"
                className="mt-2 h-32"
              />
            </div>

            <div>
              <Label>Treatment preferences or goals</Label>
              <Textarea
                value={formData.treatmentGoals || ""}
                onChange={(e) => updateData("treatmentGoals", e.target.value)}
                placeholder="What are your main goals for treatment? Any preferences or concerns about treatment options?"
                className="mt-2 h-32"
              />
            </div>
          </div>
        );

      default:
        return <div>Step not found</div>;
    }
  };

  return <div>{renderStep()}</div>;
};

export default AssessmentForm;
