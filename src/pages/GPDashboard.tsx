import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Stethoscope,
  Plus,
  Search,
  Activity,
  LogOut,
  Eye,
  Mail,
  MessageSquare,
  AlertTriangle,
  Clock,
  BookOpen
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PatientIdentificationForm from "@/components/PatientIdentificationForm";
import GPInstructions from "@/components/instructions/GPInstructions";

interface Assessment {
  id: string;
  patientName: string;
  dateOfBirth: string;
  completedAt: string;
  riskLevel: string;
  urgentFlags: string[];
  status: string;
}

const GPDashboard = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPatientForm, setShowPatientForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadAssessments();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth_user");
    navigate("/auth");
  };

  const loadAssessments = () => {
    console.log("=== LOADING ASSESSMENTS (GP DASHBOARD) ===");
    
    try {
      const storedAssessments = JSON.parse(localStorage.getItem('assessments') || '[]');
      console.log("📋 Raw assessments from localStorage:", storedAssessments);
      
      // Filter out duplicate IDs and ensure unique assessments
      const uniqueAssessments = storedAssessments.reduce((acc: any[], current: any) => {
        const existingIndex = acc.findIndex(item => item.id === current.id);
        if (existingIndex >= 0) {
          // Keep the most recent one (or replace with current if it has more data)
          if (new Date(current.completedAt) > new Date(acc[existingIndex].completedAt)) {
            acc[existingIndex] = current;
          }
        } else {
          acc.push(current);
        }
        return acc;
      }, []);
      
      // Sort by completion date (most recent first)
      const sortedAssessments = uniqueAssessments.sort((a: any, b: any) => {
        const aTime = new Date(a.completedAt).getTime();
        const bTime = new Date(b.completedAt).getTime();
        return bTime - aTime;
      });
      
      console.log("✅ Loaded and sorted unique assessments:", sortedAssessments);
      setAssessments(sortedAssessments);
    } catch (error) {
      console.error("❌ Error loading assessments:", error);
    }
  };

  const filteredAssessments = assessments.filter(assessment =>
    assessment.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const navigateToResults = (sessionId: string) => {
    console.log("🔗 Navigating to results for sessionId:", sessionId);
    navigate(`/gp-results/${sessionId}`);
  };

  const handleAssessmentCreated = (sessionId: string, patientRef: string) => {
    // Refresh the assessments list
    loadAssessments();
    setShowPatientForm(false);
  };

  const handleEmail = (assessment: Assessment) => {
    const subject = `Assessment Results for ${assessment.patientName}`;
    const body = `Dear ${assessment.patientName},\n\nYour recent health assessment has been completed. Please contact the surgery to discuss your results.\n\nBest regards,\nYour Healthcare Team`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
  };

  const handleCopySMS = (assessment: Assessment) => {
    const smsText = `Please contact the surgery regarding your recent assessment. Call: 01234 567890`;
    navigator.clipboard.writeText(smsText).then(() => {
      toast({
        title: "SMS template copied to clipboard",
        description: "You can now paste this message to send to your patient.",
      });
    });
  };

  // NICE NG23 compliant risk badge mapping
  const getRiskBadgeClass = (riskLevel: string) => {
    console.log("=== GP DASHBOARD RISK BADGE MAPPING ===");
    console.log("Risk level received:", riskLevel);
    
    switch (riskLevel.toLowerCase()) {
      case 'red':
      case 'urgent':
      case 'high':
        console.log("Mapping to HIGH RISK (red)");
        return 'bg-red-500 hover:bg-red-600 text-white border-red-600';
      case 'amber':
      case 'medium':
      case 'moderate':
        console.log("Mapping to MODERATE RISK (amber)");
        return 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600';
      case 'green':
      case 'low':
      default:
        console.log("Mapping to LOW RISK (green)");
        return 'bg-green-500 hover:bg-green-600 text-white border-green-600';
    }
  };

  const getRiskLabel = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'red':
      case 'urgent':
      case 'high':
        return 'HIGH RISK';
      case 'amber':
      case 'medium':
      case 'moderate':
        return 'MODERATE RISK';
      case 'green':
      case 'low':
      default:
        return 'LOW RISK';
    }
  };

  const getPriorityIcon = (assessment: Assessment) => {
    if (assessment.urgentFlags && assessment.urgentFlags.length > 0) {
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
    return <Clock className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SILVIA Clinical Portal</h1>
                <p className="text-sm text-gray-600">
                  <strong>S</strong>ymptom <strong>I</strong>ntake & <strong>L</strong>iaison for <strong>V</strong>ital <strong>I</strong>nsight & <strong>A</strong>ssessment
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                <Activity className="w-4 h-4 mr-1" />
                System Active (Local Mode)
              </Badge>
              <Button 
                onClick={() => setShowPatientForm(true)} 
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Assessment
              </Button>
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Tabs */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="assessments" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="assessments" className="flex items-center">
              <Stethoscope className="w-4 h-4 mr-2" />
              Patient Assessments
            </TabsTrigger>
            <TabsTrigger value="instructions" className="flex items-center">
              <BookOpen className="w-4 h-4 mr-2" />
              GP Instructions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assessments">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">My Patient Assessments</h2>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search by patient name..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-500" />
                </div>
              </div>
            </div>

            {filteredAssessments.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Patient Assessments ({filteredAssessments.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Date of Birth</TableHead>
                        <TableHead>Risk Level</TableHead>
                        <TableHead>Red Flags</TableHead>
                        <TableHead>Completed</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAssessments.map((assessment, index) => (
                        <TableRow key={`${assessment.id}-${index}`}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getPriorityIcon(assessment)}
                              <span className="font-medium">
                                {assessment.patientName}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {assessment.dateOfBirth}
                          </TableCell>
                          <TableCell>
                            <Badge className={getRiskBadgeClass(assessment.riskLevel)}>
                              {getRiskLabel(assessment.riskLevel)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {assessment.urgentFlags && assessment.urgentFlags.length > 0 ? (
                              <Badge variant="destructive" className="text-xs">
                                {assessment.urgentFlags.length} Red Flag(s)
                              </Badge>
                            ) : (
                              <span className="text-gray-500">None</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {new Date(assessment.completedAt).toLocaleDateString('en-GB')}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button 
                                onClick={() => navigateToResults(assessment.id)} 
                                variant="outline" size="sm"
                                className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View Results
                              </Button>
                              <Button 
                                onClick={() => handleEmail(assessment)} 
                                variant="outline" size="sm"
                              >
                                <Mail className="w-4 h-4 mr-1" />
                                Email
                              </Button>
                              <Button 
                                onClick={() => handleCopySMS(assessment)} 
                                variant="outline" size="sm"
                              >
                                <MessageSquare className="w-4 h-4 mr-1" />
                                SMS
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Assessments Found</h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery ? "No assessments match your search criteria." : "Create your first patient assessment to get started."}
                </p>
                {!searchQuery && (
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
          </TabsContent>

          <TabsContent value="instructions">
            <GPInstructions />
          </TabsContent>
        </Tabs>
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
