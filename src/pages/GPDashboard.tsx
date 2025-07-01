
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Plus, Eye, Mail, Calendar, BarChart3, User, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const GPDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [patientRef, setPatientRef] = useState("");
  const [refType, setRefType] = useState("initials");
  const [appointmentDate, setAppointmentDate] = useState("");
  
  const [sessions, setSessions] = useState([
    {
      id: "uuid-123-456",
      patientRef: "J.S. (DOB: 15/03/1968)",
      refType: "initials",
      appointmentDate: "2024-07-05",
      created: "2024-06-30 10:30",
      status: "pending",
      riskLevel: null,
      daysOld: 1
    },
    {
      id: "uuid-789-012",
      patientRef: "M.J. (DOB: 22/08/1965)", 
      refType: "initials",
      appointmentDate: "2024-07-03",
      created: "2024-06-29 14:15",
      status: "completed",
      riskLevel: "amber",
      daysOld: 2
    }
  ]);

  const generateNewSession = () => {
    const newUUID = `uuid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Create formatted patient reference
    let formattedRef = "";
    if (patientRef.trim()) {
      switch (refType) {
        case "initials":
          formattedRef = patientRef.toUpperCase();
          break;
        case "dob":
          formattedRef = `DOB: ${patientRef}`;
          break;
        case "custom":
          formattedRef = patientRef;
          break;
      }
    }
    
    const newSession = {
      id: newUUID,
      patientRef: formattedRef,
      refType,
      appointmentDate,
      created: new Date().toLocaleString(),
      status: "pending" as const,
      riskLevel: null,
      daysOld: 0
    };
    
    setSessions([newSession, ...sessions]);
    
    // Clear form
    setPatientRef("");
    setAppointmentDate("");
    
    return newUUID;
  };

  const copyAssessmentLink = (sessionId: string) => {
    const link = `${window.location.origin}/patient-assessment/${sessionId}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Assessment Link Copied",
      description: "Send this secure link to your patient via your preferred method",
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

  const getStatusBadge = (status: string, daysOld: number) => {
    if (status === "pending") {
      if (daysOld > 7) return <Badge variant="destructive">Overdue</Badge>;
      if (daysOld > 3) return <Badge className="bg-amber-500 text-white">Follow-up</Badge>;
      return <Badge className="bg-blue-500 text-white">Sent</Badge>;
    }
    return <Badge className="bg-green-500 text-white">Completed</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">GP Assessment Dashboard</h1>
              <p className="text-gray-600">Quick & secure patient menopause assessments</p>
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
          {/* Quick Assessment Creation */}
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-800">
                <Plus className="w-5 h-5 mr-2" />
                Create New Assessment - 30 Second Setup
              </CardTitle>
              <p className="text-sm text-blue-700">Anonymous & secure - only you can access results</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="ref-type" className="text-sm font-medium">Identification Method</Label>
                  <Select value={refType} onValueChange={setRefType}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="initials">Patient Initials</SelectItem>
                      <SelectItem value="dob">Date of Birth</SelectItem>
                      <SelectItem value="custom">Custom Reference</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="patient-ref" className="text-sm font-medium">
                    {refType === "initials" && "Initials (e.g., J.S.)"}
                    {refType === "dob" && "Date of Birth (e.g., 15/03/1968)"}
                    {refType === "custom" && "Your Reference"}
                  </Label>
                  <Input
                    id="patient-ref"
                    value={patientRef}
                    onChange={(e) => setPatientRef(e.target.value)}
                    placeholder={
                      refType === "initials" ? "J.S." :
                      refType === "dob" ? "15/03/1968" :
                      "Your reference"
                    }
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="appointment-date" className="text-sm font-medium">Next Appointment (Optional)</Label>
                  <Input
                    id="appointment-date"
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <span>✓ Patient data never stored with NHS details</span>
                    <span>✓ Secure one-time links</span>
                    <span>✓ Only you can access results</span>
                  </div>
                </div>
                <Button 
                  onClick={() => {
                    const sessionId = generateNewSession();
                    copyAssessmentLink(sessionId);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={!patientRef.trim()}
                >
                  Generate & Copy Link
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Assessments</span>
                <Badge variant="outline">{sessions.length} total</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div key={session.id} className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-lg">
                              {session.patientRef || `Session ${session.id.slice(-8)}`}
                            </span>
                          </div>
                          {getStatusBadge(session.status, session.daysOld)}
                          {getRiskBadge(session.riskLevel)}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Created: {session.created}
                          </div>
                          {session.appointmentDate && (
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              Appointment: {session.appointmentDate}
                            </div>
                          )}
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
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/patient-results/${session.id}`)}
                            >
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
              
              {sessions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No assessments yet. Create your first one above!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GPDashboard;
