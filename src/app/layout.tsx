import type { Metadata } from "next";
import { Bangers, Bebas_Neue, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import "./globals.css";

const bangers = Bangers({
  weight: "400",
  variable: "--font-bangers",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas-neue",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yogesh Tandan | Marvel Comic-Themed Portfolio",
  description: "An interactive, graphic-novel-inspired software engineering portfolio of Yogesh Tandan.",
  openGraph: {
    title: "Yogesh Tandan | Marvel Comic Portfolio",
    description: "An interactive, graphic-novel-inspired software engineering portfolio.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yogesh Tandan | Marvel Comic Portfolio",
    description: "An interactive, graphic-novel-inspired software engineering portfolio.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bangers.variable} ${bebasNeue.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col paper-texture bg-background text-foreground transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
