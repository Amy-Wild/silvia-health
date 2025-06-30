
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Step3Props {
  data: any;
  onUpdate: (key: string, value: any) => void;
}

const Step3HotFlashes = ({ data, onUpdate }: Step3Props) => {
  return (
    <div className="space-y-6">
      <div>
        <Label>How often do you experience hot flashes/flushes?</Label>
        <RadioGroup
          value={data.hotFlashFrequency}
          onValueChange={(value) => onUpdate("hotFlashFrequency", value)}
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
          value={data.nightSweats}
          onValueChange={(value) => onUpdate("nightSweats", value)}
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
          value={data.vasomotorImpact || ""}
          onChange={(e) => onUpdate("vasomotorImpact", e.target.value)}
          placeholder="e.g., Affects my sleep, embarrassing at work, limits social activities..."
          className="mt-2"
        />
      </div>
    </div>
  );
};

export default Step3HotFlashes;
