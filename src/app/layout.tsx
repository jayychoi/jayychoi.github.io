import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import localFont from "next/font/local";
import Header from "@/components/header";
import SearchProvider from "@/components/search-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { getSearchItems } from "@/lib/search";
import { siteConfig } from "@/lib/site";
import "@/styles/globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-quicksand",
});

const pretendard = localFont({
  src: "../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  display: "swap",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${pretendard.variable} ${quicksand.variable} antialiased`}>
        <ThemeProvider>
          <SearchProvider items={getSearchItems()}>
            <Header />
            <main className="mx-auto max-w-7xl px-6">{children}</main>
          </SearchProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
