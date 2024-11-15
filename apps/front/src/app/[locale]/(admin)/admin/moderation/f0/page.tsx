import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import pick from "lodash/pick";
import { AdminModerationF0PageClient } from "./page-client";

export default async function AdminModerationF0Page() {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider
      messages={pick(messages, [
        "common.documents.f0",
        "pages.apply-form.steps.personal",
        "pages.apply-form.steps.damagedProperty",
        "pages.admin.moderation-f0",
      ])}
    >
      <AdminModerationF0PageClient />
    </NextIntlClientProvider>
  );
}
