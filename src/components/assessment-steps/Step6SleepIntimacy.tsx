
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

interface Step6SleepIntimacyProps {
  data: any;
  onUpdate: (key: string, value: any) => void;
}

const Step6SleepIntimacy = ({ data, onUpdate }: Step6SleepIntimacyProps) => {
  const handleCheckboxChange = (checked: boolean | string, value: string) => {
    const isChecked = checked === true;
    const currentPreferences = data.treatmentPreferences || [];
    if (isChecked) {
      onUpdate('treatmentPreferences', [...currentPreferences, value]);
    } else {
      onUpdate('treatmentPreferences', currentPreferences.filter((pref: string) => pref !== value));
    }
  };

  return (
    <div className="space-y-8">
      {/* Sleep Quality */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-gray-800">Sleep Quality</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base font-medium text-gray-700 mb-3 block">
              How would you rate your sleep quality over the past month?
            </Label>
            <RadioGroup 
              value={data.sleepQuality} 
              onValueChange={(value) => onUpdate('sleepQuality', value)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="very-poor" id="sleep-very-poor" />
                <Label htmlFor="sleep-very-poor">Very poor - I rarely get a good night's sleep</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="poor" id="sleep-poor" />
                <Label htmlFor="sleep-poor">Poor - I often have trouble sleeping</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fair" id="sleep-fair" />
                <Label htmlFor="sleep-fair">Fair - Some nights are better than others</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="good" id="sleep-good" />
                <Label htmlFor="sleep-good">Good - I usually sleep well</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Sexual Health */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-gray-800">Sexual Health & Intimacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base font-medium text-gray-700 mb-3 block">
              Have you noticed changes in your interest in intimacy?
            </Label>
            <RadioGroup 
              value={data.libidoChanges} 
              onValueChange={(value) => onUpdate('libidoChanges', value)}
              className="space-y-2"
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
                <RadioGroupItem value="significantly-decreased" id="libido-significantly-decreased" />
                <Label htmlFor="libido-significantly-decreased">Significantly decreased interest</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-medium text-gray-700 mb-3 block">
              Do you experience vaginal dryness or discomfort?
            </Label>
            <RadioGroup 
              value={data.vaginalSymptoms} 
              onValueChange={(value) => onUpdate('vaginalSymptoms', value)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="vaginal-none" />
                <Label htmlFor="vaginal-none">No symptoms</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mild" id="vaginal-mild" />
                <Label htmlFor="vaginal-mild">Mild dryness occasionally</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moderate" id="vaginal-moderate" />
                <Label htmlFor="vaginal-moderate">Moderate discomfort affecting intimacy</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="severe" id="vaginal-severe" />
                <Label htmlFor="vaginal-severe">Severe symptoms causing significant problems</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Treatment Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-gray-800">Treatment Preferences</CardTitle>
          <p className="text-sm text-gray-600">Please select which treatment approaches you would like to learn more about:</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hrt-preference"
                checked={(data.treatmentPreferences || []).includes('hrt')}
                onCheckedChange={(checked) => handleCheckboxChange(checked, 'hrt')}
              />
              <Label htmlFor="hrt-preference" className="text-sm">
                <strong>Hormone Replacement Therapy (HRT)</strong> - Learn about hormonal treatments
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="cbt-preference"
                checked={(data.treatmentPreferences || []).includes('cbt')}
                onCheckedChange={(checked) => handleCheckboxChange(checked, 'cbt')}
              />
              <Label htmlFor="cbt-preference" className="text-sm">
                <strong>Cognitive Behavioral Therapy (CBT)</strong> - Learn about psychological approaches
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="non-hormonal-preference"
                checked={(data.treatmentPreferences || []).includes('non-hormonal')}
                onCheckedChange={(checked) => handleCheckboxChange(checked, 'non-hormonal')}
              />
              <Label htmlFor="non-hormonal-preference" className="text-sm">
                <strong>Non-hormonal treatments</strong> - Learn about lifestyle and alternative approaches
              </Label>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              💡 Based on your selections, we'll provide educational resources about your preferred treatment options.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Step6SleepIntimacy;
