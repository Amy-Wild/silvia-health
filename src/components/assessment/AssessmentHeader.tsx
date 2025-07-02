
import { Heart } from "lucide-react";

const AssessmentHeader = () => {
  return (
    <header className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-900">Your Health Assessment</h1>
              <p className="text-sm text-gray-600">Understanding your menopause journey</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AssessmentHeader;
