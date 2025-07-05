
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  const [createdLink, setCreatedLink] = useState<string | null>(null);
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
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Format as XXX XXX XXXX
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
    
    // Store patient reference with session
    localStorage.setItem(`patient_ref_${sessionId}`, patientRef);
    
    setCreatedLink(assessmentLink);
    setPatientReference(patientRef);
    setIsCreating(false);
    
    onAssessmentCreated(sessionId, patientRef);

    toast({
      title: "Assessment Link Created",
      description: `Secure assessment link generated for ${patientRef}`,
    });
  };

  const copyToClipboard = async () => {
    if (createdLink) {
      await navigator.clipboard.writeText(createdLink);
      toast({
        title: "Link Copied",
        description: "Assessment link copied to clipboard",
      });
    }
  };

  const resetForm = () => {
    setNameForm({ firstName: "", surname: "" });
    setDobForm({ dateOfBirth: "" });
    setNhsForm({ nhsNumber: "" });
    setCustomForm({ customId: "" });
    setCreatedLink(null);
    setPatientReference("");
    setSelectedTab("name");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (createdLink) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Assessment Link Created</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800 mb-2">
                <strong>Patient:</strong> {patientReference}
              </p>
              <p className="text-xs text-green-600 break-all mb-3">
                {createdLink}
              </p>
              <Button onClick={copyToClipboard} className="w-full bg-green-600 hover:bg-green-700">
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <p>• Share this link securely with your patient</p>
              <p>• Link expires after assessment completion</p>
              <p>• Results will appear in your dashboard</p>
            </div>
            <Button onClick={handleClose} variant="outline" className="w-full">
              Create Another Assessment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            <span>Create Patient Assessment</span>
          </DialogTitle>
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
  );
};

export default PatientIdentificationForm;
