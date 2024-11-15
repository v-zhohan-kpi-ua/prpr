"use client";

import { Button } from "@prpr/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@prpr/ui/components/card";
import { Input } from "@prpr/ui/components/input";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/localization/navigation";
import { toast } from "@prpr/ui/components/sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CardsCallToActionIndexPage() {
  const router = useRouter();

  const t = useTranslations("pages.index.cardsCallToAction");

  const [docNumber, setDocNumber] = useState("");

  const goToDocument = (docNumber: string) => {
    if (!docNumber || docNumber === "") {
      toast.error(t("cardFindApplication.form.docNumberEmpty"));

      return;
    }

    if (docNumber.split("/").length !== 3) {
      toast.error(t("cardFindApplication.form.docNumberIncorrect"));

      return;
    }

    router.push(`/d/${docNumber}`);
  };

  return (
    <div className="grid gap-0 md:grid-cols-4 xl:grid-cols-6 px-1 md:px-3">
      <Card className="flex flex-col rounded-b-none border-b-0 md:rounded-bl-lg md:border-b md:col-span-2 md:rounded-r-none md:border-r-0 xl:col-span-2 xl:col-start-2">
        <CardHeader className="pb-3">
          <CardTitle>{t("cardStartApplication.title")}</CardTitle>
          <CardDescription className="max-w-lg text-balance leading-relaxed">
            {t("cardStartApplication.description")}
          </CardDescription>
        </CardHeader>
        <CardFooter className="mt-auto">
          <Button asChild>
            <Link href="/apply/form">{t("cardStartApplication.actionButton")}</Link>
          </Button>
        </CardFooter>
      </Card>
      <Card className="rounded-t-none md:rounded-tr-lg md:col-span-2 md:rounded-l-none">
        <CardHeader className="pb-3">
          <CardTitle>{t("cardFindApplication.title")}</CardTitle>
          <CardDescription className="max-w-lg text-balance leading-relaxed">
            {t("cardFindApplication.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Input
              placeholder={t("cardFindApplication.form.docNumber")}
              className="pr-14 md:pr-15"
              value={docNumber}
              onChange={(e) => setDocNumber(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  goToDocument(docNumber);
                }
              }}
            />
            <Button
              size="icon"
              className="h-8 w-9 !absolute right-1 top-1"
              aria-label={t("cardFindApplication.form.submitButton")}
              onClick={() => goToDocument(docNumber)}
            >
              <ArrowRight />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
