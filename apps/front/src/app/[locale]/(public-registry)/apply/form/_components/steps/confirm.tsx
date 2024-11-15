"use client";

import Typography from "@prpr/ui/components/typography";
import { useApplyFormStore } from "../../store";
import { useFormatter, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { PersonalFormSchema, PersonalFormValues } from "./personal";
import { Steps } from "../../types";
import { toast } from "@prpr/ui/components/sonner";
import {
  futureOptions,
  PropertyFormSchema,
  PropertyFormValues,
} from "./property";
import { DocsFormSchema, DocsFormValues } from "./docs";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button } from "@prpr/ui/components/button";
import { ArrowLeft, Send } from "lucide-react";
import { Input } from "@prpr/ui/components/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@prpr/ui/components/form";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Checkbox } from "@prpr/ui/components/checkbox";
import { defaultTranslationValues } from "@/localization/config";
import { create, preUploadFiles } from "@/lib/back-api/public/documents/f0";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@prpr/ui/components/card";
import { DocumentType, F0Document } from "@prpr/documents";
import { encodeNumber } from "@prpr/documents/number";

const ConfirmFormSchema = (
  t: ReturnType<
    typeof useTranslations<"pages.apply-form.steps.confirmation.form">
  > = (() => {}) as any
) =>
  yup.object({
    agreementToCollectAndProcessPersonalData: yup
      .boolean()
      .oneOf(
        [true],
        t("fields.agreementToCollectAndProcessPersonalData.errors.required")
      ),
    signature: yup.string().min(3, t("fields.signature.errors.required")),
  });

export default function ConfirmStep() {
  const t = useTranslations("pages.apply-form");
  const tForm = useTranslations("pages.apply-form.steps.confirmation.form");

  const formSchema = ConfirmFormSchema(tForm);

  const prevFromCurrent = useApplyFormStore(
    (state) => state.steps.previousFromCurrent
  );

  const formData = useApplyFormStore((state) => state.form.data);

  const formDataPersonal = formData.personal as PersonalFormValues;
  const formDataProperty = formData.property as PropertyFormValues;
  const formDataDocs = formData.docs as DocsFormValues;

  const [isUploading, setIsUploading] = useState(false);
  const [uploadedDoc, setUploadedDoc] = useState<F0Document | null>(null);

  const forbidInvalidation = useApplyFormStore(
    (state) => state.forbidInvalidation
  );

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      agreementToCollectAndProcessPersonalData: false,
      signature: "",
    },
  });

  async function onSubmit() {
    setIsUploading(true);
    forbidInvalidation(true);

    const { request: preUploadReq, docsTransformedForPreUpload } =
      preUploadFiles({
        id: formDataDocs.id,
        propertyId: formDataDocs.propertyId,
        evidenceOfDamagedProperty: formDataDocs.evidenceOfDamagedProperty,
      });

    toast.promise(preUploadReq, {
      loading: t("steps.confirmation.submitting.preUploadS3.loading"),
      success: t("steps.confirmation.submitting.preUploadS3.success"),
      error: () => {
        setIsUploading(false);
        forbidInvalidation(false);
        return t("steps.confirmation.submitting.preUploadS3.error");
      },
    });

    const docsTransformedForPreUploadFlat = [
      ...docsTransformedForPreUpload.id,
      ...docsTransformedForPreUpload.propertyId,
      ...(docsTransformedForPreUpload?.evidenceOfDamagedProperty || []),
    ].flat();

    const preUploadReqData = (await preUploadReq).data;
    const preUploadReqDataFlat = [
      ...preUploadReqData.id,
      ...preUploadReqData.propertyId,
      ...(preUploadReqData?.evidenceOfDamagedProperty || []),
    ].flat();

    const promisesToUploadToS3 = preUploadReqDataFlat.map((responseFromApi) => {
      const docTransformed = docsTransformedForPreUploadFlat.find(
        (doc) => doc.feedForApi.ref === responseFromApi.ref
      )!;

      const req = axios.postForm(responseFromApi.url, {
        ...responseFromApi.fields,
        "Content-Type": docTransformed.file.type,
        file: docTransformed.file,
      });

      return req;
    });

    toast.promise(Promise.all(promisesToUploadToS3), {
      loading: t("steps.confirmation.submitting.uploadS3.loading"),
      success: t("steps.confirmation.submitting.uploadS3.success"),
      error: () => {
        setIsUploading(false);
        forbidInvalidation(false);
        return t("steps.confirmation.submitting.uploadS3.error");
      },
    });

    await Promise.all(promisesToUploadToS3);

    const createReq = create({
      personal: formDataPersonal,
      property: formDataProperty,
      docs: {
        idKeys: preUploadReqData.id.map((v) => v.fields.key),
        propertyIdKeys: preUploadReqData.propertyId.map((v) => v.fields.key),
        evidenceOfDamagedPropertyKeys:
          preUploadReqData.evidenceOfDamagedProperty?.map((v) => v.fields.key),
      },
    });

    toast.promise(createReq, {
      loading: t("steps.confirmation.submitting.submit.loading"),
      success: t("steps.confirmation.submitting.submit.success"),
      error: () => {
        setIsUploading(false);
        forbidInvalidation(false);
        return t("steps.confirmation.submitting.submit.error");
      },
    });

    const createData = (await createReq).data;

    setUploadedDoc(createData);
    setIsUploading(false);
    forbidInvalidation(false);
  }

  return (
    <ConfirmValidation>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-8 gap-4">
            <div className="col-span-8">
              <Typography variant="h4" className="border-b mb-2">
                {t("steps.personal.title")}
              </Typography>
              <ConfirmPersonal />
            </div>
            <div className="col-span-8">
              <Typography variant="h4" className="border-b mb-2">
                {t("steps.damagedProperty.title")}
              </Typography>
              <ConfirmProperty />
            </div>
            <div className="col-span-8">
              <Typography variant="h4" className="border-b mb-2">
                {t("steps.docs.title")}
              </Typography>
              <ConfirmDocs />
            </div>

            <div className="col-span-8 grid grid-cols-10 border-t mt-1 pt-4 pl-3">
              <FormField
                control={form.control}
                name="agreementToCollectAndProcessPersonalData"
                render={({ field }) => (
                  <FormItem className="col-span-10">
                    <div className="flex flex-row items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isUploading || uploadedDoc !== null}
                        />
                      </FormControl>
                      <FormLabel>
                        {t(
                          "steps.confirmation.form.fields.agreementToCollectAndProcessPersonalData.label"
                        )}
                      </FormLabel>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="signature"
                render={({ field }) => (
                  <FormItem className="col-span-10 lg:col-span-6 row-span-1 mt-10">
                    <FormDescription>
                      {t.rich(
                        "steps.confirmation.form.fields.signature.description",
                        defaultTranslationValues
                      )}
                    </FormDescription>
                    <div className=" flex flex-row items-center gap-2">
                      <FormLabel>
                        {t("steps.confirmation.form.fields.signature.label")}:
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "steps.confirmation.form.fields.signature.placeholder"
                          )}
                          disabled={isUploading || uploadedDoc !== null}
                          {...field}
                        />
                      </FormControl>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {uploadedDoc === null && (
              <div className="col-span-8 mt-3 flex flex-row gap-3">
                <Button
                  variant="secondary"
                  onClick={() => prevFromCurrent()}
                  disabled={isUploading}
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  {t("steps.confirmation.form.actions.back")}
                </Button>
                <Button type="submit" disabled={isUploading}>
                  {t("steps.confirmation.form.actions.submit")}
                  <Send className="h-5 w-5 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </form>
        {uploadedDoc !== null && (
          <div className="mt-3">
            <DocCreatedConfirmed
              number={encodeNumber({
                year: uploadedDoc.year,
                id: uploadedDoc.id,
                type: DocumentType.F0_Apply_To_Open_Main_Case,
              })}
              deadline={uploadedDoc.assignments[0].deadline}
              workerEmail={uploadedDoc.assignments[0].worker.email}
              workerFullName={`${uploadedDoc.assignments[0].worker.surname} ${uploadedDoc.assignments[0].worker.givenName}`}
            />
          </div>
        )}
      </Form>
    </ConfirmValidation>
  );
}

function ConfirmValidation({ children }: { children: JSX.Element }) {
  const t = useTranslations("pages.apply-form.steps");

  const personal = useApplyFormStore((state) => state.form.data.personal);
  const property = useApplyFormStore((state) => state.form.data.property);
  const docs = useApplyFormStore((state) => state.form.data.docs);

  const goToStep = useApplyFormStore((state) => state.steps.goTo);
  const removeComplete = useApplyFormStore(
    (state) => state.steps.removeComplete
  );

  const isPersonalValid = PersonalFormSchema().isValidSync(personal);
  const isPropertyValid = PropertyFormSchema().isValidSync(property);
  const isDocsValid = DocsFormSchema().isValidSync(docs);

  const informedAtLeastOnce = useRef(false);

  if (informedAtLeastOnce.current) {
    return null;
  }

  if (!isPersonalValid) {
    goToStep(Steps.Personal);
    removeComplete(Steps.Personal);
    toast.info(t("confirmation.validation.personal"));

    informedAtLeastOnce.current = true;

    return null;
  }

  if (!isPropertyValid) {
    goToStep(Steps.DamagedProperty);
    removeComplete(Steps.DamagedProperty);
    toast.info(t("confirmation.validation.damagedProperty"));

    informedAtLeastOnce.current = true;

    return null;
  }

  if (!isDocsValid) {
    goToStep(Steps.Docs);
    removeComplete(Steps.Docs);
    toast.info(t("confirmation.validation.docs"));

    informedAtLeastOnce.current = true;

    return null;
  }

  if (isPersonalValid && isPropertyValid && isDocsValid) {
    return children;
  }

  return null;
}

function ConfirmPersonal() {
  const t = useTranslations("pages.apply-form.steps");

  const formatter = useFormatter();

  const personal = useApplyFormStore((state) => state.form.data.personal);

  return (
    <div className="flex flex-col gap-1 ml-3">
      {/* title */}
      <div>
        <span className="font-semibold">
          {t("confirmation.sections.personal.title")}:
        </span>{" "}
        {t(`personal.form.fields.title.options.${personal?.title || "none"}`)}
      </div>

      {/* givenName, surName */}
      <div>
        <div className="font-semibold">
          {t("confirmation.sections.personal.names")}:
        </div>
        <div className="ml-3">
          <div>
            <span className="font-semibold">
              {t("confirmation.sections.personal.namesUk")}:{" "}
            </span>
            {`${personal?.surname?.uk}, ${personal?.givenName?.uk}`}
          </div>
          <div>
            <span className="font-semibold">
              {t("confirmation.sections.personal.namesEn")}:{" "}
            </span>
            {`${personal?.surname?.en}, ${personal?.givenName?.en}`}
          </div>
        </div>
      </div>

      {/* dob */}
      {personal?.dob && (
        <div>
          <span className="font-semibold">
            {t("confirmation.sections.personal.dob")}:
          </span>{" "}
          {formatter.dateTime(new Date(personal?.dob), {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          })}
        </div>
      )}

      {/* legalAddress */}
      <div>
        <span className="font-semibold">
          {t("confirmation.sections.personal.legalAddress")}:
        </span>{" "}
        {personal?.addressForLegalCorrespondence}
      </div>

      {/* contact.email */}
      <div>
        <span className="font-semibold">
          {t("confirmation.sections.personal.email")}:
        </span>{" "}
        {personal?.contact?.email}{" "}
        {personal?.contact?.preferableContactMethod === "email" &&
          `(${t("confirmation.sections.personal.contactSelected")})`}
      </div>

      {/* contact.phone */}
      <div>
        <span className="font-semibold">
          {t("confirmation.sections.personal.phone")}:
        </span>{" "}
        {personal?.contact?.phone}{" "}
        {personal?.contact?.preferableContactMethod === "phone" &&
          `(${t("confirmation.sections.personal.contactSelected")})`}
      </div>
    </div>
  );
}

function ConfirmProperty() {
  const t = useTranslations("pages.apply-form.steps");

  const property = useApplyFormStore((state) => state.form.data.property);

  const { locale } = useParams<{ locale: string }>();

  return (
    <div className="flex flex-col gap-1 ml-3">
      {/* addressFull */}
      <div>
        <span className="font-semibold">
          {t("confirmation.sections.damagedProperty.address")}:
        </span>{" "}
        {`${property?.residence?.full_name[locale]}, ${property?.address}, ${t(
          "confirmation.sections.damagedProperty.building"
        )} ${property?.buildingNumber}${
          property?.apartmentNumber
            ? `, ${t(
                "confirmation.sections.damagedProperty.apartment"
              )} ${property?.apartmentNumber}`
            : ""
        }`}
      </div>

      {/* selfAssessment */}
      <div>
        <div className="font-semibold">
          {t("confirmation.sections.damagedProperty.selfAssessment")}:
        </div>
        <div className="space-y-2 pl-4">
          {/* physicalDamage */}
          <div>
            <div className="font-semibold">
              {t("confirmation.sections.damagedProperty.physicalDamage")}:
            </div>
            <ul className="ml-6 list-disc [&>li]:mt-1">
              <li>
                {t(
                  "damagedProperty.form.fields.selfAssessment.physicalDamage.externalWalls.label"
                )}{" "}
                {property?.selfAssessment?.physicalDamage?.externalWalls}
              </li>
              <li>
                {t(
                  "damagedProperty.form.fields.selfAssessment.physicalDamage.roof.label"
                )}{" "}
                {property?.selfAssessment?.physicalDamage?.roof}
              </li>
              <li>
                {t(
                  "damagedProperty.form.fields.selfAssessment.physicalDamage.windows.label"
                )}{" "}
                {property?.selfAssessment?.physicalDamage?.windows}
              </li>
              <li>
                {t(
                  "damagedProperty.form.fields.selfAssessment.physicalDamage.internalWalls.label"
                )}{" "}
                {property?.selfAssessment?.physicalDamage?.internalWalls}
              </li>
              <li>
                {t(
                  "damagedProperty.form.fields.selfAssessment.physicalDamage.engineeringSystems.label"
                )}{" "}
                {property?.selfAssessment?.physicalDamage?.engineeringSystems}
              </li>
            </ul>
          </div>

          {/* safety */}
          <div>
            <div className="font-semibold">
              {t("confirmation.sections.damagedProperty.safety")}:
            </div>
            <ul className="ml-6 list-disc [&>li]:mt-1">
              <li>
                {t(
                  "damagedProperty.form.fields.selfAssessment.safety.explosives.label"
                )}{" "}
                {property?.selfAssessment?.safety?.explosives ? "✓" : ""}
              </li>
              <li>
                {t(
                  "damagedProperty.form.fields.selfAssessment.safety.debris.label"
                )}{" "}
                {property?.selfAssessment?.safety?.debris ? "✓" : ""}
              </li>
            </ul>
          </div>

          {/* livingConditions */}
          <div>
            <div className="font-semibold">
              {t("confirmation.sections.damagedProperty.livingConditions")}:
            </div>
            <ul className="ml-6 list-disc [&>li]:mt-1">
              <li>
                {t(
                  "damagedProperty.form.fields.selfAssessment.livingConditions.habitability.label"
                )}{" "}
                {property?.selfAssessment?.livingConditions?.habitability}
              </li>
              <li>
                {t(
                  "damagedProperty.form.fields.selfAssessment.livingConditions.repairability.label"
                )}{" "}
                {property?.selfAssessment?.livingConditions?.repairability}
              </li>
            </ul>
          </div>

          {/* descriptionOfDamage */}
          {property?.selfAssessment?.descriptionOfDamage && (
            <div>
              <div className="font-semibold">
                {t("confirmation.sections.damagedProperty.descriptionOfDamage")}
                :
              </div>
              <div className="whitespace-pre-line">
                {property?.selfAssessment?.descriptionOfDamage}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* future */}
      <div>
        <div className="font-semibold">
          {t("confirmation.sections.damagedProperty.future")}:
        </div>
        <ul className="ml-6 list-decimal [&>li]:mt-1">
          {property?.future
            ?.filter(
              (v) =>
                v && futureOptions.includes(v as (typeof futureOptions)[number])
            )
            .map(
              (v) =>
                v &&
                t(
                  `damagedProperty.form.fields.future.options.${
                    v as (typeof futureOptions)[number]
                  }`
                )
            )
            .map((v) => <li key={v}>{v}.</li>)}
        </ul>
      </div>
    </div>
  );
}

function ConfirmDocs() {
  const t = useTranslations("pages.apply-form.steps");

  const docs = useApplyFormStore((state) => state.form.data.docs);

  const idNames = docs?.id ? docs?.id.map((v) => v.name) : [];
  const propertyIdNames = docs?.propertyId
    ? docs?.propertyId.map((v) => v.name)
    : [];
  const evidenceOfDamagedPropertyNames = docs?.evidenceOfDamagedProperty
    ? docs?.evidenceOfDamagedProperty.map((v) => v.name)
    : [];

  return (
    <div className="flex flex-col gap-1 ml-3">
      {idNames.length > 0 && (
        <div>
          <div className="font-bold">{t("confirmation.sections.docs.id")}:</div>
          <ul className="ml-6 list-decimal [&>li]:mt-1">
            {idNames.map((v) => (
              <li key={v}>{v}.</li>
            ))}
          </ul>
        </div>
      )}

      {propertyIdNames.length > 0 && (
        <div>
          <div className="font-bold">
            {t("confirmation.sections.docs.propertyId")}:
          </div>
          <ul className="ml-6 list-decimal [&>li]:mt-1">
            {propertyIdNames.map((v) => (
              <li key={v}>{v}.</li>
            ))}
          </ul>
        </div>
      )}

      {evidenceOfDamagedPropertyNames.length > 0 && (
        <div>
          <div className="font-bold">
            {t("confirmation.sections.docs.evidenceOfDamagedProperty")}:
          </div>
          <ul className="ml-6 list-decimal [&>li]:mt-1">
            {evidenceOfDamagedPropertyNames.map((v) => (
              <li key={v}>{v}.</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function DocCreatedConfirmed({
  number,
  deadline,
  workerEmail,
  workerFullName,
}: {
  number: string;
  deadline: Date;
  workerEmail: string;
  workerFullName: string;
}) {
  const t = useTranslations("pages.apply-form.steps.confirmation");
  const format = useFormatter();

  const setValidToPast = useApplyFormStore((state) => state.setValidToPast);

  useEffect(() => {
    setValidToPast();
  }, [setValidToPast]);

  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.focus();
      ref.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [ref]);

  return (
    <Card ref={ref} className="border-primary border-2">
      <CardHeader>
        <CardTitle>
          {t("submitting.successCard.title")} <br />
          <br />#{" "}
          <span className="font-extrabold tracking-wide text-3xl">
            {number}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {t.rich("submitting.successCard.description", defaultTranslationValues)}
        <span className="font-semibold">
          {t("submitting.successCard.willBeDone")}{" "}
          <span className="font-bold text-xl">
            {format.dateTime(new Date(deadline), {
              dateStyle: "short",
            })}
          </span>
          <br />
          {t("submitting.successCard.executor")}:{" "}
          <span className="font-bold">
            {workerFullName} ({workerEmail})
          </span>
        </span>
      </CardContent>
    </Card>
  );
}
