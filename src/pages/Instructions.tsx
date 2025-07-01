
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, Stethoscope, ArrowLeft } from "lucide-react";
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
                <p className="text-gray-600">How to use the Menopause Assessment System</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="patient" className="w-full">
          <div className="flex justify-center mb-8">
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
      </div>
    </div>
  );
};

export default Instructions;
