import { NextIntlClientProvider } from "next-intl";
import pick from "lodash/pick";
import StepsApplyFormPage from "./_components/steps";
import { getMessages } from "next-intl/server";

export default async function ApplyForm() {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider
      messages={pick(messages, [
        "pages.apply-form",
        "common.components.file-uploader",
        "common.components.combobox",
        "common.documents.f0",
      ])}
    >
      <StepsApplyFormPage />
    </NextIntlClientProvider>
  );
}
