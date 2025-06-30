import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Copy, Plus, Eye, Mail, Calendar, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const GPDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([
    {
      id: "uuid-123-456",
      patientRef: "Patient A",
      created: "2024-06-30 10:30",
      status: "pending",
      riskLevel: null
    },
    {
      id: "uuid-789-012",
      patientRef: "Patient B", 
      created: "2024-06-29 14:15",
      status: "completed",
      riskLevel: "amber"
    }
  ]);

  const generateNewSession = () => {
    const newUUID = `uuid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newSession = {
      id: newUUID,
      patientRef: "",
      created: new Date().toLocaleString(),
      status: "pending" as const,
      riskLevel: null
    };
    setSessions([newSession, ...sessions]);
    return newUUID;
  };

  const copyAssessmentLink = (sessionId: string) => {
    const link = `${window.location.origin}/patient-assessment/${sessionId}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied",
      description: "Assessment link copied to clipboard",
    });
  };

  const getRiskBadge = (level: string | null) => {
    if (!level) return null;
    const colors = {
      red: "bg-red-500",
      amber: "bg-amber-500", 
      green: "bg-green-500"
    };
    return <Badge className={`${colors[level as keyof typeof colors]} text-white`}>{level.toUpperCase()}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">GP Assessment Dashboard</h1>
              <p className="text-gray-600">Manage patient menopause assessments</p>
            </div>
            <Button 
              onClick={() => navigate('/clinical-dashboard')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Clinical Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Quick Actions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Create New Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Label htmlFor="patient-ref">Patient Reference (Optional)</Label>
                  <Input
                    id="patient-ref"
                    placeholder="e.g., Patient initials or reference"
                    className="mt-1"
                  />
                </div>
                <Button 
                  onClick={() => {
                    const sessionId = generateNewSession();
                    copyAssessmentLink(sessionId);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Generate & Copy Link
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Generate a secure, anonymous assessment link to send to your patient
              </p>
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Assessment Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium">Session: {session.id.slice(-8)}</span>
                          {session.patientRef && (
                            <Badge variant="outline">{session.patientRef}</Badge>
                          )}
                          {getRiskBadge(session.riskLevel)}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          Created: {session.created}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {session.status === "pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyAssessmentLink(session.id)}
                          >
                            <Copy className="w-4 h-4 mr-1" />
                            Copy Link
                          </Button>
                        )}
                        {session.status === "completed" && (
                          <>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              View Results
                            </Button>
                            <Button variant="outline" size="sm">
                              <Mail className="w-4 h-4 mr-1" />
                              Email Report
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GPDashboard;
