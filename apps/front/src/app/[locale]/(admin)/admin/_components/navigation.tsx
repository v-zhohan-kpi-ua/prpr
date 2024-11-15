"use client";

import { Link, usePathname } from "@/localization/navigation";
import { cn } from "@prpr/ui/lib/utils";
import { useTranslations } from "next-intl";

function NavigationAdmin() {
  const pathname = usePathname();

  const t = useTranslations("pages.admin.common.navigation");

  return (
    <nav
      className={cn(
        "grid font-medium gap-2 text-lg mt-5",
        "md:items-start md:px-4 md:mt-0 md:text-sm"
      )}
    >
      <Link
        href="/admin/moderation/f0"
        className={cn(
          "flex gap-4 mx-[-0.65rem] items-center px-3 py-2 rounded-lg transition-all",
          "md:gap-3 md:mx-0",
          pathname === "/admin/moderation/f0"
            ? "bg-muted text-foreground hover:text-foreground"
            : "bg-none text-muted-foreground hover:text-primary"
        )}
      >
        {t("moderation-f0")}
      </Link>
    </nav>
  );
}

export { NavigationAdmin };
