
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Clock, CheckCircle, Heart, AlertCircle, FileText, Stethoscope, Activity } from "lucide-react";

const PatientInstructions = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-gradient-to-r from-[#ede9fe] to-[#dbeafe] text-[#425563]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Patient Guide</CardTitle>
          <p className="text-[#425563] opacity-80">Your Comprehensive Health Assessment - Simple & Secure</p>
        </CardHeader>
      </Card>

      {/* Enhanced Assessment Features - Updated */}
      <Card className="border-[#dbeafe] bg-[#dbeafe]">
        <CardHeader>
          <CardTitle className="flex items-center text-[#425563]">
            <Stethoscope className="w-5 h-5 mr-2" />
            NICE NG23 Enhanced Evidence-Based Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-[#425563] font-medium">Your GP is using NICE NG23 guidelines enhanced with the latest clinical evidence and research:</p>
          
          <div className="grid gap-3">
            <div className="bg-white p-4 rounded-lg border-l-4 border-[#dcfce7]">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="w-4 h-4 text-[#425563]" />
                <span className="font-semibold">NICE NG23 Plus Enhanced Screening</span>
              </div>
              <p className="text-sm text-[#425563]">Building on NICE NG23 foundations with additional screening for UTI risks, bone health, and other important factors</p>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-[#ede9fe]">
              <div className="flex items-center space-x-2 mb-2">
                <Heart className="w-4 h-4 text-[#425563]" />
                <span className="font-semibold">Enhanced Evidence Base</span>
              </div>
              <p className="text-sm text-[#425563]">Your results combine NICE NG23 recommendations with the latest Cochrane reviews and 2024 clinical research</p>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-[#dbeafe]">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-4 h-4 text-[#425563]" />
                <span className="font-semibold">Transparent Clinical Decision Making</span>
              </div>
              <p className="text-sm text-[#425563]">You'll see exactly how your GP reaches their recommendations using NICE NG23 criteria plus enhanced evidence grading</p>
            </div>
          </div>

          <div className="bg-white p-3 rounded border-l-4 border-[#dbeafe]">
            <p className="text-sm font-medium text-[#425563]">This assessment follows NICE NG23 guidelines enhanced with additional clinical evidence to give you comprehensive care</p>
          </div>
        </CardContent>
      </Card>

      {/* What to Expect */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-[#425563]">
            <Heart className="w-5 h-5 mr-2" />
            What to Expect
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-[#dbeafe] rounded-lg">
              <Clock className="w-8 h-8 mx-auto mb-2 text-[#425563]" />
              <h3 className="font-semibold">10-15 Minutes</h3>
              <p className="text-sm text-[#425563]">Complete at your own pace</p>
            </div>
            <div className="p-4 bg-[#dcfce7] rounded-lg">
              <FileText className="w-8 h-8 mx-auto mb-2 text-[#425563]" />
              <h3 className="font-semibold">8 Comprehensive Steps</h3>
              <p className="text-sm text-[#425563]">Detailed questions about your health</p>
            </div>
            <div className="p-4 bg-[#ede9fe] rounded-lg">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-[#425563]" />
              <h3 className="font-semibold">Better Care</h3>
              <p className="text-sm text-[#425563]">Helps your GP help you better</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step by Step Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#425563]">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <div className="w-8 h-8 bg-[#ede9fe] text-[#425563] rounded-full flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="font-semibold">Click Your Personal Link</h3>
                <p className="text-[#425563] text-sm">Your GP has sent you a secure, private link. This is just for you and expires when you're done.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <div className="w-8 h-8 bg-[#ede9fe] text-[#425563] rounded-full flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="font-semibold">Answer Questions Honestly</h3>
                <p className="text-[#425563] text-sm">Tell us about your symptoms, feelings, lifestyle, and health history. The more honest you are, the better your GP can help.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <div className="w-8 h-8 bg-[#ede9fe] text-[#425563] rounded-full flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="font-semibold">Take Your Time</h3>
                <p className="text-[#425563] text-sm">You can pause anytime and come back. Your answers are saved as you go.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <div className="w-8 h-8 bg-[#ede9fe] text-[#425563] rounded-full flex items-center justify-center font-bold">4</div>
              <div>
                <h3 className="font-semibold">Submit & Relax</h3>
                <p className="text-[#425563] text-sm">Once finished, your GP gets a detailed report based on NICE NG23 guidelines plus enhanced clinical evidence to discuss with you at your appointment.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What We Ask About - Enhanced */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#425563]">What We'll Ask You About</CardTitle>
          <p className="text-[#425563] text-sm">NICE NG23 comprehensive assessment enhanced with additional clinical screening</p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="border-[#ede9fe]">Your periods & menstrual cycle</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="border-[#ede9fe]">Hot flashes & night sweats</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="border-[#ede9fe]">Physical symptoms & pain</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="border-[#ede9fe]">Mood, memory & mental health</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="border-[#ede9fe]">Sleep quality & intimacy</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="border-[#ede9fe]">Lifestyle & health habits</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-[#dbeafe] text-[#425563]">Enhanced: UTI & bladder health</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-[#dcfce7] text-[#425563]">Enhanced: Bone health & fracture risks</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-[#ede9fe] text-[#425563]">Family & medical history</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-[#fed7c3] text-[#425563]">Current medications</Badge>
            </div>
          </div>
          <div className="mt-4 p-3 bg-[#dbeafe] rounded-lg">
            <p className="text-sm text-[#425563]">
              <strong>Enhanced Clinical Features:</strong> Building on NICE NG23 guidelines, we include additional screening 
              for UTI risks and bone health based on recent research showing these are closely linked to menopause 
              and hormone changes. Early identification means better prevention and treatment options.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Security & Privacy - Updated with correct information */}
      <Card className="border-[#dcfce7] bg-[#dcfce7]">
        <CardHeader>
          <CardTitle className="flex items-center text-[#425563]">
            <Shield className="w-5 h-5 mr-2" />
            Your Privacy & Safety
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-start space-x-3">
              <Lock className="w-5 h-5 text-[#425563] mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Secure & Confidential</h4>
                <p className="text-sm text-[#425563]">We only collect the information needed for your health assessment, such as your name and date of birth, to ensure accuracy and safety.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-[#425563] mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">NHS-Grade Security</h4>
                <p className="text-sm text-[#425563]">Your information is protected with hospital-grade security during transmission and storage, meeting NHS data protection standards.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-[#425563] mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Only Your GP Sees This</h4>
                <p className="text-sm text-[#425563]">Your responses go directly to your GP only. No one else can access them.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded border-l-4 border-[#dcfce7]">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-[#425563] mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm text-[#425563]">Your Data Rights</h4>
                <p className="text-sm text-[#425563]">
                  Your assessment uses NHS-approved security standards and follows strict NHS privacy rules. 
                  Your responses help provide evidence-based care and are stored securely in compliance with NHS data governance.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Need Help */}
      <Card className="bg-[#dbeafe] border-[#dbeafe]">
        <CardContent className="p-6 text-center">
          <h3 className="font-semibold text-[#425563] mb-2">Need Help?</h3>
          <p className="text-sm text-[#425563] mb-3">
            If you have trouble with the assessment or technical issues, contact your GP practice directly.
            They can help you complete it or arrange an alternative.
          </p>
          <Badge className="bg-[#ede9fe] text-[#425563]">Remember: This NICE NG23 enhanced assessment helps your GP provide you with the best possible care</Badge>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientInstructions;
