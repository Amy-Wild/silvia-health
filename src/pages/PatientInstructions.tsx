
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PatientInstructions from "@/components/instructions/PatientInstructions";

const PatientInstructionsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('sessionId');

  const handleStartAssessment = () => {
    if (sessionId) {
      // Mark instructions as seen for this session
      localStorage.setItem(`instructions_seen_${sessionId}`, 'true');
      navigate(`/patient-assessment/${sessionId}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Patient Instructions</h1>
                <p className="text-gray-600">Complete your assessment - Simple & Secure</p>
              </div>
            </div>
            {sessionId && (
              <Button 
                onClick={handleStartAssessment}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Assessment
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <PatientInstructions />
        
        {sessionId && (
          <div className="max-w-3xl mx-auto mt-8 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Ready to Begin?</h3>
              <p className="text-blue-700 mb-4">
                Once you've read through the instructions above, click the button below to start your assessment.
              </p>
              <Button 
                onClick={handleStartAssessment}
                className="bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Start My Assessment
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientInstructionsPage;
