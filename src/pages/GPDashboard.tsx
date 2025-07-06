import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Search, 
  Filter,
  Copy,
  Mail,
  MessageSquare,
  Clock,
  Shield,
  Plus,
  BookOpen,
  User,
  X
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import DateInput from "@/components/DateInput";

const GPDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [assessmentLinks, setAssessmentLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAssessment, setNewAssessment] = useState({
    firstName: '',
    surname: '',
    dateOfBirth: '',
    nhsNumber: '',
    patientId: ''
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAssessmentLinks();
    }
  }, [user]);

  const fetchAssessmentLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('assessment_links')
        .select('*')
        .eq('created_by', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssessmentLinks(data || []);
    } catch (error) {
      console.error('Error fetching assessment links:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssessment = async () => {
    if (!user || !newAssessment.firstName.trim() || !newAssessment.surname.trim()) {
      toast({
        title: "Error",
        description: "First name and surname are required.",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);
    try {
      // Create patient identifier from provided information
      const identifierParts = [
        `${newAssessment.firstName.trim()} ${newAssessment.surname.trim()}`,
        newAssessment.dateOfBirth.trim(),
        newAssessment.nhsNumber.trim(),
        newAssessment.patientId.trim()
      ].filter(Boolean);
      
      const patientIdentifier = identifierParts.join(' | ');

      const { data, error } = await supabase
        .from('assessment_links')
        .insert({
          created_by: user.id,
          patient_identifier: patientIdentifier,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      // Create the correct URL path
      const fullUrl = `${window.location.origin}/patient-assessment/${data.id}`;
      
      console.log('Created assessment link:', fullUrl);
      
      // Copy to clipboard
      await navigator.clipboard.writeText(fullUrl);

      toast({
        title: "Assessment Created",
        description: "Assessment link has been created and copied to clipboard.",
      });

      // Reset form and close modal
      setNewAssessment({
        firstName: '',
        surname: '',
        dateOfBirth: '',
        nhsNumber: '',
        patientId: ''
      });
      setShowCreateModal(false);
      
      // Refresh the list
      fetchAssessmentLinks();
    } catch (error) {
      console.error('Error creating assessment:', error);
      toast({
        title: "Error",
        description: "Failed to create assessment link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const filteredAssessments = assessmentLinks.filter(link =>
    link.patient_identifier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRiskLevel = (sessionData: any) => {
    if (!sessionData?.riskAssessment) return 'unknown';
    return sessionData.riskAssessment.overall || 'unknown';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const copyStandardSMS = async (patientName: string) => {
    const message = "NHS: You need an appointment to discuss your SYLVIA assessment results. Please call the practice to book. Reply STOP to opt out.";
    try {
      await navigator.clipboard.writeText(message);
      toast({
        title: "Message copied!",
        description: "Paste into your practice SMS system",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please manually copy the message",
        variant: "destructive",
      });
    }
  };

  const copyHighRiskSMS = async (patientName: string) => {
    const message = "Please contact your GP Practice to arrange an appointment ASAP. Your assessment shows results requiring prompt review. Please contact the practice TODAY on [PRACTICE_PHONE]. Reply STOP to opt out.";
    try {
      await navigator.clipboard.writeText(message);
      toast({
        title: "High-risk message copied!",
        description: "Paste into your practice SMS system",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please manually copy the message",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-soft-coral-dark"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">GP Clinical Portal</h1>
              <p className="text-gray-600 mt-1">Manage patient assessments and view results</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={() => navigate('/instructions')}
                className="flex items-center space-x-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>User Guide</span>
              </Button>
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Assessment</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assessmentLinks.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {assessmentLinks.filter(link => link.status === 'completed').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {assessmentLinks.filter(link => link.status === 'completed' && !link.reviewed).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search patients..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Patient List */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredAssessments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No assessments found</p>
                <Button 
                  onClick={() => setShowCreateModal(true)}
                  className="mt-4"
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Assessment
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAssessments.map((assessment) => (
                  <div key={assessment.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-medium">{assessment.patient_identifier}</h3>
                          <Badge className={getRiskColor(getRiskLevel(assessment.session_data))}>
                            {getRiskLevel(assessment.session_data).toUpperCase()}
                          </Badge>
                          <Badge variant={assessment.status === 'completed' ? 'default' : 'secondary'}>
                            {assessment.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Created: {new Date(assessment.created_at).toLocaleDateString()}
                          {assessment.completed_at && (
                            <> • Completed: {new Date(assessment.completed_at).toLocaleDateString()}</>
                          )}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {assessment.status === 'completed' ? (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/gp-results/${assessment.id}`)}
                            >
                              View Results
                            </Button>
                            <Button variant="outline" size="sm">
                              <Mail className="w-4 h-4 mr-1" />
                              Email
                            </Button>
                            {getRiskLevel(assessment.session_data) === 'high' ? (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => copyHighRiskSMS(assessment.patient_identifier)}
                                className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                              >
                                <MessageSquare className="w-4 h-4 mr-1" />
                                Copy SMS
                              </Button>
                            ) : (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => copyStandardSMS(assessment.patient_identifier)}
                              >
                                <MessageSquare className="w-4 h-4 mr-1" />
                                Copy SMS
                              </Button>
                            )}
                          </>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={async () => {
                              const fullUrl = `${window.location.origin}/patient-assessment/${assessment.id}`;
                              console.log('Copying link:', fullUrl);
                              try {
                                await navigator.clipboard.writeText(fullUrl);
                                toast({
                                  title: "Link copied!",
                                  description: "Assessment link copied to clipboard",
                                });
                              } catch (error) {
                                toast({
                                  title: "Copy failed",
                                  description: "Please manually copy the link",
                                  variant: "destructive",
                                });
                              }
                            }}
                          >
                            <Copy className="w-4 h-4 mr-1" />
                            Copy Link
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Assessment Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <DialogTitle>Create Patient Assessment</DialogTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowCreateModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Securely identify your patient to generate a personalized assessment link
            </p>
          </DialogHeader>
          
          <div className="space-y-6 mt-6">
            {/* Instructions */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 font-medium mb-2">
                Please identify the patient using one or more of the secure methods below
              </p>
              <p className="text-xs text-blue-600">
                Use any combination of identifiers that your practice requires for patient verification
              </p>
            </div>

            {/* Column Headers */}
            <div className="grid grid-cols-4 gap-3 text-xs font-medium text-gray-500 border-b pb-2">
              <span>Name</span>
              <span>DOB</span>
              <span>NHS</span>
              <span>ID</span>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  value={newAssessment.firstName}
                  onChange={(e) => setNewAssessment(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Sarah"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="surname" className="text-sm font-medium text-gray-700">
                  Surname <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="surname"
                  value={newAssessment.surname}
                  onChange={(e) => setNewAssessment(prev => ({ ...prev, surname: e.target.value }))}
                  placeholder="Smith"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <Label htmlFor="dob" className="text-sm font-medium text-gray-700">Date of Birth</Label>
              <DateInput
                id="dob"
                value={newAssessment.dateOfBirth}
                onChange={(value) => setNewAssessment(prev => ({ ...prev, dateOfBirth: value }))}
                placeholder="DD/MM/YYYY"
                className="mt-1"
              />
            </div>

            {/* NHS Number */}
            <div>
              <Label htmlFor="nhs" className="text-sm font-medium text-gray-700">NHS Number</Label>
              <Input
                id="nhs"
                value={newAssessment.nhsNumber}
                onChange={(e) => setNewAssessment(prev => ({ ...prev, nhsNumber: e.target.value }))}
                placeholder="123 456 7890"
                className="mt-1"
              />
            </div>

            {/* Patient ID */}
            <div>
              <Label htmlFor="patientId" className="text-sm font-medium text-gray-700">Patient ID</Label>
              <Input
                id="patientId"
                value={newAssessment.patientId}
                onChange={(e) => setNewAssessment(prev => ({ ...prev, patientId: e.target.value }))}
                placeholder="Practice patient identifier"
                className="mt-1"
              />
            </div>

            {/* Security Notice */}
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <div className="flex items-start space-x-2">
                <Shield className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-yellow-800">
                  <p className="font-medium">Security Notice</p>
                  <p>Links expire in 48 hours and are single-use only for patient safety.</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateAssessment}
                disabled={creating || !newAssessment.firstName.trim() || !newAssessment.surname.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {creating ? 'Creating...' : 'Create Assessment'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GPDashboard;
