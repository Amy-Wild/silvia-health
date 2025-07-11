
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";

interface PasswordGateProps {
  children: React.ReactNode;
}

const PasswordGate = ({ children }: PasswordGateProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has already entered the correct password
    const storedAuth = localStorage.getItem("silvia_demo_auth");
    if (storedAuth === "demo2025") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === "demo2025") {
      localStorage.setItem("silvia_demo_auth", "demo2025");
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect access code. Please try again.");
      setPassword("");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#dbeafe] to-[#ede9fe] flex items-center justify-center">
        <div className="text-[#425563]">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#dbeafe] to-[#ede9fe] flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-[#425563]/20 shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-[#425563] rounded-full">
                <Lock className="w-6 h-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-[#425563]">
              SILVIA Health Demo Access
            </CardTitle>
            <p className="text-[#425563]/80 text-sm">
              This is a private demo. Please enter the access code provided.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#425563]">
                  Access Code
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter access code"
                  className="border-[#425563]/20 focus:border-[#425563]"
                  required
                />
              </div>
              
              {error && (
                <p className="text-red-600 text-sm text-center">{error}</p>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-[#425563] hover:bg-[#425563]/90"
              >
                Access Demo
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default PasswordGate;
