
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, TrendingUp, Download, Share2, Plus, BarChart3, LogOut, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DailyTracker from "@/components/tracker/DailyTracker";
import PeriodTracker from "@/components/tracker/PeriodTracker";
import TrackerAnalytics from "@/components/tracker/TrackerAnalytics";
import TrackerHistory from "@/components/tracker/TrackerHistory";
import TrackerEducation from "@/components/tracker/TrackerEducation";

const SymptomTracker = () => {
  const navigate = useNavigate();
  const [trackedDays, setTrackedDays] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [lastEntry, setLastEntry] = useState<string | null>(null);
  const [periodData, setPeriodData] = useState({});

  useEffect(() => {
    // Load tracking data from localStorage
    const savedData = localStorage.getItem('symptom-tracker-data');
    if (savedData) {
      const data = JSON.parse(savedData);
      setTrackedDays(data.totalDays || 0);
      setCurrentStreak(data.currentStreak || 0);
      setLastEntry(data.lastEntry || null);
    }

    // Load period data
    const savedPeriodData = localStorage.getItem('period-tracker-data');
    if (savedPeriodData) {
      setPeriodData(JSON.parse(savedPeriodData));
    }
  }, []);

  const handleLogout = () => {
    // Preserve demo access while clearing user auth
    const demoAuth = localStorage.getItem("silvia_demo_auth");
    localStorage.removeItem("auth_user");
    // Preserve demo access if it exists
    if (demoAuth) {
      localStorage.setItem("silvia_demo_auth", demoAuth);
    }
    // Force reload to the landing page
    window.location.replace("/");
  };

  const handleNewEntry = () => {
    const today = new Date().toISOString().split('T')[0];
    setLastEntry(today);
    setTrackedDays(prev => prev + 1);
    setCurrentStreak(prev => prev + 1);
  };

  const handlePeriodDataChange = (data: any) => {
    setPeriodData(data);
    localStorage.setItem('period-tracker-data', JSON.stringify(data));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Symptom Tracker</h1>
                <p className="text-sm text-gray-600">Track patterns, understand your journey</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share with GP
              </Button>
              <Button 
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <h3 className="text-2xl font-bold text-gray-900">{trackedDays}</h3>
              <p className="text-gray-600">Days Tracked</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <h3 className="text-2xl font-bold text-gray-900">{currentStreak}</h3>
              <p className="text-gray-600">Current Streak</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <BarChart3 className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <h3 className="text-2xl font-bold text-gray-900">
                {lastEntry ? 'Today' : 'Start'}
              </h3>
              <p className="text-gray-600">
                {lastEntry ? 'Entry Complete' : 'Tracking Journey'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tracker Interface */}
        <Tabs defaultValue="daily" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="daily">Daily Entry</TabsTrigger>
            <TabsTrigger value="period">
              <Heart className="w-4 h-4 mr-2" />
              Period & Cycle
            </TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="education">Learn</TabsTrigger>
          </TabsList>

          <TabsContent value="daily">
            <DailyTracker onEntryComplete={handleNewEntry} />
          </TabsContent>

          <TabsContent value="period">
            <PeriodTracker onDataChange={handlePeriodDataChange} />
          </TabsContent>

          <TabsContent value="analytics">
            <TrackerAnalytics />
          </TabsContent>

          <TabsContent value="history">
            <TrackerHistory />
          </TabsContent>

          <TabsContent value="education">
            <TrackerEducation />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SymptomTracker;
