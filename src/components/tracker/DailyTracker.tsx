
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Thermometer, Heart, Brain, Moon, Zap, Save } from "lucide-react";

interface DailyTrackerProps {
  onEntryComplete: () => void;
}

const DailyTracker = ({ onEntryComplete }: DailyTrackerProps) => {
  const [symptoms, setSymptoms] = useState({
    vasomotor: {
      hotFlashes: 0,
      nightSweats: 0,
      coldFlashes: 0
    },
    physical: {
      jointPain: 0,
      headaches: 0,
      fatigue: 0,
      bloating: 0,
      breastTenderness: 0
    },
    psychological: {
      moodRating: 5,
      anxiety: 0,
      irritability: 0,
      cognitiveIssues: 0
    },
    sleep: {
      sleepQuality: 5,
      timeToSleep: 0,
      nightWakings: 0,
      hoursSlept: 7
    },
    lifestyle: {
      stressLevel: 5,
      exerciseMinutes: 0,
      alcohol: false,
      caffeine: false
    }
  });

  const [notes, setNotes] = useState('');
  const [triggers, setTriggers] = useState<string[]>([]);

  const commonTriggers = [
    'Stress', 'Hot weather', 'Spicy food', 'Alcohol', 'Caffeine', 
    'Lack of sleep', 'Exercise', 'Work pressure', 'Arguments'
  ];

  const handleSymptomChange = (category: string, symptom: string, value: number | boolean) => {
    setSymptoms(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [symptom]: value
      }
    }));
  };

  const handleTriggerToggle = (trigger: string) => {
    setTriggers(prev => 
      prev.includes(trigger) 
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
    );
  };

  const handleSave = () => {
    const entry = {
      date: new Date().toISOString().split('T')[0],
      symptoms,
      notes,
      triggers,
      timestamp: new Date().toISOString()
    };

    // Save to localStorage
    const existingData = JSON.parse(localStorage.getItem('symptom-tracker-entries') || '[]');
    existingData.push(entry);
    localStorage.setItem('symptom-tracker-entries', JSON.stringify(existingData));

    // Update tracking stats
    const stats = JSON.parse(localStorage.getItem('symptom-tracker-data') || '{}');
    stats.totalDays = (stats.totalDays || 0) + 1;
    stats.currentStreak = (stats.currentStreak || 0) + 1;
    stats.lastEntry = entry.date;
    localStorage.setItem('symptom-tracker-data', JSON.stringify(stats));

    onEntryComplete();
    
    // Show success message
    alert('Entry saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Vasomotor Symptoms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Thermometer className="w-5 h-5 mr-2 text-red-500" />
            Hot Flashes & Night Sweats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Hot Flashes (frequency today)</label>
            <Slider
              value={[symptoms.vasomotor.hotFlashes]}
              onValueChange={([value]) => handleSymptomChange('vasomotor', 'hotFlashes', value)}
              max={10}
              step={1}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>None</span>
              <span>{symptoms.vasomotor.hotFlashes}/10</span>
              <span>Very Frequent</span>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">Night Sweats (severity)</label>
            <Slider
              value={[symptoms.vasomotor.nightSweats]}
              onValueChange={([value]) => handleSymptomChange('vasomotor', 'nightSweats', value)}
              max={10}
              step={1}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>None</span>
              <span>{symptoms.vasomotor.nightSweats}/10</span>
              <span>Severe</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Physical Symptoms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="w-5 h-5 mr-2 text-blue-500" />
            Physical Symptoms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Fatigue Level</label>
            <Slider
              value={[symptoms.physical.fatigue]}
              onValueChange={([value]) => handleSymptomChange('physical', 'fatigue', value)}
              max={10}
              step={1}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Energetic</span>
              <span>{symptoms.physical.fatigue}/10</span>
              <span>Exhausted</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Joint Pain</label>
            <Slider
              value={[symptoms.physical.jointPain]}
              onValueChange={([value]) => handleSymptomChange('physical', 'jointPain', value)}
              max={10}
              step={1}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>None</span>
              <span>{symptoms.physical.jointPain}/10</span>
              <span>Severe</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Psychological Symptoms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-500" />
            Mood & Memory
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Overall Mood Today</label>
            <Slider
              value={[symptoms.psychological.moodRating]}
              onValueChange={([value]) => handleSymptomChange('psychological', 'moodRating', value)}
              max={10}
              step={1}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Very Low</span>
              <span>{symptoms.psychological.moodRating}/10</span>
              <span>Excellent</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Anxiety Level</label>
            <Slider
              value={[symptoms.psychological.anxiety]}
              onValueChange={([value]) => handleSymptomChange('psychological', 'anxiety', value)}
              max={10}
              step={1}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Calm</span>
              <span>{symptoms.psychological.anxiety}/10</span>
              <span>Very Anxious</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sleep & Intimacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Moon className="w-5 h-5 mr-2 text-indigo-500" />
            Sleep Quality
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Sleep Quality</label>
            <Slider
              value={[symptoms.sleep.sleepQuality]}
              onValueChange={([value]) => handleSymptomChange('sleep', 'sleepQuality', value)}
              max={10}
              step={1}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Terrible</span>
              <span>{symptoms.sleep.sleepQuality}/10</span>
              <span>Excellent</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Hours Slept</label>
            <Slider
              value={[symptoms.sleep.hoursSlept]}
              onValueChange={([value]) => handleSymptomChange('sleep', 'hoursSlept', value)}
              max={12}
              min={2}
              step={0.5}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>2 hours</span>
              <span>{symptoms.sleep.hoursSlept} hours</span>
              <span>12 hours</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lifestyle Factors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-500" />
            Lifestyle & Triggers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Stress Level</label>
            <Slider
              value={[symptoms.lifestyle.stressLevel]}
              onValueChange={([value]) => handleSymptomChange('lifestyle', 'stressLevel', value)}
              max={10}
              step={1}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Very Relaxed</span>
              <span>{symptoms.lifestyle.stressLevel}/10</span>
              <span>Very Stressed</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Possible Triggers Today</label>
            <div className="flex flex-wrap gap-2">
              {commonTriggers.map((trigger) => (
                <Badge
                  key={trigger}
                  variant={triggers.includes(trigger) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleTriggerToggle(trigger)}
                >
                  {trigger}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Additional Notes</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional observations about your symptoms today..."
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-center">
        <Button onClick={handleSave} size="lg" className="bg-purple-600 hover:bg-purple-700">
          <Save className="w-4 h-4 mr-2" />
          Save Today's Entry
        </Button>
      </div>
    </div>
  );
};

export default DailyTracker;
