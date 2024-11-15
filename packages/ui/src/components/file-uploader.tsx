"use client";

import { CircleX, SquareArrowOutUpRight, Trash, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  FileRejection,
  useDropzone,
  ErrorCode,
  type DropzoneProps,
} from "react-dropzone";
import { Button } from "@prpr/ui/components/button";
import { cn } from "@prpr/ui/lib/utils";
import { MimeTypes } from "@prpr/mime-types";

export type FileWithPreview = {
  data: File;
  previewLink: string;
};

export type FileUploaderProps = {
  files?: File[];
  dropzoneProps?: DropzoneProps;
  accept?: MimeTypes[];
  maxSizeInBytes?: DropzoneProps["maxSize"];
  maxFiles?: DropzoneProps["maxFiles"];
  multiple?: DropzoneProps["multiple"];
  onFileUnaccepted: (props: {
    file: File | null;
    reason: "fileType" | "maxFileSize" | "maxFiles";
    message: string;
  }) => void;
  onFilesChange: (files: File[]) => void;
  translationsI18n?: {
    dropHereOrClick: string | React.ReactNode;
    dropHereIsActive: string | React.ReactNode;
    youCanUploadOnly: (types: MimeTypes[]) => string;
    maxFileSize: (sizeInBytes: string) => string;
    youCanUploadNMoreFiles: (n: number) => string;
    icons: {
      viewFile: string;
      removeFile: string;
    };
    removeAllFiles: string;
    errors: {
      maxFiles: (options: { n: number; zipAvailable: boolean }) => string;
      maxFileSize: (sizeInBytes: string) => string;
      fileType: (type: string) => string;
    };
  };
};

const createFileWithPreview = (file: File): FileWithPreview => ({
  data: file,
  previewLink: URL.createObjectURL(file),
});

function FileUploader(props: FileUploaderProps) {
  const {
    translationsI18n = {
      dropHereOrClick: "Drag and drop your files here OR click to browse files",
      dropHereIsActive: "Drop here",
      youCanUploadOnly: () => "You can upload only specific files",
      maxFileSize: (sizeInBytes) => `Max file size: ${sizeInBytes}`,
      youCanUploadNMoreFiles: (n) => `You can upload ${n} more file(s)`,
      icons: {
        viewFile: "View file",
        removeFile: "Remove file",
      },
      removeAllFiles: "Remove all files",
      errors: {
        maxFiles: ({ n, zipAvailable }) =>
          zipAvailable
            ? `You can't upload more than ${n} file(s). Delete some files OR try to zip archive`
            : `You can't upload more than ${n} file(s). Delete some to add more`,
        maxFileSize: (sizeInBytes) =>
          `This file is too large. Max file size is ${sizeInBytes}`,
        fileType: () => "This file type is not supported",
      },
    },
    accept,
    maxSizeInBytes,
    maxFiles = 1,
    multiple,
    onFilesChange,
    files: filesFromProps,
  } = props;

  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const filesCountHaveLeft = maxFiles - files.length;

  const zipAvailable =
    (accept?.filter((v) => v === MimeTypes[".zip"]).length || [].length) > 0;

  const canLoadMore = filesCountHaveLeft > 0 || (zipAvailable && maxFiles > 1);

  const onDrop = (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    if (acceptedFiles.length > 0) {
      if (acceptedFiles.length + files.length > maxFiles) {
        props.onFileUnaccepted({
          file: null,
          reason: "maxFiles",
          message: translationsI18n.errors.maxFiles({
            n: maxFiles,
            zipAvailable,
          }),
        });

        return;
      }

      acceptedFiles.forEach((file) => {
        setFiles((prev) => [...prev, createFileWithPreview(file)]);
      });
    }

    rejectedFiles.forEach((fileRejection) => {
      const { file, errors } = fileRejection;

      errors.forEach((error) => {
        if (error.code === ErrorCode.FileInvalidType) {
          props.onFileUnaccepted({
            file,
            reason: "fileType",
            message: translationsI18n.errors.fileType(file.type),
          });

          return;
        }

        if (maxSizeInBytes && error.code === ErrorCode.FileTooLarge) {
          props.onFileUnaccepted({
            file,
            reason: "maxFileSize",
            message: translationsI18n.errors.maxFileSize(
              formatBytes(maxSizeInBytes)
            ),
          });

          return;
        }

        if (maxFiles && error.code === ErrorCode.TooManyFiles) {
          props.onFileUnaccepted({
            file,
            reason: "maxFiles",
            message: translationsI18n.errors.maxFiles({
              n: maxFiles,
              zipAvailable,
            }),
          });

          return;
        }
      });
    });
  };

  const onRemove = (index: number | "all") => {
    if (index === "all") {
      setFiles([]);
    } else {
      setFiles((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    ...props.dropzoneProps,
    accept: accept?.reduce((prev, curr) => ({ ...prev, [curr]: [] }), {}),
    maxSize: maxSizeInBytes,
    maxFiles,
    multiple: maxFiles > 1 || multiple,
    onDrop: onDrop,
  });

  useEffect(() => {
    onFilesChange(files.map((file) => file.data));
  }, [files, onFilesChange]);

  useEffect(() => {
    if (filesFromProps) {
      setFiles((filesFromState) => {
        const filesToInternalStateFromProps = filesFromProps
          .filter(
            (fromProps) =>
              !filesFromState.some(
                (fromState) =>
                  fromState.data.name === fromProps.name &&
                  fromState.data.size === fromProps.size &&
                  fromState.data.lastModified === fromProps.lastModified
              )
          )
          .map((v) => createFileWithPreview(v));

        if (filesToInternalStateFromProps.length <= 0) return filesFromState;

        return [...filesFromState, ...filesToInternalStateFromProps];
      });
    }
    // update (sync) files (internal state) when props (external state) updates
    // do nothing when internal state changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filesFromProps]);

  // Revoke preview link
  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.previewLink));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="w-full bg-background border-2 border-input rounded-md border-dashed outline-none">
        {canLoadMore && (
          <div
            className="py-12 gap-1 text-center flex flex-col justify-center items-center cursor-pointer focus-visible:rounded-t-md focus-visible:outline-ring focus-visible:outline-2 hover:bg-accent/50"
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <p className="text-sm text-muted-foreground font-bold">
              {isDragActive
                ? translationsI18n.dropHereIsActive
                : translationsI18n.dropHereOrClick}
            </p>
            {accept && (
              <p className="text-sm text-muted-foreground">
                {translationsI18n.youCanUploadOnly(accept)}
              </p>
            )}
            {maxSizeInBytes && (
              <p className="text-sm text-muted-foreground">
                {translationsI18n.maxFileSize(formatBytes(maxSizeInBytes))}
              </p>
            )}

            {maxFiles && (
              <>
                <br />
                <p className="text-sm text-muted-foreground">
                  {translationsI18n.youCanUploadNMoreFiles(filesCountHaveLeft)}
                </p>
              </>
            )}
          </div>
        )}

        {files.length > 0 && (
          <div className={cn("space-y-2", files.length >= 2 && "pb-2")}>
            <ul
              className={cn(
                "[&>li]:border-t [&>li]:border-x-0",
                files.length >= 2 && "[&>li:last-child]:border-b",
                !canLoadMore && "[&>li:first-child]:border-t-0"
              )}
            >
              {files.map((file, index) => {
                return (
                  <li
                    key={index}
                    className="flex flex-row justify-between px-4 py-2"
                  >
                    <div className="flex flex-col justify-center">
                      <div className="text-sm">{file.data.name}</div>
                    </div>
                    <div className="flex flex-row gap-0.5 items-center">
                      <Button asChild variant="ghost" size="icon">
                        <a target="_blank" href={file.previewLink}>
                          <SquareArrowOutUpRight />
                          <span className="sr-only">
                            {translationsI18n.icons.viewFile}
                          </span>
                        </a>
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemove(index)}
                      >
                        <CircleX />
                        <span className="sr-only">
                          {translationsI18n.icons.removeFile}
                        </span>
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>

            {files.length >= 2 && (
              <div className="flex flex-row px-4 justify-end">
                <Button variant="outline" onClick={() => onRemove("all")}>
                  <Trash className="mr-2 h-5 w-5" />
                  {translationsI18n.removeAllFiles}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {}
) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate"
      ? (accurateSizes[i] ?? "Bytest")
      : (sizes[i] ?? "Bytes")
  }`;
}

export { FileUploader };
