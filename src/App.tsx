
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import AuthPage from "@/components/auth/AuthPage";
import RouteGuard from "@/components/RouteGuard";
import Navigation from "@/components/Navigation";
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
import { useAuth } from "@/components/auth/AuthProvider";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Route - No Navigation */}
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Public Routes - No Navigation Required */}
        <Route path="/education" element={<Education />} />
        <Route path="/partner-zone" element={<PartnerZone />} />
        <Route path="/instructions" element={<Instructions />} />
        
        {/* Protected Patient Routes */}
        <Route path="/" element={
          <RouteGuard requiresAccess="patient">
            <div className="min-h-screen bg-gray-50">
              <Navigation />
              <Index />
            </div>
          </RouteGuard>
        } />
        
        <Route path="/patient-assessment/:sessionId" element={
          <RouteGuard requiresAccess="patient">
            <div className="min-h-screen">
              <Navigation />
              <PatientAssessment />
            </div>
          </RouteGuard>
        } />
        
        <Route path="/patient-results/:sessionId" element={
          <RouteGuard requiresAccess="patient">
            <div className="min-h-screen">
              <Navigation />
              <PatientResults />
            </div>
          </RouteGuard>
        } />
        
        <Route path="/symptom-tracker" element={
          <RouteGuard requiresAccess="patient">
            <div className="min-h-screen bg-gray-50">
              <Navigation />
              <SymptomTracker />
            </div>
          </RouteGuard>
        } />
        
        {/* GP Routes */}
        <Route path="/gp/dashboard" element={
          <RouteGuard requiresAccess="gp">
            <div className="min-h-screen bg-gray-50">
              <Navigation />
              <GPDashboard />
            </div>
          </RouteGuard>
        } />
        
        <Route path="/gp/results/:sessionId" element={
          <RouteGuard requiresAccess="gp">
            <div className="min-h-screen bg-gray-50">
              <Navigation />
              <GPResults />
            </div>
          </RouteGuard>
        } />
        
        {/* Clinical Admin Routes */}
        <Route path="/clinical/dashboard" element={
          <RouteGuard requiresAccess="clinical_admin">
            <div className="min-h-screen bg-gray-50">
              <Navigation />
              <ClinicalDashboard />
            </div>
          </RouteGuard>
        } />
        
        {/* Legacy Routes for Backward Compatibility */}
        <Route path="/gp" element={
          <RouteGuard requiresAccess="gp">
            <div className="min-h-screen bg-gray-50">
              <Navigation />
              <GPDashboard />
            </div>
          </RouteGuard>
        } />
        
        <Route path="/clinical" element={
          <RouteGuard requiresAccess="clinical_admin">
            <div className="min-h-screen bg-gray-50">
              <Navigation />
              <ClinicalDashboard />
            </div>
          </RouteGuard>
        } />
        
        <Route path="/gp-dashboard" element={
          <RouteGuard requiresAccess="gp">
            <div className="min-h-screen bg-gray-50">
              <Navigation />
              <GPDashboard />
            </div>
          </RouteGuard>
        } />
        
        <Route path="/gp-results/:sessionId" element={
          <RouteGuard requiresAccess="gp">
            <div className="min-h-screen bg-gray-50">
              <Navigation />
              <GPResults />
            </div>
          </RouteGuard>
        } />
        
        <Route path="/clinical-dashboard" element={
          <RouteGuard requiresAccess="clinical_admin">
            <div className="min-h-screen bg-gray-50">
              <Navigation />
              <ClinicalDashboard />
            </div>
          </RouteGuard>
        } />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
