import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Info, Heart } from "lucide-react";

interface PatientAssessmentFormProps {
  step: number;
  data: any;
  onDataChange: (data: any) => void;
}

const PatientAssessmentForm = ({ step, data, onDataChange }: PatientAssessmentFormProps) => {
  const [formData, setFormData] = useState(data);

  const updateData = (key: string, value: any) => {
    const newData = { ...formData, [key]: value };
    setFormData(newData);
    onDataChange(newData);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Your age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age || ""}
                  onChange={(e) => updateData("age", e.target.value)}
                  placeholder="e.g., 45"
                />
              </div>
              <div>
                <Label htmlFor="occupation">Your occupation (optional)</Label>
                <Input
                  id="occupation"
                  value={formData.occupation || ""}
                  onChange={(e) => updateData("occupation", e.target.value)}
                  placeholder="e.g., Teacher, Manager"
                />
              </div>
            </div>

            <div>
              <Label>What brings you to see your GP today?</Label>
              <Textarea
                value={formData.primaryConcern || ""}
                onChange={(e) => updateData("primaryConcern", e.target.value)}
                placeholder="Tell us about your main concerns or symptoms..."
                className="mt-2"
              />
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-800">About This Assessment</span>
                </div>
                <p className="text-blue-700 text-sm">
                  This assessment follows NHS guidelines to help your GP understand your symptoms and provide the best care. Your answers are confidential and will only be shared with your healthcare team.
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label>How would you describe your periods currently?</Label>
              <RadioGroup
                value={formData.menstrualStatus}
                onValueChange={(value) => updateData("menstrualStatus", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="regular" id="regular" />
                  <Label htmlFor="regular">Regular - same pattern as usual</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="irregular" id="irregular" />
                  <Label htmlFor="irregular">Irregular - different timing or flow</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="stopped" id="stopped" />
                  <Label htmlFor="stopped">My periods have stopped</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hysterectomy" id="hysterectomy" />
                  <Label htmlFor="hysterectomy">I've had a hysterectomy</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>If your periods have stopped, how long ago?</Label>
              <Select onValueChange={(value) => updateData("periodsStopped", value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3-6months">3-6 months ago</SelectItem>
                  <SelectItem value="6-12months">6-12 months ago</SelectItem>
                  <SelectItem value="1-2years">1-2 years ago</SelectItem>
                  <SelectItem value="2+years">More than 2 years ago</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <Label className="text-red-800 font-medium">Important Question</Label>
                </div>
                <div className="mt-3">
                  <Label>Have you had any bleeding after your periods stopped for 12+ months?</Label>
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
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label>How often do you experience hot flashes/flushes?</Label>
              <RadioGroup
                value={formData.hotFlashFrequency}
                onValueChange={(value) => updateData("hotFlashFrequency", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="hot-none" />
                  <Label htmlFor="hot-none">I don't get them</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mild" id="hot-mild" />
                  <Label htmlFor="hot-mild">1-2 times per day</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderate" id="hot-moderate" />
                  <Label htmlFor="hot-moderate">3-5 times per day</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="severe" id="hot-severe" />
                  <Label htmlFor="hot-severe">6 or more times per day</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>How would you describe your night sweats?</Label>
              <RadioGroup
                value={formData.nightSweats}
                onValueChange={(value) => updateData("nightSweats", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="sweats-none" />
                  <Label htmlFor="sweats-none">I don't get them</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mild" id="sweats-mild" />
                  <Label htmlFor="sweats-mild">Mild - occasionally wake up warm</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderate" id="sweats-moderate" />
                  <Label htmlFor="sweats-moderate">Moderate - need to change clothes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="severe" id="sweats-severe" />
                  <Label htmlFor="sweats-severe">Severe - need to change bedding</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>How do these symptoms affect your daily life?</Label>
              <Textarea
                value={formData.vasomotorImpact || ""}
                onChange={(e) => updateData("vasomotorImpact", e.target.value)}
                placeholder="e.g., Affects my sleep, embarrassing at work, limits social activities..."
                className="mt-2"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label>Which physical symptoms are you experiencing? (Select all that apply)</Label>
              <div className="mt-3 space-y-3">
                {[
                  { id: "joint-pain", label: "Joint aches and pains" },
                  { id: "muscle-pain", label: "Muscle aches" },
                  { id: "headaches", label: "Headaches or migraines" },
                  { id: "fatigue", label: "Tiredness or fatigue" },
                  { id: "weight-gain", label: "Weight gain" },
                  { id: "bloating", label: "Bloating or digestive issues" },
                  { id: "breast-tenderness", label: "Breast tenderness" },
                  { id: "skin-changes", label: "Dry skin or hair changes" },
                ].map((symptom) => (
                  <div key={symptom.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={symptom.id}
                      checked={formData.physicalSymptoms?.includes(symptom.id) || false}
                      onCheckedChange={(checked) => {
                        const current = formData.physicalSymptoms || [];
                        const updated = checked
                          ? [...current, symptom.id]
                          : current.filter((item: string) => item !== symptom.id);
                        updateData("physicalSymptoms", updated);
                      }}
                    />
                    <Label htmlFor={symptom.id}>{symptom.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <Label className="text-red-800 font-medium">Important Questions</Label>
                </div>
                <div className="mt-3 space-y-4">
                  <div>
                    <Label>Have you experienced unexplained weight loss (more than 10% of body weight)?</Label>
                    <RadioGroup
                      value={formData.unexplainedWeightLoss}
                      onValueChange={(value) => updateData("unexplainedWeightLoss", value)}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="weight-loss-yes" />
                        <Label htmlFor="weight-loss-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="weight-loss-no" />
                        <Label htmlFor="weight-loss-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div>
                    <Label>Do you have severe pelvic pain?</Label>
                    <RadioGroup
                      value={formData.severePelvicPain}
                      onValueChange={(value) => updateData("severePelvicPain", value)}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="pelvic-pain-yes" />
                        <Label htmlFor="pelvic-pain-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="pelvic-pain-no" />
                        <Label htmlFor="pelvic-pain-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <Label>How would you describe your mood and emotional wellbeing?</Label>
              <RadioGroup
                value={formData.moodSymptoms}
                onValueChange={(value) => updateData("moodSymptoms", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="mood-none" />
                  <Label htmlFor="mood-none">No changes - feeling normal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mild" id="mood-mild" />
                  <Label htmlFor="mood-mild">Slightly more emotional than usual</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderate" id="mood-moderate" />
                  <Label htmlFor="mood-moderate">Noticeable mood swings or anxiety</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="severe" id="mood-severe" />
                  <Label htmlFor="mood-severe">Significant depression or anxiety</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Are you experiencing any memory or concentration problems?</Label>
              <RadioGroup
                value={formData.cognitiveSymptoms}
                onValueChange={(value) => updateData("cognitiveSymptoms", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="cognitive-none" />
                  <Label htmlFor="cognitive-none">No problems</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mild" id="cognitive-mild" />
                  <Label htmlFor="cognitive-mild">Occasional forgetfulness</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderate" id="cognitive-moderate" />
                  <Label htmlFor="cognitive-moderate">Regular memory or focus issues</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="severe" id="cognitive-severe" />
                  <Label htmlFor="cognitive-severe">Significant memory problems affecting daily life</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>How are these symptoms affecting your work or daily activities?</Label>
              <Textarea
                value={formData.moodImpact || ""}
                onChange={(e) => updateData("moodImpact", e.target.value)}
                placeholder="e.g., Difficulty concentrating at work, avoiding social situations, affecting relationships..."
                className="mt-2"
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <Label>How is your sleep quality?</Label>
              <RadioGroup
                value={formData.sleepQuality}
                onValueChange={(value) => updateData("sleepQuality", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="good" id="sleep-good" />
                  <Label htmlFor="sleep-good">Good - sleeping well most nights</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fair" id="sleep-fair" />
                  <Label htmlFor="sleep-fair">Fair - some difficulty sleeping</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="poor" id="sleep-poor" />
                  <Label htmlFor="sleep-poor">Poor - frequently disturbed sleep</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="very-poor" id="sleep-very-poor" />
                  <Label htmlFor="sleep-very-poor">Very poor - severe insomnia</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Have you noticed changes in your interest in intimacy?</Label>
              <RadioGroup
                value={formData.libidoChanges}
                onValueChange={(value) => updateData("libidoChanges", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no-change" id="libido-no-change" />
                  <Label htmlFor="libido-no-change">No change</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="decreased" id="libido-decreased" />
                  <Label htmlFor="libido-decreased">Decreased interest</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="significantly-decreased" id="libido-sig-decreased" />
                  <Label htmlFor="libido-sig-decreased">Significantly decreased interest</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="prefer-not-to-say" id="libido-prefer-not" />
                  <Label htmlFor="libido-prefer-not">Prefer not to say</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Are you experiencing vaginal dryness or discomfort?</Label>
              <RadioGroup
                value={formData.vaginalSymptoms}
                onValueChange={(value) => updateData("vaginalSymptoms", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="vaginal-none" />
                  <Label htmlFor="vaginal-none">No problems</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mild" id="vaginal-mild" />
                  <Label htmlFor="vaginal-mild">Mild dryness</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderate" id="vaginal-moderate" />
                  <Label htmlFor="vaginal-moderate">Moderate dryness affecting comfort</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="severe" id="vaginal-severe" />
                  <Label htmlFor="vaginal-severe">Severe dryness affecting intimacy</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="prefer-not-to-say" id="vaginal-prefer-not" />
                  <Label htmlFor="vaginal-prefer-not">Prefer not to say</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Heart className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">Lifestyle & Health Information</span>
                </div>
                <p className="text-green-700 text-sm">
                  These questions help your GP understand your overall health and provide personalized care.
                </p>
              </CardContent>
            </Card>

            <div>
              <Label>Do you currently smoke?</Label>
              <RadioGroup
                value={formData.smokingStatus}
                onValueChange={(value) => updateData("smokingStatus", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="never" id="smoke-never" />
                  <Label htmlFor="smoke-never">Never smoked</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="former" id="smoke-former" />
                  <Label htmlFor="smoke-former">Used to smoke but quit</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="current" id="smoke-current" />
                  <Label htmlFor="smoke-current">Yes, I currently smoke</Label>
                </div>
              </RadioGroup>
            </div>

            {formData.smokingStatus === "current" && (
              <div>
                <Label htmlFor="cigarettes-per-day">How many cigarettes per day?</Label>
                <Input
                  id="cigarettes-per-day"
                  type="number"
                  value={formData.cigarettesPerDay || ""}
                  onChange={(e) => updateData("cigarettesPerDay", e.target.value)}
                  placeholder="e.g., 10"
                  className="mt-1"
                />
              </div>
            )}

            <div>
              <Label>How much alcohol do you drink per week?</Label>
              <Select onValueChange={(value) => updateData("alcoholConsumption", value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select your alcohol consumption" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">I don't drink alcohol</SelectItem>
                  <SelectItem value="1-7">1-7 units per week</SelectItem>
                  <SelectItem value="8-14">8-14 units per week</SelectItem>
                  <SelectItem value="15-21">15-21 units per week</SelectItem>
                  <SelectItem value="22+">22+ units per week</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-600 mt-1">
                1 unit = small glass of wine, half pint of beer, or single measure of spirits
              </p>
            </div>

            <div>
              <Label>How much exercise do you do per week?</Label>
              <RadioGroup
                value={formData.exerciseLevel}
                onValueChange={(value) => updateData("exerciseLevel", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="exercise-none" />
                  <Label htmlFor="exercise-none">Little to no exercise</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="exercise-light" />
                  <Label htmlFor="exercise-light">Light exercise (1-2 times per week)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderate" id="exercise-moderate" />
                  <Label htmlFor="exercise-moderate">Moderate exercise (3-4 times per week)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="exercise-high" />
                  <Label htmlFor="exercise-high">Regular exercise (5+ times per week)</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Have you had frequent urinary tract infections (UTIs) recently?</Label>
              <RadioGroup
                value={formData.frequentUTIs}
                onValueChange={(value) => updateData("frequentUTIs", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="uti-no" />
                  <Label htmlFor="uti-no">No, not recently</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="some" id="uti-some" />
                  <Label htmlFor="uti-some">Yes, 1-2 in the past year</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="frequent" id="uti-frequent" />
                  <Label htmlFor="uti-frequent">Yes, 3 or more in the past year</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Any family history of bone problems (osteoporosis/fractures)?</Label>
              <RadioGroup
                value={formData.familyBoneHistory}
                onValueChange={(value) => updateData("familyBoneHistory", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="bone-no" />
                  <Label htmlFor="bone-no">No family history</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="bone-yes" />
                  <Label htmlFor="bone-yes">Yes, in mother/sister</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unsure" id="bone-unsure" />
                  <Label htmlFor="bone-unsure">I'm not sure</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <Card className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold mb-4">Assessment Complete!</h3>
                <p className="mb-4">
                  Thank you for taking the time to complete this assessment. Your responses will help your GP provide you with the best possible care.
                </p>
                <p className="text-sm opacity-90">
                  Your GP will receive a detailed report and will discuss the results with you at your appointment.
                </p>
              </CardContent>
            </Card>

            <div>
              <Label>Is there anything else you'd like your GP to know?</Label>
              <Textarea
                value={formData.additionalInfo || ""}
                onChange={(e) => updateData("additionalInfo", e.target.value)}
                placeholder="Any other symptoms, concerns, or questions you have..."
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

export default PatientAssessmentForm;
