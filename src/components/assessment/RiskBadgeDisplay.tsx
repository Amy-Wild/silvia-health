
import { Badge } from "@/components/ui/badge";

interface RiskBadgeDisplayProps {
  riskBadge: {
    className: string;
    text: string;
  };
}

const RiskBadgeDisplay = ({ riskBadge }: RiskBadgeDisplayProps) => {
  // Override with brand colors for common risk levels
  const getBrandColorClass = (text: string, originalClass: string) => {
    if (text.toLowerCase().includes('low risk')) {
      return 'bg-soft-green text-green-800 border-green-300';
    }
    if (text.toLowerCase().includes('moderate risk')) {
      return 'bg-gentle-blue text-blue-800 border-blue-300';
    }
    if (text.toLowerCase().includes('high risk')) {
      return 'bg-soft-coral text-orange-800 border-orange-300';
    }
    return originalClass;
  };

  return (
    <div className="container mx-auto px-4 py-2">
      <div className="max-w-3xl mx-auto flex justify-end">
        <Badge className={getBrandColorClass(riskBadge.text, riskBadge.className)}>
          {riskBadge.text}
        </Badge>
      </div>
    </div>
  );
};

export default RiskBadgeDisplay;
