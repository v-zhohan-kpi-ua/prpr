import { getMessages } from "next-intl/server";
import AdminClientLayout from "./_components/layout";
import AuthGuard from "./auth/guard";
import { NextIntlClientProvider } from "next-intl";
import pick from "lodash/pick";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={pick(messages, ["pages.admin.common"])}>
      <AuthGuard>
        <AdminClientLayout>{children}</AdminClientLayout>
      </AuthGuard>
    </NextIntlClientProvider>
  );
}
