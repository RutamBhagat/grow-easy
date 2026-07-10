import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "GrowEasy",
  description: "Manage and import CRM leads.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geist.variable}>
      <body>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            {children}
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
