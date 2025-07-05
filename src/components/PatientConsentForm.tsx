
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Shield } from "lucide-react";

interface ConsentFormProps {
  onConsentGiven: (consents: ConsentData) => void;
  isRequired?: boolean;
}

interface ConsentData {
  dataProcessing: boolean;
  clinicalAssessment: boolean;
  dataSharing: boolean;
  communicationPreferences: boolean;
  timestamp: string;
}

const PatientConsentForm = ({ onConsentGiven, isRequired = true }: ConsentFormProps) => {
  const [consents, setConsents] = useState<ConsentData>({
    dataProcessing: false,
    clinicalAssessment: false,
    dataSharing: false,
    communicationPreferences: false,
    timestamp: new Date().toISOString()
  });

  const handleConsentChange = (key: keyof ConsentData, value: boolean) => {
    const newConsents = { 
      ...consents, 
      [key]: value,
      timestamp: new Date().toISOString() 
    };
    setConsents(newConsents);
  };

  const handleSubmit = () => {
    if (isRequired && (!consents.dataProcessing || !consents.clinicalAssessment)) {
      return; // Required consents not given
    }
    onConsentGiven(consents);
  };

  const allRequiredConsentsGiven = consents.dataProcessing && consents.clinicalAssessment;

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <CardTitle className="text-blue-800">Patient Consent & Data Protection</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="w-4 h-4" />
          <AlertDescription>
            This assessment follows NHS data protection standards. Your information is handled securely and confidentially.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-3 rounded-lg bg-white border">
            <Checkbox
              id="data-processing"
              checked={consents.dataProcessing}
              onCheckedChange={(checked) => handleConsentChange('dataProcessing', checked as boolean)}
            />
            <div className="space-y-1">
              <Label htmlFor="data-processing" className="text-sm font-medium text-gray-900">
                Data Processing Consent <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-gray-600">
                I consent to the processing of my health data for this clinical assessment, 
                in accordance with GDPR and NHS data protection policies.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-lg bg-white border">
            <Checkbox
              id="clinical-assessment"
              checked={consents.clinicalAssessment}
              onCheckedChange={(checked) => handleConsentChange('clinicalAssessment', checked as boolean)}
            />
            <div className="space-y-1">
              <Label htmlFor="clinical-assessment" className="text-sm font-medium text-gray-900">
                Clinical Assessment Consent <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-gray-600">
                I understand this assessment will be reviewed by my GP and may influence my treatment plan.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-lg bg-white border">
            <Checkbox
              id="data-sharing"
              checked={consents.dataSharing}
              onCheckedChange={(checked) => handleConsentChange('dataSharing', checked as boolean)}
            />
            <div className="space-y-1">
              <Label htmlFor="data-sharing" className="text-sm font-medium text-gray-900">
                Healthcare Team Sharing (Optional)
              </Label>
              <p className="text-xs text-gray-600">
                I consent to sharing my assessment results with relevant healthcare professionals 
                involved in my care (nurses, specialists, etc.).
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-lg bg-white border">
            <Checkbox
              id="communication-preferences"
              checked={consents.communicationPreferences}
              onCheckedChange={(checked) => handleConsentChange('communicationPreferences', checked as boolean)}
            />
            <div className="space-y-1">
              <Label htmlFor="communication-preferences" className="text-sm font-medium text-gray-900">
                Follow-up Communications (Optional)
              </Label>
              <p className="text-xs text-gray-600">
                I consent to receive follow-up communications about my assessment results and care recommendations.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <p className="text-xs text-gray-500 mb-3">
            <strong>Your Rights:</strong> You can withdraw consent at any time, request data deletion, 
            or ask for a copy of your data by contacting your GP practice.
          </p>
          
          <Button 
            onClick={handleSubmit}
            disabled={!allRequiredConsentsGiven}
            className="w-full"
          >
            {allRequiredConsentsGiven ? 'Continue with Assessment' : 'Please provide required consents'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientConsentForm;
