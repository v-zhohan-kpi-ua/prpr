import { notFound } from "next/navigation";
import { BaseNumber, parseNumberToObject } from "@prpr/documents/number";
import { get } from "@/lib/back-api/public/documents/c0";
import { C0PageView } from "./view";
import { getMessages } from "next-intl/server";
import pick from "lodash/pick";
import { NextIntlClientProvider } from "next-intl";
import { AxiosError } from "axios";
import { Skeleton } from "@prpr/ui/components/skeleton";

export default async function F0IndexPage({
  params,
}: {
  params: { body: string[] };
}) {
  if (!params.body) notFound();

  let parsedNumber: BaseNumber;

  try {
    parsedNumber = parseNumberToObject(`c0/${params.body.join("/")}`);
  } catch (error) {
    throw error;
  }

  const messages = await getMessages();

  let data;

  try {
    data = await get({ year: parsedNumber.year, id: parsedNumber.id });
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) notFound();
    }

    throw error;
  }

  return (
    <div className="my-4 w-full">
      <NextIntlClientProvider
        messages={pick(messages, [
          "common.documents.f0.form.property",
          "pages.apply-form.steps.damagedProperty",
        ])}
      >
        <C0PageView data={data.data} />
      </NextIntlClientProvider>
    </div>
  );
}
