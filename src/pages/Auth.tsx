
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Stethoscope } from "lucide-react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const authUser = localStorage.getItem("auth_user");
    if (authUser) {
      const userData = JSON.parse(authUser);
      // Redirect based on existing user role
      switch (userData.role) {
        case "patient":
          navigate("/symptom-tracker");
          break;
        case "gp":
          navigate("/gp-dashboard");
          break;
        case "admin":
          navigate("/clinical-dashboard");
          break;
        default:
          navigate("/");
      }
    }
  }, [navigate]);

  // Hardcoded test users
  const testUsers = {
    "patient@example.com": { password: "password123", role: "patient", redirect: "/symptom-tracker" },
    "gp@example.com": { password: "password123", role: "gp", redirect: "/gp-dashboard" },
    "admin@example.com": { password: "password123", role: "admin", redirect: "/clinical-dashboard" }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Check if user exists and password matches
    const user = testUsers[email as keyof typeof testUsers];
    
    if (!user || user.password !== password) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // Store user in localStorage
    const userData = {
      email,
      role: user.role,
      loginTime: new Date().toISOString()
    };
    
    localStorage.setItem("auth_user", JSON.stringify(userData));
    
    toast({
      title: "Login Successful",
      description: `Welcome back, ${user.role}!`,
    });

    // Redirect based on role
    navigate(user.redirect);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">SILVIA Login</CardTitle>
          <p className="text-gray-600">Access your health portal</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600 font-medium mb-2">Test Accounts:</p>
            <div className="text-xs text-gray-500 space-y-1">
              <div>Patient: patient@example.com / password123</div>
              <div>GP: gp@example.com / password123</div>
              <div>Admin: admin@example.com / password123</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
