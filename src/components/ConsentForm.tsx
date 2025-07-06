
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Shield, FileText, Users } from "lucide-react";

interface ConsentFormProps {
  onConsent: () => void;
}

const ConsentForm = ({ onConsent }: ConsentFormProps) => {
  const [consents, setConsents] = useState({
    dataStorage: false,
    gpAccess: false,
    privacyPolicy: false
  });

  const allConsented = Object.values(consents).every(consent => consent);

  const handleConsentChange = (key: keyof typeof consents, checked: boolean) => {
    setConsents(prev => ({ ...prev, [key]: checked }));
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center text-blue-800">
          <Shield className="w-5 h-5 mr-2" />
          Data Protection & Consent
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-white p-4 rounded border-l-4 border-blue-500">
          <p className="text-blue-800 font-medium mb-2">This assessment collects personal health data</p>
          <p className="text-sm text-blue-700">
            Your responses will be stored securely and may be shared with your healthcare provider 
            to support your care. All data is encrypted and handled according to NHS standards.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="data-storage"
              checked={consents.dataStorage}
              onCheckedChange={(checked) => handleConsentChange('dataStorage', checked as boolean)}
            />
            <div className="flex-1">
              <label htmlFor="data-storage" className="text-sm font-medium cursor-pointer">
                I consent to SYLVIA Health storing my data securely
              </label>
              <p className="text-xs text-gray-600 mt-1">
                Your data is encrypted and stored on UK-based servers for up to 7 years
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="gp-access"
              checked={consents.gpAccess}
              onCheckedChange={(checked) => handleConsentChange('gpAccess', checked as boolean)}
            />
            <div className="flex-1">
              <label htmlFor="gp-access" className="text-sm font-medium cursor-pointer">
                I understand my GP can access this assessment
              </label>
              <p className="text-xs text-gray-600 mt-1">
                Only the healthcare provider who sent you this assessment can view your responses
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="privacy-policy"
              checked={consents.privacyPolicy}
              onCheckedChange={(checked) => handleConsentChange('privacyPolicy', checked as boolean)}
            />
            <div className="flex-1">
              <label htmlFor="privacy-policy" className="text-sm font-medium cursor-pointer">
                I have read the privacy policy
              </label>
              <p className="text-xs text-gray-600 mt-1">
                <a href="/privacy-policy" target="_blank" className="text-blue-600 hover:underline">
                  View full privacy policy →
                </a>
              </p>
            </div>
          </div>
        </div>

        <Button 
          onClick={onConsent} 
          disabled={!allConsented}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
        >
          Continue to Assessment
        </Button>
      </CardContent>
    </Card>
  );
};

export default ConsentForm;
