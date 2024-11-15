import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@prpr/ui/globals.css";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { GoToMainContent } from "./_components/accessability-go-to-main-content";
import { getTranslations } from "next-intl/server";
import { DarkModeThemeProvider } from "./_components/dark-mode";
import { Header } from "./_components/header";
import { Footer } from "./_components/footer";
import { Toaster } from "@prpr/ui/components/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "common" });

  return {
    title: t("app.name.long"),
    description: t("app.name.long"),
  };
}

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <html lang={locale}>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <DarkModeThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster
            containerAriaLabel={t("toast.sectionLabel")}
            visibleToasts={5}
            gap={8}
          />
          <GoToMainContent />

          {/* header + main + footer */}
          <div className="flex flex-col justify-between min-h-screen">
            <Header />
            <main className="flex justify-center items-center" id="main">
              {children}
            </main>
            <Footer />
          </div>
        </DarkModeThemeProvider>
      </body>
    </html>
  );
}
