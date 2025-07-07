
import { Badge } from "@/components/ui/badge";

interface RiskBadgeDisplayProps {
  riskBadge: {
    className: string;
    text: string;
  };
}

const RiskBadgeDisplay = ({ riskBadge }: RiskBadgeDisplayProps) => {
  return (
    <div className="container mx-auto px-4 py-2">
      <div className="max-w-3xl mx-auto flex justify-end">
        <Badge className={riskBadge.className}>{riskBadge.text}</Badge>
      </div>
    </div>
  );
};

export default RiskBadgeDisplay;
