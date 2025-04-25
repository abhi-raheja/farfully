import '@farcaster/auth-kit/styles.css';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FarcasterAuthKitProvider } from "./components/FarcasterAuthKit";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Farfully - Farcaster TweetDeck & Scheduler",
  description: "A TweetDeck-like experience with post scheduling for Farcaster",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FarcasterAuthKitProvider>
          {children}
        </FarcasterAuthKitProvider>
      </body>
    </html>
  );
}
