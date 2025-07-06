
import { Badge } from "@/components/ui/badge";

interface RiskBadgeDisplayProps {
  riskBadge: {
    className: string;
    text: string;
  };
}

const RiskBadgeDisplay = ({ riskBadge }: RiskBadgeDisplayProps) => {
  // Use traffic light colors for risk levels - clear and universally understood
  const getRiskColorClass = (text: string) => {
    const lowRiskText = text.toLowerCase();
    
    if (lowRiskText.includes('high risk') || lowRiskText.includes('urgent') || lowRiskText.includes('red')) {
      return 'bg-risk-high text-white border-risk-high-dark';
    }
    if (lowRiskText.includes('moderate risk') || lowRiskText.includes('medium') || lowRiskText.includes('amber')) {
      return 'bg-risk-medium text-white border-risk-medium-alt';
    }
    if (lowRiskText.includes('low risk') || lowRiskText.includes('green')) {
      return 'bg-risk-low text-white border-risk-low-dark';
    }
    
    // Default fallback for non-risk badges - use brand colors
    return 'bg-gentle-blue text-blue-800 border-blue-300';
  };

  return (
    <div className="container mx-auto px-4 py-2">
      <div className="max-w-3xl mx-auto flex justify-end">
        <Badge className={getRiskColorClass(riskBadge.text)}>
          {riskBadge.text}
        </Badge>
      </div>
    </div>
  );
};

export default RiskBadgeDisplay;
