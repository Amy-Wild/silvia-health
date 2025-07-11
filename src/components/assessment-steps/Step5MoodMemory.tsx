
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { AssessmentStepProps } from "@/types/componentTypes";

type Step5Props = AssessmentStepProps;

const Step5MoodMemory = ({ data, onUpdate }: Step5Props) => {
  return (
    <div className="space-y-6">
      <div>
        <Label>How would you describe your mood and emotional wellbeing?</Label>
        <RadioGroup
          value={data.moodSymptoms}
          onValueChange={(value) => onUpdate("moodSymptoms", value)}
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
          value={data.cognitiveSymptoms}
          onValueChange={(value) => onUpdate("cognitiveSymptoms", value)}
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
          value={data.moodImpact || ""}
          onChange={(e) => onUpdate("moodImpact", e.target.value)}
          placeholder="e.g., Difficulty concentrating at work, avoiding social situations, affecting relationships..."
          className="mt-2"
        />
      </div>
    </div>
  );
};

export default Step5MoodMemory;
