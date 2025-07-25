"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Save, X } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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
  const [watchedDate, setWatchedDate] = useState<Date>(
    parseISO(entry.watched_date)
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(entry.id, format(watchedDate, "yyyy-MM-dd"));
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanged = format(watchedDate, "yyyy-MM-dd") !== entry.watched_date;

  return (
    <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800/30 transition-colors">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-blue-800 dark:text-blue-200 transition-colors">
          Edit Watch Date
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Episode Info */}
        <div>
          <p className="font-medium text-sm text-blue-900 dark:text-blue-100 transition-colors">
            Episode {entry.episode?.id}: {entry.episode?.title}
          </p>
          {entry.episode?.arc_title && (
            <p className="text-xs text-blue-700 dark:text-blue-300 transition-colors">
              Arc: {entry.episode.arc_title}
            </p>
          )}
        </div>

        {/* ShadCN Date Picker */}
        <div className="space-y-2">
          <Label className="text-blue-700 dark:text-blue-300 transition-colors">
            Date Watched
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700 transition-colors",
                  !watchedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {watchedDate ? (
                  format(watchedDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 dark:bg-gray-800 dark:border-gray-600"
              align="start"
            >
              <Calendar
                mode="single"
                selected={watchedDate}
                onSelect={(date) => date && setWatchedDate(date)}
                initialFocus
                className="dark:bg-gray-800"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            disabled={isLoading || !hasChanged}
            size="sm"
            className="flex-1 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Saving..." : "Save"}
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            size="sm"
            className="flex-1 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
