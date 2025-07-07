
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Stethoscope,
  Plus,
  Search,
  Activity
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PatientIdentificationForm from "@/components/PatientIdentificationForm";
import { loadAllAssessments, type StoredAssessment } from "@/utils/assessmentStorage";

const GPDashboard = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<StoredAssessment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    setLoading(true);
    try {
      const allAssessments = await loadAllAssessments();
      console.log("Loaded assessments:", allAssessments);
      setAssessments(allAssessments);
    } catch (error) {
      console.error("Error loading assessments:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssessments = assessments.filter(assessment =>
    assessment.patient_ref.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const navigateToResults = (sessionId: string) => {
    navigate(`/gp-results/${sessionId}`);
  };

  const handleAssessmentCreated = (sessionId: string, patientRef: string) => {
    // Refresh the assessments list
    loadAssessments();
    setShowPatientForm(false);
  };

  const getRiskBadgeClass = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'red':
      case 'urgent':
      case 'high':
        return 'bg-red-500 hover:bg-red-600 text-white border-red-600';
      case 'amber':
      case 'moderate':
      case 'medium':
        return 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600';
      case 'green':
      case 'low':
      default:
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
      case 'moderate':
      case 'medium':
        return 'MODERATE RISK';
      case 'green':
      case 'low':
      default:
        return 'LOW RISK';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-GB');
    } catch (error) {
      return 'Unknown date';
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
                System Active
              </Badge>
              <Button 
                onClick={() => setShowPatientForm(true)} 
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Assessment
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            My Patient Assessments ({filteredAssessments.length})
          </h2>
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

        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Stethoscope className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">Loading assessments...</p>
          </div>
        ) : filteredAssessments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssessments.map((assessment) => (
              <Card key={assessment.session_id} className="bg-white shadow-md rounded-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{assessment.patient_ref}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Completed: {formatDate(assessment.completed_at)}</p>
                  <Badge className={`mt-2 ${getRiskBadgeClass(assessment.risk_level)}`}>
                    {getRiskLabel(assessment.risk_level)}
                  </Badge>
                  <Button onClick={() => navigateToResults(assessment.session_id)} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                    View Results
                  </Button>
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
