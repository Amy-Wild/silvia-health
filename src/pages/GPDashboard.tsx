import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Stethoscope,
  Plus,
  Search,
  Activity,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PatientIdentificationForm from "@/components/PatientIdentificationForm";

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
    console.log("Raw from localStorage:", localStorage.getItem('assessments'));
    
    console.log("🔄 Loading assessments from localStorage...");
    
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

  const getRiskBadgeClass = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'urgent':
      case 'high':
        return 'bg-red-500 hover:bg-red-600 text-white border-red-600';
      case 'medium':
      case 'moderate':
        return 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600';
      case 'low':
      default:
        return 'bg-green-500 hover:bg-green-600 text-white border-green-600';
    }
  };

  const getRiskLabel = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'urgent':
      case 'high':
        return 'HIGH RISK';
      case 'medium':
      case 'moderate':
        return 'MODERATE RISK';
      case 'low':
      default:
        return 'LOW RISK';
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssessments.map((assessment, index) => (
              <Card key={`${assessment.id}-${index}`} className="bg-white shadow-md rounded-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{assessment.patientName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Completed: {new Date(assessment.completedAt).toLocaleDateString('en-GB')}</p>
                  <Badge className={`mt-2 ${getRiskBadgeClass(assessment.riskLevel)}`}>
                    {getRiskLabel(assessment.riskLevel)}
                  </Badge>
                  {assessment.urgentFlags && assessment.urgentFlags.length > 0 && (
                    <div className="mt-2">
                      <Badge variant="destructive" className="text-xs">
                        {assessment.urgentFlags.length} Red Flag(s)
                      </Badge>
                    </div>
                  )}
                  <div className="mt-4 space-y-2">
                    <Button onClick={() => navigateToResults(assessment.id)} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      View Results
                    </Button>
                    <div className="flex space-x-2">
                      <Button onClick={() => handleEmail(assessment)} variant="outline" size="sm" className="flex-1">
                        Email
                      </Button>
                      <Button onClick={() => handleCopySMS(assessment)} variant="outline" size="sm" className="flex-1">
                        Copy SMS
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
