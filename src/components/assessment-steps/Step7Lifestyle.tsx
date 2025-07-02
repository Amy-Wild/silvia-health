
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface Step7LifestyleProps {
  data: any;
  onUpdate: (key: string, value: any) => void;
}

const Step7Lifestyle = ({ data, onUpdate }: Step7LifestyleProps) => {
  const handleFamilyHistoryChange = (checked: boolean, condition: string) => {
    const currentHistory = data.familyHistory || [];
    if (checked) {
      onUpdate('familyHistory', [...currentHistory, condition]);
    } else {
      onUpdate('familyHistory', currentHistory.filter((item: string) => item !== condition));
    }
  };

  const handlePersonalHistoryChange = (checked: boolean, condition: string) => {
    const currentHistory = data.personalMedicalHistory || [];
    if (checked) {
      onUpdate('personalMedicalHistory', [...currentHistory, condition]);
    } else {
      onUpdate('personalMedicalHistory', currentHistory.filter((item: string) => item !== condition));
    }
  };

  return (
    <div className="space-y-8">
      {/* Personal Medical History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-gray-800">Your Medical History</CardTitle>
          <p className="text-sm text-gray-600">This information helps us provide better care recommendations</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base font-medium text-gray-700 mb-3 block">
              Do you have a personal history of any of the following? (Select all that apply)
            </Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="personal-breast-cancer"
                  checked={(data.personalMedicalHistory || []).includes('breast-cancer')}
                  onCheckedChange={(checked) => handlePersonalHistoryChange(checked, 'breast-cancer')}
                />
                <Label htmlFor="personal-breast-cancer" className="text-sm">Breast cancer</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="personal-blood-clots"
                  checked={(data.personalMedicalHistory || []).includes('blood-clots')}
                  onCheckedChange={(checked) => handlePersonalHistoryChange(checked, 'blood-clots')}
                />
                <Label htmlFor="personal-blood-clots" className="text-sm">Blood clots or thrombosis</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="personal-heart-disease"
                  checked={(data.personalMedicalHistory || []).includes('heart-disease')}
                  onCheckedChange={(checked) => handlePersonalHistoryChange(checked, 'heart-disease')}
                />
                <Label htmlFor="personal-heart-disease" className="text-sm">Heart disease</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="personal-stroke"
                  checked={(data.personalMedicalHistory || []).includes('stroke')}
                  onCheckedChange={(checked) => handlePersonalHistoryChange(checked, 'stroke')}
                />
                <Label htmlFor="personal-stroke" className="text-sm">Stroke</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="personal-liver-disease"
                  checked={(data.personalMedicalHistory || []).includes('liver-disease')}
                  onCheckedChange={(checked) => handlePersonalHistoryChange(checked, 'liver-disease')}
                />
                <Label htmlFor="personal-liver-disease" className="text-sm">Liver disease</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="personal-depression"
                  checked={(data.personalMedicalHistory || []).includes('depression')}
                  onCheckedChange={(checked) => handlePersonalHistoryChange(checked, 'depression')}
                />
                <Label htmlFor="personal-depression" className="text-sm">Depression or anxiety</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="personal-none"
                  checked={(data.personalMedicalHistory || []).includes('none')}
                  onCheckedChange={(checked) => handlePersonalHistoryChange(checked, 'none')}
                />
                <Label htmlFor="personal-none" className="text-sm">None of the above</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Family History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-gray-800">Family Medical History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base font-medium text-gray-700 mb-3 block">
              Does anyone in your immediate family (parents, siblings, children) have a history of: (Select all that apply)
            </Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="family-breast-cancer"
                  checked={(data.familyHistory || []).includes('breast-cancer')}
                  onCheckedChange={(checked) => handleFamilyHistoryChange(checked, 'breast-cancer')}
                />
                <Label htmlFor="family-breast-cancer" className="text-sm">Breast cancer</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="family-ovarian-cancer"
                  checked={(data.familyHistory || []).includes('ovarian-cancer')}
                  onCheckedChange={(checked) => handleFamilyHistoryChange(checked, 'ovarian-cancer')}
                />
                <Label htmlFor="family-ovarian-cancer" className="text-sm">Ovarian cancer</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="family-blood-clots"
                  checked={(data.familyHistory || []).includes('blood-clots')}
                  onCheckedChange={(checked) => handleFamilyHistoryChange(checked, 'blood-clots')}
                />
                <Label htmlFor="family-blood-clots" className="text-sm">Blood clots or thrombosis</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="family-heart-disease"
                  checked={(data.familyHistory || []).includes('heart-disease')}
                  onCheckedChange={(checked) => handleFamilyHistoryChange(checked, 'heart-disease')}
                />
                <Label htmlFor="family-heart-disease" className="text-sm">Heart disease</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="family-osteoporosis"
                  checked={(data.familyHistory || []).includes('osteoporosis')}
                  onCheckedChange={(checked) => handleFamilyHistoryChange(checked, 'osteoporosis')}
                />
                <Label htmlFor="family-osteoporosis" className="text-sm">Osteoporosis</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="family-none"
                  checked={(data.familyHistory || []).includes('none')}
                  onCheckedChange={(checked) => handleFamilyHistoryChange(checked, 'none')}
                />
                <Label htmlFor="family-none" className="text-sm">None of the above</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lifestyle Factors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-gray-800">Lifestyle & Health</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium text-gray-700 mb-3 block">
              Do you currently smoke?
            </Label>
            <RadioGroup 
              value={data.smokingStatus} 
              onValueChange={(value) => onUpdate('smokingStatus', value)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="never" id="smoke-never" />
                <Label htmlFor="smoke-never">Never smoked</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="former" id="smoke-former" />
                <Label htmlFor="smoke-former">Former smoker (quit)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="current" id="smoke-current" />
                <Label htmlFor="smoke-current">Current smoker</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-medium text-gray-700 mb-3 block">
              How many alcoholic drinks do you have per week on average?
            </Label>
            <RadioGroup 
              value={data.alcoholConsumption} 
              onValueChange={(value) => onUpdate('alcoholConsumption', value)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="alcohol-none" />
                <Label htmlFor="alcohol-none">None</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1-7" id="alcohol-1-7" />
                <Label htmlFor="alcohol-1-7">1-7 drinks per week</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="8-14" id="alcohol-8-14" />
                <Label htmlFor="alcohol-8-14">8-14 drinks per week</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="15-21" id="alcohol-15-21" />
                <Label htmlFor="alcohol-15-21">15-21 drinks per week</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="22+" id="alcohol-22+" />
                <Label htmlFor="alcohol-22+">22+ drinks per week</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-medium text-gray-700 mb-3 block">
              How would you describe your exercise level?
            </Label>
            <RadioGroup 
              value={data.exerciseLevel} 
              onValueChange={(value) => onUpdate('exerciseLevel', value)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="exercise-none" />
                <Label htmlFor="exercise-none">No regular exercise</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="exercise-light" />
                <Label htmlFor="exercise-light">Light exercise (walking, gentle activities)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moderate" id="exercise-moderate" />
                <Label htmlFor="exercise-moderate">Moderate exercise (2-3 times per week)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="exercise-high" />
                <Label htmlFor="exercise-high">High level (4+ times per week)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="height" className="text-sm font-medium text-gray-700">
                Height (cm)
              </Label>
              <Input
                id="height"
                type="number"
                value={data.height || ''}
                onChange={(e) => onUpdate('height', e.target.value)}
                placeholder="e.g., 165"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="weight" className="text-sm font-medium text-gray-700">
                Weight (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                value={data.weight || ''}
                onChange={(e) => onUpdate('weight', e.target.value)}
                placeholder="e.g., 65"
                className="mt-1"
              />
            </div>
          </div>

          {data.height && data.weight && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>BMI:</strong> {(parseFloat(data.weight) / Math.pow(parseFloat(data.height) / 100, 2)).toFixed(1)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Step7Lifestyle;
