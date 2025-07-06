
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Droplets, TrendingUp, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";

interface PeriodEntry {
  entry_date: string;
  period_start: boolean;
  period_end: boolean;
  flow_intensity?: 'light' | 'medium' | 'heavy';
  symptoms_data?: {
    cramps: boolean;
    bloating: boolean;
    moodChanges: boolean;
    headaches: boolean;
    breastTenderness: boolean;
  };
}

const PeriodTracker = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [todayEntry, setTodayEntry] = useState<PeriodEntry>({
    entry_date: new Date().toISOString().split('T')[0],
    period_start: false,
    period_end: false,
    flow_intensity: undefined,
    symptoms_data: {
      cramps: false,
      bloating: false,
      moodChanges: false,
      headaches: false,
      breastTenderness: false
    }
  });
  const [recentEntries, setRecentEntries] = useState<PeriodEntry[]>([]);
  const [cycleStats, setCycleStats] = useState<{
    averageCycle: number;
    lastPeriod?: string;
    nextExpected?: string;
    irregularityWarning: boolean;
  }>({
    averageCycle: 28,
    irregularityWarning: false
  });

  useEffect(() => {
    if (user) {
      loadTodayEntry();
      loadRecentEntries();
    }
  }, [user, selectedDate]);

  const loadTodayEntry = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('symptom_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('entry_date', selectedDate)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setTodayEntry({
          entry_date: data.entry_date,
          period_start: data.period_start || false,
          period_end: data.period_end || false,
          flow_intensity: data.flow_intensity as 'light' | 'medium' | 'heavy' || undefined,
          symptoms_data: data.symptoms_data || {
            cramps: false,
            bloating: false,
            moodChanges: false,
            headaches: false,
            breastTenderness: false
          }
        });
      }
    } catch (error) {
      console.error('Error loading today entry:', error);
    }
  };

  const loadRecentEntries = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('symptom_entries')
        .select('entry_date, period_start, period_end, flow_intensity')
        .eq('user_id', user.id)
        .or('period_start.eq.true,period_end.eq.true')
        .order('entry_date', { ascending: false })
        .limit(10);

      if (error) throw error;

      if (data) {
        setRecentEntries(data);
        calculateCycleStats(data);
      }
    } catch (error) {
      console.error('Error loading recent entries:', error);
    }
  };

  const calculateCycleStats = (entries: any[]) => {
    const periodStarts = entries
      .filter(entry => entry.period_start)
      .map(entry => new Date(entry.entry_date))
      .sort((a, b) => b.getTime() - a.getTime());

    if (periodStarts.length >= 2) {
      const cycles = [];
      for (let i = 0; i < periodStarts.length - 1; i++) {
        const daysDiff = Math.abs(
          (periodStarts[i].getTime() - periodStarts[i + 1].getTime()) / (1000 * 60 * 60 * 24)
        );
        cycles.push(daysDiff);
      }

      const averageCycle = Math.round(cycles.reduce((sum, cycle) => sum + cycle, 0) / cycles.length);
      const lastPeriod = periodStarts[0];
      const nextExpected = new Date(lastPeriod.getTime() + (averageCycle * 24 * 60 * 60 * 1000));
      
      // Check for irregularity (variation > 7 days from average)
      const irregularityWarning = cycles.some(cycle => Math.abs(cycle - averageCycle) > 7);

      setCycleStats({
        averageCycle,
        lastPeriod: lastPeriod.toISOString().split('T')[0],
        nextExpected: nextExpected.toISOString().split('T')[0],
        irregularityWarning
      });
    }
  };

  const saveEntry = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('symptom_entries')
        .upsert({
          user_id: user.id,
          entry_date: selectedDate,
          period_start: todayEntry.period_start,
          period_end: todayEntry.period_end,
          flow_intensity: todayEntry.flow_intensity,
          symptoms_data: todayEntry.symptoms_data,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Period data saved",
        description: "Your period tracking data has been updated.",
      });

      loadRecentEntries();
    } catch (error) {
      console.error('Error saving entry:', error);
      toast({
        title: "Error",
        description: "Failed to save period data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateSymptom = (symptom: string, checked: boolean) => {
    setTodayEntry(prev => ({
      ...prev,
      symptoms_data: {
        ...prev.symptoms_data!,
        [symptom]: checked
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Cycle Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Cycle Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-pink-50 rounded">
              <h3 className="text-2xl font-bold text-pink-600">{cycleStats.averageCycle}</h3>
              <p className="text-sm text-pink-800">Average Cycle (days)</p>
            </div>
            
            {cycleStats.lastPeriod && (
              <div className="text-center p-4 bg-blue-50 rounded">
                <h3 className="text-sm font-bold text-blue-600">
                  {new Date(cycleStats.lastPeriod).toLocaleDateString()}
                </h3>
                <p className="text-sm text-blue-800">Last Period</p>
              </div>
            )}
            
            {cycleStats.nextExpected && (
              <div className="text-center p-4 bg-green-50 rounded">
                <h3 className="text-sm font-bold text-green-600">
                  {new Date(cycleStats.nextExpected).toLocaleDateString()}
                </h3>
                <p className="text-sm text-green-800">Next Expected</p>
              </div>
            )}
          </div>

          {cycleStats.irregularityWarning && (
            <div className="mt-4 p-3 bg-amber-50 border-l-4 border-amber-500 rounded">
              <div className="flex items-center">
                <AlertTriangle className="w-4 h-4 text-amber-600 mr-2" />
                <p className="text-sm text-amber-800">
                  Your cycles are becoming irregular. Consider discussing with your GP.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Daily Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Droplets className="w-5 h-5 mr-2" />
            Today's Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Checkbox
                id="period-start"
                checked={todayEntry.period_start}
                onCheckedChange={(checked) => 
                  setTodayEntry(prev => ({ ...prev, period_start: checked as boolean }))
                }
              />
              <label htmlFor="period-start" className="text-sm font-medium">
                Period started today
              </label>
            </div>

            <div className="flex items-center space-x-4">
              <Checkbox
                id="period-end"
                checked={todayEntry.period_end}
                onCheckedChange={(checked) => 
                  setTodayEntry(prev => ({ ...prev, period_end: checked as boolean }))
                }
              />
              <label htmlFor="period-end" className="text-sm font-medium">
                Period ended today
              </label>
            </div>
          </div>

          {(todayEntry.period_start || todayEntry.period_end) && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Flow Intensity</label>
              <Select
                value={todayEntry.flow_intensity || ''}
                onValueChange={(value) => 
                  setTodayEntry(prev => ({ 
                    ...prev, 
                    flow_intensity: value as 'light' | 'medium' | 'heavy' 
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select flow intensity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="heavy">Heavy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-3">
            <label className="text-sm font-medium">Associated Symptoms</label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(todayEntry.symptoms_data || {}).map(([symptom, checked]) => (
                <div key={symptom} className="flex items-center space-x-2">
                  <Checkbox
                    id={symptom}
                    checked={checked}
                    onCheckedChange={(isChecked) => updateSymptom(symptom, isChecked as boolean)}
                  />
                  <label htmlFor={symptom} className="text-sm capitalize">
                    {symptom.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={saveEntry} className="w-full">
            Save Period Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PeriodTracker;
