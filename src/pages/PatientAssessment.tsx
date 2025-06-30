
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, Heart } from "lucide-react";
import PatientAssessmentForm from "@/components/PatientAssessmentForm";
import { calculateRiskLevel } from "@/components/ConditionalQuestionLogic";
import { EmailService } from "@/services/EmailService";
import { useToast } from "@/hooks/use-toast";

const PatientAssessment = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [assessmentData, setAssessmentData] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit assessment
      await submitAssessment();
    }
  };

  const submitAssessment = async () => {
    setIsSubmitting(true);
    try {
      // Calculate risk level
      const riskLevel = calculateRiskLevel(assessmentData);
      
      // Prepare assessment result
      const result = {
        sessionId: sessionId!,
        patientRef: assessmentData.patientRef || "",
        completedAt: new Date().toISOString(),
        riskLevel,
        redFlags: getRedFlags(assessmentData),
        clinicalSummary: generateClinicalSummary(assessmentData),
        recommendations: generateRecommendations(assessmentData, riskLevel)
      };

      // Send email to GP (simulated)
      const gpEmail = "gp@example.com"; // In real app, this would be retrieved from session
      await EmailService.sendAssessmentResults(gpEmail, result);
      
      toast({
        title: "Assessment Complete",
        description: "Your results have been sent to your GP",
      });

      // Navigate to results page
      navigate(`/patient-results/${sessionId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit assessment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRedFlags = (data: any): string[] => {
    const flags = [];
    if (data.postmenopausalBleeding === "yes") flags.push("Postmenopausal bleeding");
    if (data.unexplainedWeightLoss === "yes") flags.push("Unexplained weight loss");
    if (data.severePelvicPain === "yes") flags.push("Severe pelvic pain");
    return flags;
  };

  const generateClinicalSummary = (data: any) => {
    return {
      vasomotor: data.hotFlashFrequency || "Not reported",
      physical: data.physicalSymptoms || "Not reported",
      psychological: data.moodSymptoms || "Not reported",
      sexual: data.libidoChanges || "Not reported",
      smoking: data.smokingStatus || "Not reported",
      alcohol: data.alcoholConsumption || "Not reported",
      exercise: data.exerciseLevel || "Not reported",
      bmi: data.bmi || "Not calculated"
    };
  };

  const generateRecommendations = (data: any, riskLevel: string): string[] => {
    const recommendations = [];
    
    if (riskLevel === "red") {
      recommendations.push("Urgent medical review required");
      recommendations.push("Consider urgent referral");
    }
    
    if (data.hotFlashFrequency === "severe" || data.nightSweats === "severe") {
      recommendations.push("Discuss HRT options");
    }
    
    if (data.smokingStatus === "current") {
      recommendations.push("Smoking cessation support");
    }
    
    if (data.exerciseLevel === "none") {
      recommendations.push("Exercise counseling");
    }
    
    if (data.alcoholConsumption === "22+") {
      recommendations.push("Alcohol reduction advice");
    }
    
    recommendations.push("Lifestyle counseling");
    recommendations.push("Follow-up appointment in 4-6 weeks");
    
    return recommendations;
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
              disabled={(!isValid && currentStep < totalSteps) || isSubmitting}
              className="bg-pink-500 hover:bg-pink-600 flex items-center"
            >
              {isSubmitting ? (
                <>Submitting...</>
              ) : currentStep === totalSteps ? (
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
