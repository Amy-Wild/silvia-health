
import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PatientWelcome from "@/components/assessment/PatientWelcome";
import AssessmentView from "@/components/assessment/AssessmentView";
import AssessmentError from "@/components/assessment/AssessmentError";
import AssessmentLoader from "@/components/assessment/AssessmentLoader";

const PatientAssessmentContainer = () => {
  const { sessionId: paramSessionId } = useParams<{ sessionId: string }>();
  const location = useLocation();
  const { toast } = useToast();
  const [showWelcome, setShowWelcome] = useState(true);
  const [assessmentLink, setAssessmentLink] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Extract sessionId more reliably
  const sessionId = paramSessionId || location.pathname.split('/').filter(Boolean).pop();

  console.log('PatientAssessment component loaded');
  console.log('URL params sessionId:', paramSessionId);
  console.log('Location pathname:', location.pathname);
  console.log('Final extracted sessionId:', sessionId);
  console.log('SessionId type:', typeof sessionId, 'Length:', sessionId?.length);

  useEffect(() => {
    const verifyAssessmentLink = async () => {
      console.log('Verifying assessment link for sessionId:', sessionId);
      
      if (!sessionId || sessionId === 'patient-assessment' || sessionId.includes(':')) {
        console.log('No valid sessionId provided. SessionId:', sessionId);
        toast({
          title: "Invalid Link",
          description: "No assessment session ID provided.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      try {
        console.log('About to query assessment_links with ID:', sessionId);
        const { data, error } = await supabase
          .from('assessment_links')
          .select('*')
          .eq('id', sessionId)
          .single();

        console.log('Assessment link query result - data:', data);
        console.log('Assessment link query result - error:', error);

        if (error) {
          console.error('Supabase query error:', error);
          toast({
            title: "Database Error",
            description: `Failed to verify assessment link: ${error.message}`,
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        if (!data) {
          console.error('No assessment link found for ID:', sessionId);
          toast({
            title: "Invalid Link",
            description: "This assessment link was not found.",
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

  if (loading) {
    return <AssessmentLoader />;
  }

  if (!sessionId || !assessmentLink) {
    return (
      <AssessmentError 
        sessionId={sessionId} 
        paramSessionId={paramSessionId}
        pathname={location.pathname}
      />
    );
  }

  if (showWelcome) {
    return <PatientWelcome onStart={() => setShowWelcome(false)} />;
  }

  return (
    <AssessmentView 
      sessionId={sessionId}
      assessmentLink={assessmentLink}
    />
  );
};

export default PatientAssessmentContainer;
