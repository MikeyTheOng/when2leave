import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/shared/navbar";
import { arialRounded } from './fonts';
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased ${arialRounded.variable} font-rounded`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <main className="h-screen">
              <Navbar />
              {children}
            </main>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
