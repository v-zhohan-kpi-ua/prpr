import { cn } from "@prpr/ui/lib/utils";
import { Button } from "@prpr/ui/components/button";
import { CalendarProps, Calendar } from "@prpr/ui/components/calendar";
import { FormControl } from "@prpr/ui/components/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@prpr/ui/components/popover";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { format as fnsFormat } from "date-fns";

export type DatePickerProps = CalendarProps & {
  placeholder: string;
  mode: "single" | "range";
  format?: (selectedDate: Date) => string;
  formatRange?: (from: Date, to: Date) => string;
};

function isDateRange(value: any): value is DateRange {
  return value?.hasOwnProperty("from") || value?.hasOwnProperty("to");
}

function DatePicker({
  placeholder,
  format = (date) => fnsFormat(date, "yyyy-MM-dd"),
  formatRange = (from, to) =>
    `${fnsFormat(from, "yyyy-MM-dd")} - ${fnsFormat(to, "yyyy-MM-dd")}`,
  ...props
}: DatePickerProps) {
  const { selected } = props;
  const selectedIsRange = isDateRange(selected);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={"outline"}
            className={cn(
              "pl-3 text-left font-normal",
              !selected && "text-muted-foreground"
            )}
          >
            {selected ? (
              selectedIsRange ? (
                selected.from && selected.to ? (
                  formatRange(selected.from, selected.to)
                ) : (
                  <span>{placeholder}</span>
                )
              ) : (
                format(new Date(selected))
              )
            ) : (
              <span>{placeholder}</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          captionLayout="dropdown"
          initialFocus
          today={selected && !selectedIsRange ? new Date(selected) : new Date()}
          {...props}
        />
      </PopoverContent>
    </Popover>
  );
}
DatePicker.displayName = "DatePicker";

export { DatePicker };
