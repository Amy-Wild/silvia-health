import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { UserPlus, FileText, BarChart3, Users, Calendar as CalendarIcon, Shield, Search, Eye, Mail, Plus, AlertTriangle, Clock, CheckCircle, Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import AssessmentLinkGenerator from "@/components/AssessmentLinkGenerator";
import PatientIdentificationForm from "@/components/PatientIdentificationForm";

interface Assessment {
  id: string;
  patientRef: string;
  completed: string | null;
  status: string;
  riskLevel: string | null;
  redFlags: string[];
  symptoms: any;
  priority: string | null;
  completedAt?: string;
}

const GPDashboard = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRisk, setFilterRisk] = useState("all");
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  
  // Patient creation form state
  const [patientName, setPatientName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date>();
  const [nhsNumber, setNhsNumber] = useState("");
  const [patientId, setPatientId] = useState("");
  const [isCreatingAssessment, setIsCreatingAssessment] = useState(false);

  useEffect(() => {
    if (user) {
      loadAssessments();
    }
  }, [user]);

  const loadAssessments = () => {
    const storedAssessments: Assessment[] = [];
    
    // Load completed assessments from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('assessment_')) {
        const assessmentData = localStorage.getItem(key);
        if (assessmentData) {
          try {
            const assessment = JSON.parse(assessmentData);
            
            // Determine priority based on risk level and urgent flags
            let priority = "routine";
            if (assessment.urgentFlags && assessment.urgentFlags.length > 0) {
              const hasRedFlags = assessment.urgentFlags.some((flag: string) => 
                flag.includes('🚨 RED') || flag.includes('Postmenopausal bleeding') || 
                flag.includes('Unexplained weight loss') || flag.includes('Severe pelvic pain')
              );
              if (hasRedFlags) {
                priority = "urgent";
              }
            }
            
            storedAssessments.push({
              id: assessment.sessionId,
              patientRef: assessment.patientRef || "Anonymous Patient",
              completed: assessment.completedAt ? new Date(assessment.completedAt).toLocaleString('en-GB') : null,
              status: "completed",
              riskLevel: assessment.riskLevel,
              redFlags: assessment.urgentFlags || [],
              symptoms: assessment.clinicalSummary || {},
              priority,
              completedAt: assessment.completedAt
            });
          } catch (error) {
            console.error("Error parsing assessment data:", error);
          }
        }
      }
    }
    
    // Sort by completion date (most recent first)
    storedAssessments.sort((a, b) => {
      if (!a.completedAt || !b.completedAt) return 0;
      return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
    });
    
    setAssessments(storedAssessments);
  };

  const handleAssessmentCreated = (sessionId: string, patientRef: string) => {
    loadAssessments();
    setShowPatientForm(false);
  };

  const handleCreateAssessment = async () => {
    if (!patientName || !dateOfBirth) {
      toast({
        title: "Missing Information",
        description: "Patient name and date of birth are required.",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingAssessment(true);
    
    try {
      const patientRef = nhsNumber || patientId || `${patientName}_${format(dateOfBirth, 'ddMMyyyy')}`;
      const sessionId = `assessment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create a simple assessment link entry in localStorage for demo
      const linkData = {
        sessionId,
        patientRef,
        patientName,
        dateOfBirth: format(dateOfBirth, 'yyyy-MM-dd'),
        nhsNumber,
        patientId,
        createdBy: user?.id,
        createdAt: new Date().toISOString(),
        status: 'pending'
      };
      
      localStorage.setItem(`assessment_link_${sessionId}`, JSON.stringify(linkData));
      
      // Clear form
      setPatientName("");
      setDateOfBirth(undefined);
      setNhsNumber("");
      setPatientId("");
      
      toast({
        title: "Assessment Created",
        description: `Assessment link generated for ${patientName}`,
      });
      
      loadAssessments();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingAssessment(false);
    }
  };

  const copySMSMessage = (assessment: Assessment) => {
    const isHighRisk = assessment.riskLevel?.toLowerCase() === 'red' || 
                      assessment.riskLevel?.toLowerCase() === 'urgent' || 
                      assessment.riskLevel?.toLowerCase() === 'high';
    
    let message;
    if (isHighRisk) {
      message = "Please contact your GP Practice to arrange an appointment ASAP. Your assessment shows results requiring prompt review. Please contact the practice TODAY on [PRACTICE_PHONE]. Reply STOP to opt out.";
    } else {
      message = "NHS: You need an appointment to discuss your SYLVIA assessment results. Please call the practice to book. Reply STOP to opt out.";
    }
    
    navigator.clipboard.writeText(message).then(() => {
      toast({
        title: "Message Copied!",
        description: "Paste into your practice SMS system",
      });
    }).catch(() => {
      toast({
        title: "Copy Failed",
        description: "Please copy the message manually",
        variant: "destructive",
      });
    });
  };

  const getRiskBadge = (level: string | null) => {
    if (!level) return <Badge variant="outline">Pending</Badge>;
    
    const getBadgeProps = (level: string) => {
      switch (level.toLowerCase()) {
        case 'red':
        case 'urgent':
        case 'high':
          return { className: "bg-red-500 hover:bg-red-600 text-white border-red-600", label: "HIGH RISK" };
        case 'amber':
        case 'moderate': 
        case 'medium':
          return { className: "bg-amber-500 hover:bg-amber-600 text-white border-amber-600", label: "MODERATE RISK" };
        case 'green':
        case 'low':
        case 'mild':
        default:
          return { className: "bg-green-500 hover:bg-green-600 text-white border-green-600", label: "LOW RISK" };
      }
    };
    
    const { className, label } = getBadgeProps(level);
    return <Badge className={className}>{label}</Badge>;
  };

  const getPriorityIcon = (priority: string | null) => {
    if (priority === "urgent") return <AlertTriangle className="w-4 h-4 text-red-500" />;
    if (priority === "routine") return <Clock className="w-4 h-4 text-gray-500" />;
    return null;
  };

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = !searchTerm || 
      assessment.patientRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.id.includes(searchTerm);
    
    const matchesStatus = filterStatus === "all" || assessment.status === filterStatus;
    const matchesRisk = filterRisk === "all" || assessment.riskLevel === filterRisk;
    
    return matchesSearch && matchesStatus && matchesRisk;
  });

  const stats = {
    total: assessments.length,
    completed: assessments.filter(a => a.status === "completed").length,
    pending: assessments.filter(a => a.status === "pending").length,
    urgent: assessments.filter(a => a.priority === "urgent").length
  };

  if (!user || (userRole !== 'gp' && userRole !== 'clinical_admin')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-bold mb-2">Access Restricted</h2>
            <p className="text-gray-600">
              This area is for healthcare professionals only.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header */}
      <div className="bg-blue-800 text-white py-4 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">SYLVIA Clinician Portal</h1>
              <p className="text-blue-200 text-sm">For Healthcare Professionals Only</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-white border-white">
                {userRole === 'clinical_admin' ? 'Clinical Admin' : 'GP'}
              </Badge>
              <Button 
                onClick={() => setShowPatientForm(true)} 
                variant="secondary"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Assessment
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Patient Creation Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserPlus className="w-5 h-5 mr-2" />
              Create New Patient Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <div>
                <Label htmlFor="patientName">Patient Name *</Label>
                <Input
                  id="patientName"
                  placeholder="Enter patient name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                />
              </div>
              
              <div>
                <Label>Date of Birth *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateOfBirth && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateOfBirth ? format(dateOfBirth, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateOfBirth}
                      onSelect={setDateOfBirth}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label htmlFor="nhsNumber">NHS Number</Label>
                <Input
                  id="nhsNumber"
                  placeholder="Enter NHS number"
                  value={nhsNumber}
                  onChange={(e) => setNhsNumber(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="patientId">Patient ID</Label>
                <Input
                  id="patientId"
                  placeholder="Unique patient ID"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                />
              </div>
              
              <Button
                onClick={handleCreateAssessment}
                disabled={isCreatingAssessment || !patientName || !dateOfBirth}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isCreatingAssessment ? (
                  <>Creating...</>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Generate Link
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <h3 className="text-2xl font-bold">{stats.total}</h3>
                <p className="text-gray-600">Total Assessments</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <FileText className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <h3 className="text-2xl font-bold">{stats.completed}</h3>
                <p className="text-gray-600">Completed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <h3 className="text-2xl font-bold">{stats.pending}</h3>
                <p className="text-gray-600">Pending</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-red-500" />
                <h3 className="text-2xl font-bold">{stats.urgent}</h3>
                <p className="text-gray-600">Urgent</p>
              </CardContent>
            </Card>
          </div>

          {/* Assessment Link Generator */}
          <AssessmentLinkGenerator />
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by patient reference or session ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterRisk} onValueChange={setFilterRisk}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by risk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="red">Red Flag</SelectItem>
                  <SelectItem value="amber">Amber</SelectItem>
                  <SelectItem value="yellow">Yellow</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Assessment Table */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Assessments ({filteredAssessments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredAssessments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Session ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Red Flags</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssessments.map((assessment) => {
                    const isHighRisk = assessment.riskLevel?.toLowerCase() === 'red' || 
                                      assessment.riskLevel?.toLowerCase() === 'urgent' || 
                                      assessment.riskLevel?.toLowerCase() === 'high';
                    
                    return (
                      <TableRow key={assessment.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getPriorityIcon(assessment.priority)}
                            <span className="font-medium">
                              {assessment.patientRef}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {assessment.id.slice(-8)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={assessment.status === "completed" ? "default" : "secondary"}>
                            {assessment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {getRiskBadge(assessment.riskLevel)}
                        </TableCell>
                        <TableCell>
                          {assessment.redFlags.length > 0 ? (
                            <Badge variant="destructive">
                              {assessment.redFlags.length} flag(s)
                            </Badge>
                          ) : (
                            <span className="text-gray-500">None</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {assessment.completed ? (
                            <span className="text-sm text-gray-600">
                              {assessment.completed}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {assessment.status === "completed" && (
                              <>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => navigate(`/gp-results/${assessment.id}`)}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Mail className="w-4 h-4 mr-1" />
                                  Email
                                </Button>
                                <Button 
                                  variant={isHighRisk ? "destructive" : "outline"}
                                  size="sm"
                                  onClick={() => copySMSMessage(assessment)}
                                  className={isHighRisk ? "bg-red-600 hover:bg-red-700" : ""}
                                >
                                  <Copy className="w-4 h-4 mr-1" />
                                  Copy SMS
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Assessments Found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm ? "No assessments match your search criteria." : "Create your first patient assessment to get started."}
                </p>
                {!searchTerm && (
                  <Button 
                    onClick={() => setShowPatientForm(true)} 
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Assessment
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Assessment Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredAssessments.slice(0, 5).map((assessment, index) => (
                  <div key={assessment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{assessment.patientRef}</p>
                      <p className="text-sm text-gray-600">
                        {assessment.status === 'completed' ? 'Assessment completed' : 'Assessment pending'}
                      </p>
                    </div>
                    <div className="text-right">
                      {getRiskBadge(assessment.riskLevel)}
                      <p className="text-xs text-gray-500 mt-1">
                        {assessment.completed || 'Pending'}
                      </p>
                    </div>
                  </div>
                ))}
                
                {filteredAssessments.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No recent activity. Generate assessment links to get started.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Patient Identification Form Modal */}
      <PatientIdentificationForm
        isOpen={showPatientForm}
        onClose={() => setShowPatientForm(false)}
        onAssessmentCreated={handleAssessmentCreated}
      />
    </div>
  );
};

export default GPDashboard;
