
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, Mail, UserCheck, ClipboardList, BarChart3, Clock, Calendar, User } from "lucide-react";

const GPInstructions = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">GP User Guide</CardTitle>
          <p className="text-blue-100">Streamlined menopause assessments with minimal admin</p>
        </CardHeader>
      </Card>

      {/* Patient Identification System */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-800">
            <User className="w-5 h-5 mr-2" />
            Smart Patient Identification - Zero Admin Overhead
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-blue-700 font-medium">Choose your preferred identification method for effortless patient tracking:</p>
          
          <div className="grid gap-4">
            <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-center space-x-2 mb-2">
                <Badge className="bg-blue-500 text-white">Initials</Badge>
                <span className="font-semibold">Patient Initials (Most Popular)</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Enter: "J.S." → Dashboard shows: "J.S."</p>
              <p className="text-xs text-gray-500">Perfect for quick identification while maintaining privacy</p>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
              <div className="flex items-center space-x-2 mb-2">
                <Badge className="bg-green-500 text-white">DOB</Badge>
                <span className="font-semibold">Date of Birth</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Enter: "15/03/1968" → Dashboard shows: "DOB: 15/03/1968"</p>
              <p className="text-xs text-gray-500">Useful when multiple patients share initials</p>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-purple-500">
              <div className="flex items-center space-x-2 mb-2">
                <Badge className="bg-purple-500 text-white">Custom</Badge>
                <span className="font-semibold">Your Own System</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Enter: "Room-3-10am" → Dashboard shows: "Room-3-10am"</p>
              <p className="text-xs text-gray-500">Use your existing patient reference system</p>
            </div>
          </div>

          <div className="bg-white p-3 rounded border-l-4 border-blue-500">
            <p className="text-sm font-medium text-blue-800">✓ No NHS numbers stored ✓ No patient names required ✓ You choose the reference system</p>
          </div>
        </CardContent>
      </Card>

      {/* Step by Step Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ClipboardList className="w-5 h-5 mr-2" />
            30-Second Workflow
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="font-semibold">Quick Setup (10 seconds)</h3>
                <p className="text-gray-600 text-sm">Choose identification method → Enter reference → Add appointment date (optional) → Click "Generate & Copy Link"</p>
                <p className="text-xs text-blue-600 mt-1">✓ Link automatically copied to clipboard</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="font-semibold">Send to Patient</h3>
                <p className="text-gray-600 text-sm">Paste link in email/SMS or share verbally. Patient completes 10-minute assessment on any device.</p>
                <p className="text-xs text-green-600 mt-1">✓ Works on phones, tablets, computers</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="font-semibold">Automatic Tracking</h3>
                <p className="text-gray-600 text-sm">Dashboard shows real-time status with visual indicators. No manual checking required.</p>
                <div className="flex space-x-2 mt-2">
                  <Badge className="bg-blue-500 text-white text-xs">Sent</Badge>
                  <Badge className="bg-amber-500 text-white text-xs">Follow-up</Badge>
                  <Badge className="bg-red-500 text-white text-xs">Overdue</Badge>
                  <Badge className="bg-green-500 text-white text-xs">Completed</Badge>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">4</div>
              <div>
                <h3 className="font-semibold">Instant Results</h3>
                <p className="text-gray-600 text-sm">Get immediate email notification with clinical report. One-click access to detailed analysis.</p>
                <p className="text-xs text-purple-600 mt-1">✓ NICE-compliant recommendations included</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visual Status System */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Smart Status Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">Never lose track of assessments with automatic status updates:</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Badge className="bg-blue-500 text-white">Sent</Badge>
                <span className="text-sm">Assessment link shared (Days 0-3)</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
                <Badge className="bg-amber-500 text-white">Follow-up</Badge>
                <span className="text-sm">Gentle reminder needed (Days 4-7)</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                <Badge className="bg-red-500 text-white">Overdue</Badge>
                <span className="text-sm">Needs attention (7+ days)</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <Badge className="bg-green-500 text-white">Completed</Badge>
                <span className="text-sm">Ready for clinical review</span>
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
            Clinical Features
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
            NHS-Grade Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-center space-x-3">
              <Lock className="w-4 h-4 text-green-600" />
              <span className="text-sm"><strong>Anonymous by Design:</strong> No NHS numbers, names, or addresses stored</span>
            </div>
            <div className="flex items-center space-x-3">
              <UserCheck className="w-4 h-4 text-green-600" />
              <span className="text-sm"><strong>Secure Sessions:</strong> Each assessment uses a unique, one-time encrypted link</span>
            </div>
            <div className="flex items-center space-x-3">
              <Eye className="w-4 h-4 text-green-600" />
              <span className="text-sm"><strong>GP Access Only:</strong> Only you can access your patient's responses using your reference system</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-green-600" />
              <span className="text-sm"><strong>Medical-Grade Encryption:</strong> All data transmission exceeds NHS security standards</span>
            </div>
          </div>
          <div className="bg-white p-3 rounded border-l-4 border-green-500">
            <p className="text-sm text-gray-700">
              <strong>Patient Privacy:</strong> Your identification system means patients remain anonymous while you maintain perfect tracking. 
              Assessment data is only accessible via your unique GP dashboard and expires after clinical review.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GPInstructions;
