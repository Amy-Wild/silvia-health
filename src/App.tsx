import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import Navigation from "@/components/Navigation";
import PrivacyBanner from "@/components/PrivacyBanner";
import Index from "./pages/Index";
import Assessment from "./pages/Assessment";
import Results from "./pages/Results";
import SymptomTracker from "./pages/SymptomTracker";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import GPDashboard from "./pages/GPDashboard";
import Auth from "./pages/Auth";

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
              <Route path="/" element={<Index />} />
              <Route path="/assessment" element={<Assessment />} />
              <Route path="/assessment/:linkId" element={<Assessment />} />
              <Route path="/results" element={<Results />} />
              <Route path="/symptom-tracker" element={<SymptomTracker />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/gp-dashboard" element={<GPDashboard />} />
              <Route path="/auth" element={<Auth />} />
            </Routes>
            <PrivacyBanner />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
