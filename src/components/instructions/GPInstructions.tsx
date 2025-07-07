
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, Mail, UserCheck, ClipboardList, BarChart3, Clock, Calendar, User, Stethoscope, Heart, Bone } from "lucide-react";

const GPInstructions = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">GP User Guide</CardTitle>
          <p className="text-blue-100">NICE NG23 Enhanced Evidence-Based Clinical Assessment Platform</p>
        </CardHeader>
      </Card>

      {/* Enhanced Clinical Features - NEW */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center text-purple-800">
            <Stethoscope className="w-5 h-5 mr-2" />
            NICE NG23 Enhanced Evidence-Based Clinical Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-purple-700 font-medium">Building on NICE NG23 foundations with enhanced 2024 evidence-based clinical features:</p>
          
          <div className="grid gap-4">
            <div className="bg-white p-4 rounded-lg border-l-4 border-red-500">
              <div className="flex items-center space-x-2 mb-2">
                <Heart className="w-4 h-4 text-red-600" />
                <span className="font-semibold">Enhanced UTI Risk Assessment</span>
                <Badge className="bg-red-100 text-red-800 text-xs">NICE NG23 + Cochrane 2023</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">Comprehensive screening for recurrent UTI risk factors alongside standard NICE NG23 assessment</p>
              <p className="text-xs text-gray-500">Supporting evidence: 61% reduction in UTI recurrence with vaginal estrogen therapy</p>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-orange-500">
              <div className="flex items-center space-x-2 mb-2">
                <Bone className="w-4 h-4 text-orange-600" />
                <span className="font-semibold">Enhanced Bone Health Screening</span>
                <Badge className="bg-orange-100 text-orange-800 text-xs">NICE NG23 + FRAX Algorithm</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">DEXA scan recommendations based on NICE NG23 criteria plus enhanced fracture risk factors</p>
              <p className="text-xs text-gray-500">Supporting evidence: 30-40% fracture reduction with HRT for high-risk patients</p>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-center space-x-2 mb-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span className="font-semibold">Enhanced Risk Stratification</span>
                <Badge className="bg-blue-100 text-blue-800 text-xs">NICE NG23 + Latest Research</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">Cardiovascular timing hypothesis and enhanced contraindication checking building on NICE NG23 framework</p>
              <p className="text-xs text-gray-500">Transparent scoring with confidence intervals supporting clinical decisions</p>
            </div>
          </div>

          <div className="bg-white p-3 rounded border-l-4 border-purple-500">
            <p className="text-sm font-medium text-purple-800">✓ NICE NG23 compliant ✓ Enhanced evidence grading ✓ Study citations ✓ Clinical confidence scores</p>
          </div>
        </CardContent>
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
                <p className="text-gray-600 text-sm">Paste link in email/SMS or share verbally. Patient completes 10-minute NICE NG23 enhanced comprehensive assessment on any device.</p>
                <p className="text-xs text-green-600 mt-1">✓ Enhanced with UTI and bone health screening</p>
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
                <h3 className="font-semibold">NICE NG23 Enhanced Clinical Report</h3>
                <p className="text-gray-600 text-sm">Get immediate email notification with comprehensive clinical analysis including NICE NG23 compliance plus enhanced evidence grades and confidence scores.</p>
                <p className="text-xs text-purple-600 mt-1">✓ NICE NG23 compliant + latest research integrated</p>
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
            NICE NG23 Enhanced Clinical Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Badge className="bg-green-100 text-green-800">Enhanced Risk Assessment</Badge>
              <p className="text-sm text-gray-600">NICE NG23 plus UTI risk, bone health, cardiovascular factors with confidence scoring</p>
            </div>
            <div className="space-y-2">
              <Badge className="bg-blue-100 text-blue-800">Evidence-Based</Badge>
              <p className="text-sm text-gray-600">NICE NG23 + Cochrane reviews + latest 2024 research</p>
            </div>
            <div className="space-y-2">
              <Badge className="bg-purple-100 text-purple-800">Transparent Scoring</Badge>
              <p className="text-sm text-gray-600">See exactly how recommendations are calculated with NICE NG23 criteria plus evidence grades</p>
            </div>
            <div className="space-y-2">
              <Badge className="bg-orange-100 text-orange-800">Comprehensive Screening</Badge>
              <p className="text-sm text-gray-600">NICE NG23 red flags, contraindications, specialist referral criteria plus enhanced screening</p>
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
              <strong>NICE NG23 Enhanced Clinical Intelligence:</strong> Your identification system with NICE NG23 enhanced evidence-based assessment 
              provides comprehensive clinical insights while maintaining complete patient anonymity and NHS compliance.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GPInstructions;
