
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, Trash2, Download } from "lucide-react";
import { format } from 'date-fns';

const TrackerHistory = () => {
  const [entries, setEntries] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  useEffect(() => {
    const savedEntries = JSON.parse(localStorage.getItem('symptom-tracker-entries') || '[]');
    setEntries(savedEntries.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, []);

  const getSeverityColor = (value: number) => {
    if (value >= 7) return 'bg-red-500';
    if (value >= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getSeverityLabel = (value: number) => {
    if (value >= 7) return 'High';
    if (value >= 4) return 'Moderate';
    return 'Low';
  };

  const filteredEntries = selectedMonth === 'all' 
    ? entries 
    : entries.filter(entry => entry.date.startsWith(selectedMonth));

  const availableMonths = [...new Set(entries.map(entry => entry.date.substring(0, 7)))].sort().reverse();

  const deleteEntry = (index: number) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      const updatedEntries = entries.filter((_, i) => i !== index);
      setEntries(updatedEntries);
      localStorage.setItem('symptom-tracker-entries', JSON.stringify(updatedEntries));
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium">Filter by month:</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="border rounded px-3 py-1 text-sm"
              >
                <option value="all">All entries</option>
                {availableMonths.map(month => (
                  <option key={month} value={month}>
                    {format(new Date(month + '-01'), 'MMMM yyyy')}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{filteredEntries.length} entries</span>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Month
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entries List */}
      {filteredEntries.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No Entries Found</h3>
            <p className="text-gray-600">
              {selectedMonth === 'all' 
                ? 'Start tracking your symptoms to build your history.' 
                : 'No entries found for this month.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {format(new Date(entry.date), 'EEEE, MMMM do, yyyy')}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => deleteEntry(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {/* Hot Flashes */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Hot Flashes</span>
                    <Badge className={`${getSeverityColor(entry.symptoms.vasomotor.hotFlashes)} text-white`}>
                      {entry.symptoms.vasomotor.hotFlashes}/10
                    </Badge>
                  </div>

                  {/* Mood */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Mood</span>
                    <Badge className={`${getSeverityColor(10 - entry.symptoms.psychological.moodRating)} text-white`}>
                      {entry.symptoms.psychological.moodRating}/10
                    </Badge>
                  </div>

                  {/* Sleep */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Sleep Quality</span>
                    <Badge className={`${getSeverityColor(10 - entry.symptoms.sleep.sleepQuality)} text-white`}>
                      {entry.symptoms.sleep.sleepQuality}/10
                    </Badge>
                  </div>

                  {/* Fatigue */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Fatigue</span>
                    <Badge className={`${getSeverityColor(entry.symptoms.physical.fatigue)} text-white`}>
                      {entry.symptoms.physical.fatigue}/10
                    </Badge>
                  </div>
                </div>

                {/* Triggers */}
                {entry.triggers && entry.triggers.length > 0 && (
                  <div className="mb-3">
                    <span className="text-sm text-gray-600 mb-2 block">Triggers:</span>
                    <div className="flex flex-wrap gap-1">
                      {entry.triggers.map((trigger: string, triggerIndex: number) => (
                        <Badge key={triggerIndex} variant="outline" className="text-xs">
                          {trigger}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {entry.notes && (
                  <div>
                    <span className="text-sm text-gray-600 block mb-1">Notes:</span>
                    <p className="text-sm bg-gray-50 p-2 rounded italic">
                      "{entry.notes}"
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrackerHistory;
