
import { Card, CardContent } from "@/components/ui/card";

interface WelcomeMessageProps {
  show: boolean;
}

const WelcomeMessage = ({ show }: WelcomeMessageProps) => {
  if (!show) return null;

  return (
    <Card className="mb-8 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
      <CardContent className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
        <p className="text-lg opacity-90 mb-4">
          Your GP has asked you to complete this health assessment to better understand your symptoms and provide the best care possible.
        </p>
        <p className="opacity-80">
          This assessment is completely anonymous and secure. Your responses will help create a personalized care plan for you.
        </p>
      </CardContent>
    </Card>
  );
};

export default WelcomeMessage;
