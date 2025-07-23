"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Save, X } from "lucide-react";
import { format, parseISO } from "date-fns";

interface EditWatchEntryProps {
  entry;
  onSave: (entryId: number, newDate: string) => void;
  onCancel: () => void;
}

export default function EditWatchEntry({
  entry,
  onSave,
  onCancel,
}: EditWatchEntryProps) {
  const [watchedDate, setWatchedDate] = useState(entry.watched_date);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(entry.id, watchedDate);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-blue-800">Edit Watch Date</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Episode Info */}
        <div>
          <p className="font-medium text-sm text-blue-900">
            Episode {entry.episode?.id}: {entry.episode?.title}
          </p>
          {entry.episode?.arc_title && (
            <p className="text-xs text-blue-700">
              Arc: {entry.episode.arc_title}
            </p>
          )}
        </div>

        {/* Date Input */}
        <div className="space-y-2">
          <Label htmlFor="edit-watched-date" className="text-blue-700">
            Date Watched
          </Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="edit-watched-date"
              type="date"
              value={watchedDate}
              onChange={(e) => setWatchedDate(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            disabled={isLoading || watchedDate === entry.watched_date}
            size="sm"
            className="flex-1"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Saving..." : "Save"}
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            size="sm"
            className="flex-1"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
