"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Button } from "@prpr/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@prpr/ui/components/form";
import { Input } from "@prpr/ui/components/input";
import { useCallback, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@prpr/ui/components/select";
import toUpper from "lodash/toUpper";
import toLower from "lodash/toLower";
import { useApplyFormStore } from "../../store";
import cloneDeep from "lodash/cloneDeep";
import { subYears } from "date-fns/subYears";
import { DatePickerWithI18n } from "@/components/with-i18n/date-picker";
import { useTranslations } from "next-intl";
import { Steps } from "../../types";
import { ArrowRight, RotateCcw } from "lucide-react";

export const titleOptions = ["mr", "ms", "none"] as const;
export const contactMethodOptions = ["phone", "email"] as const;

const regexUk = /^[А-ЩЬЮЯҐЄІЇа-щьюяґєії ]+$/;
const regexEn = /^[A-Za-z ]+$/;

export const PersonalFormSchema = (
  t: ReturnType<
    typeof useTranslations<"pages.apply-form.steps.personal.form">
  > = (() => {}) as any
) =>
  yup.object({
    title: yup
      .string()
      .oneOf(titleOptions, t("fields.title.errors.required"))
      .required(t("fields.title.errors.required")),
    surname: yup.object({
      uk: yup
        .string()
        .matches(regexUk, t("errors.invalidUkLanguage"))
        .required(t("fields.surname.errors.required")),
      en: yup
        .string()
        .matches(regexEn, t("errors.invalidEnLanguage"))
        .required(t("fields.surname.errors.required")),
    }),
    givenName: yup.object({
      uk: yup
        .string()
        .matches(regexUk, t("errors.invalidUkLanguage"))
        .required(t("fields.givenName.errors.required")),
      en: yup
        .string()
        .matches(regexEn, t("errors.invalidEnLanguage"))
        .required(t("fields.givenName.errors.required")),
    }),
    dob: yup.date().required(t("fields.dob.errors.required")),
    contact: yup.object({
      phone: yup.string().required(t("fields.contact.phone.errors.required")),
      email: yup
        .string()
        .email(t("fields.contact.email.errors.invalid"))
        .required(t("fields.contact.email.errors.required")),
      preferableContactMethod: yup
        .string()
        .oneOf(
          contactMethodOptions,
          t("fields.contact.preferableContactMethod.errors.required")
        )
        .required(t("fields.contact.preferableContactMethod.errors.required")),
    }),
    addressForLegalCorrespondence: yup
      .string()
      .required(t("fields.legalAddress.errors.required")),
  });

export type PersonalFormValues = yup.InferType<
  ReturnType<typeof PersonalFormSchema>
>;

export default function PersonalStep() {
  const t = useTranslations("pages.apply-form.steps.personal.form");
  const tApplyForm = useTranslations("pages.apply-form");

  const formSchema = PersonalFormSchema(t);

  const savedValues = useApplyFormStore((state) => state.form.data.personal);
  const updatePersonal = useApplyFormStore(
    (state) => state.form.updatePersonal
  );
  const nextFromCurrent = useApplyFormStore(
    (state) => state.steps.nextFromCurrent
  );
  const complete = useApplyFormStore((state) => state.steps.complete);
  const invalidate = useApplyFormStore((state) => state.invalidate);

  const form = useForm<PersonalFormValues>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      surname: {
        uk: "",
        en: "",
      },
      givenName: {
        uk: "",
        en: "",
      },
      contact: {
        phone: "",
        email: "",
      },
      addressForLegalCorrespondence: "",
    },
  });

  useEffect(() => {
    if (savedValues) {
      form.reset(savedValues, {
        keepErrors: true,
        keepTouched: true,
        keepDirty: true,
        keepIsValid: true,
        keepDirtyValues: true,
        keepIsSubmitted: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveDraft = useCallback(
    () => updatePersonal(cloneDeep(form.getValues())),
    [form, updatePersonal]
  );

  form.watch(() => saveDraft());

  function onSubmit(_: PersonalFormValues) {
    saveDraft();
    complete(Steps.Personal);
    nextFromCurrent();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-8 gap-6"
      >
        {/* title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="col-span-8 lg:col-span-4">
              <FormLabel>{t("fields.title.label")}</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={savedValues?.title}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("fields.title.placeholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {titleOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {t(`fields.title.options.${option}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* empty div */}
        <div className="hidden lg:block" />

        {/* surName.uk */}
        <FormField
          control={form.control}
          name="surname.uk"
          render={({ field }) => (
            <FormItem className="col-span-8 lg:col-span-4">
              <FormLabel>{t("fields.surname.label.uk")}</FormLabel>
              <FormControl>
                <Input
                  className="uppercase"
                  placeholder={t("fields.surname.placeholder.uk")}
                  {...field}
                  onChange={(e) => field.onChange(toUpper(e.target.value))}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* surName.en */}
        <FormField
          control={form.control}
          name="surname.en"
          render={({ field }) => (
            <FormItem className="col-span-8 lg:col-span-4">
              <FormLabel>{t("fields.surname.label.en")}</FormLabel>
              <FormControl>
                <Input
                  className="uppercase"
                  placeholder={t("fields.surname.placeholder.en")}
                  {...field}
                  onChange={(e) => field.onChange(toUpper(e.target.value))}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* givenName.uk */}
        <FormField
          control={form.control}
          name="givenName.uk"
          render={({ field }) => (
            <FormItem className="col-span-8 lg:col-span-4">
              <FormLabel>{t("fields.givenName.label.uk")}</FormLabel>
              <FormControl>
                <Input
                  className="uppercase"
                  placeholder={t("fields.givenName.placeholder.uk")}
                  {...field}
                  onChange={(e) => field.onChange(toUpper(e.target.value))}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* firstName.en */}
        <FormField
          control={form.control}
          name="givenName.en"
          render={({ field }) => (
            <FormItem className="col-span-8 lg:col-span-4">
              <FormLabel>{t("fields.givenName.label.en")}</FormLabel>
              <FormControl>
                <Input
                  className="uppercase"
                  placeholder={t("fields.givenName.placeholder.en")}
                  {...field}
                  onChange={(e) => field.onChange(toUpper(e.target.value))}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* dob */}
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="col-span-8 flex flex-col">
              <FormLabel>{t("fields.dob.label")}</FormLabel>

              <DatePickerWithI18n
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                fromDate={subYears(new Date(), 150)}
                toDate={subYears(new Date(), 14)}
                disabled={(date) => date > subYears(new Date(), 14)}
                captionLayout="dropdown"
                placeholder={t("fields.dob.placeholder")}
              />

              <FormMessage />
            </FormItem>
          )}
        />

        {/* addressForLegalCorrespondence */}
        <FormField
          control={form.control}
          name="addressForLegalCorrespondence"
          render={({ field }) => (
            <FormItem className="col-span-8">
              <FormLabel>{t("fields.legalAddress.label")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("fields.legalAddress.placeholder")}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-8 lg:col-span-4 lg:row-span-2 flex flex-col gap-6">
          {/* contact.email */}
          <FormField
            control={form.control}
            name="contact.email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("fields.contact.email.label")}</FormLabel>
                <FormControl>
                  <Input
                    className="lowercase"
                    placeholder={t("fields.contact.email.placeholder")}
                    {...field}
                    onChange={(e) => field.onChange(toLower(e.target.value))}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* contact.phone */}
          <FormField
            control={form.control}
            name="contact.phone"
            render={({ field }) => (
              <FormItem className="col-span-8">
                <FormLabel>{t("fields.contact.phone.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("fields.contact.phone.placeholder")}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* contact.preferableContactMethod */}
        <FormField
          control={form.control}
          name="contact.preferableContactMethod"
          render={({ field }) => (
            <FormItem className="col-span-8 lg:col-span-4 lg:row-span-2">
              <FormLabel>
                {t("fields.contact.preferableContactMethod.label")}
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={savedValues?.contact?.preferableContactMethod}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t(
                        "fields.contact.preferableContactMethod.placeholder"
                      )}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {contactMethodOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {t(
                        `fields.contact.preferableContactMethod.options.${option}`
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                {t("fields.contact.preferableContactMethod.description")}
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-8 flex flex-row mt-3 gap-4 justify-center">
          <Button
            onClick={() => invalidate(true)}
            variant="secondary"
            className="lg:hidden"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            {tApplyForm("restart-form")}
          </Button>
          <Button type="submit">
            {t("actions.submit")}
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
