
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Clock, CheckCircle, Heart, AlertCircle, FileText, Stethoscope, Activity } from "lucide-react";

const PatientInstructions = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Patient Guide</CardTitle>
          <p className="text-pink-100">Your Comprehensive Health Assessment - Simple & Secure</p>
        </CardHeader>
      </Card>

      {/* Enhanced Assessment Features - NEW */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-800">
            <Stethoscope className="w-5 h-5 mr-2" />
            What Makes This Assessment Special
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-blue-700 font-medium">Your GP is using the latest evidence-based assessment that goes beyond basic NHS guidelines:</p>
          
          <div className="grid gap-3">
            <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="w-4 h-4 text-green-600" />
                <span className="font-semibold">Comprehensive Health Screening</span>
              </div>
              <p className="text-sm text-gray-600">We check for UTI risks, bone health, and other important factors that affect your wellbeing</p>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-purple-500">
              <div className="flex items-center space-x-2 mb-2">
                <Heart className="w-4 h-4 text-purple-600" />
                <span className="font-semibold">Evidence-Based Recommendations</span>
              </div>
              <p className="text-sm text-gray-600">Your results are based on the latest research and medical studies, not just basic guidelines</p>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span className="font-semibold">Transparent Scoring</span>
              </div>
              <p className="text-sm text-gray-600">You'll see exactly how your GP reaches their recommendations - no black box decisions</p>
            </div>
          </div>

          <div className="bg-white p-3 rounded border-l-4 border-blue-500">
            <p className="text-sm font-medium text-blue-800">This assessment considers the latest medical research to give you the best possible care</p>
          </div>
        </CardContent>
      </Card>

      {/* What to Expect */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="w-5 h-5 mr-2" />
            What to Expect
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <Clock className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-semibold">10-15 Minutes</h3>
              <p className="text-sm text-gray-600">Complete at your own pace</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <FileText className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-semibold">8 Comprehensive Steps</h3>
              <p className="text-sm text-gray-600">Detailed questions about your health</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <h3 className="font-semibold">Better Care</h3>
              <p className="text-sm text-gray-600">Helps your GP help you better</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step by Step Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="font-semibold">Click Your Personal Link</h3>
                <p className="text-gray-600 text-sm">Your GP has sent you a secure, private link. This is just for you and expires when you're done.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="font-semibold">Answer Questions Honestly</h3>
                <p className="text-gray-600 text-sm">Tell us about your symptoms, feelings, lifestyle, and health history. The more honest you are, the better your GP can help.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="font-semibold">Take Your Time</h3>
                <p className="text-gray-600 text-sm">You can pause anytime and come back. Your answers are saved as you go.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold">4</div>
              <div>
                <h3 className="font-semibold">Submit & Relax</h3>
                <p className="text-gray-600 text-sm">Once finished, your GP gets a detailed evidence-based report to discuss with you at your appointment.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What We Ask About - Enhanced */}
      <Card>
        <CardHeader>
          <CardTitle>What We'll Ask You About</CardTitle>
          <p className="text-gray-600 text-sm">Comprehensive assessment covering all aspects of your health</p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Your periods & menstrual cycle</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Hot flashes & night sweats</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Physical symptoms & pain</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Mood, memory & mental health</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Sleep quality & intimacy</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Lifestyle & health habits</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-blue-100 text-blue-800">UTI & bladder health</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-800">Bone health & fracture risks</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-purple-100 text-purple-800">Family & medical history</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-orange-100 text-orange-800">Current medications</Badge>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Why we ask about UTIs and bone health:</strong> Recent research shows these are closely linked to menopause 
              and hormone changes. Catching risks early means better prevention and treatment options for you.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Security & Privacy */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center text-green-800">
            <Shield className="w-5 h-5 mr-2" />
            Your Privacy & Safety
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-start space-x-3">
              <Lock className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Completely Anonymous</h4>
                <p className="text-sm text-gray-700">We don't ask for your name, address, or any personal details that could identify you.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Secure & Encrypted</h4>
                <p className="text-sm text-gray-700">Your answers are protected with hospital-grade security during transmission.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Only Your GP Sees This</h4>
                <p className="text-sm text-gray-700">Your responses go directly to your GP only. No one else can access them.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded border-l-4 border-green-500">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm text-green-800">Your Data Rights</h4>
                <p className="text-sm text-gray-700">
                  Your assessment uses the latest security standards and follows strict NHS privacy rules. 
                  Your responses help provide evidence-based care and are not stored permanently.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Need Help */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
          <p className="text-sm text-blue-800 mb-3">
            If you have trouble with the assessment or technical issues, contact your GP practice directly.
            They can help you complete it or arrange an alternative.
          </p>
          <Badge className="bg-blue-600 text-white">Remember: This comprehensive assessment helps your GP provide you with the best possible care</Badge>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientInstructions;
