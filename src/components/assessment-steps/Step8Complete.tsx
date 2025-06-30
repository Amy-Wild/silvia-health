
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface Step8Props {
  data: any;
  onUpdate: (key: string, value: any) => void;
}

const Step8Complete = ({ data, onUpdate }: Step8Props) => {
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
          value={data.additionalInfo || ""}
          onChange={(e) => onUpdate("additionalInfo", e.target.value)}
          placeholder="Any other symptoms, concerns, or questions you have..."
          className="mt-2 h-32"
        />
      </div>
    </div>
  );
};

export default Step8Complete;
