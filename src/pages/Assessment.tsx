
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AssessmentForm from "@/components/AssessmentForm";

const Assessment = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [assessmentData, setAssessmentData] = useState({});
  const [riskLevel, setRiskLevel] = useState("green");

  const totalSteps = 7;
  const progress = (currentStep / totalSteps) * 100;

  const steps = [
    "Patient Information",
    "Menstrual History", 
    "Vasomotor Symptoms",
    "Physical Symptoms",
    "Psychological Health",
    "Sexual Health & Sleep",
    "Review & Results"
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/results');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getRiskBadge = () => {
    switch (riskLevel) {
      case "red":
        return <Badge className="bg-red-500 text-white">High Risk - Urgent Review</Badge>;
      case "amber":
        return <Badge className="bg-amber-500 text-white">Moderate Risk</Badge>;
      default:
        return <Badge className="bg-green-500 text-white">Routine Care</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            {getRiskBadge()}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Section */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-xl">Patient Assessment Progress</CardTitle>
                <span className="text-sm text-gray-500">
                  Step {currentStep} of {totalSteps}
                </span>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-600 mt-2">
                Current: {steps[currentStep - 1]}
              </p>
            </CardHeader>
          </Card>

          {/* Assessment Form */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full text-white flex items-center justify-center text-sm font-bold">
                  {currentStep}
                </div>
                <CardTitle className="text-xl">{steps[currentStep - 1]}</CardTitle>
              </div>
              {riskLevel === "red" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="text-red-800 font-medium">Red Flag Symptoms Detected</p>
                    <p className="text-red-600 text-sm">Urgent medical review recommended</p>
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <AssessmentForm 
                step={currentStep}
                data={assessmentData}
                onDataChange={setAssessmentData}
                onRiskChange={setRiskLevel}
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
              className="bg-blue-600 hover:bg-blue-700 flex items-center"
            >
              {currentStep === totalSteps ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete Assessment
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>

          {/* Step Navigation */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {steps.map((step, index) => (
              <Button
                key={index}
                variant={currentStep === index + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentStep(index + 1)}
                className="text-xs"
              >
                {index + 1}. {step}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
