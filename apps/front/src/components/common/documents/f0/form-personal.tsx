import Typography from "@prpr/ui/components/typography";
import {
  F0PropertiesFormPersonal,
  F0PropertiesFormPersonalTitle,
} from "@prpr/documents/properties";
import { useFormatter, useTranslations } from "next-intl";
import { cn } from "@prpr/ui/lib/utils";

const obscureValue = "***";

export function F0FormPersonal({
  personal,
  withHeader = false,
  headerClassName,
}: {
  personal: F0PropertiesFormPersonal;
  withHeader?: boolean;
  headerClassName?: string;
}) {
  const t = useTranslations("common.documents.f0.form.personal");
  const tApplyPersonal = useTranslations("pages.apply-form.steps.personal");

  const formatter = useFormatter();

  return (
    <div className="break-words">
      {withHeader && (
        <Typography
          variant="h4"
          className={cn("border-b mb-2", headerClassName)}
        >
          {t("header.title")}
        </Typography>
      )}

      <div className={cn("flex flex-col gap-1", withHeader && "ml-3")}>
        {/* title */}
        <div>
          <span className="font-semibold">{t("title")}:</span>{" "}
          {F0PropertiesFormPersonalTitle.includes(personal.title)
            ? tApplyPersonal(`form.fields.title.options.${personal.title}`)
            : personal.title}
        </div>

        {/* givenName, surName */}
        <div>
          <div className="font-semibold">{t("names")}:</div>
          <div className="ml-3">
            <div>
              <span className="font-semibold">{t("namesUk")}: </span>
              {`${personal?.surname?.uk}, ${personal?.givenName?.uk}`}
            </div>
            <div>
              <span className="font-semibold">{t("namesEn")}: </span>
              {`${personal?.surname?.en}, ${personal?.givenName?.en}`}
            </div>
          </div>
        </div>

        {/* dob */}
        <div>
          <span className="font-semibold">{t("dob")}:</span>{" "}
          {personal?.dob
            ? formatter.dateTime(new Date(personal.dob), {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            : obscureValue}
        </div>

        {/* legalAddress */}
        <div>
          <span className="font-semibold">{t("legalAddress")}:</span>{" "}
          {personal?.addressForLegalCorrespondence}
        </div>

        {/* contact.email */}
        <div>
          <span className="font-semibold">{t("email")}:</span>{" "}
          {personal?.contact?.email}{" "}
          {personal?.contact?.preferred === (obscureValue as unknown)
            ? ""
            : personal?.contact?.preferred === "email" &&
              `(${t("contactSelected")})`}
        </div>

        {/* contact.phone */}
        <div>
          <span className="font-semibold">{t("phone")}:</span>{" "}
          {personal?.contact?.phone}{" "}
          {personal?.contact?.preferred === (obscureValue as unknown)
            ? ""
            : personal?.contact?.preferred === "email" &&
              `(${t("contactSelected")})`}
        </div>
      </div>
    </div>
  );
}
