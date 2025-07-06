import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PatientWelcome from "@/components/assessment/PatientWelcome";
import PatientAssessmentForm from "@/components/PatientAssessmentForm";
import { useAssessmentState } from "@/hooks/useAssessmentState";
import { useAssessmentCompletion } from "@/hooks/useAssessmentCompletion";
import AssessmentHeader from "@/components/assessment/AssessmentHeader";
import AssessmentProgress from "@/components/assessment/AssessmentProgress";
import AssessmentNavigation from "@/components/assessment/AssessmentNavigation";

const PatientAssessment = () => {
  const params = useParams();
  const sessionId = params.sessionId;
  const { toast } = useToast();
  const [showWelcome, setShowWelcome] = useState(true);
  const [assessmentLink, setAssessmentLink] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  console.log('PatientAssessment component loaded with sessionId:', sessionId);

  // Use assessment state management
  const {
    currentStep,
    setCurrentStep,
    assessmentData,
    isValid,
    setIsValid,
    isSubmitting,
    setIsSubmitting,
    totalSteps,
    steps,
    handleDataChange,
    getRiskBadge,
    showUrgentWarning
  } = useAssessmentState();

  const { processAssessmentCompletion } = useAssessmentCompletion(sessionId);

  useEffect(() => {
    const verifyAssessmentLink = async () => {
      console.log('Verifying assessment link for sessionId:', sessionId);
      
      if (!sessionId) {
        console.log('No sessionId provided');
        toast({
          title: "Invalid Link",
          description: "No assessment session ID provided.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('assessment_links')
          .select('*')
          .eq('id', sessionId)
          .single();

        console.log('Assessment link data:', data);
        console.log('Assessment link error:', error);

        if (error || !data) {
          console.error('Assessment link not found or error:', error);
          toast({
            title: "Invalid Link",
            description: "This assessment link is invalid or has expired.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        // Check if link has expired
        if (new Date(data.expires_at) < new Date()) {
          console.log('Assessment link has expired');
          toast({
            title: "Link Expired",
            description: "This assessment link has expired. Please contact your healthcare provider for a new link.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        // Check if already completed
        if (data.status === 'completed') {
          console.log('Assessment already completed');
          toast({
            title: "Assessment Completed",
            description: "This assessment has already been completed.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        console.log('Assessment link verified successfully');
        setAssessmentLink(data);
      } catch (error) {
        console.error('Error verifying assessment link:', error);
        toast({
          title: "Error",
          description: "Failed to verify assessment link.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    verifyAssessmentLink();
  }, [sessionId, toast]);

  const handleStartAssessment = () => {
    console.log('Starting assessment');
    setShowWelcome(false);
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!sessionId) return;
    
    setIsSubmitting(true);
    try {
      // Store assessment data locally for GP results
      const assessmentResult = {
        sessionId,
        rawData: assessmentData,
        completedAt: new Date().toISOString(),
        patientRef: assessmentLink?.patient_identifier || 'Patient Assessment'
      };
      
      localStorage.setItem(`assessment_${sessionId}`, JSON.stringify(assessmentResult));
      
      // Update assessment link status - properly cast to Json
      await supabase
        .from('assessment_links')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString(),
          session_data: assessmentData as any
        })
        .eq('id', sessionId);

      await processAssessmentCompletion(assessmentData);
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: "Failed to submit assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-soft-coral-dark mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying assessment link...</p>
        </div>
      </div>
    );
  }

  if (!sessionId || !assessmentLink) {
    console.log('Invalid session - showing error message');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Assessment Link Invalid</h1>
          <p className="text-gray-600 mb-4">This assessment link is invalid or has expired.</p>
          <p className="text-sm text-gray-500">Please contact your healthcare provider for a new assessment link.</p>
        </div>
      </div>
    );
  }

  if (showWelcome) {
    return <PatientWelcome onStart={handleStartAssessment} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gentle-blue/30 to-soft-coral/20">
      <div className="container mx-auto px-4 py-8">
        <AssessmentHeader 
          currentStep={currentStep}
          totalSteps={totalSteps}
          stepTitle={steps[currentStep - 1]}
          riskBadge={getRiskBadge()}
          showUrgentWarning={showUrgentWarning()}
        />
        
        <AssessmentProgress 
          currentStep={currentStep}
          totalSteps={totalSteps}
          steps={steps}
        />

        <div className="mt-8">
          <PatientAssessmentForm
            step={currentStep}
            data={assessmentData}
            onDataChange={handleDataChange}
          />
        </div>

        <AssessmentNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          isValid={isValid}
          isSubmitting={isSubmitting}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default PatientAssessment;
