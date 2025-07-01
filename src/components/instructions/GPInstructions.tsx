
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, Mail, UserCheck, ClipboardList, BarChart3 } from "lucide-react";

const GPInstructions = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">GP User Guide</CardTitle>
          <p className="text-blue-100">How to use the Menopause Assessment System</p>
        </CardHeader>
      </Card>

      {/* Step by Step Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ClipboardList className="w-5 h-5 mr-2" />
            Step-by-Step Process
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="font-semibold">Create Assessment Session</h3>
                <p className="text-gray-600 text-sm">Click "Generate & Copy Link" on your GP Dashboard. Optionally add a patient reference for your records.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="font-semibold">Send Link to Patient</h3>
                <p className="text-gray-600 text-sm">Share the secure assessment link with your patient via email, SMS, or in person. The link is anonymous and expires after completion.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="font-semibold">Patient Completes Assessment</h3>
                <p className="text-gray-600 text-sm">Patient fills out the 8-step assessment covering symptoms, lifestyle, and health history (takes 10-15 minutes).</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">4</div>
              <div>
                <h3 className="font-semibold">Receive Clinical Report</h3>
                <p className="text-gray-600 text-sm">Get an instant email with risk assessment, red flag alerts, and NICE guideline-compliant recommendations.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">5</div>
              <div>
                <h3 className="font-semibold">Review & Plan Treatment</h3>
                <p className="text-gray-600 text-sm">Use the Clinical Dashboard to review detailed results and plan your consultation approach.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Key Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Badge className="bg-green-100 text-green-800">Risk Assessment</Badge>
              <p className="text-sm text-gray-600">Automatic red, amber, green risk categorization based on symptoms</p>
            </div>
            <div className="space-y-2">
              <Badge className="bg-blue-100 text-blue-800">NICE Compliant</Badge>
              <p className="text-sm text-gray-600">Follows NHS NICE NG23 menopause guidelines</p>
            </div>
            <div className="space-y-2">
              <Badge className="bg-purple-100 text-purple-800">Red Flag Alerts</Badge>
              <p className="text-sm text-gray-600">Immediate alerts for symptoms requiring urgent attention</p>
            </div>
            <div className="space-y-2">
              <Badge className="bg-orange-100 text-orange-800">Clinical Summary</Badge>
              <p className="text-sm text-gray-600">Structured reports with treatment recommendations</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Features */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center text-green-800">
            <Shield className="w-5 h-5 mr-2" />
            Patient Data Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-center space-x-3">
              <Lock className="w-4 h-4 text-green-600" />
              <span className="text-sm"><strong>Anonymous by Default:</strong> No personal details required from patients</span>
            </div>
            <div className="flex items-center space-x-3">
              <UserCheck className="w-4 h-4 text-green-600" />
              <span className="text-sm"><strong>Secure Sessions:</strong> Each assessment uses a unique, one-time link</span>
            </div>
            <div className="flex items-center space-x-3">
              <Eye className="w-4 h-4 text-green-600" />
              <span className="text-sm"><strong>GP Access Only:</strong> Only you can access your patient's responses</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-green-600" />
              <span className="text-sm"><strong>Encrypted Transmission:</strong> All data sent securely using medical-grade encryption</span>
            </div>
          </div>
          <div className="bg-white p-3 rounded border-l-4 border-green-500">
            <p className="text-sm text-gray-700">
              <strong>Patient Privacy:</strong> We follow strict NHS data protection standards. 
              Patient responses are never stored permanently and are only accessible to the requesting GP.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GPInstructions;
