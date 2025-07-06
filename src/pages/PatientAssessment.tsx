
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PatientAssessmentForm from "@/components/PatientAssessmentForm";
import AssessmentHeader from "@/components/assessment/AssessmentHeader";
import AssessmentProgress from "@/components/assessment/AssessmentProgress";
import AssessmentNavigation from "@/components/assessment/AssessmentNavigation";
import WelcomeMessage from "@/components/assessment/WelcomeMessage";
import { generatePatientGuidance, calculateRiskLevel, getUrgentFlags } from "@/components/ConditionalQuestionLogic";
import { processAssessmentData } from "@/utils/assessmentProcessor";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

interface AssessmentData {
  patientRef?: string;
  dateOfBirth: string; // Required field to match PatientAssessmentData
  age?: string;
  menstrualStatus?: string;
  periodsStopped?: string;
  postmenopausalBleeding?: string;
  unexplainedWeightLoss?: string;
  severePelvicPain?: string;
  hotFlashFrequency?: string;
  nightSweats?: string;
  physicalSymptoms?: string[];
  moodSymptoms?: string;
  libidoChanges?: string;
  smokingStatus?: string;
  alcoholConsumption?: string;
  exerciseLevel?: string;
  bmi?: string;
  treatmentPreferences?: string[];
  personalMedicalHistory?: string[];
  familyHistory?: string[];
  height?: string;
  weight?: string;
  sleepQuality?: string;
  vaginalSymptoms?: string;
  cognitiveSymptoms?: string;
  vasomotorImpact?: string;
  moodImpact?: string;
  primaryConcern?: string;
  occupation?: string;
  additionalInfo?: string;
  [key: string]: any;
}

const PatientAssessment = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    dateOfBirth: "" // Initialize with empty string to satisfy required field
  });
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [riskLevel, setRiskLevel] = useState("low");

  const totalSteps = 8;
  const steps = [
    "About You",
    "Your Periods", 
    "Hot Flashes & Night Sweats",
    "Physical Symptoms",
    "Mood & Memory",
    "Sleep & Treatment Preferences",
    "Medical History & Lifestyle",
    "Complete"
  ];

  useEffect(() => {
    if (!sessionId) {
      navigate('/');
    }
  }, [sessionId, navigate]);

  // Calculate risk level in real-time as data changes
  useEffect(() => {
    const currentRisk = calculateRiskLevel(assessmentData);
    setRiskLevel(currentRisk);
  }, [assessmentData]);

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      await processAssessmentCompletion();
    }
  };

  const processAssessmentCompletion = async () => {
    setIsSubmitting(true);
    try {
      const { result, normalizedData, determinedPath } = await processAssessmentData(assessmentData, sessionId!);

      // Route based on care pathway - Fixed to use correct pathway values
      if (determinedPath === 'self-care' || determinedPath === 'education') {
        const treatmentPreferences = normalizedData.treatmentPreferences || [];
        const educationUrl = treatmentPreferences.length > 0 
          ? `/education?preferences=${treatmentPreferences.join(',')}&sessionId=${sessionId}&source=assessment`
          : `/education?sessionId=${sessionId}&source=assessment`;
        
        toast({
          title: "Great news! You can manage your symptoms effectively",
          description: "You're being redirected to educational resources to support your wellness journey.",
          duration: 3000
        });
        
        // Redirect to educational website after brief delay
        setTimeout(() => {
          window.location.href = educationUrl;
        }, 2000);
        
        return;
      } else {
        // Show patient guidance for GP appointments
        const patientGuidance = generatePatientGuidance(determinedPath, normalizedData);
        
        toast({
          title: patientGuidance.title,
          description: patientGuidance.nextSteps[0],
          duration: 5000
        });
        
        navigate(`/patient-results/${sessionId}`);
      }
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to process assessment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDataChange = (data: AssessmentData) => {
    setAssessmentData(data);
    setIsValid(Object.keys(data).length > 0);
  };

  const getRiskBadge = () => {
    const urgentFlags = getUrgentFlags(assessmentData);
    
    if (urgentFlags.length > 0) {
      return <Badge className="bg-red-500 text-white">Urgent Review Recommended</Badge>;
    }
    
    switch (riskLevel) {
      case "urgent":
        return <Badge className="bg-red-500 text-white">Urgent Care Needed</Badge>;
      case "high":
        return <Badge className="bg-orange-500 text-white">High Priority</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500 text-white">Routine Care</Badge>;
      default:
        return <Badge className="bg-green-500 text-white">Low Risk</Badge>;
    }
  };

  const showUrgentWarning = () => {
    const urgentFlags = getUrgentFlags(assessmentData);
    return urgentFlags.length > 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
      <AssessmentHeader 
        currentStep={currentStep}
        totalSteps={totalSteps}
        stepTitle={steps[currentStep - 1]}
        riskBadge={{
          className: riskLevel === 'urgent' ? 'bg-red-500 text-white' : 
                    riskLevel === 'high' ? 'bg-orange-500 text-white' :
                    riskLevel === 'medium' ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white',
          text: riskLevel === 'urgent' ? 'Urgent Care Needed' :
                riskLevel === 'high' ? 'High Priority' :
                riskLevel === 'medium' ? 'Routine Care' : 'Low Risk'
        }}
        showUrgentWarning={showUrgentWarning()}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <WelcomeMessage show={currentStep === 1} />

          {/* Urgent Warning */}
          {showUrgentWarning() && (
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
          )}

          <AssessmentProgress 
            currentStep={currentStep}
            totalSteps={totalSteps}
            steps={steps}
          />

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

          <AssessmentNavigation 
            currentStep={currentStep}
            totalSteps={totalSteps}
            isValid={isValid}
            isSubmitting={isSubmitting}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSubmit={processAssessmentCompletion}
          />
        </div>
      </div>
    </div>
  );
};

export default PatientAssessment;
