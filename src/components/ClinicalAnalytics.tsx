
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { TrendingUp, Brain, Activity, Shield } from "lucide-react";

interface AnalyticsData {
  symptomProgression: Array<{ week: number; severity: number; }>;
  riskProfile: Array<{ factor: string; score: number; maxScore: number; }>;
  treatmentEffectiveness: Array<{ treatment: string; success: number; evidence: string; }>;
}

interface ClinicalAnalyticsProps {
  data: AnalyticsData;
  overallRisk: string;
  confidenceLevel: number;
}

const ClinicalAnalytics = ({ data, overallRisk, confidenceLevel }: ClinicalAnalyticsProps) => {
  const radarData = data.riskProfile.map(item => ({
    factor: item.factor,
    score: item.score,
    fullMark: item.maxScore
  }));

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high': return 'bg-red-500';
      case 'moderate': return 'bg-amber-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const chartConfig = {
    severity: {
      label: "Severity",
      color: "#3b82f6",
    },
    score: {
      label: "Score",
      color: "#ef4444",
    },
  };

  return (
    <div className="space-y-6">
      {/* Overall Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-500" />
            Clinical Decision Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center">
                <Shield className="w-8 h-8 text-gray-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Overall Risk</p>
              <Badge className={`${getRiskColor(overallRisk)} text-white mt-1`}>
                {overallRisk.toUpperCase()}
              </Badge>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-gray-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Confidence Level</p>
              <p className="text-2xl font-bold text-gray-900">{confidenceLevel}%</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center">
                <Activity className="w-8 h-8 text-gray-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Analysis Model</p>
              <p className="text-sm font-bold text-gray-900">ML Enhanced</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="progression" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="progression">Symptom Progression</TabsTrigger>
              <TabsTrigger value="risk">Risk Profile</TabsTrigger>
              <TabsTrigger value="effectiveness">Treatment Outcomes</TabsTrigger>
            </TabsList>

            <TabsContent value="progression" className="space-y-4">
              <ChartContainer config={chartConfig} className="h-80">
                <LineChart data={data.symptomProgression}>
                  <XAxis dataKey="week" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="severity" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ChartContainer>
              <div className="text-sm text-gray-600">
                <p><strong>Predictive Analysis:</strong> Based on current symptom severity and progression patterns from similar patient profiles.</p>
              </div>
            </TabsContent>

            <TabsContent value="risk" className="space-y-4">
              <ChartContainer config={chartConfig} className="h-80">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="factor" />
                  <PolarRadiusAxis angle={90} domain={[0, 10]} />
                  <Radar
                    name="Risk Score"
                    dataKey="score"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.3}
                  />
                  <ChartTooltip />
                </RadarChart>
              </ChartContainer>
              <div className="text-sm text-gray-600">
                <p><strong>Multi-dimensional Risk Assessment:</strong> Comprehensive evaluation across cardiovascular, bone health, psychological, and lifestyle factors.</p>
              </div>
            </TabsContent>

            <TabsContent value="effectiveness" className="space-y-4">
              <div className="space-y-3">
                {data.treatmentEffectiveness.map((treatment, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{treatment.treatment}</h4>
                      <Badge className="bg-green-500 text-white">
                        {treatment.success}% success rate
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      <strong>Evidence Level:</strong> {treatment.evidence}
                    </p>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${treatment.success}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClinicalAnalytics;
