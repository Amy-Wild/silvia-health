
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, Lightbulb } from "lucide-react";

interface SymptomEntry {
  date: string;
  symptoms: {
    vasomotor: {
      hotFlashes: number;
      nightSweats: number;
    };
    physical: {
      fatigue: number;
      jointPain: number;
    };
    psychological: {
      moodRating: number;
      anxiety: number;
    };
    sleep: {
      sleepQuality: number;
    };
    lifestyle: {
      stressLevel: number;
    };
  };
  triggers?: string[];
  notes?: string;
}

interface Insight {
  type: 'warning' | 'info' | 'tip';
  title: string;
  description: string;
  icon: any;
}

const TrackerAnalytics = () => {
  const [entries, setEntries] = useState<SymptomEntry[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    // Load entries from localStorage
    const savedEntries = JSON.parse(localStorage.getItem('symptom-tracker-entries') || '[]');
    setEntries(savedEntries);
    
    // Generate insights
    generateInsights(savedEntries);
  }, []);

  const generateInsights = (data: SymptomEntry[]) => {
    if (data.length < 3) return;

    const generatedInsights: Insight[] = [];
    
    // Hot flash pattern analysis
    const hotFlashData = data
      .map(entry => entry.symptoms?.vasomotor?.hotFlashes)
      .filter((value): value is number => typeof value === 'number');
    
    if (hotFlashData.length > 0) {
      const avgHotFlashes = hotFlashData.reduce((a, b) => a + b, 0) / hotFlashData.length;
      
      if (avgHotFlashes > 5) {
        generatedInsights.push({
          type: 'warning',
          title: 'High Hot Flash Frequency',
          description: `Your average hot flash frequency is ${avgHotFlashes.toFixed(1)}/10. Consider discussing this pattern with your GP.`,
          icon: AlertCircle
        });
      }
    }

    // Sleep pattern analysis
    const sleepData = data
      .map(entry => entry.symptoms?.sleep?.sleepQuality)
      .filter((value): value is number => typeof value === 'number');
    
    if (sleepData.length > 0) {
      const recentSleep = sleepData.slice(-7);
      const avgRecentSleep = recentSleep.reduce((a, b) => a + b, 0) / recentSleep.length;
      
      if (avgRecentSleep < 5) {
        generatedInsights.push({
          type: 'info',
          title: 'Sleep Quality Concern',
          description: `Your sleep quality has averaged ${avgRecentSleep.toFixed(1)}/10 this week. Poor sleep can worsen other menopause symptoms.`,
          icon: Lightbulb
        });
      }
    }

    // Trigger pattern analysis
    const allTriggers = data.flatMap(entry => entry.triggers || []);
    const triggerCounts = allTriggers.reduce((acc, trigger) => {
      acc[trigger] = (acc[trigger] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostCommonTrigger = Object.entries(triggerCounts).sort(([,a], [,b]) => b - a)[0];
    if (mostCommonTrigger && mostCommonTrigger[1] > 2) {
      generatedInsights.push({
        type: 'tip',
        title: 'Pattern Identified',
        description: `"${mostCommonTrigger[0]}" appears to be your most common trigger (${mostCommonTrigger[1]} times). Consider strategies to manage this.`,
        icon: TrendingUp
      });
    }

    setInsights(generatedInsights);
  };

  const prepareChartData = () => {
    return entries.slice(-14).map((entry, index) => ({
      day: `Day ${index + 1}`,
      date: entry.date,
      hotFlashes: entry.symptoms?.vasomotor?.hotFlashes || 0,
      mood: entry.symptoms?.psychological?.moodRating || 5,
      sleep: entry.symptoms?.sleep?.sleepQuality || 5,
      fatigue: entry.symptoms?.physical?.fatigue || 0,
      stress: entry.symptoms?.lifestyle?.stressLevel || 5
    }));
  };

  const prepareTriggerData = () => {
    const allTriggers = entries.flatMap(entry => entry.triggers || []);
    const triggerCounts = allTriggers.reduce((acc, trigger) => {
      acc[trigger] = (acc[trigger] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(triggerCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([trigger, count]) => ({ trigger, count }));
  };

  const calculateAverage = (values: (number | undefined)[]): number => {
    const validValues = values.filter((value): value is number => typeof value === 'number');
    if (validValues.length === 0) return 0;
    return validValues.reduce((sum, value) => sum + value, 0) / validValues.length;
  };

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">No Data Yet</h3>
          <p className="text-gray-600">Start tracking your symptoms to see patterns and insights here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Insights Cards */}
      {insights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <Card key={index} className={`border-l-4 ${
              insight.type === 'warning' ? 'border-red-500 bg-red-50' :
              insight.type === 'info' ? 'border-blue-500 bg-blue-50' :
              'border-green-500 bg-green-50'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <insight.icon className={`w-5 h-5 mt-0.5 ${
                    insight.type === 'warning' ? 'text-red-600' :
                    insight.type === 'info' ? 'text-blue-600' :
                    'text-green-600'
                  }`} />
                  <div>
                    <h4 className="font-semibold mb-1">{insight.title}</h4>
                    <p className="text-sm text-gray-700">{insight.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Symptom Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Symptom Trends (Last 14 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={prepareChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line type="monotone" dataKey="hotFlashes" stroke="#ef4444" name="Hot Flashes" strokeWidth={2} />
                <Line type="monotone" dataKey="mood" stroke="#8b5cf6" name="Mood" strokeWidth={2} />
                <Line type="monotone" dataKey="sleep" stroke="#3b82f6" name="Sleep Quality" strokeWidth={2} />
                <Line type="monotone" dataKey="fatigue" stroke="#f59e0b" name="Fatigue" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Trigger Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Common Triggers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={prepareTriggerData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="trigger" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-red-500">
              {calculateAverage(entries.map(entry => entry.symptoms?.vasomotor?.hotFlashes)).toFixed(1)}
            </h3>
            <p className="text-sm text-gray-600">Avg Hot Flashes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-purple-500">
              {calculateAverage(entries.map(entry => entry.symptoms?.psychological?.moodRating)).toFixed(1)}
            </h3>
            <p className="text-sm text-gray-600">Avg Mood</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-blue-500">
              {calculateAverage(entries.map(entry => entry.symptoms?.sleep?.sleepQuality)).toFixed(1)}
            </h3>
            <p className="text-sm text-gray-600">Avg Sleep Quality</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-green-500">{entries.length}</h3>
            <p className="text-sm text-gray-600">Total Entries</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrackerAnalytics;
