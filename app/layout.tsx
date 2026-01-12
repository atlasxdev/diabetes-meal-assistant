import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = "https://diabetes-meal-assistant.vercel.app";

export const metadata: Metadata = {
  title: "Diabetes Meal Assistant",
  description:
    "Get instant, AI-powered feedback on your meals to help manage your diabetes. Understand food choices, portion sizes, and get healthier alternatives.",
  icons: {
    icon: "/diabetes-meal-assistant.svg",
  },
  openGraph: {
    title: "Diabetes Meal Assistant",
    description: "AI-powered meal feedback for better diabetes management.",
    url: siteUrl,
    siteName: "Diabetes Meal Assistant",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Diabetes Meal Assistant Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Diabetes Meal Assistant",
    description: "Get instant, AI-powered feedback on your meals to help manage your diabetes.",
    images: [`${siteUrl}/og-image.png`],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Diabetes Meal Assistant",
              applicationCategory: "HealthApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
              },
            }),
          }}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
