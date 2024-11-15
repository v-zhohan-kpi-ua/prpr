import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { AdminAuthLoginForm } from "./form";
import pick from "lodash/pick";

export default async function AdminAuthLoginPage() {
  const messages = await getMessages();

  return (
    <div className="flex items-center justify-center">
      <NextIntlClientProvider messages={pick(messages, ["pages.admin.auth.login"])}>
        <AdminAuthLoginForm />
      </NextIntlClientProvider>
    </div>
  );
}
