
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, Heart } from "lucide-react";
import PatientAssessmentForm from "@/components/PatientAssessmentForm";

const PatientAssessment = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [assessmentData, setAssessmentData] = useState({});
  const [isValid, setIsValid] = useState(false);

  const totalSteps = 8;
  const progress = (currentStep / totalSteps) * 100;

  const steps = [
    "About You",
    "Your Periods", 
    "Hot Flashes & Night Sweats",
    "Physical Symptoms",
    "Mood & Memory",
    "Sleep & Intimacy",
    "Lifestyle & Health",
    "Complete"
  ];

  useEffect(() => {
    // Validate session ID exists
    if (!sessionId) {
      navigate('/');
    }
  }, [sessionId, navigate]);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit assessment
      navigate(`/patient-results/${sessionId}`);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDataChange = (data: any) => {
    setAssessmentData(data);
    // Basic validation - could be enhanced
    setIsValid(Object.keys(data).length > 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
      {/* Header */}
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

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Welcome Message */}
          {currentStep === 1 && (
            <Card className="mb-8 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
                <p className="text-lg opacity-90 mb-4">
                  Your GP has asked you to complete this health assessment to better understand your symptoms and provide the best care possible.
                </p>
                <p className="opacity-80">
                  This assessment is completely anonymous and secure. Your responses will help your GP prepare for your appointment.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Progress Section */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-lg">Assessment Progress</CardTitle>
                <span className="text-sm text-gray-500">
                  Step {currentStep} of {totalSteps}
                </span>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-600 mt-2">
                {steps[currentStep - 1]}
              </p>
            </CardHeader>
          </Card>

          {/* Assessment Form */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-pink-500 rounded-full text-white flex items-center justify-center text-sm font-bold">
                  {currentStep}
                </div>
                <CardTitle className="text-xl">{steps[currentStep - 1]}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <PatientAssessmentForm 
                step={currentStep}
                data={assessmentData}
                onDataChange={handleDataChange}
              />
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button 
              onClick={handleNext}
              disabled={!isValid && currentStep < totalSteps}
              className="bg-pink-500 hover:bg-pink-600 flex items-center"
            >
              {currentStep === totalSteps ? (
                <>Complete Assessment</>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientAssessment;
