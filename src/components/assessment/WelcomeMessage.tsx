
import { Card, CardContent } from "@/components/ui/card";

interface WelcomeMessageProps {
  show: boolean;
}

const WelcomeMessage = ({ show }: WelcomeMessageProps) => {
  if (!show) return null;

  return (
    <Card className="mb-8 bg-gradient-to-r from-purple-100 to-blue-100 border-purple-200">
      <CardContent className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Welcome to Silvia!</h2>
        <p className="text-lg mb-4 text-gray-700">
          Your GP has asked you to complete this health assessment to better understand your symptoms and provide the best care possible.
        </p>
        <p className="text-gray-600">
          Silvia is a digital triage assistant that provides <strong>S</strong>ymptom <strong>I</strong>ntake & <strong>L</strong>iaison for <strong>V</strong>ital <strong>I</strong>nsight & <strong>A</strong>ssessment — helping you prepare and your GP prioritise.
        </p>
      </CardContent>
    </Card>
  );
};

export default WelcomeMessage;
