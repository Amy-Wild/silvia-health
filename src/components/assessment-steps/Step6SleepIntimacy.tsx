
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Step6Props {
  data: any;
  onUpdate: (key: string, value: any) => void;
}

const Step6SleepIntimacy = ({ data, onUpdate }: Step6Props) => {
  return (
    <div className="space-y-6">
      <div>
        <Label>How is your sleep quality?</Label>
        <RadioGroup
          value={data.sleepQuality}
          onValueChange={(value) => onUpdate("sleepQuality", value)}
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
          value={data.libidoChanges}
          onValueChange={(value) => onUpdate("libidoChanges", value)}
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
          value={data.vaginalSymptoms}
          onValueChange={(value) => onUpdate("vaginalSymptoms", value)}
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
};

export default Step6SleepIntimacy;
