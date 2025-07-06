
import { useAuth } from "@/components/auth/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserPlus, FileText, BarChart3, Users, Calendar, Shield } from "lucide-react";
import AssessmentLinkGenerator from "@/components/AssessmentLinkGenerator";

const GPDashboard = () => {
  const { user, userRole } = useAuth();

  if (!user || (userRole !== 'gp' && userRole !== 'clinical_admin')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-bold mb-2">Access Restricted</h2>
            <p className="text-gray-600">
              This area is for healthcare professionals only.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header */}
      <div className="bg-blue-800 text-white py-4 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">SYLVIA Clinician Portal</h1>
              <p className="text-blue-200 text-sm">For Healthcare Professionals Only</p>
            </div>
            <Badge variant="outline" className="text-white border-white">
              {userRole === 'clinical_admin' ? 'Clinical Admin' : 'GP'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <h3 className="text-2xl font-bold">47</h3>
                <p className="text-gray-600">Active Patients</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <FileText className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <h3 className="text-2xl font-bold">12</h3>
                <p className="text-gray-600">Pending Reviews</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <h3 className="text-2xl font-bold">8</h3>
                <p className="text-gray-600">This Week</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <BarChart3 className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                <h3 className="text-2xl font-bold">94%</h3>
                <p className="text-gray-600">Completion Rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Assessment Link Generator */}
          <AssessmentLinkGenerator />
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Assessment Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">Sarah Johnson</p>
                    <p className="text-sm text-gray-600">Assessment completed</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-500">Complete</Badge>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">Emma Williams</p>
                    <p className="text-sm text-gray-600">Link sent, awaiting response</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">Pending</Badge>
                    <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">Lisa Brown</p>
                    <p className="text-sm text-gray-600">High risk assessment - requires follow-up</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-red-500">High Risk</Badge>
                    <p className="text-xs text-gray-500 mt-1">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GPDashboard;
