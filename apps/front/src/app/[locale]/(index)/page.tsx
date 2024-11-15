import Typography from "@prpr/ui/components/typography";
import { CardsCallToActionIndexPage } from "./_components/cards-call-to-action";
import { NextIntlClientProvider } from "next-intl";
import pick from "lodash/pick";
import { getMessages, getTranslations } from "next-intl/server";

export default async function Index(
  params: Readonly<{
    locale: string;
  }>
) {
  const messages = await getMessages();
  const t = await getTranslations({
    locale: params.locale,
    namespace: "common",
  });

  return (
    <>
      <div className="m-6">
        <div className="mb-12 max-w-2xl mx-auto">
          <Typography variant="h1" className="text-center uppercase">
            {t("app.name.long")}
          </Typography>
        </div>
        <NextIntlClientProvider
          messages={pick(messages, ["pages.index.cardsCallToAction"])}
        >
          <CardsCallToActionIndexPage />
        </NextIntlClientProvider>
      </div>
    </>
  );
}
