
interface AssessmentResult {
  sessionId: string;
  patientRef?: string;
  completedAt: string;
  riskLevel: string;
  urgentFlags: string[];
  clinicalSummary: any;
  recommendations: string[];
}

interface EmailTemplate {
  subject: string;
  body: string;
}

export class EmailService {
  static generateClinicalReport(result: AssessmentResult): EmailTemplate {
    const riskBadge = result.riskLevel.toUpperCase();
    const urgentFlag = result.riskLevel === "red" ? "🚨 URGENT REVIEW REQUIRED 🚨" : "";
    
    const subject = `${urgentFlag} Menopause Assessment Results - Session ${result.sessionId.slice(-8)}`;
    
    const body = `
Dear Colleague,

${urgentFlag ? "URGENT: This patient requires immediate attention due to red flag symptoms.\n\n" : ""}

PATIENT ASSESSMENT SUMMARY
==========================
Session ID: ${result.sessionId}
Patient Reference: ${result.patientRef || "Anonymous"}
Completed: ${result.completedAt}
Risk Level: ${riskBadge}

${result.urgentFlags.length > 0 ? `
RED FLAG ALERTS:
${result.urgentFlags.map(flag => `⚠️ ${flag}`).join('\n')}
` : ""}

CLINICAL SUMMARY:
================
• Vasomotor symptoms: ${result.clinicalSummary.vasomotor || "Not reported"}
• Physical symptoms: ${result.clinicalSummary.physical || "Not reported"}  
• Psychological symptoms: ${result.clinicalSummary.psychological || "Not reported"}
• Sexual health concerns: ${result.clinicalSummary.sexual || "Not reported"}

LIFESTYLE FACTORS:
=================
• Smoking status: ${result.clinicalSummary.smoking || "Not reported"}
• Alcohol consumption: ${result.clinicalSummary.alcohol || "Not reported"}
• Exercise level: ${result.clinicalSummary.exercise || "Not reported"}
• BMI: ${result.clinicalSummary.bmi || "Not calculated"}

RECOMMENDATIONS:
===============
${result.recommendations.map(rec => `• ${rec}`).join('\n')}

NEXT STEPS:
==========
${result.riskLevel === "red" ? 
  "• Schedule urgent appointment within 2 weeks\n• Consider urgent referral if indicated\n• Review red flag symptoms immediately" :
  "• Schedule routine follow-up appointment\n• Discuss treatment options\n• Consider lifestyle interventions"
}

This assessment was completed using the NHS NICE NG23 compliant menopause assessment tool.
For full results and detailed analysis, please login to the clinical dashboard.

Best regards,
Menopause Assessment System
    `.trim();

    return { subject, body };
  }

  static async sendEmail(to: string, template: EmailTemplate): Promise<boolean> {
    // In a real application, this would integrate with an email service
    // For now, we'll simulate the email sending and log the content
    
    console.log("=== EMAIL SENT ===");
    console.log(`To: ${to}`);
    console.log(`Subject: ${template.subject}`);
    console.log(`Body:\n${template.body}`);
    console.log("================");
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return success (in real app, this would depend on actual email service response)
    return true;
  }

  static async sendAssessmentResults(
    gpEmail: string, 
    result: AssessmentResult
  ): Promise<boolean> {
    try {
      const template = this.generateClinicalReport(result);
      return await this.sendEmail(gpEmail, template);
    } catch (error) {
      console.error("Failed to send assessment results:", error);
      return false;
    }
  }
}
