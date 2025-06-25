
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Download, Printer, Share2, ArrowLeft, CheckCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Results = () => {
  const navigate = useNavigate();
  const [reportType, setReportType] = useState("clinical");

  // Mock assessment data for demonstration
  const assessmentData = {
    riskLevel: "amber",
    redFlags: ["Postmenopausal bleeding reported"],
    symptoms: {
      vasomotor: "moderate",
      physical: "mild",
      psychological: "moderate",
      sexual: "significant"
    },
    qualityOfLifeImpact: "moderate",
    recommendations: [
      "Urgent gynecological referral for postmenopausal bleeding",
      "Consider HRT discussion",
      "Lifestyle counseling",
      "Follow-up in 4-6 weeks"
    ]
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "red": return "bg-red-500";
      case "amber": return "bg-amber-500";
      default: return "bg-green-500";
    }
  };

  const ClinicalReport = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Clinical Assessment Summary</CardTitle>
            <Badge className={`${getRiskColor(assessmentData.riskLevel)} text-white`}>
              {assessmentData.riskLevel.toUpperCase()} PRIORITY
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {assessmentData.redFlags.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <h3 className="font-semibold text-red-800">Red Flag Alerts</h3>
              </div>
              <ul className="list-disc list-inside text-red-700">
                {assessmentData.redFlags.map((flag, index) => (
                  <li key={index}>{flag}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Symptom Categories</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Vasomotor symptoms:</span>
                  <Badge variant="outline">{assessmentData.symptoms.vasomotor}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Physical symptoms:</span>
                  <Badge variant="outline">{assessmentData.symptoms.physical}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Psychological symptoms:</span>
                  <Badge variant="outline">{assessmentData.symptoms.psychological}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Sexual health:</span>
                  <Badge variant="outline">{assessmentData.symptoms.sexual}</Badge>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Quality of Life Impact</h3>
              <Badge className="bg-amber-100 text-amber-800">
                {assessmentData.qualityOfLifeImpact} impact
              </Badge>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Clinical Recommendations</h3>
            <ul className="list-disc list-inside space-y-1">
              {assessmentData.recommendations.map((rec, index) => (
                <li key={index} className="text-gray-700">{rec}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Assessment Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600">
            <p>Complete assessment responses, symptom scoring, and clinical decision support data available in full report download.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const PatientReport = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Assessment Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">What Your Results Mean</h3>
            <p className="text-blue-700">
              Based on your responses, you're experiencing moderate perimenopause symptoms that are impacting your quality of life. 
              Some of your symptoms require prompt medical attention.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Key Areas to Discuss with Your GP</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Urgent: Postmenopausal bleeding</p>
                  <p className="text-sm text-gray-600">This requires immediate medical evaluation</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium">Hormone replacement therapy options</p>
                  <p className="text-sm text-gray-600">Your symptoms may benefit from HRT discussion</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium">Mood and psychological support</p>
                  <p className="text-sm text-gray-600">Consider counseling or other support options</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Questions to Ask Your Doctor</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>What could be causing my postmenopausal bleeding?</li>
              <li>Am I a good candidate for hormone replacement therapy?</li>
              <li>What are my treatment options for managing symptoms?</li>
              <li>How can I improve my quality of life during this transition?</li>
              <li>When should I follow up?</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">You're Not Alone</h3>
            <p className="text-green-700">
              Many women experience similar symptoms during perimenopause and menopause. 
              With proper support and treatment, you can manage these symptoms effectively and maintain your quality of life.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/assessment')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Assessment
            </Button>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Results Header */}
          <Card className="mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Assessment Complete</CardTitle>
              <p className="text-gray-600">
                Your comprehensive perimenopause and menopause assessment has been completed. 
                Review your results below and choose the appropriate report format.
              </p>
            </CardHeader>
          </Card>

          {/* Report Tabs */}
          <Tabs value={reportType} onValueChange={setReportType}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="clinical">Clinical Report (GP)</TabsTrigger>
              <TabsTrigger value="patient">Patient Summary</TabsTrigger>
            </TabsList>

            <TabsContent value="clinical">
              <ClinicalReport />
            </TabsContent>

            <TabsContent value="patient">
              <PatientReport />
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button 
              onClick={() => navigate('/assessment')}
              size="lg" 
              variant="outline"
              className="flex-1"
            >
              Take Another Assessment
            </Button>
            <Button 
              onClick={() => navigate('/education')}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 flex-1"
            >
              Explore Education Resources
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
