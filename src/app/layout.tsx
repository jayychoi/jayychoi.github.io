import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
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
      <body className={`${quicksand.className} antialiased`}>
        <ThemeProvider>
          <Header />
          <main className="mx-auto max-w-7xl px-6">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
