
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Stethoscope, 
  Clock, 
  Shield, 
  CheckCircle, 
  Heart,
  ArrowRight
} from "lucide-react";

interface PatientWelcomeProps {
  onStart: () => void;
}

const PatientWelcome = ({ onStart }: PatientWelcomeProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gentle-blue/30 to-soft-coral/20 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Header with branding */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-soft-coral-dark to-light-purple-dark rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SYLVIA Health Assessment</h1>
          <p className="text-lg text-gray-600">Your healthcare provider has requested you complete this menopause assessment</p>
        </div>

        {/* Main information card */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-gray-900 flex items-center justify-center">
              <Heart className="w-6 h-6 mr-2 text-soft-coral-dark" />
              Comprehensive Menopause Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Time estimate */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-900">Estimated Time: 10-15 minutes</h3>
                  <p className="text-sm text-blue-700">Take your time - you can pause and continue later if needed</p>
                </div>
              </div>
            </div>

            {/* What to expect */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">What to expect:</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-700"><strong>Personal Information:</strong> Basic details about you and your health history</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-700"><strong>Symptom Questions:</strong> About physical and emotional changes you may be experiencing</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-700"><strong>Lifestyle Factors:</strong> Questions about sleep, exercise, and daily activities</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-700"><strong>Results:</strong> Your healthcare provider will review your responses and discuss them with you</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy notice */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 text-gray-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Your Privacy & Security</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Your responses are securely encrypted and will only be shared with your healthcare provider. 
                    This assessment is part of your medical care and follows strict privacy guidelines.
                  </p>
                </div>
              </div>
            </div>

            {/* Start button */}
            <div className="text-center pt-4">
              <Button 
                size="lg" 
                onClick={onStart}
                className="bg-soft-coral-dark hover:bg-soft-coral-dark/80 text-white text-lg px-8 py-4 h-auto font-semibold shadow-lg"
              >
                Start Assessment
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                By clicking "Start Assessment", you consent to sharing your responses with your healthcare provider
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Support info */}
        <div className="text-center text-sm text-gray-600">
          <p>Questions about this assessment? Contact your healthcare provider's office</p>
        </div>
      </div>
    </div>
  );
};

export default PatientWelcome;
