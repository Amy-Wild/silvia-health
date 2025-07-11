
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, User, Heart, Brain, Activity, Shield } from "lucide-react";

import { AssessmentResult } from "@/types/componentTypes";

interface GPResultsSummaryProps {
  clinicalResults: AssessmentResult;
}

const GPResultsSummary = ({ clinicalResults }: GPResultsSummaryProps) => {
  const getRiskBadge = (level: string) => {
    const colors = {
      red: "bg-red-500 text-white",
      amber: "bg-amber-500 text-white", 
      yellow: "bg-yellow-500 text-white",
      green: "bg-green-500 text-white"
    };
    const labels = {
      red: "🚨 URGENT - RED",
      amber: "🟠 HIGH PRIORITY - AMBER",
      yellow: "🟡 ROUTINE PRIORITY - YELLOW", 
      green: "🟢 LOW RISK - GREEN"
    };
    return <Badge className={colors[level as keyof typeof colors]}>{labels[level as keyof typeof labels]}</Badge>;
  };

  const getUrgencyIcon = (urgencyScore: number) => {
    if (urgencyScore >= 8) return <AlertTriangle className="w-5 h-5 text-red-500" />;
    if (urgencyScore >= 5) return <Clock className="w-5 h-5 text-amber-500" />;
    if (urgencyScore >= 3) return <Clock className="w-5 h-5 text-yellow-500" />;
    return <Clock className="w-5 h-5 text-green-500" />;
  };

  const getFlagColor = (flag: string) => {
    if (flag.includes('🚨 RED')) return 'text-red-800 bg-red-100 border-red-200';
    if (flag.includes('🟠 AMBER')) return 'text-amber-800 bg-amber-100 border-amber-200';
    if (flag.includes('🟡 YELLOW')) return 'text-yellow-800 bg-yellow-100 border-yellow-200';
    return 'text-blue-800 bg-blue-100 border-blue-200';
  };

  return (
    <div className="space-y-6">
      {/* Quick Overview Card - 30 second read */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-lg">
              <User className="w-5 h-5 mr-2" />
              2-Minute Clinical Summary
            </CardTitle>
            <div className="flex items-center space-x-2">
              {getUrgencyIcon(clinicalResults.analyticsData?.urgencyScore || 0)}
              {getRiskBadge(clinicalResults.riskLevel)}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-gray-700">PRIMARY CONCERNS</h4>
              <div className="text-sm">
                <p><strong>Vasomotor:</strong> {clinicalResults.clinicalSummary.vasomotor.severity}</p>
                <p><strong>Psychological:</strong> {clinicalResults.clinicalSummary.psychological.severity}</p>
                <p><strong>Overall Impact:</strong> {clinicalResults.clinicalSummary.overallComplexity}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-gray-700">KEY FACTORS</h4>
              <div className="text-sm">
                <p><strong>Age:</strong> {clinicalResults.patientProfile.age} years</p>
                <p><strong>Medical History:</strong> {clinicalResults.clinicalSummary.medicalHistory.riskLevel} risk</p>
                <p><strong>Lifestyle Risk:</strong> {clinicalResults.clinicalSummary.lifestyle.riskLevel}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-gray-700">PATIENT PREFERENCES</h4>
              <div className="text-sm">
                {clinicalResults.clinicalSummary.treatmentPreferences.selected.length > 0 ? (
                  clinicalResults.clinicalSummary.treatmentPreferences.selected.map((pref: string, index: number) => (
                    <Badge key={index} variant="outline" className="mr-1 mb-1 text-xs">
                      {pref.toUpperCase()}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-500">No specific preferences</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color-Coded Clinical Flags */}
      {clinicalResults.redFlags.length > 0 && (
        <div className="space-y-3">
          {clinicalResults.redFlags.map((flag: string, index: number) => {
            const flagColor = getFlagColor(flag);
            const isUrgent = flag.includes('🚨 RED');
            
            return (
              <Card key={index} className={`border-2 ${flagColor}`}>
                <CardHeader className="pb-3">
                  <CardTitle className={`flex items-center ${isUrgent ? 'text-red-900' : ''}`}>
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    {flag.includes('🚨 RED') && 'IMMEDIATE CLINICAL ATTENTION REQUIRED'}
                    {flag.includes('🟠 AMBER') && 'HIGH PRIORITY CLINICAL ACTION'}
                    {flag.includes('🟡 YELLOW') && 'ROUTINE PRIORITY CONSIDERATION'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium text-sm">{flag}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Medical History Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-base">
              <Heart className="w-4 h-4 mr-2" />
              Medical History Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">PERSONAL HISTORY</p>
                {clinicalResults.clinicalSummary.medicalHistory.personal.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {clinicalResults.clinicalSummary.medicalHistory.personal.map((item: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {item.replace('-', ' ')}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">No significant history</p>
                )}
              </div>
              
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">FAMILY HISTORY</p>
                {clinicalResults.clinicalSummary.medicalHistory.family.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {clinicalResults.clinicalSummary.medicalHistory.family.map((item: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {item.replace('-', ' ')}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">No significant family history</p>
                )}
              </div>
              
              <div className="pt-2 border-t">
                <p className="text-xs font-medium text-gray-700">
                  Clinical Notes: {clinicalResults.clinicalSummary.medicalHistory.clinicalNotes}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-base">
              <Activity className="w-4 h-4 mr-2" />
              Lifestyle & Risk Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="font-medium text-gray-600">Smoking</p>
                <p className={clinicalResults.clinicalSummary.lifestyle.smoking === 'current' ? 'text-red-600 font-medium' : ''}>
                  {clinicalResults.clinicalSummary.lifestyle.smoking}
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Exercise</p>
                <p className={clinicalResults.clinicalSummary.lifestyle.exercise === 'none' ? 'text-amber-600 font-medium' : ''}>
                  {clinicalResults.clinicalSummary.lifestyle.exercise}
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Alcohol</p>
                <p className={clinicalResults.clinicalSummary.lifestyle.alcohol === '22+' ? 'text-amber-600 font-medium' : ''}>
                  {clinicalResults.clinicalSummary.lifestyle.alcohol} units/week
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-600">BMI</p>
                <p className={parseFloat(clinicalResults.clinicalSummary.lifestyle.bmi) > 30 ? 'text-amber-600 font-medium' : ''}>
                  {clinicalResults.clinicalSummary.lifestyle.bmi}
                </p>
              </div>
            </div>
            <div className="pt-3 border-t mt-3">
              <p className="text-xs font-medium text-gray-700">
                {clinicalResults.clinicalSummary.lifestyle.clinicalNotes}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Priority Clinical Actions */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-green-900">
            <Shield className="w-5 h-5 mr-2" />
            Priority Clinical Actions (Next Steps)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {clinicalResults.clinicalRecommendations.slice(0, 5).map((rec: string, index: number) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-green-800 text-sm font-medium">{rec}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Treatment Preferences Summary with CBT Mapping */}
      {clinicalResults.clinicalSummary.treatmentPreferences.educationNeeded && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-blue-900">
              <Brain className="w-5 h-5 mr-2" />
              Patient Treatment Preferences & Clinical Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-800 text-sm mb-3">
              {clinicalResults.clinicalSummary.treatmentPreferences.clinicalNotes}
            </p>
            <div className="space-y-2">
              <p className="text-xs font-medium text-blue-700 mb-1">Patient preferences reviewed:</p>
              <div className="flex flex-wrap gap-1">
                {clinicalResults.clinicalSummary.treatmentPreferences.selected.map((pref: string, index: number) => {
                  let badgeColor = "bg-blue-500 text-white";
                  let prefLabel = pref.replace('-', ' ').toUpperCase();
                  
                  // Special handling for CBT - show as routine priority, not urgent
                  if (pref === 'cbt') {
                    badgeColor = "bg-yellow-500 text-white";
                    prefLabel = "CBT - ROUTINE MH REFERRAL";
                  }
                  
                  return (
                    <Badge key={index} className={`text-xs ${badgeColor}`}>
                      {prefLabel}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GPResultsSummary;
