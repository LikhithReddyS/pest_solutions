import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Amarnath Pest Solutions — Admin Dashboard",
  description:
    "Manage pest control projects, services, billing, and invoices for Amarnath Pest Solutions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
