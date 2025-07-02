
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Plus, Eye, Mail, Calendar, BarChart3, User, Clock, AlertTriangle, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const GPDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [patientRef, setPatientRef] = useState("");
  const [refType, setRefType] = useState("initials");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  
  const [sessions, setSessions] = useState([
    {
      id: "uuid-123-456",
      patientRef: "J.S. (DOB: 15/03/1968)",
      refType: "initials",
      appointmentDate: "2024-07-05",
      created: "2024-06-30 10:30",
      status: "pending",
      riskLevel: null,
      daysOld: 1,
      carePath: null,
      urgency: 'low'
    },
    {
      id: "uuid-789-012",
      patientRef: "M.J. (DOB: 22/08/1965)", 
      refType: "initials",
      appointmentDate: "2024-07-03",
      created: "2024-06-29 14:15",
      status: "completed",
      riskLevel: "medium",
      daysOld: 2,
      carePath: 'gp-routine',
      urgency: 'medium'
    },
    {
      id: "uuid-345-678",
      patientRef: "A.B. (DOB: 10/12/1970)",
      refType: "initials", 
      appointmentDate: "2024-07-08",
      created: "2024-07-01 09:15",
      status: "completed",
      riskLevel: "low",
      daysOld: 0,
      carePath: 'self-care',
      urgency: 'low'
    },
    {
      id: "uuid-901-234",
      patientRef: "S.K. (DOB: 03/05/1962)",
      refType: "initials",
      appointmentDate: "2024-07-02", 
      created: "2024-07-01 16:45",
      status: "completed",
      riskLevel: "urgent",
      daysOld: 0,
      carePath: 'gp-urgent',
      urgency: 'high'
    }
  ]);

  const generateNewSession = () => {
    const newUUID = `uuid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
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
      daysOld: 0,
      carePath: null,
      urgency: 'low' as const
    };
    
    setSessions([newSession, ...sessions]);
    
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

  const getRiskBadge = (level: string | null, urgency: string) => {
    if (!level) return null;
    
    const badgeMap = {
      'urgent': { color: 'bg-red-500', text: 'URGENT - Book Today' },
      'high': { color: 'bg-red-400', text: 'HIGH PRIORITY' },
      'medium': { color: 'bg-amber-500', text: 'ROUTINE REVIEW' },
      'low': { color: 'bg-green-500', text: 'LOW PRIORITY' }
    };
    
    const badge = badgeMap[level as keyof typeof badgeMap] || badgeMap.medium;
    return <Badge className={`${badge.color} text-white`}>{badge.text}</Badge>;
  };

  const getStatusBadge = (status: string, daysOld: number, carePath: string | null) => {
    if (status === "pending") {
      if (daysOld > 7) return <Badge variant="destructive">Overdue</Badge>;
      if (daysOld > 3) return <Badge className="bg-amber-500 text-white">Follow-up</Badge>;
      return <Badge className="bg-blue-500 text-white">Sent</Badge>;
    }
    
    // Completed assessments
    if (carePath === 'self-care' || carePath === 'education-first') {
      return <Badge className="bg-green-500 text-white">Self-Managing</Badge>;
    }
    return <Badge className="bg-green-500 text-white">Completed</Badge>;
  };

  const getCarePathBadge = (carePath: string | null) => {
    if (!carePath) return null;
    
    const pathMap = {
      'gp-urgent': { color: 'bg-red-100 text-red-800', text: 'Urgent GP' },
      'gp-routine': { color: 'bg-blue-100 text-blue-800', text: 'Routine GP' },
      'self-care': { color: 'bg-green-100 text-green-800', text: 'Self-Care' },
      'education-first': { color: 'bg-purple-100 text-purple-800', text: 'Education' }
    };
    
    const path = pathMap[carePath as keyof typeof pathMap];
    return path ? <Badge className={path.color}>{path.text}</Badge> : null;
  };

  const getFilteredSessions = () => {
    if (filterBy === 'all') return sessions;
    if (filterBy === 'urgent') return sessions.filter(s => s.urgency === 'high' || s.riskLevel === 'urgent');
    if (filterBy === 'pending') return sessions.filter(s => s.status === 'pending');
    if (filterBy === 'self-managing') return sessions.filter(s => s.carePath === 'self-care' || s.carePath === 'education-first');
    return sessions;
  };

  const filteredSessions = getFilteredSessions();

  const getStatsCounts = () => {
    const total = sessions.length;
    const urgent = sessions.filter(s => s.urgency === 'high' || s.riskLevel === 'urgent').length;
    const pending = sessions.filter(s => s.status === 'pending').length;
    const selfManaging = sessions.filter(s => s.carePath === 'self-care' || s.carePath === 'education-first').length;
    
    return { total, urgent, pending, selfManaging };
  };

  const stats = getStatsCounts();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">GP Assessment Dashboard</h1>
              <p className="text-gray-600">Intelligent menopause care - reducing unnecessary appointments</p>
            </div>
            <Button 
              onClick={() => navigate('/clinical-dashboard')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Clinical Analytics
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Assessments</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{stats.urgent}</div>
                <div className="text-sm text-gray-600">Need Urgent Review</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
                <div className="text-sm text-gray-600">Awaiting Response</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.selfManaging}</div>
                <div className="text-sm text-gray-600">Self-Managing</div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Assessment Creation */}
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-800">
                <Plus className="w-5 h-5 mr-2" />
                Create New Assessment - 30 Second Setup
              </CardTitle>
              <p className="text-sm text-blue-700">Anonymous & secure - intelligent triage reduces unnecessary appointments</p>
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
                    <span>✓ Intelligent triage - reduces routine appointments by 40%</span>
                    <span>✓ Patient education pathways</span>
                    <span>✓ Only urgent cases need immediate review</span>
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

          {/* Patient Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <span>Patient Management</span>
                  <Badge variant="outline" className="ml-2">{filteredSessions.length} showing</Badge>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <Select value={filterBy} onValueChange={setFilterBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Assessments</SelectItem>
                      <SelectItem value="urgent">Urgent Priority</SelectItem>
                      <SelectItem value="pending">Pending Response</SelectItem>
                      <SelectItem value="self-managing">Self-Managing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredSessions.map((session) => (
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
                          {session.urgency === 'high' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                          {getStatusBadge(session.status, session.daysOld, session.carePath)}
                          {getRiskBadge(session.riskLevel, session.urgency)}
                          {getCarePathBadge(session.carePath)}
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
                          {session.carePath === 'self-care' && (
                            <div className="text-green-600 font-medium">
                              Patient managing symptoms independently
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
                              onClick={() => navigate(`/gp-results/${session.id}`)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              {session.urgency === 'high' ? 'URGENT Review' : 'Clinical Results'}
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
              
              {filteredSessions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No assessments match your current filter. Try adjusting the filter above.</p>
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
