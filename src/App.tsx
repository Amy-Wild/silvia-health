
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import AuthPage from "@/components/auth/AuthPage";
import RouteGuard from "@/components/RouteGuard";
import Index from "./pages/Index";
import PatientAssessment from "./pages/PatientAssessment";
import PatientResults from "./pages/PatientResults";
import GPDashboard from "./pages/GPDashboard";
import GPResults from "./pages/GPResults";
import ClinicalDashboard from "./pages/ClinicalDashboard";
import Instructions from "./pages/Instructions";
import Education from "./pages/Education";
import PartnerZone from "./pages/PartnerZone";
import SymptomTracker from "./pages/SymptomTracker";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth Route */}
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Public Patient Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/patient-assessment/:sessionId" element={<PatientAssessment />} />
            <Route path="/patient-results/:sessionId" element={<PatientResults />} />
            <Route path="/education" element={<Education />} />
            <Route path="/partner-zone" element={<PartnerZone />} />
            <Route path="/instructions" element={<Instructions />} />
            
            {/* Protected Symptom Tracker - requires patient login */}
            <Route path="/symptom-tracker" element={
              <RouteGuard requiresAccess="patient">
                <SymptomTracker />
              </RouteGuard>
            } />
            
            {/* GP/Healthcare Provider Routes - Single set only */}
            <Route path="/gp/dashboard" element={
              <RouteGuard requiresAccess="gp">
                <GPDashboard />
              </RouteGuard>
            } />
            <Route path="/gp/results/:sessionId" element={
              <RouteGuard requiresAccess="gp">
                <GPResults />
              </RouteGuard>
            } />
            
            {/* Clinical Dashboard Routes - Single set only */}
            <Route path="/clinical/dashboard" element={
              <RouteGuard requiresAccess="clinical_admin">
                <ClinicalDashboard />
              </RouteGuard>
            } />
            
            {/* Legacy redirects for backward compatibility */}
            <Route path="/gp" element={
              <RouteGuard requiresAccess="gp">
                <GPDashboard />
              </RouteGuard>
            } />
            <Route path="/gp-dashboard" element={
              <RouteGuard requiresAccess="gp">
                <GPDashboard />
              </RouteGuard>
            } />
            <Route path="/gp-results/:sessionId" element={
              <RouteGuard requiresAccess="gp">
                <GPResults />
              </RouteGuard>
            } />
            <Route path="/clinical" element={
              <RouteGuard requiresAccess="clinical_admin">
                <ClinicalDashboard />
              </RouteGuard>
            } />
            <Route path="/clinical-dashboard" element={
              <RouteGuard requiresAccess="clinical_admin">
                <ClinicalDashboard />
              </RouteGuard>
            } />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
