
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>What Data We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We collect the following personal data to provide our health assessment and tracking services:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Personal information: Name, date of birth, email address</li>
                <li>Health symptoms and menopause-related information</li>
                <li>Assessment responses and tracking data</li>
                <li>Communication preferences and reminder settings</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Why We Collect This Data</CardTitle>
            </CardHeader>
            <CardContent>
              <p>We use your data to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Provide personalized health assessments</li>
                <li>Enable symptom tracking and monitoring</li>
                <li>Share assessment results with your healthcare provider</li>
                <li>Send reminders and educational content (with your consent)</li>
                <li>Improve our services and clinical outcomes</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Who Can Access Your Data</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Your data is only accessible to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>You (full access to your own data)</li>
                <li>Your healthcare provider (when you share an assessment)</li>
                <li>Our technical team (for system maintenance, under strict confidentiality)</li>
              </ul>
              <p className="mt-4 font-semibold">We never sell or share your data with third parties for marketing purposes.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Retention</CardTitle>
            </CardHeader>
            <CardContent>
              <p>We retain your health data for 7 years, in line with UK medical record standards. This ensures:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Continuity of care with your healthcare provider</li>
                <li>Long-term symptom pattern analysis</li>
                <li>Compliance with NHS data governance requirements</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Under UK GDPR, you have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Object to processing</li>
                <li>Data portability</li>
              </ul>
              <p className="mt-4">To exercise these rights, contact us at privacy@sylviahealth.co.uk</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p>We protect your data through:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>End-to-end encryption for data transmission</li>
                <li>Encrypted storage on secure UK-based servers</li>
                <li>Multi-factor authentication for healthcare providers</li>
                <li>Regular security audits and monitoring</li>
                <li>Compliance with NHS Digital security standards</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p>For any privacy-related questions or concerns:</p>
              <div className="mt-4 space-y-2">
                <p><strong>Email:</strong> privacy@sylviahealth.co.uk</p>
                <p><strong>Post:</strong> SYLVIA Health Privacy Team, [Address]</p>
                <p><strong>Data Protection Officer:</strong> dpo@sylviahealth.co.uk</p>
              </div>
            </CardContent>
          </Card>

          <div className="text-sm text-gray-600 mt-8">
            <p>Last updated: {new Date().toLocaleDateString('en-GB')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
