import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Eye, Mail, Search, Download, Clock, CheckCircle, Plus, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PatientIdentificationForm from "@/components/PatientIdentificationForm";

interface Assessment {
  id: string;
  patientRef: string;
  completed: string | null;
  status: string;
  riskLevel: string | null;
  redFlags: string[];
  symptoms: any;
  bmi?: number;
  smoking?: string;
  alcohol?: string;
  priority: string | null;
  completedAt?: string;
}

const ClinicalDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRisk, setFilterRisk] = useState("all");
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadAssessments();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth_user");
    navigate("/auth");
  };

  const loadAssessments = () => {
    console.log("🔄 Loading assessments for clinical dashboard...");
    
    try {
      const storedAssessments = JSON.parse(localStorage.getItem('assessments') || '[]');
      
      // Transform to match expected interface
      const transformedAssessments = storedAssessments.map((assessment: any) => ({
        id: assessment.id,
        patientRef: assessment.patientName,
        completed: new Date(assessment.completedAt).toLocaleString('en-GB'),
        status: assessment.status,
        riskLevel: assessment.riskLevel,
        redFlags: assessment.urgentFlags || [],
        symptoms: {},
        priority: assessment.urgentFlags && assessment.urgentFlags.length > 0 ? "urgent" : "routine",
        completedAt: assessment.completedAt
      }));
      
      // Sort by completion date (most recent first)
      transformedAssessments.sort((a: any, b: any) => {
        if (!a.completedAt || !b.completedAt) return 0;
        return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
      });
      
      console.log("✅ Clinical dashboard loaded assessments:", transformedAssessments);
      setAssessments(transformedAssessments);
    } catch (error) {
      console.error("❌ Error loading assessments:", error);
    }
  };

  const handleAssessmentCreated = (sessionId: string, patientRef: string) => {
    // Refresh the assessments list
    loadAssessments();
    setShowPatientForm(false);
  };

  const handleEmail = (assessment: Assessment) => {
    const subject = `Assessment Results for ${assessment.patientRef}`;
    const body = `Dear ${assessment.patientRef},\n\nYour recent health assessment has been completed. Please contact the surgery to discuss your results.\n\nBest regards,\nYour Healthcare Team`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
  };

  const handleCopySMS = (assessment: Assessment) => {
    const smsText = `Please contact the surgery regarding your recent assessment. Call: 01234 567890`;
    navigator.clipboard.writeText(smsText).then(() => {
      // Show toast notification
      console.log("SMS template copied to clipboard");
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Clinical Assessment Dashboard</h1>
              <p className="text-gray-600">Review and manage patient assessments</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" size="sm">
                <Mail className="w-4 h-4 mr-2" />
                Bulk Email
              </Button>
              <Button 
                onClick={() => setShowPatientForm(true)} 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Assessment
              </Button>
              <Button 
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Assessments</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Urgent</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.urgent}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                    {filteredAssessments.map((assessment) => (
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
                                  Clinical View
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEmail(assessment)}
                                >
                                  <Mail className="w-4 h-4 mr-1" />
                                  Email
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleCopySMS(assessment)}
                                >
                                  Copy SMS
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
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

export default ClinicalDashboard;
