"use client";

import { Sheet, SheetContent, SheetTrigger } from "@prpr/ui/components/sheet";
import { NavigationAdmin } from "./navigation";
import { Button } from "@prpr/ui/components/button";
import { CircleUser, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@prpr/ui/components/dropdown-menu";
import { usePathname } from "@/localization/navigation";
import { logout } from "@/lib/back-api/admin/auth/logout";
import { useTranslations } from "next-intl";

export default function AdminClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const t = useTranslations("pages.admin.common.layout");

  if (pathname.startsWith("/admin/auth")) {
    return <>{children}</>;
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-4">
          <div className="flex h-14 items-center border-b px-4 lg:px-6"></div>
          <div className="flex-1">
            <NavigationAdmin />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:px-6 justify-between md:justify-end">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">{t("openNavigationMenu")}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <NavigationAdmin />
            </SheetContent>
          </Sheet>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">{t("openUserMenu")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => logout()}>
                {t("logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        {children}
      </div>
    </div>
  );
}
