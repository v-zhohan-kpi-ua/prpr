"use client";

import {
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@prpr/ui/components/dropdown-menu";
import { locales } from "../../../localization/config";
import { Button } from "@prpr/ui/components/button";
import { Languages } from "lucide-react";
import { usePathname, useRouter } from "../../../localization/navigation";

export default function LanguageChanger({
  translation,
}: {
  translation: {
    header: {
      changeLang: string;
      langs: {
        uk: string;
        en: string;
      };
    };
  };
}) {
  const router = useRouter();
  const pathname = usePathname();

  const changeLang = (lang: (typeof locales)[number]) => {
    router.replace(pathname, { locale: lang });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label={translation.header.changeLang}
        >
          <Languages className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          <span className="sr-only">{translation.header.changeLang}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLang("uk")}>
          {translation.header.langs.uk}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLang("en")}>
          {translation.header.langs.en}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
