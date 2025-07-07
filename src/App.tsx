
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/patient-assessment/:sessionId" element={<PatientAssessment />} />
          <Route path="/patient-results/:sessionId" element={<PatientResults />} />
          <Route path="/gp-dashboard" element={<GPDashboard />} />
          <Route path="/gp-results/:sessionId" element={<GPResults />} />
          <Route path="/clinical-dashboard" element={<ClinicalDashboard />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/education" element={<Education />} />
          <Route path="/partner-zone" element={<PartnerZone />} />
          <Route path="/symptom-tracker" element={<SymptomTracker />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
