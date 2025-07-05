
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, FileText, Users, TrendingUp } from "lucide-react";
import TransparentTreatmentAnalysis from "./TransparentTreatmentAnalysis";

interface TreatmentRecommendationsProps {
  treatments: any[];
  patientProfile: {
    age: number;
    riskFactors: string[];
    preferences: string[];
  };
  rawData?: any;
  clinicalSummary?: any;
}

const TreatmentRecommendations = ({ treatments, patientProfile, rawData, clinicalSummary }: TreatmentRecommendationsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evidence-Based Treatment Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="transparent" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="transparent">
              <FileText className="w-4 h-4 mr-2" />
              Transparent Logic
            </TabsTrigger>
            <TabsTrigger value="population">
              <Users className="w-4 h-4 mr-2" />
              Population Data
            </TabsTrigger>
            <TabsTrigger value="predictive">
              <TrendingUp className="w-4 h-4 mr-2" />
              Predictive Models
            </TabsTrigger>
            <TabsTrigger value="future">
              <Brain className="w-4 h-4 mr-2" />
              AI Enhancement
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transparent" className="space-y-4">
            <TransparentTreatmentAnalysis 
              rawData={rawData || {}}
              clinicalSummary={clinicalSummary || {}}
            />
          </TabsContent>

          <TabsContent value="population" className="space-y-4">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-3">Population-Based Insights</h4>
              <div className="space-y-3 text-sm">
                <p><strong>Similar Patient Outcomes:</strong></p>
                <ul className="space-y-1 ml-4">
                  <li>• Women aged {patientProfile.age}±5 years with similar symptoms</li>
                  <li>• Based on NHS England menopause service data (2022-2024)</li>
                  <li>• Response rates to different interventions</li>
                </ul>
                <div className="mt-4 p-3 bg-white rounded border">
                  <p className="text-xs text-gray-600"><strong>Note:</strong> Population data integration planned for Q2 2024 following NHS Digital approval</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="predictive" className="space-y-4">
            <div className="bg-amber-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-3">Predictive Clinical Models</h4>
              <div className="space-y-3 text-sm">
                <p><strong>Future Implementation:</strong></p>
                <ul className="space-y-1 ml-4">
                  <li>• Logistic regression models for treatment response</li>
                  <li>• Decision tree algorithms based on validated clinical rules</li>
                  <li>• Risk stratification using machine learning</li>
                </ul>
                <div className="mt-4 p-3 bg-white rounded border">
                  <p className="text-xs text-gray-600">
                    <strong>Status:</strong> Awaiting clinical validation and regulatory approval. 
                    Models will be trained on anonymized patient outcome data with appropriate governance.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="future" className="space-y-4">
            <div className="bg-purple-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-3">AI-Enhanced Clinical Support</h4>
              <div className="space-y-3 text-sm">
                <p><strong>Planned Enhancements:</strong></p>
                <ul className="space-y-1 ml-4">
                  <li>• Real-time literature synthesis</li>
                  <li>• Personalized risk prediction</li>
                  <li>• Continuous learning from outcomes</li>
                  <li>• Integration with electronic health records</li>
                </ul>
                <div className="mt-4 p-3 bg-white rounded border">
                  <p className="text-xs text-gray-600">
                    <strong>Timeline:</strong> Phased implementation 2024-2025, subject to clinical governance approval and validation studies.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TreatmentRecommendations;
