import { Alert, AlertDescription, AlertTitle } from "@prpr/ui/components/alert";
import { Button } from "@prpr/ui/components/button";
import Typography from "@prpr/ui/components/typography";
import { ArrowRight, Info as InfoIcon } from "lucide-react";
import { useApplyFormStore } from "../store";
import { useTranslations } from "next-intl";
import { defaultTranslationValues } from "@/localization/config";
import { Steps } from "../types";

export default function Info() {
  const t = useTranslations("pages.apply-form");

  const nextStep = useApplyFormStore((state) => state.steps.nextFromCurrent);
  const startValidTo = useApplyFormStore((state) => state.startValidTo);

  const formStepsKeys = Object.values(Steps);

  return (
    <div className="col-span-12 md:col-span-8 md:col-start-3 xl:col-span-6 xl:col-start-4">
      <Typography variant="h1" className="mb-5">
        {t("title")}
      </Typography>

      <Alert role="status">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>
          {t.rich("info.alert.title", defaultTranslationValues)}
        </AlertTitle>
        <AlertDescription>
          {t.rich("info.alert.description", defaultTranslationValues)}
        </AlertDescription>
      </Alert>

      <div className="my-3">
        {t("info.alert.formConsistOf", { numberOfSteps: formStepsKeys.length })}
        :
        <ul className="my-3 ml-6 list-decimal [&>li]:mt-2">
          {formStepsKeys.map((value) => (
            <li key={value}>{t(`steps.${value}.title`)}</li>
          ))}
        </ul>
      </div>

      <div className="my-4">
        <Button
          onClick={() => {
            nextStep();
            startValidTo();
          }}
        >
          {t("info.alert.nextButton")} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
