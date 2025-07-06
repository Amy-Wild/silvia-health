
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Users, 
  Stethoscope, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  UserCheck,
  FileText,
  Shield,
  Calendar
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

const Instructions = () => {
  const { userRole } = useAuth();
  
  // Determine which sections to show based on user role
  const showGPFirst = userRole === 'gp' || userRole === 'clinical_admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gentle-blue/30 to-soft-coral/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">User Instructions</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive guides for patients and healthcare professionals using the SYLVIA Health Assessment platform.
            </p>
          </div>

          {/* Two-column layout - GP guide first for healthcare professionals */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* GP Guide - Show first for healthcare professionals */}
            {showGPFirst ? (
              <>
                <GPGuideSection />
                <PatientGuideSection />
              </>
            ) : (
              <>
                <PatientGuideSection />
                <GPGuideSection />
              </>
            )}
          </div>

          {/* Additional Resources */}
          <Card className="mt-12 bg-light-purple/30 border-light-purple-dark/20">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-900">
                <BookOpen className="w-6 h-6 mr-3" />
                Additional Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Shield className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-purple-900 mb-2">Privacy & Security</h3>
                  <p className="text-sm text-purple-700">All data is encrypted and complies with NHS security standards.</p>
                </div>
                <div className="text-center">
                  <FileText className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-purple-900 mb-2">Clinical Guidelines</h3>
                  <p className="text-sm text-purple-700">Based on NICE NG23 and RCOG evidence-based recommendations.</p>
                </div>
                <div className="text-center">
                  <UserCheck className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-purple-900 mb-2">Support</h3>
                  <p className="text-sm text-purple-700">Technical support available for healthcare professionals.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// GP Guide Component
const GPGuideSection = () => (
  <Card className="h-fit bg-gentle-blue/40 border-gentle-blue-dark/30">
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center text-blue-900">
          <Stethoscope className="w-6 h-6 mr-3" />
          For GPs
        </CardTitle>
        <Badge className="bg-blue-600 text-white">Healthcare Professional</Badge>
      </div>
      <p className="text-blue-700">GP-Initiated Assessment Flow</p>
    </CardHeader>
    <CardContent className="space-y-6">
      {/* Step 1 */}
      <div className="flex items-start space-x-4">
        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
        <div>
          <h3 className="font-semibold text-blue-900 mb-2">Create Assessment Link</h3>
          <p className="text-sm text-blue-800 mb-3">
            Log into your GP dashboard and click "New Assessment". Enter patient details to generate a secure, personalized assessment link.
          </p>
          <div className="bg-blue-100 p-3 rounded border-l-4 border-blue-500">
            <p className="text-xs text-blue-700">
              <strong>Security:</strong> Each link is unique, expires in 48 hours, and is single-use only.
            </p>
          </div>
        </div>
      </div>

      {/* Step 2 */}
      <div className="flex items-start space-x-4">
        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
        <div>
          <h3 className="font-semibold text-blue-900 mb-2">Share with Patient</h3>
          <p className="text-sm text-blue-800 mb-3">
            Send the generated link to your patient via secure email or SMS. The link includes clear instructions for the patient.
          </p>
          <div className="flex items-center space-x-2 text-xs text-blue-700">
            <Clock className="w-4 h-4" />
            <span>Assessment takes 10-15 minutes to complete</span>
          </div>
        </div>
      </div>

      {/* Step 3 */}
      <div className="flex items-start space-x-4">
        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
        <div>
          <h3 className="font-semibold text-blue-900 mb-2">Review Results</h3>
          <p className="text-sm text-blue-800 mb-3">
            Once completed, access comprehensive clinical results through your dashboard. Results include risk assessment, treatment recommendations, and red flags.
          </p>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs text-blue-700">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Evidence-based treatment recommendations</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-blue-700">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <span>Automated red flag identification</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">Key Features for GPs:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Automated clinical decision support</li>
          <li>• NHS NICE NG23 compliant recommendations</li>
          <li>• Risk stratification and urgency scoring</li>
          <li>• Export functionality for patient records</li>
          <li>• Secure patient communication templates</li>
        </ul>
      </div>
    </CardContent>
  </Card>
);

// Patient Guide Component  
const PatientGuideSection = () => (
  <Card className="h-fit bg-soft-coral/40 border-soft-coral-dark/30">
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center text-orange-900">
          <Users className="w-6 h-6 mr-3" />
          For Patients
        </CardTitle>
        <Badge className="bg-orange-600 text-white">Patient Guide</Badge>
      </div>
      <p className="text-orange-700">GP-Initiated Assessment Process</p>
    </CardHeader>
    <CardContent className="space-y-6">
      {/* Step 1 */}
      <div className="flex items-start space-x-4">
        <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
        <div>
          <h3 className="font-semibold text-orange-900 mb-2">Receive Assessment Link</h3>
          <p className="text-sm text-orange-800 mb-3">
            Your GP will send you a secure link via email or text message. Click the link when you're ready to complete your assessment.
          </p>
          <div className="bg-orange-100 p-3 rounded border-l-4 border-orange-500">
            <p className="text-xs text-orange-700">
              <strong>Important:</strong> The link is personal to you and expires in 48 hours for security.
            </p>
          </div>
        </div>
      </div>

      {/* Step 2 */}
      <div className="flex items-start space-x-4">
        <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
        <div>
          <h3 className="font-semibold text-orange-900 mb-2">Complete Assessment</h3>
          <p className="text-sm text-orange-800 mb-3">
            The assessment covers your symptoms, medical history, and lifestyle. Answer honestly - all information is confidential and helps your GP provide better care.
          </p>
          <div className="flex items-center space-x-2 text-xs text-orange-700 mb-2">
            <Clock className="w-4 h-4" />
            <span>Takes 10-15 minutes to complete</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-orange-700">
            <Shield className="w-4 h-4" />
            <span>All information is secure and confidential</span>
          </div>
        </div>
      </div>

      {/* Step 3 */}
      <div className="flex items-start space-x-4">
        <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
        <div>
          <h3 className="font-semibold text-orange-900 mb-2">Follow Up with GP</h3>
          <p className="text-sm text-orange-800 mb-3">
            After completion, your GP will review your results and contact you to arrange a follow-up appointment if needed.
          </p>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs text-orange-700">
              <Calendar className="w-4 h-4" />
              <span>Your GP will contact you within 3-5 working days</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-orange-700">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Results help create your personalized treatment plan</span>
            </div>
          </div>
        </div>
      </div>

      {/* What to Expect */}
      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
        <h4 className="font-semibold text-orange-900 mb-2">What to Expect:</h4>
        <ul className="text-xs text-orange-800 space-y-1">
          <li>• Questions about your menopause symptoms</li>
          <li>• Medical history and current medications</li>
          <li>• Lifestyle factors affecting your health</li>
          <li>• Your preferences for treatment options</li>
          <li>• Space for additional comments or concerns</li>
        </ul>
      </div>

      {/* Preparation Tips */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h4 className="font-semibold text-yellow-900 mb-2">Before You Start:</h4>
        <ul className="text-xs text-yellow-800 space-y-1">
          <li>• Set aside 15 minutes in a quiet space</li>
          <li>• Have your current medication list ready</li>
          <li>• Think about your symptoms over the past month</li>
          <li>• Consider any questions for your GP</li>
        </ul>
      </div>
    </CardContent>
  </Card>
);

export default Instructions;
