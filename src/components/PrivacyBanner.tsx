
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const PrivacyBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem('privacy-accepted');
    if (!hasAccepted) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('privacy-accepted', 'true');
    setShowBanner(false);
  };

  const handleLearnMore = () => {
    window.open('/privacy-policy', '_blank');
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50 p-4">
      <div className="container mx-auto flex items-center justify-between max-w-6xl">
        <div className="flex-1 mr-4">
          <p className="text-sm text-gray-700">
            We use cookies and collect health data to provide our service. 
            Your data is encrypted and only shared with your healthcare provider.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={handleLearnMore}>
            Learn More
          </Button>
          <Button size="sm" onClick={handleAccept} className="bg-soft-coral hover:bg-soft-coral-dark">
            Accept
          </Button>
          <Button variant="ghost" size="sm" onClick={handleAccept}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyBanner;
