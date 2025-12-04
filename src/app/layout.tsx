import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Science Olympiad Testing Portal",
  description: "Secure testing platform for Science Olympiad",
};

import { Toaster } from 'sonner';

// ... imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased min-h-screen bg-background text-foreground")}>
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
