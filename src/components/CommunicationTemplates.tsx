
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Copy, MessageSquare, Mail, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CommunicationTemplatesProps {
  assessmentLink?: string;
  patientName?: string;
}

const CommunicationTemplates = ({ assessmentLink = "", patientName = "" }: CommunicationTemplatesProps) => {
  const { toast } = useToast();
  const [customMessage, setCustomMessage] = useState('');

  const templates = {
    sms: [
      {
        name: "Assessment Ready",
        message: `Hi ${patientName}, your SYLVIA health assessment is ready: ${assessmentLink}`,
        charCount: 0
      },
      {
        name: "Reminder",
        message: `Please complete your health assessment within 48 hours: ${assessmentLink}`,
        charCount: 0
      },
      {
        name: "Follow-up",
        message: `Your assessment results are ready for review. Book an appointment to discuss: ${assessmentLink}`,
        charCount: 0
      }
    ],
    email: {
      subject: "Your SYLVIA Health Assessment is Ready",
      body: `Dear ${patientName},

Your healthcare provider has prepared a personalized health assessment for you through SYLVIA Health.

Please complete your assessment by clicking the link below:
${assessmentLink}

This assessment will help your healthcare provider better understand your symptoms and provide appropriate care.

Important notes:
- This link is for single use only
- It expires in 48 hours
- Your responses are secure and confidential

If you have any questions, please contact your healthcare provider directly.

Best regards,
SYLVIA Health Team

---
This is an automated message from SYLVIA Health. Please do not reply to this email.`
    }
  };

  // Calculate character counts
  const templatesWithCounts = templates.sms.map(template => ({
    ...template,
    charCount: template.message.length
  }));

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${type} template copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please manually select and copy the text",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* SMS Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            SMS Templates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Copy these templates into your practice SMS system (AccuRx, mjog, etc.)
          </p>
          
          {templatesWithCounts.map((template, index) => (
            <div key={index} className="border rounded p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{template.name}</h4>
                <div className="flex items-center space-x-2">
                  <Badge variant={template.charCount <= 160 ? "default" : "destructive"}>
                    {template.charCount}/160 chars
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(template.message, 'SMS template')}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                </div>
              </div>
              <Textarea
                value={template.message}
                readOnly
                className="text-sm resize-none"
                rows={3}
              />
            </div>
          ))}

          {/* Custom SMS Template */}
          <div className="border rounded p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Custom Message</h4>
              <div className="flex items-center space-x-2">
                <Badge variant={customMessage.length <= 160 ? "default" : "destructive"}>
                  {customMessage.length}/160 chars
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(customMessage, 'Custom SMS')}
                  disabled={!customMessage.trim()}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
              </div>
            </div>
            <Textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Write your custom SMS message..."
              className="text-sm"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Email Template */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Email Template
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="font-medium">Subject Line</Label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={templates.email.subject}
                readOnly
                className="flex-1 p-2 border rounded text-sm bg-gray-50"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(templates.email.subject, 'Email subject')}
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-medium">Email Body</Label>
            <div className="space-y-2">
              <Textarea
                value={templates.email.body}
                readOnly
                className="text-sm resize-none bg-gray-50"
                rows={16}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(templates.email.body, 'Email template')}
                className="w-full"
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy Email Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Label = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <label className={`text-sm font-medium ${className}`}>
    {children}
  </label>
);

export default CommunicationTemplates;
