
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Copy, Link, Mail, MessageSquare, Clock, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import CommunicationTemplates from "./CommunicationTemplates";

const AssessmentLinkGenerator = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [patientIdentifier, setPatientIdentifier] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<{
    id: string;
    fullUrl: string;
    patientIdentifier: string;
    expiresAt: string;
  } | null>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);

  const generateLink = async () => {
    if (!user || !patientIdentifier.trim()) return;

    setGenerating(true);
    try {
      const { data, error } = await supabase
        .from('assessment_links')
        .insert({
          created_by: user.id,
          patient_identifier: patientIdentifier.trim(),
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      const fullUrl = `${window.location.origin}/assessment/${data.id}`;
      
      setGeneratedLink({
        id: data.id,
        fullUrl,
        patientIdentifier: data.patient_identifier,
        expiresAt: data.expires_at
      });
      
      setShowLinkModal(true);
      setPatientIdentifier('');

      toast({
        title: "Assessment Link Generated",
        description: "The link is ready to share with your patient.",
      });
    } catch (error) {
      console.error('Error generating link:', error);
      toast({
        title: "Error",
        description: "Failed to generate assessment link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const copyLink = async () => {
    if (!generatedLink) return;
    
    try {
      await navigator.clipboard.writeText(generatedLink.fullUrl);
      toast({
        title: "Copied!",
        description: "Assessment link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please manually copy the link",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Link className="w-5 h-5 mr-2" />
            Generate Assessment Link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patient-id">Patient Identifier</Label>
            <Input
              id="patient-id"
              value={patientIdentifier}
              onChange={(e) => setPatientIdentifier(e.target.value)}
              placeholder="Email address or patient reference"
              className="w-full"
            />
          </div>

          <Button 
            onClick={generateLink}
            disabled={!patientIdentifier.trim() || generating}
            className="w-full"
          >
            {generating ? 'Generating...' : 'Generate Secure Link'}
          </Button>

          <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
            <div className="flex items-start space-x-2">
              <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Security Notice</p>
                <p>Links are single-use only and expire in 48 hours for patient safety.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Link Generation Modal */}
      <Dialog open={showLinkModal} onOpenChange={setShowLinkModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Link className="w-5 h-5 mr-2" />
              Assessment Link Generated
            </DialogTitle>
          </DialogHeader>
          
          {generatedLink && (
            <div className="space-y-6">
              {/* Link Details */}
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Patient:</Label>
                      <p className="text-sm">{generatedLink.patientIdentifier}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Assessment Link:</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Input
                          value={generatedLink.fullUrl}
                          readOnly
                          className="text-xs bg-white"
                        />
                        <Button variant="outline" size="sm" onClick={copyLink}>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm">
                      <Badge variant="outline" className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Expires: {new Date(generatedLink.expiresAt).toLocaleString()}
                      </Badge>
                      <Badge variant="outline">Single Use</Badge>
                      <Badge variant="outline">Secure</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Communication Templates */}
              <CommunicationTemplates 
                assessmentLink={generatedLink.fullUrl}
                patientName={generatedLink.patientIdentifier}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AssessmentLinkGenerator;
