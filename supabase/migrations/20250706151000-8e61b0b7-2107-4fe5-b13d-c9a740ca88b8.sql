
-- Create user preferences table for reminders and settings
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  reminder_frequency TEXT DEFAULT 'off' CHECK (reminder_frequency IN ('off', 'daily', 'weekly')),
  reminder_time TIME DEFAULT '09:00:00',
  reminder_method TEXT DEFAULT 'email' CHECK (reminder_method IN ('email')),
  reminders_paused BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create assessment links table for secure link generation
CREATE TABLE public.assessment_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by UUID REFERENCES auth.users NOT NULL,
  patient_identifier TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '48 hours'),
  completed_at TIMESTAMP WITH TIME ZONE,
  ip_address INET,
  session_data JSONB
);

-- Create audit logs table for NHS compliance
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create symptom tracker entries table (expanded)
CREATE TABLE public.symptom_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  entry_date DATE NOT NULL,
  period_start BOOLEAN DEFAULT false,
  period_end BOOLEAN DEFAULT false,
  flow_intensity TEXT CHECK (flow_intensity IN ('light', 'medium', 'heavy')),
  hot_flashes_frequency INTEGER DEFAULT 0,
  hot_flashes_severity INTEGER DEFAULT 0 CHECK (hot_flashes_severity BETWEEN 0 AND 10),
  night_sweats_severity INTEGER DEFAULT 0 CHECK (night_sweats_severity BETWEEN 0 AND 10),
  mood_rating INTEGER DEFAULT 5 CHECK (mood_rating BETWEEN 1 AND 10),
  sleep_quality INTEGER DEFAULT 5 CHECK (sleep_quality BETWEEN 1 AND 10),
  energy_level INTEGER DEFAULT 5 CHECK (energy_level BETWEEN 1 AND 10),
  symptoms_data JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, entry_date)
);

-- Enable RLS on all tables
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptom_entries ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_preferences
CREATE POLICY "Users can view own preferences" ON public.user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON public.user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON public.user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for assessment_links
CREATE POLICY "GPs can view their assessment links" ON public.assessment_links
  FOR SELECT USING (
    auth.uid() = created_by OR 
    has_role(auth.uid(), 'gp') OR 
    has_role(auth.uid(), 'clinical_admin')
  );

CREATE POLICY "GPs can create assessment links" ON public.assessment_links
  FOR INSERT WITH CHECK (
    auth.uid() = created_by AND 
    (has_role(auth.uid(), 'gp') OR has_role(auth.uid(), 'clinical_admin'))
  );

CREATE POLICY "GPs can update their assessment links" ON public.assessment_links
  FOR UPDATE USING (
    auth.uid() = created_by OR 
    has_role(auth.uid(), 'clinical_admin')
  );

-- RLS policies for audit_logs
CREATE POLICY "Clinical admins can view all audit logs" ON public.audit_logs
  FOR SELECT USING (has_role(auth.uid(), 'clinical_admin'));

CREATE POLICY "Users can insert their own audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS policies for symptom_entries
CREATE POLICY "Users can view own symptom entries" ON public.symptom_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own symptom entries" ON public.symptom_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own symptom entries" ON public.symptom_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own symptom entries" ON public.symptom_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_user_preferences_user_id ON public.user_preferences(user_id);
CREATE INDEX idx_assessment_links_created_by ON public.assessment_links(created_by);
CREATE INDEX idx_assessment_links_status ON public.assessment_links(status);
CREATE INDEX idx_assessment_links_expires_at ON public.assessment_links(expires_at);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);
CREATE INDEX idx_symptom_entries_user_id ON public.symptom_entries(user_id);
CREATE INDEX idx_symptom_entries_entry_date ON public.symptom_entries(entry_date);
