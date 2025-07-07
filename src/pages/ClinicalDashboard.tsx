
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Eye, Mail, Search, Download, Clock, CheckCircle, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PatientIdentificationForm from "@/components/PatientIdentificationForm";
import { loadAllAssessments, type StoredAssessment } from "@/utils/assessmentStorage";

const ClinicalDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRisk, setFilterRisk] = useState("all");
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [assessments, setAssessments] = useState<StoredAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadAssessmentsData();
  }, []);

  const loadAssessmentsData = async () => {
    setLoading(true);
    try {
      const allAssessments = await loadAllAssessments();
      
      // Process assessments to determine priority
      const processedAssessments = allAssessments.map(assessment => ({
        ...assessment,
        priority: determinePriority(assessment),
        status: 'completed'
      }));
      
      console.log("Clinical dashboard loaded assessments:", processedAssessments);
      setAssessments(processedAssessments);
    } catch (error) {
      console.error("Error loading assessments:", error);
    } finally {
      setLoading(false);
    }
  };

  const determinePriority = (assessment: StoredAssessment): string => {
    if (assessment.urgent_flags && assessment.urgent_flags.length > 0) {
      const hasRedFlags = assessment.urgent_flags.some((flag: string) => 
        flag.includes('🚨 RED') || flag.includes('Postmenopausal bleeding') || 
        flag.includes('Unexplained weight loss') || flag.includes('Severe pelvic pain')
      );
      if (hasRedFlags) {
        return "urgent";
      }
    }
    return "routine";
  };

  const handleAssessmentCreated = (sessionId: string, patientRef: string) => {
    loadAssessmentsData();
    setShowPatientForm(false);
  };

  const getRiskBadge = (level: string) => {
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

  const getPriorityIcon = (priority: string) => {
    if (priority === "urgent") return <AlertTriangle className="w-4 h-4 text-red-500" />;
    if (priority === "routine") return <Clock className="w-4 h-4 text-gray-500" />;
    return null;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('en-GB');
    } catch (error) {
      return 'Unknown date';
    }
  };

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = !searchTerm || 
      assessment.patient_ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.session_id.includes(searchTerm);
    
    const matchesStatus = filterStatus === "all" || "completed" === filterStatus;
    const matchesRisk = filterRisk === "all" || assessment.risk_level === filterRisk;
    
    return matchesSearch && matchesStatus && matchesRisk;
  });

  const stats = {
    total: assessments.length,
    completed: assessments.length,
    pending: 0,
    urgent: assessments.filter(a => determinePriority(a) === "urgent").length
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
              {loading ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <CheckCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">Loading assessments...</p>
                </div>
              ) : filteredAssessments.length > 0 ? (
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
                      <TableRow key={assessment.session_id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getPriorityIcon(determinePriority(assessment))}
                            <span className="font-medium">
                              {assessment.patient_ref}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {assessment.session_id.slice(-8)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">completed</Badge>
                        </TableCell>
                        <TableCell>
                          {getRiskBadge(assessment.risk_level)}
                        </TableCell>
                        <TableCell>
                          {assessment.urgent_flags.length > 0 ? (
                            <Badge variant="destructive">
                              {assessment.urgent_flags.length} flag(s)
                            </Badge>
                          ) : (
                            <span className="text-gray-500">None</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {formatDate(assessment.completed_at)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/gp-results/${assessment.session_id}`)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Clinical View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Mail className="w-4 h-4 mr-1" />
                              Email
                            </Button>
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
