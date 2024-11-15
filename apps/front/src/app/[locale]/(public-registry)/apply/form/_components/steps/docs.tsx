import { Alert, AlertDescription, AlertTitle } from "@prpr/ui/components/alert";
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
import { FileUploaderWithI18n } from "@/components/with-i18n/file-uploader";
import { MimeTypes } from '@prpr/mime-types';
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowLeft, ArrowRight, InfoIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useApplyFormStore } from "../../store";
import { useCallback, useEffect } from "react";
import cloneDeep from "lodash/cloneDeep";
import { Steps } from "../../types";
import { useTranslations } from "next-intl";
import { defaultTranslationValues } from "@/localization/config";

export const DocsFormSchema = (
  t: ReturnType<
    typeof useTranslations<"pages.apply-form.steps.docs.form">
  > = (() => {}) as any
) =>
  yup.object().shape({
    id: yup
      .array()
      .of(yup.mixed<File>().required())
      .min(1, t("fields.id.errors.required"))
      .required(),
    propertyId: yup
      .array()
      .of(yup.mixed<File>().required())
      .min(1, t("fields.propertyId.errors.required"))
      .required(),
    evidenceOfDamagedProperty: yup.array().of(yup.mixed<File>().required()),
  });

export type DocsFormValues = yup.InferType<ReturnType<typeof DocsFormSchema>>;

export default function DocsStep() {
  const tForm = useTranslations("pages.apply-form.steps.docs.form");
  const tStep = useTranslations("pages.apply-form.steps.docs");

  const formSchema = DocsFormSchema(tForm);

  const savedValues = useApplyFormStore((state) => state.form.data.docs);
  const updateDocs = useApplyFormStore((state) => state.form.updateDocs);
  const nextFromCurrent = useApplyFormStore(
    (state) => state.steps.nextFromCurrent
  );
  const prevFromCurrent = useApplyFormStore(
    (state) => state.steps.previousFromCurrent
  );
  const complete = useApplyFormStore((state) => state.steps.complete);

  const form = useForm<DocsFormValues>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      id: [],
      propertyId: [],
    },
  });

  useEffect(() => {
    if (savedValues) {
      // form.reset(savedValues) doesn't work :(
      form.setValue("id", savedValues.id || []);
      form.setValue("propertyId", savedValues.propertyId || []);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveDraft = useCallback(
    () => updateDocs(cloneDeep(form.getValues())),
    [form, updateDocs]
  );

  function onSubmit(_: DocsFormValues) {
    saveDraft();
    complete(Steps.Docs);
    nextFromCurrent();
  }

  return (
    <>
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>
          <span className="font-bold">{tStep("alert-no-save.title")}</span>
        </AlertTitle>
        <AlertDescription>
          {tStep.rich("alert-no-save.description", defaultTranslationValues)}
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-8 gap-6"
        >
          {/* id */}
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem className="col-span-8">
                <FormLabel>{tForm("fields.id.label")}</FormLabel>
                <FormDescription>
                  {tForm.rich(
                    "fields.id.description",
                    defaultTranslationValues
                  )}
                </FormDescription>

                <FormControl>
                  <FileUploaderWithI18n
                    files={field.value}
                    maxSizeInBytes={10 * 1024 * 1024}
                    maxFiles={3}
                    accept={[
                      MimeTypes[".pdf"],
                      MimeTypes[".jpeg"],
                      MimeTypes[".png"],
                    ]}
                    onFileUnaccepted={({ message }) =>
                      form.setError(field.name, { message, type: "manual" })
                    }
                    onFilesChange={field.onChange}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* propertyId */}
          <FormField
            control={form.control}
            name="propertyId"
            render={({ field }) => (
              <FormItem className="col-span-8">
                <FormLabel>{tForm("fields.propertyId.label")}</FormLabel>
                <FormDescription>
                  {tForm.rich(
                    "fields.propertyId.description",
                    defaultTranslationValues
                  )}
                </FormDescription>

                <FormControl>
                  <FileUploaderWithI18n
                    files={field.value}
                    maxSizeInBytes={50 * 1024 * 1024}
                    maxFiles={6}
                    accept={[
                      MimeTypes[".pdf"],
                      MimeTypes[".jpeg"],
                      MimeTypes[".png"],
                      MimeTypes[".zip"],
                    ]}
                    onFileUnaccepted={({ message }) =>
                      form.setError(field.name, { message, type: "manual" })
                    }
                    onFilesChange={field.onChange}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* evidenceOfDamagedProperty */}
          <FormField
            control={form.control}
            name="evidenceOfDamagedProperty"
            render={({ field }) => (
              <FormItem className="col-span-8">
                <FormLabel>
                  {tForm("fields.evidenceOfDamagedProperty.label")}
                </FormLabel>
                <FormControl>
                  <FileUploaderWithI18n
                    files={field.value}
                    maxSizeInBytes={50 * 1024 * 1024}
                    maxFiles={6}
                    accept={[
                      MimeTypes[".pdf"],
                      MimeTypes[".jpeg"],
                      MimeTypes[".png"],
                      MimeTypes[".zip"],
                    ]}
                    onFileUnaccepted={({ message }) =>
                      form.setError(field.name, { message, type: "manual" })
                    }
                    onFilesChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  {tForm.rich(
                    "fields.evidenceOfDamagedProperty.description",
                    defaultTranslationValues
                  )}
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-8 flex flex-row mt-3 gap-4 justify-center">
            <Button variant="secondary" onClick={() => prevFromCurrent()}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              {tForm("actions.back")}
            </Button>
            <Button type="submit">
              {tForm("actions.submit")}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
