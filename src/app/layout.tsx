import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import localFont from "next/font/local";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
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
  title: "최재영의 개발 일지",
  description: "",
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
          <Header />
          <main className="mx-auto max-w-7xl px-6">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
