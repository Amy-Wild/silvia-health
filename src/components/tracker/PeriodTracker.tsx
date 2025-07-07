
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { CalendarIcon, Heart, AlertTriangle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PeriodTrackerProps {
  onDataChange: (data: any) => void;
}

const PeriodTracker = ({ onDataChange }: PeriodTrackerProps) => {
  const [periodStatus, setPeriodStatus] = useState('');
  const [lastPeriodDate, setLastPeriodDate] = useState<Date | undefined>();
  const [periodLength, setPeriodLength] = useState([5]);
  const [flowIntensity, setFlowIntensity] = useState('');
  const [cycleLength, setCycleLength] = useState('28');
  const [noPeriodsReason, setNoPeriodsReason] = useState('');

  // Clinical flags logic
  const getClinicalFlags = () => {
    const flags = [];
    
    if (periodStatus === 'no-periods-12' && lastPeriodDate) {
      const monthsSince = Math.floor((new Date().getTime() - lastPeriodDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
      if (monthsSince >= 12) {
        // Check for bleeding after 12 months
        flags.push({ type: 'danger', message: 'Any bleeding after 12 months without periods requires immediate GP consultation' });
      }
    }
    
    const cycle = parseInt(cycleLength);
    if (cycle && (cycle < 21 || cycle > 35)) {
      flags.push({ type: 'warning', message: 'Cycle length outside normal range (21-35 days) - discuss with GP' });
    }
    
    if (flowIntensity === 'heavy' && periodLength[0] > 7) {
      flags.push({ type: 'warning', message: 'Heavy bleeding for more than 7 days - consider GP consultation' });
    }
    
    return flags;
  };

  const handleDataUpdate = () => {
    const data = {
      periodStatus,
      lastPeriodDate,
      periodLength: periodLength[0],
      flowIntensity,
      cycleLength: parseInt(cycleLength) || 0,
      noPeriodsReason,
      clinicalFlags: getClinicalFlags()
    };
    onDataChange(data);
  };

  // Update data whenever any field changes
  useState(() => {
    handleDataUpdate();
  });

  const clinicalFlags = getClinicalFlags();

  return (
    <div className="space-y-6">
      {/* Clinical Alerts */}
      {clinicalFlags.map((flag, index) => (
        <div
          key={index}
          className={cn(
            "p-4 rounded-lg border-l-4 flex items-start space-x-3",
            flag.type === 'danger' ? "bg-red-50 border-red-500" : "bg-yellow-50 border-yellow-500"
          )}
        >
          {flag.type === 'danger' ? (
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
          )}
          <p className={cn(
            "text-sm font-medium",
            flag.type === 'danger' ? "text-red-800" : "text-yellow-800"
          )}>
            {flag.message}
          </p>
        </div>
      ))}

      {/* Period Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="w-5 h-5 mr-2 text-pink-500" />
            Period & Cycle Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-3 block">What describes your periods?</Label>
            <RadioGroup
              value={periodStatus}
              onValueChange={(value) => {
                setPeriodStatus(value);
                handleDataUpdate();
              }}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="regular" id="regular" />
                <Label htmlFor="regular">Regular periods</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="irregular" id="irregular" />
                <Label htmlFor="irregular">Irregular/changing periods</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no-periods-12" id="no-periods-12" />
                <Label htmlFor="no-periods-12">No periods for 12+ months</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no-periods-medical" id="no-periods-medical" />
                <Label htmlFor="no-periods-medical">No periods (medical/surgical)</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Regular/Irregular Periods Details */}
      {(periodStatus === 'regular' || periodStatus === 'irregular') && (
        <Card>
          <CardHeader>
            <CardTitle>Period Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Last period started</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !lastPeriodDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {lastPeriodDate ? format(lastPeriodDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={lastPeriodDate}
                    onSelect={(date) => {
                      setLastPeriodDate(date);
                      handleDataUpdate();
                    }}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label className="text-sm font-medium">Period length (days)</Label>
              <Slider
                value={periodLength}
                onValueChange={(value) => {
                  setPeriodLength(value);
                  handleDataUpdate();
                }}
                max={10}
                min={1}
                step={1}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 day</span>
                <span>{periodLength[0]} days</span>
                <span>10 days</span>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Flow intensity</Label>
              <div className="flex gap-2">
                {['light', 'medium', 'heavy'].map((intensity) => (
                  <Badge
                    key={intensity}
                    variant={flowIntensity === intensity ? "default" : "outline"}
                    className="cursor-pointer capitalize"
                    onClick={() => {
                      setFlowIntensity(intensity);
                      handleDataUpdate();
                    }}
                  >
                    {intensity}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Cycle length</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={cycleLength}
                  onChange={(e) => {
                    setCycleLength(e.target.value);
                    handleDataUpdate();
                  }}
                  className="w-20"
                  min="14"
                  max="50"
                />
                <span className="text-sm text-gray-600">days</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Periods 12+ Months */}
      {periodStatus === 'no-periods-12' && (
        <Card>
          <CardHeader>
            <CardTitle>Last Period Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Date of last period</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !lastPeriodDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {lastPeriodDate ? format(lastPeriodDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={lastPeriodDate}
                    onSelect={(date) => {
                      setLastPeriodDate(date);
                      handleDataUpdate();
                    }}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <p className="text-blue-800 text-sm">
                <strong>Information:</strong> You may be postmenopausal. Continue tracking symptoms and discuss with your GP.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Periods Medical */}
      {periodStatus === 'no-periods-medical' && (
        <Card>
          <CardHeader>
            <CardTitle>Medical Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-3 block">Reason</Label>
              <RadioGroup
                value={noPeriodsReason}
                onValueChange={(value) => {
                  setNoPeriodsReason(value);
                  handleDataUpdate();
                }}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hysterectomy" id="hysterectomy" />
                  <Label htmlFor="hysterectomy">Hysterectomy</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medication" id="medication" />
                  <Label htmlFor="medication">Medication</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
              <p className="text-purple-800 text-sm">
                <strong>Information:</strong> Track your symptoms to discuss with your GP for personalized care recommendations.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PeriodTracker;
