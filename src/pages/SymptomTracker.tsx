
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, TrendingUp, Download, Share2, Plus, BarChart3, Droplets, Settings } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import DailyTracker from "@/components/tracker/DailyTracker";
import TrackerAnalytics from "@/components/tracker/TrackerAnalytics";
import TrackerHistory from "@/components/tracker/TrackerHistory";
import TrackerEducation from "@/components/tracker/TrackerEducation";
import PeriodTracker from "@/components/tracker/PeriodTracker";
import UserPreferences from "@/components/UserPreferences";

const SymptomTracker = () => {
  const { user } = useAuth();
  const [trackedDays, setTrackedDays] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [lastEntry, setLastEntry] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadTrackingStats();
    }
  }, [user]);

  const loadTrackingStats = async () => {
    if (!user) return;

    try {
      const { data: entries, error } = await supabase
        .from('symptom_entries')
        .select('entry_date')
        .eq('user_id', user.id)
        .order('entry_date', { ascending: false });

      if (error) throw error;

      if (entries && entries.length > 0) {
        setTrackedDays(entries.length);
        setLastEntry(entries[0].entry_date);
        
        // Calculate current streak
        let streak = 0;
        const today = new Date();
        const sortedDates = entries
          .map(entry => new Date(entry.entry_date))
          .sort((a, b) => b.getTime() - a.getTime());

        for (let i = 0; i < sortedDates.length; i++) {
          const diffTime = today.getTime() - sortedDates[i].getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays === i + 1 || (i === 0 && diffDays === 0)) {
            streak++;
          } else {
            break;
          }
        }
        
        setCurrentStreak(streak);
      }
    } catch (error) {
      console.error('Error loading tracking stats:', error);
    }
  };

  const handleNewEntry = () => {
    loadTrackingStats();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold mb-4">Login Required</h2>
            <p className="text-gray-600 mb-4">
              Please log in to access the symptom tracker and save your data securely.
            </p>
            <Button onClick={() => window.location.href = '/auth'}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="daily">Daily Entry</TabsTrigger>
            <TabsTrigger value="period">Period Tracker</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="education">Learn</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="daily">
            <DailyTracker onEntryComplete={handleNewEntry} />
          </TabsContent>

          <TabsContent value="period">
            <PeriodTracker />
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

          <TabsContent value="settings">
            <UserPreferences />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SymptomTracker;
