"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";
import { LoadingIcon } from "@prpr/ui/components/icons/loading";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      hotkey={["F8"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:py-5 group-[.toaster]:px-5 group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:focus:outline-none group-[.toaster]:focus:ring-2 group-[.toaster]:focus:ring-ring group-[.toaster]:focus:ring-offset-2",
          title: "group-[.toast]:text-sm",
          icon: "group-[.toast]:h-7 group-[.toast]:w-7 [&>svg]:h-full [&>svg]:w-full [&_.sonner-loader]:h-full [&_.sonner-loader]:w-full",
          description:
            "group-[.toast]:text-muted-foreground group-[.toast]:text-sm",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      icons={{
        loading: <LoadingIcon />,
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
