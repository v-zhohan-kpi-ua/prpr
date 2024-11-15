"use client";

import {
  F0PropertiesFormProperty,
  F0PropertiesFormPropertyFutureOptions,
} from "@prpr/documents/properties";
import Typography from "@prpr/ui/components/typography";
import { cn } from "@prpr/ui/lib/utils";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export function F0FormProperty({
  property,
  withHeader = false,
  headerClassName,
}: {
  property: Omit<F0PropertiesFormProperty, "residenceId"> & {
    residence: { id: string; name: { uk: string; en: string } };
  };
  withHeader?: boolean;
  headerClassName?: string;
}) {
  const t = useTranslations("common.documents.f0.form.property");
  const tApplyProperty = useTranslations(
    "pages.apply-form.steps.damagedProperty"
  );

  const { locale } = useParams<{
    locale: keyof typeof property.residence.name;
  }>();

  const resultDescriptionValue = t(
    `resultRoundedDescription.values.${property.selfAssessment.formula.resultRounded as [0, 1, 2, 3, 4, 5][number]}`
  );

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
        {/* addressFull */}
        <div>
          <span className="font-semibold">{t("address")}:</span>{" "}
          {`${property.residence.name[locale]}, ${property?.address}, ${t(
            "building"
          )} ${property?.buildingNumber}${
            property?.apartmentNumber
              ? `, ${t("apartment")} ${property?.apartmentNumber}`
              : ""
          }`}
        </div>

        {/* selfAssessment */}
        <div>
          <div className="font-semibold">{t("selfAssessment")}:</div>
          <div className="space-y-2 pl-4">
            {/* physicalDamage */}
            <div>
              <div className="font-semibold">{t("physicalDamage")}:</div>
              <ul className="ml-6 list-disc [&>li]:mt-1">
                <li>
                  {tApplyProperty(
                    "form.fields.selfAssessment.physicalDamage.externalWalls.label"
                  )}{" "}
                  {
                    property?.selfAssessment?.scores?.physicalDamage
                      ?.externalWalls
                  }
                </li>
                <li>
                  {tApplyProperty(
                    "form.fields.selfAssessment.physicalDamage.roof.label"
                  )}{" "}
                  {property?.selfAssessment?.scores?.physicalDamage?.roof}
                </li>
                <li>
                  {tApplyProperty(
                    "form.fields.selfAssessment.physicalDamage.windows.label"
                  )}{" "}
                  {property?.selfAssessment?.scores?.physicalDamage?.windows}
                </li>
                <li>
                  {tApplyProperty(
                    "form.fields.selfAssessment.physicalDamage.internalWalls.label"
                  )}{" "}
                  {
                    property?.selfAssessment?.scores?.physicalDamage
                      ?.internalWalls
                  }
                </li>
                <li>
                  {tApplyProperty(
                    "form.fields.selfAssessment.physicalDamage.engineeringSystems.label"
                  )}{" "}
                  {
                    property?.selfAssessment?.scores?.physicalDamage
                      ?.engineeringSystems
                  }
                </li>
              </ul>
            </div>

            {/* safety */}
            <div>
              <div className="font-semibold">{t("safety")}:</div>
              <ul className="ml-6 list-disc [&>li]:mt-1">
                <li>
                  {tApplyProperty(
                    "form.fields.selfAssessment.safety.explosives.label"
                  )}{" "}
                  {property?.selfAssessment?.scores?.safety?.explosives
                    ? "✓"
                    : ""}
                </li>
                <li>
                  {tApplyProperty(
                    "form.fields.selfAssessment.safety.debris.label"
                  )}{" "}
                  {property?.selfAssessment?.scores?.safety?.debris ? "✓" : ""}
                </li>
              </ul>
            </div>

            {/* livingConditions */}
            <div>
              <div className="font-semibold">{t("livingConditions")}:</div>
              <ul className="ml-6 list-disc [&>li]:mt-1">
                <li>
                  {tApplyProperty(
                    "form.fields.selfAssessment.livingConditions.habitability.label"
                  )}{" "}
                  {
                    property?.selfAssessment?.scores?.livingConditions
                      ?.habitability
                  }
                </li>
                <li>
                  {tApplyProperty(
                    "form.fields.selfAssessment.livingConditions.repairability.label"
                  )}{" "}
                  {
                    property?.selfAssessment?.scores?.livingConditions
                      ?.repairability
                  }
                </li>
              </ul>
            </div>

            {/* descriptionOfDamage */}
            {property?.selfAssessment?.descriptionOfDamage && (
              <div>
                <div className="font-semibold">{t("descriptionOfDamage")}:</div>
                <div className="whitespace-pre-line">
                  {property?.selfAssessment?.descriptionOfDamage}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* future */}
        <div>
          <div className="font-semibold">{t("future")}:</div>
          <ul className="ml-6 list-decimal [&>li]:mt-1">
            {property?.future
              ?.filter(
                (v) => v && F0PropertiesFormPropertyFutureOptions.includes(v)
              )
              .map(
                (v) => v && tApplyProperty(`form.fields.future.options.${v}`)
              )
              .map((v) => <li key={v}>{v}.</li>)}
          </ul>
        </div>

        {/* formula */}
        <div>
          <div className="font-semibold">{t("formula")}:</div>
          <div className="pl-4">
            <div>
              {t("result")}: {property?.selfAssessment?.formula?.result}
            </div>
            <div>
              {t("resultRoundedDescription.label")}: {resultDescriptionValue}
            </div>
            <div>
              {t("howItWasCalculated")}:{" "}
              {property?.selfAssessment?.formula?.howItWasCalculated}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
