import "./globals.css";
import "./world.css";
import { WorldProvider } from "@/components/world/provider";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Resanda Dezca | Product, Data & AI",
  description:
    "Product professional connecting complex operations, data, and AI. Explore work at Shopee, Unilever, Digiserve and Bukalapak.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WorldProvider />
        {children}
      </body>
    </html>
  );
}
