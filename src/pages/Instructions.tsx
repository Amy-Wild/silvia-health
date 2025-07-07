
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, Stethoscope, ArrowLeft, Users, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GPInstructions from "@/components/instructions/GPInstructions";
import PatientInstructions from "@/components/instructions/PatientInstructions";

const Instructions = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">User Instructions</h1>
                <p className="text-gray-600">Two assessment systems for different needs</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="gp-initiated" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-2xl grid-cols-2">
              <TabsTrigger value="gp-initiated" className="flex items-center space-x-2">
                <Stethoscope className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-medium">GP-Initiated Flow</div>
                  <div className="text-xs text-gray-500">GP creates → Patient completes</div>
                </div>
              </TabsTrigger>
              <TabsTrigger value="self-service" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-medium">Self-Service Flow</div>
                  <div className="text-xs text-gray-500">Direct patient access</div>
                </div>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="gp-initiated">
            <div className="mb-6">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Stethoscope className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900">GP-Initiated Assessment System</h3>
                      <p className="text-sm text-blue-700">
                        <strong>Routes:</strong> /patient-assessment/:sessionId → /patient-results/:sessionId
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        GP creates secure session links, patients complete assessments, results sent to GP
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Tabs defaultValue="patient" className="w-full">
              <div className="flex justify-center mb-6">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="patient" className="flex items-center space-x-2">
                    <UserCircle className="w-4 h-4" />
                    <span>For Patients</span>
                  </TabsTrigger>
                  <TabsTrigger value="gp" className="flex items-center space-x-2">
                    <Stethoscope className="w-4 h-4" />
                    <span>For GPs</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="patient">
                <PatientInstructions />
              </TabsContent>

              <TabsContent value="gp">
                <GPInstructions />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="self-service">
            <div className="mb-6">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-900">Self-Service Assessment System</h3>
                      <p className="text-sm text-green-700">
                        <strong>Routes:</strong> /assessment → /results
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Direct patient access for independent health assessment
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Self-Service Assessment Instructions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <div className="w-5 h-5 bg-yellow-500 rounded-full text-white flex items-center justify-center text-xs font-bold mt-0.5">!</div>
                    <div>
                      <h4 className="font-semibold text-yellow-800">Note: Legacy System</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        This is the original self-service assessment system. Most users should use the GP-initiated flow above for better clinical integration.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="flex items-start space-x-3 p-4 border rounded-lg">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                    <div>
                      <h3 className="font-semibold">Direct Access</h3>
                      <p className="text-gray-600 text-sm">Navigate to /assessment to start your health assessment independently</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 border rounded-lg">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                    <div>
                      <h3 className="font-semibold">Complete Assessment</h3>
                      <p className="text-gray-600 text-sm">Answer questions about your health and symptoms at your own pace</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 border rounded-lg">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                    <div>
                      <h3 className="font-semibold">View Results</h3>
                      <p className="text-gray-600 text-sm">Get immediate results and recommendations on /results page</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Key Differences:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• No GP involvement in setup</li>
                    <li>• No session tracking or patient identification</li>
                    <li>• Results visible immediately to patient</li>
                    <li>• No clinical integration</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Instructions;
