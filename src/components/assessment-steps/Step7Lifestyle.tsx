
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

import { AssessmentStepProps } from "@/types/componentTypes";

type Step7LifestyleProps = AssessmentStepProps;

const Step7Lifestyle = ({ data, onUpdate }: Step7LifestyleProps) => {
  const handlePersonalHistoryChange = (condition: string, checked: boolean) => {
    const current = data.personalMedicalHistory || [];
    const updated = checked 
      ? [...current, condition]
      : current.filter((item: string) => item !== condition);
    onUpdate("personalMedicalHistory", updated);
  };

  const handleFamilyHistoryChange = (condition: string, checked: boolean) => {
    const current = data.familyHistory || [];
    const updated = checked 
      ? [...current, condition]
      : current.filter((item: string) => item !== condition);
    onUpdate("familyHistory", updated);
  };

  return (
    <div className="space-y-6">
      {/* Personal Medical History */}
      <Card>
        <CardHeader>
          <CardTitle>Your Medical History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium mb-4 block">
              Have you ever been diagnosed with any of the following conditions?
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: "breast-cancer", label: "Breast cancer" },
                { id: "blood-clots", label: "Blood clots (DVT/PE)" },
                { id: "liver-disease", label: "Liver disease" },
                { id: "heart-disease", label: "Heart disease" },
                { id: "stroke", label: "Stroke" },
                { id: "depression", label: "Depression/Anxiety" },
                { id: "osteoporosis", label: "Osteoporosis" },
                { id: "diabetes", label: "Diabetes" },
                { id: "high-blood-pressure", label: "High blood pressure" },
                { id: "thyroid-disease", label: "Thyroid disease" }
              ].map((condition) => (
                <div key={condition.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={condition.id}
                    checked={(data.personalMedicalHistory || []).includes(condition.id)}
                    onCheckedChange={(checked) => handlePersonalHistoryChange(condition.id, checked as boolean)}
                  />
                  <Label htmlFor={condition.id} className="text-sm">
                    {condition.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Family History */}
      <Card>
        <CardHeader>
          <CardTitle>Family History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium mb-4 block">
              Has anyone in your immediate family (parents, siblings, children) had any of these conditions?
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: "breast-cancer", label: "Breast cancer" },
                { id: "ovarian-cancer", label: "Ovarian cancer" },
                { id: "blood-clots", label: "Blood clots (DVT/PE)" },
                { id: "heart-disease", label: "Heart disease" },
                { id: "stroke", label: "Stroke" },
                { id: "osteoporosis", label: "Osteoporosis" }
              ].map((condition) => (
                <div key={condition.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`family-${condition.id}`}
                    checked={(data.familyHistory || []).includes(condition.id)}
                    onCheckedChange={(checked) => handleFamilyHistoryChange(condition.id, checked as boolean)}
                  />
                  <Label htmlFor={`family-${condition.id}`} className="text-sm">
                    {condition.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lifestyle Factors */}
      <Card>
        <CardHeader>
          <CardTitle>Lifestyle Factors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Smoking */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              Do you smoke?
            </Label>
            <RadioGroup 
              value={data.smokingStatus || ""} 
              onValueChange={(value) => onUpdate("smokingStatus", value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="never" id="never-smoked" />
                <Label htmlFor="never-smoked">Never smoked</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="former" id="former-smoker" />
                <Label htmlFor="former-smoker">Former smoker (quit)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="current" id="current-smoker" />
                <Label htmlFor="current-smoker">Current smoker</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Alcohol consumption */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              How many units of alcohol do you drink per week?
              <span className="text-sm text-gray-500 block mt-1">
                (1 unit = half pint of beer, small glass of wine, or single spirit)
              </span>
            </Label>
            <RadioGroup 
              value={data.alcoholConsumption || ""} 
              onValueChange={(value) => onUpdate("alcoholConsumption", value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="no-alcohol" />
                <Label htmlFor="no-alcohol">None</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1-7" id="low-alcohol" />
                <Label htmlFor="low-alcohol">1-7 units per week</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="8-14" id="medium-alcohol" />
                <Label htmlFor="8-14">8-14 units per week</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="15-21" id="high-alcohol" />
                <Label htmlFor="15-21">15-21 units per week</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="22+" id="very-high-alcohol" />
                <Label htmlFor="very-high-alcohol">More than 22 units per week</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Exercise level */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              How would you describe your exercise level?
            </Label>
            <RadioGroup 
              value={data.exerciseLevel || ""} 
              onValueChange={(value) => onUpdate("exerciseLevel", value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high-exercise" />
                <Label htmlFor="high-exercise">High (vigorous exercise 4+ times per week)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moderate" id="moderate-exercise" />
                <Label htmlFor="moderate-exercise">Moderate (regular exercise 2-3 times per week)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light-exercise" />
                <Label htmlFor="light-exercise">Light (occasional walks or light activity)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="no-exercise" />
                <Label htmlFor="no-exercise">Sedentary (little to no exercise)</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Height and Weight for BMI calculation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-base font-medium mb-3 block">
                Height (cm)
              </Label>
              <Input
                type="number"
                placeholder="e.g. 165"
                value={data.height || ""}
                onChange={(e) => onUpdate("height", e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Label className="text-base font-medium mb-3 block">
                Weight (kg)
              </Label>
              <Input
                type="number"
                placeholder="e.g. 65"
                value={data.weight || ""}
                onChange={(e) => onUpdate("weight", e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Step7Lifestyle;
