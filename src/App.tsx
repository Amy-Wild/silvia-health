
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import Navigation from "@/components/Navigation";
import PrivacyBanner from "@/components/PrivacyBanner";
import RouteGuard from "@/components/RouteGuard";
import PublicHome from "./pages/PublicHome";
import PatientAssessment from "./pages/PatientAssessment";
import Results from "./pages/Results";
import SymptomTracker from "./pages/SymptomTracker";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import GPDashboard from "./pages/GPDashboard";
import ClinicalDashboard from "./pages/ClinicalDashboard";
import Auth from "./pages/Auth";
import Education from "./pages/Education";
import Instructions from "./pages/Instructions";
import PartnerZone from "./pages/PartnerZone";
import GPResults from "./pages/GPResults";
import PatientResults from "./pages/PatientResults";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Navigation />
            <Routes>
              {/* Public routes - accessible to everyone */}
              <Route path="/" element={<PublicHome />} />
              <Route path="/education" element={<Education />} />
              <Route path="/instructions" element={<Instructions />} />
              <Route path="/partner-zone" element={<PartnerZone />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Assessment routes - public but specific */}
              <Route path="/patient-assessment/:sessionId" element={<PatientAssessment />} />
              <Route path="/results" element={<Results />} />
              
              {/* Patient-only routes */}
              <Route 
                path="/symptom-tracker" 
                element={
                  <RouteGuard requiresAccess="patient">
                    <SymptomTracker />
                  </RouteGuard>
                } 
              />
              <Route 
                path="/patient-results/:sessionId" 
                element={
                  <RouteGuard requiresAccess="patient">
                    <PatientResults />
                  </RouteGuard>
                } 
              />
              
              {/* GP-only routes */}
              <Route 
                path="/gp-dashboard" 
                element={
                  <RouteGuard requiresAccess="gp">
                    <GPDashboard />
                  </RouteGuard>
                } 
              />
              <Route 
                path="/gp/dashboard" 
                element={
                  <RouteGuard requiresAccess="gp">
                    <GPDashboard />
                  </RouteGuard>
                } 
              />
              <Route 
                path="/gp-results/:sessionId" 
                element={
                  <RouteGuard requiresAccess="gp">
                    <GPResults />
                  </RouteGuard>
                } 
              />
              
              {/* Clinical Admin routes */}
              <Route 
                path="/clinical-dashboard" 
                element={
                  <RouteGuard requiresAccess="clinical_admin">
                    <ClinicalDashboard />
                  </RouteGuard>
                } 
              />
              <Route 
                path="/clinical/dashboard" 
                element={
                  <RouteGuard requiresAccess="clinical_admin">
                    <ClinicalDashboard />
                  </RouteGuard>
                } 
              />
            </Routes>
            <PrivacyBanner />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
