
import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PatientWelcome from "@/components/assessment/PatientWelcome";
import PatientAssessmentForm from "@/components/PatientAssessmentForm";

const PatientAssessment = () => {
  const { sessionId } = useParams();
  const { toast } = useToast();
  const [showWelcome, setShowWelcome] = useState(true);
  const [assessmentLink, setAssessmentLink] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAssessmentLink = async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('assessment_links')
          .select('*')
          .eq('id', sessionId)
          .single();

        if (error || !data) {
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
          toast({
            title: "Assessment Completed",
            description: "This assessment has already been completed.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

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
    setShowWelcome(false);
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
    return <Navigate to="/" replace />;
  }

  if (showWelcome) {
    return <PatientWelcome onStart={handleStartAssessment} />;
  }

  return <PatientAssessmentForm sessionId={sessionId} />;
};

export default PatientAssessment;
