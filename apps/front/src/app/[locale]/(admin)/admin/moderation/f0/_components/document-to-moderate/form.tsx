import {
  approveOrRejectAssignment,
  getNextAssignment,
} from "@/lib/back-api/admin/assignments/f0";
import { AsyncReturnType } from "@/types/utils";
import { yupResolver } from "@hookform/resolvers/yup";
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
import { toast } from "@prpr/ui/components/sonner";
import { Textarea } from "@prpr/ui/components/textarea";
import Typography from "@prpr/ui/components/typography";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

interface FormData {
  comment: string;
  status: "approve" | "reject";
  keysWithDescription: {
    [key: string]: string | undefined;
  };
}

const generateSchema = (
  documentKeys: string[],
  t: ReturnType<typeof useTranslations<"pages.admin.moderation-f0">>
) => {
  return yup.object({
    status: yup
      .string()
      .oneOf(
        ["approve", "reject"],
        t("document-to-moderate.form.fields.status.errors.mustBe")
      )
      .required(t("document-to-moderate.form.fields.status.errors.required")),
    comment: yup
      .string()
      .default("")
      .when("status", ([status], schema) => {
        return status === "approve"
          ? schema.optional()
          : schema.required(
              t("document-to-moderate.form.fields.comment.errors.required")
            );
      }),
    keysWithDescription: yup.lazy(() => {
      const shape = {} as { [key: string]: yup.StringSchema };

      documentKeys.forEach((key) => {
        shape[key] = yup
          .string()
          .default(undefined)
          .required(
            t("document-to-moderate.form.fields.keysWithDesc.errors.required")
          );
      });

      return yup.object(shape);
    }),
  });
};

export const ModerationForm = ({
  data,
  fetchNextAssignment,
}: {
  data: AsyncReturnType<typeof getNextAssignment>["data"];
  fetchNextAssignment: () => Promise<void>;
}) => {
  const { id, propertyId, evidenceOfDamagedProperty } =
    data.assignment?.document.properties.form.docs!;

  const documentKeys = [
    ...id,
    ...propertyId,
    ...(evidenceOfDamagedProperty || []),
  ].map((doc) => doc.key);
  const documentKeysWithoutDotsSetUnderscore7Times = documentKeys.map((key) =>
    key.replace(/\./g, "_".repeat(7))
  );

  const t = useTranslations("pages.admin.moderation-f0");

  const validationSchema = generateSchema(
    documentKeysWithoutDotsSetUnderscore7Times,
    t
  );

  const form = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      comment: "",
    },
  });

  const tF0Docs = useTranslations("common.documents.f0.form.docs");

  const [isUploading, setIsUploading] = useState(false);

  const onSubmit: SubmitHandler<FormData> = async (formData: FormData) => {
    const keysWithDescription = Object.entries(
      formData.keysWithDescription
    ).map(([key, description]) => ({
      key: key.replace(/_{7}/g, "."),
      description: description!,
    }));

    setIsUploading(true);

    const patch = approveOrRejectAssignment({
      guid: data.assignment?.guid!,
      comment: formData.comment,
      status: formData.status,
      keysWithDescription,
    });

    toast.promise(patch, {
      loading: t("document-to-moderate.uploading.approveOrReject.loading"),
      success: t("document-to-moderate.uploading.approveOrReject.success"),
      error: () => {
        setIsUploading(false);
        return t("document-to-moderate.uploading.approveOrReject.error");
      },
    });

    await patch;

    const nextAssignment = fetchNextAssignment();

    toast.promise(nextAssignment, {
      loading: t("document-to-moderate.uploading.fetchNext.loading"),
      success: t("document-to-moderate.uploading.fetchNext.success"),
      error: () => {
        setIsUploading(false);
        return t("document-to-moderate.uploading.fetchNext.error");
      },
    });

    setIsUploading(false);
  };

  const handleStatusChangeAsSubmitButton = (status: "approve" | "reject") => {
    form.setValue("status", status);
    form.handleSubmit(onSubmit)();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Typography variant="h3">
          {t("document-to-moderate.sections.descDocs.title")}
        </Typography>

        <div className="flex flex-col gap-8">
          {/* id */}
          <div>
            <div className="mb-2">{tF0Docs("id")}</div>
            <div className="flex flex-col gap-6">
              {id.map(({ key, url }) => (
                <FormField
                  key={key}
                  control={form.control}
                  name={`keysWithDescription.${key.replace(/\./g, "_".repeat(7))}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{`${t("document-to-moderate.form.fields.keysWithDesc.label")} ${key}`}</FormLabel>
                      <FormDescription>
                        {`${t("document-to-moderate.form.fields.keysWithDesc.description")}`}{" "}
                        <a
                          className="link-underline"
                          href={url}
                          target="_blank"
                        >
                          {key}
                        </a>
                      </FormDescription>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={10}
                          placeholder={t(
                            "document-to-moderate.form.fields.keysWithDesc.placeholder"
                          )}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>

          {/* propertyId */}
          <div>
            <div className="mb-2">{tF0Docs("propertyId")}</div>
            <div className="flex flex-col gap-6">
              {propertyId.map(({ key, url }) => (
                <FormField
                  key={key}
                  control={form.control}
                  name={`keysWithDescription.${key.replace(/\./g, "_".repeat(7))}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{`${t("document-to-moderate.form.fields.keysWithDesc.label")} ${key}`}</FormLabel>
                      <FormDescription>
                        {`${t("document-to-moderate.form.fields.keysWithDesc.description")}`}{" "}
                        <a
                          className="link-underline"
                          href={url}
                          target="_blank"
                        >
                          {key}
                        </a>
                      </FormDescription>

                      <FormControl>
                        <Textarea
                          {...field}
                          rows={10}
                          placeholder={t(
                            "document-to-moderate.form.fields.keysWithDesc.placeholder"
                          )}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>

          {/* evidenceOfDamagedProperty */}
          {evidenceOfDamagedProperty &&
            evidenceOfDamagedProperty?.length > 0 && (
              <div>
                <div className="mb-2">
                  {tF0Docs("evidenceOfDamagedProperty")}
                </div>
                <div className="flex flex-col gap-6">
                  {evidenceOfDamagedProperty.map(({ key, url }) => (
                    <FormField
                      key={key}
                      control={form.control}
                      name={`keysWithDescription.${key.replace(/\./g, "_".repeat(7))}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {`${t("document-to-moderate.form.fields.keysWithDesc.label")} ${key}`}
                          </FormLabel>
                          <FormDescription>
                            {`${t("document-to-moderate.form.fields.keysWithDesc.description")}`}{" "}
                            <a
                              className="link-underline"
                              href={url}
                              target="_blank"
                            >
                              {key}
                            </a>
                          </FormDescription>

                          <FormControl>
                            <Textarea
                              {...field}
                              rows={10}
                              placeholder={t(
                                "document-to-moderate.form.fields.keysWithDesc.placeholder"
                              )}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>
            )}
        </div>

        <div className="mt-8">
          <Typography variant="h3">
            {t("document-to-moderate.sections.additionalComments.title")}
          </Typography>
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("document-to-moderate.form.fields.comment.label")}
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={10}
                    placeholder={t(
                      "document-to-moderate.form.fields.comment.placeholder"
                    )}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-row gap-4 mt-4">
            <Button onClick={() => handleStatusChangeAsSubmitButton("approve")}>
              {t("document-to-moderate.form.fields.status.options.approve")}
            </Button>
            <Button
              onClick={() => handleStatusChangeAsSubmitButton("reject")}
              variant="destructive"
            >
              {t("document-to-moderate.form.fields.status.options.reject")}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
