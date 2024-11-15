"use client";

import { Steps } from "../../types";
import { useApplyFormStore } from "../../store";
import { toast } from "@prpr/ui/components/sonner";
import PersonalStep from "./personal";
import Typography from "@prpr/ui/components/typography";
import { useFormatter, useTranslations } from "next-intl";
import { Badge } from "@prpr/ui/components/badge";
import Info from "../info";
import { useEffect } from "react";
import Loading from "../../loading";
import PropertyStep from "./property";
import DocsStep from "./docs";
import ConfirmStep from "./confirm";
import StepsProgress from "./steps-progress";

export default function StepsApplyFormPage() {
  const t = useTranslations("pages.apply-form");
  const format = useFormatter();

  const invalidate = useApplyFormStore((state) => state.invalidate);
  const hydrated = useApplyFormStore((state) => state._hydrated);

  const currentStep = useApplyFormStore(
    (state) => state.steps.current
  ) as Steps;
  const currentStepIndex = Object.values(Steps).indexOf(currentStep);
  const validTo = useApplyFormStore((state) => state.validTo);

  useEffect(() => {
    const invalidated = invalidate();

    if (invalidated) {
      toast.warning(t("draftExpired"), {
        duration: 8000,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invalidate]);

  const renderStep = () => {
    switch (currentStep) {
      case Steps.Personal:
        return <PersonalStep />;
      case Steps.DamagedProperty:
        return <PropertyStep />;
      case Steps.Docs:
        return <DocsStep />;
      case Steps.Confirmation:
        return <ConfirmStep />;
      default:
        return null;
    }
  };

  if (!hydrated) return <Loading />;

  if (currentStep === null) return <Info />;

  return (
    <>
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 pb-6">
        <div className="flex flex-col gap-1">
          <div className="flex flex-col lg:flex-row gap-2">
            <Typography variant="h3">{t("title")}</Typography>
            <Badge
              variant="secondary"
              className="uppercase rounded-full self-start lg:self-center leading-none py-1"
            >
              {t("draft")}
            </Badge>
          </div>

          {validTo && new Date(validTo) > new Date() && (
            <div className="mb-2">
              {t("will-expire")} {format.relativeTime(new Date(validTo))}
            </div>
          )}

          <Typography variant="h4">
            {t("step-n-of-nth", {
              current: currentStepIndex + 1,
              total: Object.values(Steps).length,
              stepName: t(`steps.${currentStep}.title`),
            })}
          </Typography>
        </div>

        {renderStep()}
      </div>

      <div className="hidden lg:block col-span-4">
        <StepsProgress />
      </div>
    </>
  );
}
