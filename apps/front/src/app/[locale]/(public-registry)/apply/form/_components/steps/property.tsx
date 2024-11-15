"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useApplyFormStore } from "../../store";
import { useCallback, useEffect, useState } from "react";
import cloneDeep from "lodash/cloneDeep";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@prpr/ui/components/form";
import debounce from "lodash/debounce";
import useAxios from "axios-hooks";
import { GetSearchResults } from "@/app/api/%5Fedge/locations/route";
import { useParams } from "next/navigation";
import { Input } from "@prpr/ui/components/input";
import { Button } from "@prpr/ui/components/button";
import { Steps } from "../../types";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Separator } from "@prpr/ui/components/separator";
import { Textarea } from "@prpr/ui/components/textarea";
import { Checkbox } from "@prpr/ui/components/checkbox";
import { useTranslations } from "next-intl";
import ComboboxWithI18n, {
  ComboboxWithI18nProps,
} from "@/components/with-i18n/combobox";
import { defaultTranslationValues } from "@/localization/config";
import { F0PropertiesFormPropertyFutureOptions } from "../../../../../../../../../../packages/documents/dist/properties/f0";

export const futureOptions = F0PropertiesFormPropertyFutureOptions;

export const PropertyFormSchema = (
  t: ReturnType<
    typeof useTranslations<"pages.apply-form.steps.damagedProperty.form">
  > = (() => {}) as any
) =>
  yup.object({
    residence: yup
      .object({
        id: yup.string().required(),
        full_name: yup.object().shape<{
          [key: string]: yup.Schema<string>;
        }>({
          uk: yup.string().required(),
          en: yup.string().required(),
        }),
      })
      .default(undefined)
      .required(t("fields.residence.errors.required")),
    address: yup
      .string()
      .min(5, t("fields.address.errors.minLength", { minLength: 5 }))
      .required(t("fields.address.errors.required")),
    buildingNumber: yup
      .number()
      .min(1, t("fields.buildingNumber.errors.invalid"))
      .required(t("fields.buildingNumber.errors.required")),
    apartmentNumber: yup
      .number()
      .min(1, t("fields.apartmentNumber.errors.invalid"))
      .optional(),
    future: yup
      .array()
      .of(yup.string())
      .test(
        "at-least-one-item",
        t("fields.future.errors.required"),
        (v) => v && v.length > 0
      )
      .required(t("fields.future.errors.required")),
    selfAssessment: yup.object({
      physicalDamage: yup.object({
        externalWalls: yup
          .number()
          .min(
            0,
            t("fields.selfAssessment.physicalDamage.externalWalls.errors.min")
          )
          .max(
            5,
            t("fields.selfAssessment.physicalDamage.externalWalls.errors.max")
          )
          .required(
            t(
              "fields.selfAssessment.physicalDamage.externalWalls.errors.required"
            )
          ),
        roof: yup
          .number()
          .min(0, t("fields.selfAssessment.physicalDamage.roof.errors.min"))
          .max(5, t("fields.selfAssessment.physicalDamage.roof.errors.max"))
          .required(
            t("fields.selfAssessment.physicalDamage.roof.errors.required")
          ),
        windows: yup
          .number()
          .min(0, t("fields.selfAssessment.physicalDamage.windows.errors.min"))
          .max(5, t("fields.selfAssessment.physicalDamage.windows.errors.max"))
          .required(
            t("fields.selfAssessment.physicalDamage.windows.errors.required")
          ),
        internalWalls: yup
          .number()
          .min(
            0,
            t("fields.selfAssessment.physicalDamage.internalWalls.errors.min")
          )
          .max(
            5,
            t("fields.selfAssessment.physicalDamage.internalWalls.errors.max")
          )
          .required(
            t(
              "fields.selfAssessment.physicalDamage.internalWalls.errors.required"
            )
          ),
        engineeringSystems: yup
          .number()
          .min(
            0,
            t(
              "fields.selfAssessment.physicalDamage.engineeringSystems.errors.min"
            )
          )
          .max(
            5,
            t(
              "fields.selfAssessment.physicalDamage.engineeringSystems.errors.max"
            )
          )
          .required(
            t(
              "fields.selfAssessment.physicalDamage.engineeringSystems.errors.required"
            )
          ),
      }),
      safety: yup.object({
        explosives: yup.boolean().default(false).optional(),
        debris: yup.boolean().default(false).optional(),
      }),
      livingConditions: yup.object({
        habitability: yup
          .number()
          .min(
            0,
            t("fields.selfAssessment.livingConditions.habitability.errors.min")
          )
          .max(
            5,
            t("fields.selfAssessment.livingConditions.habitability.errors.max")
          )
          .required(
            t(
              "fields.selfAssessment.livingConditions.habitability.errors.required"
            )
          ),
        repairability: yup
          .number()
          .min(
            0,
            t("fields.selfAssessment.livingConditions.repairability.errors.min")
          )
          .max(
            5,
            t("fields.selfAssessment.livingConditions.repairability.errors.max")
          )
          .required(
            t(
              "fields.selfAssessment.livingConditions.repairability.errors.required"
            )
          ),
      }),
      descriptionOfDamage: yup.string().optional(),
    }),
  });

export type PropertyFormValues = yup.InferType<
  ReturnType<typeof PropertyFormSchema>
>;

export default function PropertyStep() {
  const t = useTranslations("pages.apply-form.steps.damagedProperty.form");

  const formSchema = PropertyFormSchema(t);

  const savedValues = useApplyFormStore((state) => state.form.data.property);
  const updateProperty = useApplyFormStore(
    (state) => state.form.updateProperty
  );
  const nextFromCurrent = useApplyFormStore(
    (state) => state.steps.nextFromCurrent
  );
  const prevFromCurrent = useApplyFormStore(
    (state) => state.steps.previousFromCurrent
  );
  const complete = useApplyFormStore((state) => state.steps.complete);

  const form = useForm<PropertyFormValues>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      address: "",
      buildingNumber: 0,
      future: [],
      selfAssessment: {
        safety: {
          debris: false,
          explosives: false,
        },
      },
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
    () => updateProperty(cloneDeep(form.getValues())),
    [form, updateProperty]
  );

  form.watch(() => saveDraft());

  function onSubmit(_: PropertyFormValues) {
    saveDraft();
    complete(Steps.DamagedProperty);
    nextFromCurrent();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-8 gap-6"
      >
        {/* residence */}
        <FormField
          control={form.control}
          name="residence"
          render={({ field }) => (
            <FormItem className="col-span-8 lg:col-span-4">
              <FormLabel>{t("fields.residence.label")}</FormLabel>
              <FormControl>
                <Residence
                  placeholder={t("fields.residence.placeholder")}
                  option={field.value}
                  onChange={(v) => field.onChange(v)}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* address */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="col-span-8 lg:col-span-4">
              <FormLabel>{t("fields.address.label")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t("fields.address.placeholder")}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* buildingNumber */}
        <FormField
          control={form.control}
          name="buildingNumber"
          render={({ field }) => (
            <FormItem className="col-span-8 lg:col-span-4">
              <FormLabel>{t("fields.buildingNumber.label")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t("fields.buildingNumber.placeholder")}
                  type="number"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* apartmentNumber */}
        <FormField
          control={form.control}
          name="apartmentNumber"
          render={({ field }) => (
            <FormItem className="col-span-8 lg:col-span-4">
              <FormLabel>{t("fields.apartmentNumber.label")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value || ""}
                  placeholder={t("fields.apartmentNumber.placeholder")}
                  type="number"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* selfAssessment */}
        <div className="col-span-8 p-3 border-primary border-2 rounded-lg font-semibold">
          {t.rich(
            "fields.selfAssessment.description",
            defaultTranslationValues
          )}
        </div>
        {/* physicalDamage */}
        <div className="col-span-8 p-3 border-primary border-2 rounded-lg font-semibold">
          {t.rich(
            "fields.selfAssessment.physicalDamage.description",
            defaultTranslationValues
          )}
        </div>
        {/* physicalDamage.externalWalls */}
        <FormField
          control={form.control}
          name="selfAssessment.physicalDamage.externalWalls"
          render={({ field }) => (
            <FormItem className="col-span-8 lg:col-span-4">
              <FormLabel>
                {t("fields.selfAssessment.physicalDamage.externalWalls.label")}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t(
                    "fields.selfAssessment.physicalDamage.externalWalls.label"
                  )}
                  type="number"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* physicalDamage.roof */}
        <FormField
          control={form.control}
          name="selfAssessment.physicalDamage.roof"
          render={({ field }) => (
            <FormItem className="col-span-8 lg:col-span-4">
              <FormLabel>
                {t("fields.selfAssessment.physicalDamage.roof.label")}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t(
                    "fields.selfAssessment.physicalDamage.roof.label"
                  )}
                  type="number"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* physicalDamage.windows */}
        <FormField
          control={form.control}
          name="selfAssessment.physicalDamage.windows"
          render={({ field }) => (
            <FormItem className="col-span-8 lg:col-span-4">
              <FormLabel>
                {t("fields.selfAssessment.physicalDamage.windows.label")}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t(
                    "fields.selfAssessment.physicalDamage.windows.label"
                  )}
                  type="number"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* physicalDamage.internalWalls */}
        <FormField
          control={form.control}
          name="selfAssessment.physicalDamage.internalWalls"
          render={({ field }) => (
            <FormItem className="col-span-8 lg:col-span-4">
              <FormLabel>
                {t("fields.selfAssessment.physicalDamage.internalWalls.label")}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t(
                    "fields.selfAssessment.physicalDamage.internalWalls.label"
                  )}
                  type="number"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* physicalDamage.engineeringSystems */}
        <FormField
          control={form.control}
          name="selfAssessment.physicalDamage.engineeringSystems"
          render={({ field }) => (
            <FormItem className="col-span-8">
              <FormLabel>
                {t(
                  "fields.selfAssessment.physicalDamage.engineeringSystems.label"
                )}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t(
                    "fields.selfAssessment.physicalDamage.engineeringSystems.label"
                  )}
                  type="number"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* safety */}
        <div className="col-span-8 p-3 border-primary border-2 rounded-lg font-semibold">
          {t.rich(
            "fields.selfAssessment.safety.description",
            defaultTranslationValues
          )}
        </div>
        {/* safety.explosives */}
        <FormField
          control={form.control}
          name="selfAssessment.safety.explosives"
          render={({ field }) => (
            <FormItem className="col-span-8 flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>
                {t("fields.selfAssessment.safety.explosives.label")}
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* safety.debris */}
        <FormField
          control={form.control}
          name="selfAssessment.safety.debris"
          render={({ field }) => (
            <FormItem className="col-span-8 flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>
                {t("fields.selfAssessment.safety.debris.label")}
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* livingConditions */}
        <div className="col-span-8 p-3 border-primary border-2 rounded-lg font-semibold">
          {t.rich(
            "fields.selfAssessment.livingConditions.description",
            defaultTranslationValues
          )}
        </div>
        {/* livingConditions.habitability */}
        <FormField
          control={form.control}
          name="selfAssessment.livingConditions.habitability"
          render={({ field }) => (
            <FormItem className="col-span-8 lg:col-span-4">
              <FormLabel>
                {t("fields.selfAssessment.livingConditions.habitability.label")}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t(
                    "fields.selfAssessment.livingConditions.habitability.label"
                  )}
                  type="number"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* livingConditions.repairability */}
        <FormField
          control={form.control}
          name="selfAssessment.livingConditions.repairability"
          render={({ field }) => (
            <FormItem className="col-span-8 lg:col-span-4">
              <FormLabel>
                {t(
                  "fields.selfAssessment.livingConditions.repairability.label"
                )}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t(
                    "fields.selfAssessment.livingConditions.repairability.label"
                  )}
                  type="number"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="selfAssessment.descriptionOfDamage"
          render={({ field }) => (
            <FormItem className="col-span-8">
              <FormLabel>
                {t("fields.selfAssessment.descriptionOfDamage.label")}
              </FormLabel>
              <FormDescription>
                {t.rich(
                  "fields.selfAssessment.descriptionOfDamage.description",
                  defaultTranslationValues
                )}
              </FormDescription>
              <FormControl>
                <Textarea
                  {...field}
                  rows={10}
                  placeholder={t(
                    "fields.selfAssessment.descriptionOfDamage.placeholder"
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator className="col-span-8" />

        {/* future */}
        <FormField
          name="future"
          control={form.control}
          render={() => (
            <FormItem className="col-span-8 space-y-3">
              <FormLabel>{t("fields.future.label")}</FormLabel>
              <FormDescription>
                {t.rich("fields.future.description", defaultTranslationValues)}
              </FormDescription>

              {futureOptions.map((option) => (
                <FormField
                  key={option}
                  control={form.control}
                  name="future"
                  render={({ field }) => (
                    <FormItem
                      key={option}
                      className="flex flex-row items-center space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(option)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, option])
                              : field.onChange(
                                  field.value.filter((v) => v !== option)
                                );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {t(`fields.future.options.${option}`)}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ))}

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-8 flex flex-row mt-3 gap-4 justify-center">
          <Button variant="secondary" onClick={() => prevFromCurrent()}>
            <ArrowLeft className="h-5 w-5 mr-2" />
            {t("actions.back")}
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

function Residence({
  placeholder,
  onChange,
  option,
}: {
  onChange: (option: PropertyFormValues["residence"]) => void;
  option?: PropertyFormValues["residence"];
  placeholder?: string;
}) {
  const { locale } = useParams<{ locale: "uk" | "en" }>();

  const [query, setQuery] = useState("");
  const setQueryDebounced = debounce(setQuery, 400);

  const [{ data, loading, error }] = useAxios<
    PropertyFormValues["residence"][]
  >(
    `/api/_edge/locations?q=${query}&t=${GetSearchResults.ONLY_TO_FIND_ID_BY_FULL_NAME}`,
    { manual: query.trim() === "" }
  );

  const optionFormatted: ComboboxWithI18nProps["option"] | undefined = option
    ? {
        label: option.full_name[locale],
        value: option.id,
      }
    : undefined;

  return (
    <ComboboxWithI18n
      placeholder={placeholder}
      shouldFilter={false}
      option={optionFormatted}
      options={
        data
          ? data.map((v) => ({ label: v.full_name[locale], value: v.id }))
          : optionFormatted
            ? [optionFormatted]
            : []
      }
      onSelectOption={(option) => {
        if (data) {
          const rawOption = data.find((o) => o.id === option.value);

          if (rawOption) onChange(rawOption);
        }
      }}
      onType={(v) => {
        setQueryDebounced(v.trim());
      }}
      isLoading={loading}
      isError={!!error}
    />
  );
}
