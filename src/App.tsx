
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Assessment from "./pages/Assessment";
import Results from "./pages/Results";
import Education from "./pages/Education";
import PartnerZone from "./pages/PartnerZone";
import GPDashboard from "./pages/GPDashboard";
import PatientAssessment from "./pages/PatientAssessment";
import PatientResults from "./pages/PatientResults";
import ClinicalDashboard from "./pages/ClinicalDashboard";
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
          <Route path="/gp-dashboard" element={<GPDashboard />} />
          <Route path="/clinical-dashboard" element={<ClinicalDashboard />} />
          <Route path="/patient-assessment/:sessionId" element={<PatientAssessment />} />
          <Route path="/patient-results/:sessionId" element={<PatientResults />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/results" element={<Results />} />
          <Route path="/education" element={<Education />} />
          <Route path="/partner-zone" element={<PartnerZone />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
