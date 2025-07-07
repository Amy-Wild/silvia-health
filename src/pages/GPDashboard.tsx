
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
  BookOpen,
  Copy,
  CheckCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PatientIdentificationForm from "@/components/PatientIdentificationForm";
import GPInstructions from "@/components/instructions/GPInstructions";
import { dataStore, AssessmentLink } from "@/utils/dataStore";

const GPDashboard = () => {
  const navigate = useNavigate();
  const [assessmentLinks, setAssessmentLinks] = useState<AssessmentLink[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPatientForm, setShowPatientForm] = useState(false);
  const { toast } = useToast();

  // Get current user email from localStorage
  const getCurrentUserEmail = () => {
    const user = localStorage.getItem("auth_user");
    if (user) {
      try {
        return JSON.parse(user).email;
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    }
    return "gp@example.com"; // fallback
  };

  useEffect(() => {
    loadAssessmentLinks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth_user");
    navigate("/auth");
  };

  const loadAssessmentLinks = () => {
    const userEmail = getCurrentUserEmail();
    console.log("Loading assessment links for:", userEmail);
    
    const links = dataStore.getAssessmentLinks(userEmail);
    setAssessmentLinks(links);
    console.log("Loaded assessment links:", links);
  };

  const filteredAssessmentLinks = assessmentLinks.filter(link =>
    (link.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
    (link.surname?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
    link.sessionId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleAssessmentCreated = (sessionId: string, patientRef: string, patientData: any) => {
    console.log("Assessment created callback:", { sessionId, patientRef, patientData });
    
    // Create assessment link using dataStore
    const userEmail = getCurrentUserEmail();
    const assessmentLink = dataStore.createAssessmentLink(userEmail, {
      firstName: patientData.firstName,
      surname: patientData.surname,
      dateOfBirth: patientData.dateOfBirth,
      nhsId: patientData.nhsId
    });

    // Generate the assessment URL
    const patientRefEncoded = encodeURIComponent(`${patientData.firstName} ${patientData.surname}`);
    const assessmentUrl = `${window.location.origin}/patient-assessment/${assessmentLink.sessionId}?patientRef=${patientRefEncoded}`;

    // Show success message with copy functionality
    toast({
      title: "Assessment Link Created Successfully!",
      description: (
        <div className="space-y-2">
          <p>Assessment link has been generated for {patientRef}</p>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(assessmentUrl);
                toast({
                  title: "Link Copied!",
                  description: "Assessment link copied to clipboard",
                });
              }}
            >
              <Copy className="w-4 h-4 mr-1" />
              Copy Link
            </Button>
          </div>
        </div>
      ),
      duration: 10000,
    });

    // Refresh the assessments list and close the form
    loadAssessmentLinks();
    setShowPatientForm(false);
  };

  const handleCopyLink = (link: AssessmentLink) => {
    const patientRefEncoded = encodeURIComponent(`${link.firstName || ''} ${link.surname || ''}`.trim());
    const assessmentUrl = `${window.location.origin}/patient-assessment/${link.sessionId}?patientRef=${patientRefEncoded}`;
    
    navigator.clipboard.writeText(assessmentUrl).then(() => {
      toast({
        title: "Link Copied!",
        description: "Assessment link copied to clipboard",
      });
    });
  };

  const navigateToResults = (sessionId: string) => {
    console.log("🔗 Navigating to results for sessionId:", sessionId);
    navigate(`/gp-results/${sessionId}`);
  };

  const handleEmail = (link: AssessmentLink) => {
    const patientName = `${link.firstName || ''} ${link.surname || ''}`.trim();
    const subject = `Health Assessment Link for ${patientName}`;
    const patientRefEncoded = encodeURIComponent(patientName);
    const assessmentUrl = `${window.location.origin}/patient-assessment/${link.sessionId}?patientRef=${patientRefEncoded}`;
    const body = `Dear ${patientName},\n\nPlease complete your health assessment using this secure link:\n${assessmentUrl}\n\nThis link will expire in 48 hours.\n\nBest regards,\nYour Healthcare Team`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
  };

  const handleCopySMS = (link: AssessmentLink) => {
    const patientName = `${link.firstName || ''} ${link.surname || ''}`.trim();
    const patientRefEncoded = encodeURIComponent(patientName);
    const assessmentUrl = `${window.location.origin}/patient-assessment/${link.sessionId}?patientRef=${patientRefEncoded}`;
    const smsText = `Hi ${patientName}, please complete your health assessment: ${assessmentUrl} (expires in 48hrs)`;
    navigator.clipboard.writeText(smsText).then(() => {
      toast({
        title: "SMS template copied to clipboard",
        description: "You can now paste this message to send to your patient.",
      });
    });
  };

  const getStatusBadge = (link: AssessmentLink) => {
    switch (link.status) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-600 text-white">Active</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500 hover:bg-blue-600 text-white">Completed</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPriorityIcon = (link: AssessmentLink) => {
    if (link.status === 'expired') {
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
    return <Clock className="w-4 h-4 text-gray-500" />;
  };

  const getExpiryText = (expiresAt: string) => {
    const expiryDate = new Date(expiresAt);
    const now = new Date();
    const hoursLeft = Math.max(0, Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60)));
    
    if (hoursLeft <= 0) {
      return "Expired";
    } else if (hoursLeft < 24) {
      return `${hoursLeft}h left`;
    } else {
      return `${Math.floor(hoursLeft / 24)}d ${hoursLeft % 24}h left`;
    }
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
                <h1 className="text-xl font-bold text-gray-900">SYLVIA Clinical Portal</h1>
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
              <h2 className="text-2xl font-bold text-gray-800">My Patient Assessment Links</h2>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search by patient name or session ID..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-500" />
                </div>
              </div>
            </div>

            {filteredAssessmentLinks.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Assessment Links ({filteredAssessmentLinks.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Date of Birth</TableHead>
                        <TableHead>NHS ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Expires</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAssessmentLinks.map((link, index) => (
                        <TableRow key={`${link.sessionId}-${index}`}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getPriorityIcon(link)}
                              <span className="font-medium">
                                {`${link.firstName || ''} ${link.surname || ''}`.trim() || 'Anonymous'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {link.dateOfBirth || '-'}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {link.nhsId || '-'}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(link)}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {getExpiryText(link.expiresAt)}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {new Date(link.createdAt).toLocaleDateString('en-GB')}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {link.status === 'active' && (
                                <Button 
                                  onClick={() => handleCopyLink(link)} 
                                  variant="outline" size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white border-green-600"
                                >
                                  <Copy className="w-4 h-4 mr-1" />
                                  Copy Link
                                </Button>
                              )}
                              {link.status === 'completed' && (
                                <Button 
                                  onClick={() => navigateToResults(link.sessionId)} 
                                  variant="outline" size="sm"
                                  className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View Results
                                </Button>
                              )}
                              <Button 
                                onClick={() => handleEmail(link)} 
                                variant="outline" size="sm"
                              >
                                <Mail className="w-4 h-4 mr-1" />
                                Email
                              </Button>
                              <Button 
                                onClick={() => handleCopySMS(link)} 
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
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Assessment Links Found</h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery ? "No assessment links match your search criteria." : "Create your first patient assessment link to get started."}
                </p>
                {!searchQuery && (
                  <Button 
                    onClick={() => setShowPatientForm(true)} 
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Assessment Link
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
