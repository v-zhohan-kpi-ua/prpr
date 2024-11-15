import { useTranslations } from "next-intl";
import { useApplyFormStore } from "../../store";
import { Steps } from "../../types";
import { cn } from "@/lib/utils";
import { Button } from "@prpr/ui/components/button";
import { RotateCcw } from "lucide-react";

export default function StepsProgress() {
  const t = useTranslations("pages.apply-form");

  const currentStep = useApplyFormStore((state) => state.steps.current);
  const completedSteps = useApplyFormStore((state) => state.steps.completed);

  const allSteps = Object.values(Steps);

  const invalidate = useApplyFormStore((state) => state.invalidate);
  const canInvalidate = useApplyFormStore((state) => state.canInvalidate);

  return (
    <div className="flex flex-col my-3 sticky top-6">
      <div className="flex flex-col gap-3">
        {allSteps.map((step, index) => {
          const isCurrent = step === currentStep;
          const isCompleted = completedSteps.includes(step);

          return (
            <div key={step} className="flex flex-row items-center gap-2">
              <div
                className={cn(
                  "w-12 h-12 rounded-full border-2 flex justify-center items-center",
                  isCurrent ? "border-primary" : "border-secondary",
                  isCompleted
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary text-secondary-foreground"
                )}
              >
                {isCompleted ? "✓" : index + 1}
              </div>
              <div className={cn(isCurrent ? "font-semibold" : "font-normal")}>
                {t(`steps.${step}.title`)}
              </div>
            </div>
          );
        })}
      </div>

      <Button
        onClick={() => invalidate(true)}
        className="my-6 mx-6"
        variant="secondary"
        disabled={!canInvalidate}
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        {t("restart-form")}
      </Button>
    </div>
  );
}
