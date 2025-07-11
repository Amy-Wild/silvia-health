
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

import { AssessmentStepProps } from "@/types/componentTypes";

type Step6SleepIntimacyProps = AssessmentStepProps;

const Step6SleepIntimacy = ({ data, onUpdate }: Step6SleepIntimacyProps) => {
  const handleTreatmentPreferenceChange = (preference: string, checked: boolean) => {
    const current = data.treatmentPreferences || [];
    const updated = checked 
      ? [...current, preference]
      : current.filter((item: string) => item !== preference);
    onUpdate("treatmentPreferences", updated);
  };

  return (
    <div className="space-y-6">
      {/* Sleep Quality */}
      <Card>
        <CardHeader>
          <CardTitle>Sleep Quality</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium mb-3 block">
              How would you rate your sleep quality overall?
            </Label>
            <RadioGroup 
              value={data.sleepQuality || ""} 
              onValueChange={(value) => onUpdate("sleepQuality", value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="good" id="sleep-good" />
                <Label htmlFor="sleep-good">Good - I sleep well most nights</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fair" id="sleep-fair" />
                <Label htmlFor="sleep-fair">Fair - Some difficulty sleeping</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="poor" id="sleep-poor" />
                <Label htmlFor="sleep-poor">Poor - Frequently disrupted sleep</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="very-poor" id="sleep-very-poor" />
                <Label htmlFor="sleep-very-poor">Very poor - Severely disrupted sleep</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Vaginal/Sexual Health */}
      <Card>
        <CardHeader>
          <CardTitle>Vaginal and Sexual Health</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium mb-3 block">
              Do you experience vaginal dryness, discomfort, or pain during intimacy?
            </Label>
            <RadioGroup 
              value={data.vaginalSymptoms || ""} 
              onValueChange={(value) => onUpdate("vaginalSymptoms", value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="vaginal-none" />
                <Label htmlFor="vaginal-none">No symptoms</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mild" id="vaginal-mild" />
                <Label htmlFor="vaginal-mild">Mild symptoms</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moderate" id="vaginal-moderate" />
                <Label htmlFor="vaginal-moderate">Moderate symptoms</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="severe" id="vaginal-severe" />
                <Label htmlFor="vaginal-severe">Severe symptoms</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          <div>
            <Label className="text-base font-medium mb-3 block">
              How has your interest in sexual activity changed?
            </Label>
            <RadioGroup 
              value={data.libidoChanges || ""} 
              onValueChange={(value) => onUpdate("libidoChanges", value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no-change" id="libido-same" />
                <Label htmlFor="libido-same">No change</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="decreased" id="libido-decreased" />
                <Label htmlFor="libido-decreased">Somewhat decreased</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="significantly-decreased" id="libido-much-decreased" />
                <Label htmlFor="libido-much-decreased">Significantly decreased</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Treatment Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Treatment Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium mb-4 block">
              Which treatment approaches are you interested in learning about or trying?
              <span className="text-sm text-gray-500 block mt-1">
                Select all that apply - this helps your GP provide the most relevant advice
              </span>
            </Label>
            <div className="grid grid-cols-1 gap-4">
              {[
                { id: "hrt", label: "Hormone Replacement Therapy (HRT)", description: "Tablets, patches, gels, or implants containing hormones" },
                { id: "non-hormonal", label: "Non-hormonal medications", description: "Prescription medicines that don't contain hormones" },
                { id: "cbt", label: "Cognitive Behavioral Therapy (CBT)", description: "Talking therapy to help manage symptoms" },
                { id: "lifestyle", label: "Lifestyle modifications", description: "Diet, exercise, and wellness approaches" },
                { id: "complementary", label: "Complementary therapies", description: "Herbal remedies, acupuncture, mindfulness" }
              ].map((option) => (
                <div key={option.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id={option.id}
                    checked={(data.treatmentPreferences || []).includes(option.id)}
                    onCheckedChange={(checked) => handleTreatmentPreferenceChange(option.id, checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor={option.id} className="text-sm font-medium cursor-pointer">
                      {option.label}
                    </Label>
                    <p className="text-xs text-gray-600 mt-1">{option.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Step6SleepIntimacy;
