import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/shared/navbar";
import { arialRounded } from './fonts';
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NODE_ENV === 'production'
      ? 'https://when2leave.ongspace.com'
      : 'http://localhost:3000'
  ),
  title: "When2Leave",
  description: "When2Leave helps you to catch your bus so that you won't ever be late again!",
  // icons: {
  //   icon: [
  //     { url: '/favicon-16x16.png', sizes: '16x16' },
  //     { url: '/favicon-32x32.png', sizes: '32x32' },
  //     { url: '/favicon.ico' },
  //   ],
  //   apple: '/apple-touch-icon.png',
  // },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    url: 'https://when2leave.ongspace.com',
    title: "When2Leave",
    description: "When2Leave helps you to catch your bus so that you won't ever be late again!",
    // images: [
    //   {
    //     url: "https://when2leave.ongspace.com/opengraph-image.png",
    //     width: 1200,
    //     height: 630,
    //     type: 'image/png',
    //   },
    // ],
  },
  twitter: {
    title: "When2Leave",
    description: "When2Leave helps you to catch your bus so that you won't ever be late again!",
    // images: [
    //   { url: "https://when2leave.ongspace.com/opengraph-image.png", width: 1200, height: 630 },
    // ],
  },
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
