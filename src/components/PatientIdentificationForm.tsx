import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { UserPlus, Copy, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PatientIdentificationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAssessmentCreated: (sessionId: string, patientRef: string) => void;
}

const PatientIdentificationForm = ({ isOpen, onClose, onAssessmentCreated }: PatientIdentificationFormProps) => {
  const [selectedTab, setSelectedTab] = useState("name");
  const [isCreating, setIsCreating] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdLink, setCreatedLink] = useState<string>("");
  const [patientReference, setPatientReference] = useState<string>("");
  const { toast } = useToast();

  // Form states for different identification methods
  const [nameForm, setNameForm] = useState({ firstName: "", surname: "" });
  const [dobForm, setDobForm] = useState({ dateOfBirth: "" });
  const [nhsForm, setNhsForm] = useState({ nhsNumber: "" });
  const [customForm, setCustomForm] = useState({ customId: "" });

  const generateSessionId = () => {
    return 'session_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  };

  const formatNHSNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3').substring(0, 12);
  };

  const validateNHSNumber = (nhsNumber: string) => {
    const digits = nhsNumber.replace(/\D/g, '');
    return digits.length === 10;
  };

  const validateDateOfBirth = (dob: string) => {
    const date = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    return date <= today && age >= 18 && age <= 120;
  };

  const handleCreateAssessment = async () => {
    setIsCreating(true);
    
    let patientRef = "";
    let isValid = false;

    switch (selectedTab) {
      case "name":
        if (nameForm.firstName && nameForm.surname) {
          patientRef = `${nameForm.firstName} ${nameForm.surname}`;
          isValid = true;
        }
        break;
      case "dob":
        if (dobForm.dateOfBirth && validateDateOfBirth(dobForm.dateOfBirth)) {
          const date = new Date(dobForm.dateOfBirth);
          patientRef = `DOB: ${date.toLocaleDateString('en-GB')}`;
          isValid = true;
        }
        break;
      case "nhs":
        if (nhsForm.nhsNumber && validateNHSNumber(nhsForm.nhsNumber)) {
          const maskedNHS = nhsForm.nhsNumber.replace(/(\d{3})\s(\d{3})\s(\d{4})/, '$1 $2 ****');
          patientRef = `NHS: ${maskedNHS}`;
          isValid = true;
        }
        break;
      case "custom":
        if (customForm.customId) {
          patientRef = `ID: ${customForm.customId}`;
          isValid = true;
        }
        break;
    }

    if (!isValid) {
      toast({
        variant: "destructive",
        title: "Invalid Information",
        description: "Please provide valid patient identification details."
      });
      setIsCreating(false);
      return;
    }

    const sessionId = generateSessionId();
    const assessmentLink = `${window.location.origin}/patient-assessment/${sessionId}`;
    
    console.log("=== CREATING ASSESSMENT LINK ===");
    console.log("SessionId:", sessionId);
    console.log("Patient Reference:", patientRef);
    console.log("Assessment Link:", assessmentLink);
    
    // Store the patient reference with the session ID for later retrieval
    localStorage.setItem(`patient_ref_${sessionId}`, patientRef);
    console.log("💾 Stored patient reference for sessionId:", sessionId, "->", patientRef);
    
    setCreatedLink(assessmentLink);
    setPatientReference(patientRef);
    setIsCreating(false);
    setShowSuccessModal(true);
    
    onAssessmentCreated(sessionId, patientRef);

    toast({
      title: "Assessment Link Created",
      description: `Secure assessment link generated for ${patientRef}`,
    });
  };

  const copyToClipboard = async () => {
    if (createdLink) {
      try {
        await navigator.clipboard.writeText(createdLink);
        toast({
          title: "Link Copied!",
          description: "Assessment link copied to clipboard successfully",
        });
      } catch (err) {
        const textArea = document.createElement('textarea');
        textArea.value = createdLink;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast({
          title: "Link Copied!",
          description: "Assessment link copied to clipboard successfully",
        });
      }
    }
  };

  const resetForm = () => {
    setNameForm({ firstName: "", surname: "" });
    setDobForm({ dateOfBirth: "" });
    setNhsForm({ nhsNumber: "" });
    setCustomForm({ customId: "" });
    setCreatedLink("");
    setPatientReference("");
    setSelectedTab("name");
    setShowSuccessModal(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    resetForm();
    onClose();
  };

  return (
    <>
      {/* Main Form Dialog */}
      <Dialog open={isOpen && !showSuccessModal} onOpenChange={handleClose}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              <span>Create Patient Assessment</span>
            </DialogTitle>
            <DialogDescription>
              Securely identify your patient to generate a personalized assessment link
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              <p className="text-sm text-blue-800">
                Please identify the patient using one of the secure methods below
              </p>
            </div>

            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="name" className="text-xs">Name</TabsTrigger>
                <TabsTrigger value="dob" className="text-xs">DOB</TabsTrigger>
                <TabsTrigger value="nhs" className="text-xs">NHS</TabsTrigger>
                <TabsTrigger value="custom" className="text-xs">ID</TabsTrigger>
              </TabsList>

              <TabsContent value="name" className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={nameForm.firstName}
                      onChange={(e) => setNameForm({...nameForm, firstName: e.target.value})}
                      placeholder="Sarah"
                    />
                  </div>
                  <div>
                    <Label htmlFor="surname">Surname</Label>
                    <Input
                      id="surname"
                      value={nameForm.surname}
                      onChange={(e) => setNameForm({...nameForm, surname: e.target.value})}
                      placeholder="Smith"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="dob" className="space-y-3">
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={dobForm.dateOfBirth}
                    onChange={(e) => setDobForm({...dobForm, dateOfBirth: e.target.value})}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  {dobForm.dateOfBirth && !validateDateOfBirth(dobForm.dateOfBirth) && (
                    <p className="text-xs text-red-600 mt-1">Please enter a valid date of birth</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="nhs" className="space-y-3">
                <div>
                  <Label htmlFor="nhsNumber">NHS Number</Label>
                  <Input
                    id="nhsNumber"
                    value={nhsForm.nhsNumber}
                    onChange={(e) => setNhsForm({...nhsForm, nhsNumber: formatNHSNumber(e.target.value)})}
                    placeholder="123 456 7890"
                    maxLength={12}
                  />
                  {nhsForm.nhsNumber && !validateNHSNumber(nhsForm.nhsNumber) && (
                    <p className="text-xs text-red-600 mt-1">NHS number must be 10 digits</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="custom" className="space-y-3">
                <div>
                  <Label htmlFor="customId">Practice ID / Reference</Label>
                  <Input
                    id="customId"
                    value={customForm.customId}
                    onChange={(e) => setCustomForm({...customForm, customId: e.target.value})}
                    placeholder="Your practice reference"
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex space-x-2 pt-4">
              <Button onClick={handleClose} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleCreateAssessment} 
                disabled={isCreating}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isCreating ? "Creating..." : "Create Assessment"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={handleSuccessClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Assessment Link Created Successfully</span>
            </DialogTitle>
            <DialogDescription>
              Share this secure link with your patient to begin their assessment
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="p-6 bg-green-50 rounded-lg border border-green-200">
              <div className="mb-4">
                <p className="text-sm font-medium text-green-800 mb-1">
                  <strong>Patient:</strong> {patientReference}
                </p>
                <p className="text-sm text-green-700 mb-4">
                  Assessment link generated at {new Date().toLocaleString()}
                </p>
              </div>
              
              <div className="bg-white p-4 rounded border border-green-300 mb-4">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Assessment Link:</Label>
                <div className="flex items-center space-x-2">
                  <Input 
                    value={createdLink} 
                    readOnly 
                    className="flex-1 text-sm font-mono bg-gray-50"
                    onClick={(e) => e.currentTarget.select()}
                  />
                  <Button onClick={copyToClipboard} size="sm" className="bg-green-600 hover:bg-green-700 shrink-0">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Security & Usage Notes:</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• Share this link securely with your patient via SMS, email, or patient portal</p>
                <p>• Link is unique and expires after assessment completion</p>
                <p>• Patient results will appear in your dashboard automatically</p>
                <p>• Link contains no personal information for security</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button onClick={handleSuccessClose} variant="outline" className="flex-1">
                Create Another Assessment
              </Button>
              <Button onClick={handleSuccessClose} className="flex-1 bg-blue-600 hover:bg-blue-700">
                Return to Dashboard
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PatientIdentificationForm;
