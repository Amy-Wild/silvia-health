
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface UrgentWarningProps {
  show: boolean;
}

const UrgentWarning = ({ show }: UrgentWarningProps) => {
  if (!show) return null;

  return (
    <Card className="mb-6 bg-red-50 border-red-200">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <div>
            <p className="text-red-800 font-medium">Important Medical Review Needed</p>
            <p className="text-red-600 text-sm">Based on your responses, we recommend discussing these symptoms with your GP soon.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UrgentWarning;
