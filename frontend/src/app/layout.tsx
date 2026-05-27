import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], weight: ['400', '500', '600', '700', '800'], variable: '--font-bricolage' });

export const metadata: Metadata = {
  title: "VedaAI - Assignments",
  description: "AI Powered Assignment Generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${bricolage.variable} bg-white min-h-screen text-[#303030]`}>
        {children}
      </body>
    </html>
  );
}
