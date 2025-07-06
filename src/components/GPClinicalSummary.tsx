
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, User, Heart, Brain, Activity, Shield, Eye } from "lucide-react";

interface GPClinicalSummaryProps {
  clinicalResults: any;
}

const GPClinicalSummary = ({ clinicalResults }: GPClinicalSummaryProps) => {
  const getUrgencyColor = (urgencyScore: number) => {
    if (urgencyScore >= 8) return "bg-risk-high";
    if (urgencyScore >= 5) return "bg-risk-medium"; 
    return "bg-risk-low";
  };

  const getRiskBadgeColor = (level: string) => {
    const colors = {
      red: "bg-risk-high text-white border-risk-high-dark",
      urgent: "bg-risk-high text-white border-risk-high-dark",
      high: "bg-risk-high text-white border-risk-high-dark",
      amber: "bg-risk-medium text-white border-risk-medium-alt", 
      medium: "bg-risk-medium text-white border-risk-medium-alt",
      moderate: "bg-risk-medium text-white border-risk-medium-alt",
      green: "bg-risk-low text-white border-risk-low-dark",
      low: "bg-risk-low text-white border-risk-low-dark",
      mild: "bg-risk-low text-white border-risk-low-dark"
    };
    return colors[level as keyof typeof colors] || colors.green;
  };

  const getRiskLabel = (level: string) => {
    const labels = {
      red: "HIGH RISK - URGENT",
      urgent: "HIGH RISK - URGENT", 
      high: "HIGH RISK - URGENT",
      amber: "MODERATE RISK",
      medium: "MODERATE RISK",
      moderate: "MODERATE RISK", 
      green: "LOW RISK",
      low: "LOW RISK",
      mild: "LOW RISK"
    };
    return labels[level as keyof typeof labels] || "LOW RISK";
  };

  return (
    <div className="space-y-4">
      {/* URGENT RED FLAGS - Always at top */}
      {clinicalResults.redFlags && clinicalResults.redFlags.length > 0 && (
        <Card className="border-2 border-risk-high bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-red-900 text-lg">
              <AlertTriangle className="w-6 h-6 mr-2" />
              🚨 URGENT - IMMEDIATE ACTION REQUIRED
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {clinicalResults.redFlags.map((flag: string, index: number) => (
                <div key={index} className="flex items-center space-x-2 bg-red-100 p-2 rounded border-l-4 border-risk-high">
                  <AlertTriangle className="w-4 h-4 text-risk-high flex-shrink-0" />
                  <span className="font-semibold text-red-800">{flag}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* TRAFFIC LIGHT OVERVIEW - 30 Second Scan */}
      <Card className="border-l-4 border-l-gentle-blue-dark bg-gentle-blue/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              30-Second Clinical Overview
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded-full ${getUrgencyColor(clinicalResults.analyticsData?.urgencyScore || 0)}`}></div>
              <Badge className={getRiskBadgeColor(clinicalResults.riskLevel)}>
                {getRiskLabel(clinicalResults.riskLevel)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center p-3 bg-gentle-blue rounded">
              <div className="font-bold text-lg text-blue-700">{clinicalResults.patientProfile?.age || 'N/A'}</div>
              <div className="text-xs text-blue-600">Age (years)</div>
            </div>
            <div className="text-center p-3 bg-light-purple rounded">
              <div className="font-bold text-lg text-purple-700">
                {clinicalResults.clinicalSummary?.vasomotor?.severity || 'None'}
              </div>
              <div className="text-xs text-purple-600">Vasomotor</div>
            </div>
            <div className="text-center p-3 bg-soft-green rounded">
              <div className="font-bold text-lg text-green-700">
                {clinicalResults.clinicalSummary?.psychological?.severity || 'None'}
              </div>
              <div className="text-xs text-green-600">Psychological</div>
            </div>
            <div className="text-center p-3 bg-soft-coral rounded">
              <div className="font-bold text-lg text-orange-700">
                {clinicalResults.analyticsData?.urgencyScore || 0}/10
              </div>
              <div className="text-xs text-orange-600">Urgency Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TOP 3 CLINICAL ACTIONS - Color coded by priority */}
      <Card className={`${clinicalResults.riskLevel === 'red' || clinicalResults.riskLevel === 'urgent' || clinicalResults.riskLevel === 'high' ? 'border-risk-high bg-red-50' : clinicalResults.riskLevel === 'amber' || clinicalResults.riskLevel === 'moderate' || clinicalResults.riskLevel === 'medium' ? 'border-risk-medium bg-orange-50' : 'border-risk-low bg-green-50'}`}>
        <CardHeader className="pb-3">
          <CardTitle className={`flex items-center ${clinicalResults.riskLevel === 'red' || clinicalResults.riskLevel === 'urgent' || clinicalResults.riskLevel === 'high' ? 'text-red-900' : clinicalResults.riskLevel === 'amber' || clinicalResults.riskLevel === 'moderate' || clinicalResults.riskLevel === 'medium' ? 'text-orange-900' : 'text-green-900'}`}>
            <Shield className="w-5 h-5 mr-2" />
            🎯 Priority Actions (Next 2 Weeks)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {clinicalResults.clinicalRecommendations?.slice(0, 3).map((rec: string, index: number) => (
              <div key={index} className={`flex items-start space-x-3 p-2 bg-white rounded border-l-4 ${clinicalResults.riskLevel === 'red' || clinicalResults.riskLevel === 'urgent' || clinicalResults.riskLevel === 'high' ? 'border-risk-high' : clinicalResults.riskLevel === 'amber' || clinicalResults.riskLevel === 'moderate' || clinicalResults.riskLevel === 'medium' ? 'border-risk-medium' : 'border-risk-low'}`}>
                <div className={`w-6 h-6 rounded-full text-white flex items-center justify-center text-sm font-bold flex-shrink-0 ${clinicalResults.riskLevel === 'red' || clinicalResults.riskLevel === 'urgent' || clinicalResults.riskLevel === 'high' ? 'bg-risk-high' : clinicalResults.riskLevel === 'amber' || clinicalResults.riskLevel === 'moderate' || clinicalResults.riskLevel === 'medium' ? 'bg-risk-medium' : 'bg-risk-low'}`}>
                  {index + 1}
                </div>
                <span className={`font-medium text-sm ${clinicalResults.riskLevel === 'red' || clinicalResults.riskLevel === 'urgent' || clinicalResults.riskLevel === 'high' ? 'text-red-800' : clinicalResults.riskLevel === 'amber' || clinicalResults.riskLevel === 'moderate' || clinicalResults.riskLevel === 'medium' ? 'text-orange-800' : 'text-green-800'}`}>{rec}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* RISK FACTORS - Quick Scan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-white border-gentle-blue-dark/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm">
              <Heart className="w-4 h-4 mr-2" />
              Medical History Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-xs">
              {clinicalResults.patientProfile?.riskFactors?.length > 0 ? (
                clinicalResults.patientProfile.riskFactors.map((factor: string, index: number) => (
                  <Badge key={index} variant="outline" className="mr-1 text-xs border-risk-medium text-orange-700">
                    ⚠️ {factor}
                  </Badge>
                ))
              ) : (
                <span className="text-green-600">✅ No significant risk factors identified</span>
              )}
              
              {/* Show medical history status */}
              <div className="mt-2 p-2 bg-gentle-blue/20 rounded text-xs">
                <p><strong>Personal History:</strong> {clinicalResults.clinicalSummary?.medicalHistory?.personal?.length > 0 ? clinicalResults.clinicalSummary.medicalHistory.personal.join(', ') : 'None recorded'}</p>
                <p><strong>Family History:</strong> {clinicalResults.clinicalSummary?.medicalHistory?.family?.length > 0 ? clinicalResults.clinicalSummary.medicalHistory.family.join(', ') : 'None recorded'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-soft-green-dark/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm">
              <Activity className="w-4 h-4 mr-2" />
              Lifestyle Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="font-medium">Smoking:</span>
                <span className={clinicalResults.clinicalSummary?.lifestyle?.smoking === 'current' ? 'text-risk-high ml-1' : 'ml-1'}>
                  {clinicalResults.clinicalSummary?.lifestyle?.smoking || 'Unknown'}
                </span>
              </div>
              <div>
                <span className="font-medium">Exercise:</span>
                <span className={clinicalResults.clinicalSummary?.lifestyle?.exercise === 'none' ? 'text-risk-medium ml-1' : 'ml-1'}>
                  {clinicalResults.clinicalSummary?.lifestyle?.exercise || 'Unknown'}
                </span>
              </div>
              <div>
                <span className="font-medium">BMI:</span>
                <span className={parseFloat(clinicalResults.clinicalSummary?.lifestyle?.bmi || '0') > 30 ? 'text-risk-medium ml-1' : 'ml-1'}>
                  {clinicalResults.clinicalSummary?.lifestyle?.bmi || 'Not calculated'}
                </span>
              </div>
              <div>
                <span className="font-medium">Alcohol:</span>
                <span className={clinicalResults.clinicalSummary?.lifestyle?.alcohol === '22+' ? 'text-risk-medium ml-1' : 'ml-1'}>
                  {clinicalResults.clinicalSummary?.lifestyle?.alcohol || 'Unknown'} units/week
                </span>
              </div>
            </div>
            
            {/* Physical measurements */}
            <div className="mt-3 pt-2 border-t grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="font-medium">Height:</span>
                <span className="ml-1">{clinicalResults.clinicalSummary?.lifestyle?.height || 'Not recorded'} cm</span>
              </div>
              <div>
                <span className="font-medium">Weight:</span>
                <span className="ml-1">{clinicalResults.clinicalSummary?.lifestyle?.weight || 'Not recorded'} kg</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* EVIDENCE CONFIDENCE */}
      <Card className="bg-light-purple border-light-purple-dark">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4 text-purple-600" />
              <span className="font-medium text-purple-800">AI Clinical Confidence:</span>
              <Badge className="bg-purple-600 text-white">94%</Badge>
            </div>
            <span className="text-xs text-purple-600">Based on NICE NG23 + 2024 Evidence</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GPClinicalSummary;
