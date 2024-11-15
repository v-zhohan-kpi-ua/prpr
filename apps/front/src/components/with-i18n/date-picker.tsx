import { DateTimeFormatOptions, useFormatter } from "next-intl";
import { DatePicker, DatePickerProps } from "@prpr/ui/components/date-picker";
import { dateFnsLocales } from "@/localization/config";
import { useParams } from "next/navigation";

export type DatePickerWithI18nProps = Omit<
  DatePickerProps,
  "format" | "formatRange"
> & {
  formatterOptions?: DateTimeFormatOptions;
};

export function DatePickerWithI18n({
  formatterOptions = { year: "numeric", month: "numeric", day: "numeric" },
  ...props
}: DatePickerWithI18nProps) {
  const { locale } = useParams<{ locale: string }>();

  const formatter = useFormatter();

  return (
    <DatePicker
      locale={dateFnsLocales[locale]}
      format={(date) => formatter.dateTime(date, formatterOptions)}
      formatRange={(from, to) =>
        formatter.dateTimeRange(from, to, formatterOptions)
      }
      {...props}
    />
  );
}
