
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Heart, Info, AlertTriangle, Download, BookOpen, Calendar, Clock, Activity, Phone, Shield } from "lucide-react";
import TrackerIntegration from "@/components/TrackerIntegration";
import { useState, useEffect } from "react";
import { getAssessment } from "@/utils/assessmentStorage";
import { calculateRiskLevel, getUrgentFlags, getRedFlags, generatePatientGuidance } from "@/components/ConditionalQuestionLogic";

const PatientResults = () => {
  const { sessionId } = useParams();
  const [assessmentData, setAssessmentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssessmentData();
  }, [sessionId]);

  const loadAssessmentData = async () => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    try {
      const assessment = await getAssessment(sessionId);
      if (assessment) {
        setAssessmentData(assessment);
      }
    } catch (error) {
      console.error("Error loading assessment:", error);
    } finally {
      setLoading(false);
    }
  };

  // Generate dynamic results based on assessment data
  const generateDynamicResults = () => {
    if (!assessmentData?.rawData) {
      return getDefaultResults();
    }

    const rawData = assessmentData.rawData;
    const riskLevel = calculateRiskLevel(rawData);
    const urgentFlags = getUrgentFlags(rawData);
    const redFlags = getRedFlags(rawData);
    const hasRedFlags = redFlags.length > 0;
    const hasCriticalMentalHealth = rawData.selfHarmRisk === 'frequent' || rawData.selfHarmRisk === 'occasional';

    // Generate personalized key findings
    const keyFindings = generateKeyFindings(rawData, riskLevel);
    const personalizedActions = generatePersonalizedActions(rawData, riskLevel, hasRedFlags, hasCriticalMentalHealth);
    const recommendations = generateGPDiscussionTopics(rawData, riskLevel);
    const nextSteps = generateNextSteps(rawData, riskLevel, hasRedFlags);
    const educationalTopics = generateEducationalTopics(rawData);

    return {
      completedAt: new Date(assessmentData.completedAt).toLocaleDateString('en-GB'),
      riskLevel,
      needsGPAppointment: riskLevel !== 'low',
      hasRedFlags,
      hasCriticalMentalHealth,
      urgentFlags,
      keyFindings,
      recommendations,
      nextSteps,
      educationalTopics,
      personalizedActions
    };
  };

  const generateKeyFindings = (rawData: any, riskLevel: string) => {
    const findings = [];
    
    // Vasomotor symptoms
    if (rawData.hotFlashFrequency === 'severe' || rawData.nightSweats === 'severe') {
      findings.push("You're experiencing significant menopausal symptoms that can be effectively managed");
    } else if (rawData.hotFlashFrequency === 'moderate' || rawData.nightSweats === 'moderate') {
      findings.push("You have moderate menopausal symptoms that many women experience");
    }

    // Mood and wellbeing
    if (rawData.moodSymptoms === 'severe') {
      findings.push("Your wellbeing is important to us - there are effective ways to support your mental health during menopause");
    } else if (rawData.moodSymptoms === 'moderate') {
      findings.push("You're experiencing some mood changes that are common during menopause");
    }

    // Physical symptoms
    if (rawData.physicalSymptoms?.length > 3) {
      findings.push("You have several physical symptoms that can be addressed with the right support");
    }

    // Treatment interest
    if (rawData.treatmentPreferences?.includes('hrt')) {
      findings.push("You're interested in learning more about hormone replacement therapy options");
    }

    // Default positive finding
    if (findings.length === 0) {
      findings.push("You've completed a comprehensive health assessment to help your GP provide the best care");
    }

    return findings;
  };

  const generatePersonalizedActions = (rawData: any, riskLevel: string, hasRedFlags: boolean, hasCriticalMentalHealth: boolean) => {
    const actions = [];

    // Critical mental health - immediate support
    if (hasCriticalMentalHealth) {
      actions.push({
        icon: <Phone className="w-4 h-4" />,
        title: "Speak to someone today",
        description: "Please contact your GP practice, NHS 111, or Samaritans (116 123) - support is available",
        priority: "critical",
        urgency: "immediate"
      });
    }

    // Red flags - gentle encouragement for GP appointment
    if (hasRedFlags && !hasCriticalMentalHealth) {
      actions.push({
        icon: <Calendar className="w-4 h-4" />,
        title: "Book a GP appointment soon",
        description: "Your responses suggest it would be helpful to see your GP to discuss your symptoms",
        priority: "high",
        urgency: "soon"
      });
    }

    // Regular GP appointment for moderate/high risk
    if (riskLevel === 'amber' || riskLevel === 'high') {
      actions.push({
        icon: <Calendar className="w-4 h-4" />,
        title: "Schedule a GP consultation",
        description: "Discuss your symptoms and explore treatment options that might help you feel better",
        priority: "medium",
        urgency: "routine"
      });
    }

    // Lifestyle recommendations
    if (rawData.exerciseLevel === 'none') {
      actions.push({
        icon: <Activity className="w-4 h-4" />,
        title: "Gentle exercise can help",
        description: "Even light activity like walking can improve menopause symptoms",
        priority: "low",
        urgency: "when_ready"
      });
    }

    // Symptom tracking
    actions.push({
      icon: <Clock className="w-4 h-4" />,
      title: "Track your symptoms",
      description: "Keeping a diary can help you and your GP understand patterns",
      priority: "low",
      urgency: "when_ready"
    });

    return actions;
  };

  const generateGPDiscussionTopics = (rawData: any, riskLevel: string) => {
    const topics = [];

    if (rawData.treatmentPreferences?.includes('hrt')) {
      topics.push("Ask about hormone replacement therapy and whether it's suitable for you");
    }

    if (rawData.hotFlashFrequency === 'severe' || rawData.nightSweats === 'severe') {
      topics.push("Discuss treatments for hot flashes and night sweats");
    }

    if (rawData.moodSymptoms === 'moderate' || rawData.moodSymptoms === 'severe') {
      topics.push("Talk about mood support and mental wellbeing during menopause");
    }

    if (rawData.sleepQuality === 'poor' || rawData.sleepQuality === 'very-poor') {
      topics.push("Explore ways to improve your sleep quality");
    }

    if (rawData.personalMedicalHistory?.length > 0) {
      topics.push("Review how your medical history affects treatment options");
    }

    // Default topics
    if (topics.length === 0) {
      topics.push("Discuss your symptoms and how they're affecting your daily life");
      topics.push("Ask about lifestyle changes that might help");
    }

    return topics;
  };

  const generateNextSteps = (rawData: any, riskLevel: string, hasRedFlags: boolean) => {
    const steps = [];

    if (hasRedFlags) {
      steps.push("Your GP will review your assessment and may want to see you promptly");
    } else {
      steps.push("Your GP will review your assessment before your appointment");
    }

    steps.push("Think about any questions you'd like to ask about your symptoms");
    
    if (rawData.treatmentPreferences?.length > 0) {
      steps.push("Consider what treatment approaches interest you most");
    }

    return steps;
  };

  const generateEducationalTopics = (rawData: any) => {
    const topics = ["Understanding menopause and your symptoms"];

    if (rawData.treatmentPreferences?.includes('hrt')) {
      topics.push("Hormone replacement therapy explained");
    }

    if (rawData.treatmentPreferences?.includes('lifestyle')) {
      topics.push("Lifestyle approaches for managing symptoms");
    }

    topics.push("Supporting your bone health during menopause");
    topics.push("Managing mood and wellbeing");

    return topics;
  };

  const getDefaultResults = () => ({
    completedAt: new Date().toLocaleDateString('en-GB'),
    riskLevel: "medium",
    needsGPAppointment: true,
    hasRedFlags: false,
    hasCriticalMentalHealth: false,
    urgentFlags: [],
    keyFindings: ["You've completed your comprehensive health assessment"],
    recommendations: ["Discuss your symptoms with your GP"],
    nextSteps: ["Your GP will review your responses"],
    educationalTopics: ["Understanding menopause"],
    personalizedActions: [{
      icon: <Calendar className="w-4 h-4" />,
      title: "Book a GP appointment",
      description: "Discuss your assessment results",
      priority: "medium",
      urgency: "routine"
    }]
  });

  const handleDownloadResults = () => {
    console.log("Downloading patient results summary");
  };

  const handleExploreEducation = () => {
    const treatmentPreferences = assessmentData?.rawData?.treatmentPreferences || [];
    const educationUrl = treatmentPreferences.length > 0 
      ? `/education?preferences=${treatmentPreferences.join(',')}&sessionId=${sessionId}&source=results`
      : `/education?sessionId=${sessionId}&source=results`;
    window.open(educationUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#dbeafe] via-white to-[#ede9fe] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#425563] mx-auto mb-4"></div>
          <p className="text-[#425563]">Loading your results...</p>
        </div>
      </div>
    );
  }

  const results = generateDynamicResults();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dbeafe] via-white to-[#ede9fe]">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#dcfce7] rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-[#425563]" />
              </div>
              <div className="text-center">
                <h1 className="text-xl font-bold text-[#425563]">Assessment Complete</h1>
                <p className="text-sm text-[#425563] opacity-80">Your NICE NG23 enhanced health assessment results</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Completion Message */}
          <Card className="mb-8 bg-[#dcfce7] border-[#dcfce7]">
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-[#425563]" />
              <h2 className="text-2xl font-bold mb-4 text-[#425563]">Thank You!</h2>
              <p className="text-lg mb-4 text-[#425563]">
                Your NICE NG23 enhanced health assessment has been completed and shared with your GP.
              </p>
              <p className="text-[#425563] opacity-80 text-sm">
                Completed on {results.completedAt} • Session: {sessionId?.slice(-8)}
              </p>
            </CardContent>
          </Card>

          {/* Critical Mental Health Alert - NHS Protocol */}
          {results.hasCriticalMentalHealth && (
            <Card className="mb-6 bg-red-50 border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center text-red-800">
                  <Phone className="w-5 h-5 mr-2" />
                  Support is Available Right Now
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-700 mb-4">
                  Thank you for sharing your feelings with us. Please know that you're not alone and help is available immediately.
                </p>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-3 p-3 bg-white rounded border-l-4 border-red-500">
                    <Phone className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-semibold text-red-800">Immediate Support</p>
                      <p className="text-sm text-red-700">Emergency: 999 • NHS 111 • Samaritans: 116 123 (free, 24/7)</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white rounded border-l-4 border-blue-500">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-semibold text-blue-800">Your GP Practice</p>
                      <p className="text-sm text-blue-700">Contact your GP practice today - they want to help you</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Gentle Red Flag Message - NHS Approach */}
          {results.hasRedFlags && !results.hasCriticalMentalHealth && (
            <Card className="mb-6 bg-[#dbeafe] border-[#dbeafe]">
              <CardHeader>
                <CardTitle className="flex items-center text-[#425563]">
                  <Calendar className="w-5 h-5 mr-2" />
                  We'd Like You to See Your GP Soon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#425563] mb-4">
                  Based on your responses, it would be helpful for you to have a conversation with your GP about your symptoms. 
                  This is quite common and nothing to worry about - your GP just wants to make sure you get the best care possible.
                </p>
                <p className="text-sm text-[#425563] opacity-80">
                  Your GP has all the information from your NICE NG23 enhanced assessment and will be ready to discuss the next steps with you.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Key Findings with Embedded Personalized Actions */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="w-5 h-5 mr-2 text-[#ede9fe]" />
                Your Health Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-3">
                  {results.keyFindings.map((finding, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-[#ede9fe] rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-[#425563]">{finding}</p>
                    </div>
                  ))}
                </div>

                {/* Embedded Personalized Actions */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-[#425563] mb-3">Recommended Actions for You:</h3>
                  <div className="space-y-3">
                    {results.personalizedActions.map((action, index) => {
                      const getPriorityColors = (priority: string) => {
                        switch(priority) {
                          case 'critical': return 'bg-red-50 border-red-500 text-red-800';
                          case 'high': return 'bg-[#fed7c3] border-orange-500 text-orange-800';
                          case 'medium': return 'bg-[#dbeafe] border-blue-500 text-blue-800';
                          default: return 'bg-[#dcfce7] border-green-500 text-green-800';
                        }
                      };

                      const getBadgeColors = (priority: string) => {
                        switch(priority) {
                          case 'critical': return 'bg-red-500 text-white';
                          case 'high': return 'bg-orange-500 text-white';
                          case 'medium': return 'bg-blue-500 text-white';
                          default: return 'bg-green-500 text-white';
                        }
                      };

                      return (
                        <div key={index} className={`p-3 rounded-lg border-l-4 ${getPriorityColors(action.priority)}`}>
                          <div className="flex items-start space-x-3">
                            <div className={`p-1 rounded ${
                              action.priority === 'critical' ? 'bg-red-100 text-red-600' :
                              action.priority === 'high' ? 'bg-orange-100 text-orange-600' :
                              action.priority === 'medium' ? 'bg-blue-100 text-blue-600' :
                              'bg-green-100 text-green-600'
                            }`}>
                              {action.icon}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{action.title}</h4>
                              <p className="text-sm opacity-90">{action.description}</p>
                            </div>
                            <Badge className={getBadgeColors(action.priority)}>
                              {action.urgency === 'immediate' ? 'Now' :
                               action.urgency === 'soon' ? 'Soon' :
                               action.urgency === 'routine' ? 'Routine' : 'When Ready'}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* GP Discussion Topics */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="w-5 h-5 mr-2 text-[#dbeafe]" />
                Things to Discuss with Your GP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 text-[#425563]">Conversation topics for your appointment:</h3>
                  <ul className="space-y-2">
                    {results.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-[#dcfce7] mt-0.5 flex-shrink-0" />
                        <span className="text-[#425563]">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Educational Resources Integration */}
          <Card className="mb-6 bg-[#dbeafe] border-[#dbeafe]">
            <CardHeader>
              <CardTitle className="flex items-center text-[#425563]">
                <BookOpen className="w-5 h-5 mr-2" />
                Learn More While You Wait
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#425563] mb-4">
                Explore helpful resources about your symptoms and treatment options. 
                The more you know, the better conversations you can have with your GP.
              </p>
              <div className="space-y-2 mb-4">
                <h4 className="font-medium text-[#425563]">Topics that might interest you:</h4>
                <div className="flex flex-wrap gap-2">
                  {results.educationalTopics.map((topic, index) => (
                    <Badge key={index} variant="outline" className="border-[#425563] text-[#425563]">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button 
                onClick={handleExploreEducation}
                className="w-full bg-[#425563] hover:bg-[#425563]/90 text-white"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Explore Helpful Resources
              </Button>
            </CardContent>
          </Card>

          {/* Symptom Tracker Integration */}
          <TrackerIntegration 
            sessionId={sessionId}
            patientResults={results}
          />

          {/* Next Steps */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-[#fed7c3]" />
                What Happens Next
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.nextSteps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-[#fed7c3] text-[#425563] rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-[#425563]">{step}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleDownloadResults}
              className="flex-1 bg-[#425563] hover:bg-[#425563]/90 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Your Summary
            </Button>
            <Button 
              variant="outline"
              className="flex-1 border-[#425563] text-[#425563] hover:bg-[#425563] hover:text-white"
              onClick={() => window.close()}
            >
              Close Window
            </Button>
          </div>

          {/* Footer Info */}
          <div className="mt-8 p-4 bg-[#dcfce7] rounded-lg text-center">
            <p className="text-sm text-[#425563]">
              Your responses are secure and confidential. Only your GP will have access to the detailed results.
              If you have urgent concerns, please contact your GP directly or call NHS 111.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientResults;
