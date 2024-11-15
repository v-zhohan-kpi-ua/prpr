import { notFound } from "next/navigation";
import { BaseNumber, parseNumberToObject } from "@prpr/documents/number";
import { get } from "@/lib/back-api/public/documents/f0";
import { F0PageView } from "./view";
import { getMessages } from "next-intl/server";
import pick from "lodash/pick";
import { NextIntlClientProvider } from "next-intl";
import { AxiosError } from "axios";

export default async function F0IndexPage({
  params,
}: {
  params: { body: string[] };
}) {
  if (!params.body) notFound();

  let parsedNumber: BaseNumber;

  try {
    parsedNumber = parseNumberToObject(`f0/${params.body.join("/")}`);
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
        <F0PageView data={data.data} />
      </NextIntlClientProvider>
    </div>
  );
}
