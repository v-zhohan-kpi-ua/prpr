"use client";

import { login } from "@/lib/back-api/admin/auth/login";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@prpr/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@prpr/ui/components/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@prpr/ui/components/form";
import { LoadingIcon } from "@prpr/ui/components/icons/loading";
import { Input } from "@prpr/ui/components/input";
import { AxiosError } from "axios";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { toast } from "@prpr/ui/components/sonner";

const AdminAuthLoginFormSchema = (
  t: ReturnType<
    typeof useTranslations<"pages.admin.auth.login">
  > = (() => {}) as any
) =>
  yup.object({
    username: yup.string().required(t("form.fields.username.errors.required")),
    password: yup.string().required(t("form.fields.password.errors.required")),
  });

type AdminAuthLoginFormValues = yup.InferType<
  ReturnType<typeof AdminAuthLoginFormSchema>
>;

export function AdminAuthLoginForm() {
  const t = useTranslations("pages.admin.auth.login");

  const formSchema = AdminAuthLoginFormSchema(t);

  const form = useForm<AdminAuthLoginFormValues>({
    resolver: yupResolver(formSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: AdminAuthLoginFormValues) => {
    setIsLoading(true);

    try {
      await login(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          toast.error(t("form.errors.invalidCredentials"));
        }
      }
    }

    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{t("form.title")}</CardTitle>
        <CardDescription>{t("form.description")}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
            {/* username */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.fields.username.label")}</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder={t("form.fields.username.placeholder")}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.fields.password.label")}</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder={t("form.fields.password.placeholder")}
                      type="password"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button disabled={isLoading} className="w-full" type="submit">
              {isLoading ? (
                <div className="h-5 w-5">
                  <LoadingIcon />
                  <span className="sr-only">{t("form.actions.loading")}</span>
                </div>
              ) : (
                t("form.actions.submit")
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
