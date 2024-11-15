import { useTranslations } from "next-intl";
import {
  FileUploader,
  FileUploaderProps,
} from "@prpr/ui/components/file-uploader";
import { defaultTranslationValues } from "@/localization/config";

import mime from "mime/lite";

export type FileUploaderWithI18nProps = Omit<
  FileUploaderProps,
  "translationsI18n"
> & {
  translationsI18n?: Partial<FileUploaderProps["translationsI18n"]>;
};

const mimeTypeToStringArrayWithExtensionsUppercase = (mimeType: string) => {
  const extensions = mime.getAllExtensions(mimeType);

  if (!extensions) return [mimeType.toUpperCase()];

  return Array.from(extensions).map((ext) => ext.toUpperCase());
};

function FileUploaderWithI18n(props: FileUploaderWithI18nProps) {
  const t = useTranslations("common.components.file-uploader");

  const translationsI18nDefault: FileUploaderProps["translationsI18n"] = {
    dropHereOrClick: t.rich("dropHereOrClick", defaultTranslationValues),
    dropHereIsActive: t("dropHereIsActive"),
    youCanUploadOnly: (types) =>
      t("youCanUploadOnlyTypes", {
        types: types
          .flatMap(mimeTypeToStringArrayWithExtensionsUppercase)
          .join(", "),
      }),
    maxFileSize: (maxSize) => t("maxFileSize", { maxSize }),
    youCanUploadNMoreFiles: (n) => t("youCanUploadNMoreFiles", { n }),
    icons: {
      viewFile: t("icons.view"),
      removeFile: t("icons.remove"),
    },
    removeAllFiles: t("removeAll"),
    errors: {
      maxFiles: ({ n, zipAvailable }) =>
        zipAvailable
          ? t("errors.maxFilesWithZip", { maxFiles: n })
          : t("errors.maxFiles", { maxFiles: n }),
      maxFileSize: (maxSize) => t("errors.maxFileSize", { maxSize }),
      fileType: (type) =>
        t("errors.fileType", {
          fileType: mime.getExtension(type)?.toUpperCase() || "N/A",
        }),
    },
  };

  return (
    <FileUploader
      {...props}
      translationsI18n={{
        ...translationsI18nDefault,
        ...props.translationsI18n,
      }}
    />
  );
}

export { FileUploaderWithI18n };
