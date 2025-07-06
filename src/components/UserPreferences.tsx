
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Clock, Mail, Pause } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";

interface UserPreferences {
  reminder_frequency: string;
  reminder_time: string;
  reminder_method: string;
  reminders_paused: boolean;
}

const UserPreferences = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<UserPreferences>({
    reminder_frequency: 'off',
    reminder_time: '09:00:00',
    reminder_method: 'email',
    reminders_paused: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);

  const loadPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setPreferences({
          reminder_frequency: data.reminder_frequency || 'off',
          reminder_time: data.reminder_time || '09:00:00',
          reminder_method: data.reminder_method || 'email',
          reminders_paused: data.reminders_paused || false
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          ...preferences,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Preferences Saved",
        description: "Your reminder preferences have been updated.",
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading preferences...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          Reminder Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Reminder Frequency</Label>
          <Select
            value={preferences.reminder_frequency}
            onValueChange={(value) => setPreferences(prev => ({ ...prev, reminder_frequency: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="off">Off</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {preferences.reminder_frequency !== 'off' && (
          <>
            <div className="space-y-2">
              <Label className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Preferred Time
              </Label>
              <Select
                value={preferences.reminder_time}
                onValueChange={(value) => setPreferences(prev => ({ ...prev, reminder_time: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00:00">9:00 AM</SelectItem>
                  <SelectItem value="12:00:00">12:00 PM</SelectItem>
                  <SelectItem value="15:00:00">3:00 PM</SelectItem>
                  <SelectItem value="18:00:00">6:00 PM</SelectItem>
                  <SelectItem value="20:00:00">8:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Reminder Method
              </Label>
              <Select
                value={preferences.reminder_method}
                onValueChange={(value) => setPreferences(prev => ({ ...prev, reminder_method: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="pause-reminders"
                checked={preferences.reminders_paused}
                onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, reminders_paused: checked }))}
              />
              <Label htmlFor="pause-reminders" className="flex items-center">
                <Pause className="w-4 h-4 mr-2" />
                Pause reminders temporarily
              </Label>
            </div>
          </>
        )}

        <Button onClick={savePreferences} disabled={saving} className="w-full">
          {saving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserPreferences;
