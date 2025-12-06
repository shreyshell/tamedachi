import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Tamedachi - Gamified Media Health Tracker",
  description: "Navigate your media consumption with confidence while nurturing your virtual pet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fredoka.variable} antialiased`}
        style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
      >
        {children}
      </body>
    </html>
  );
}
