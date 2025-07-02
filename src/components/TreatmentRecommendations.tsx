
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface TreatmentOption {
  name: string;
  probability: number;
  evidence: string;
  suitability: number;
  considerations: string[];
}

interface TreatmentRecommendationsProps {
  treatments: TreatmentOption[];
  patientProfile: {
    age: number;
    riskFactors: string[];
    preferences: string[];
  };
}

const TreatmentRecommendations = ({ treatments, patientProfile }: TreatmentRecommendationsProps) => {
  const chartData = treatments.map(treatment => ({
    name: treatment.name,
    probability: treatment.probability,
    suitability: treatment.suitability
  }));

  const pieData = treatments.map((treatment, index) => ({
    name: treatment.name,
    value: treatment.probability,
    fill: `hsl(${index * 60}, 70%, 50%)`
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Treatment Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="regression">Regression</TabsTrigger>
            <TabsTrigger value="decision">Decision Tree</TabsTrigger>
            <TabsTrigger value="preference">Preference</TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="space-y-4">
            <div className="space-y-4">
              {treatments.map((treatment, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-lg">{treatment.name}</h4>
                    <Badge className="bg-blue-500 text-white">
                      {treatment.probability}% recommended
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Probability Score</label>
                      <Progress value={treatment.probability} className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Suitability</label>
                      <Progress value={treatment.suitability} className="mt-1" />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-700">
                      <strong>Evidence Level:</strong> {treatment.evidence}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Clinical Considerations:</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {treatment.considerations.map((consideration, i) => (
                        <li key={i} className="flex items-start">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                          {consideration}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="regression" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="probability" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-sm text-gray-600">
              <p><strong>Logistic Regression Analysis:</strong> Based on symptom severity, patient demographics, and clinical risk factors.</p>
            </div>
          </TabsContent>

          <TabsContent value="decision" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-sm text-gray-600">
              <p><strong>Decision Tree Model:</strong> Hierarchical analysis considering primary symptoms and patient characteristics.</p>
            </div>
          </TabsContent>

          <TabsContent value="preference" className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Patient Profile Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium">Age Group:</p>
                  <p>{patientProfile.age} years</p>
                </div>
                <div>
                  <p className="font-medium">Risk Factors:</p>
                  <ul className="space-y-1">
                    {patientProfile.riskFactors.map((factor, i) => (
                      <li key={i}>• {factor}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Preferences:</p>
                  <ul className="space-y-1">
                    {patientProfile.preferences.map((pref, i) => (
                      <li key={i}>• {pref}</li>
                    ))}
                  </ul>
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
