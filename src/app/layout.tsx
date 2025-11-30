import "./globals.css";
import { ReactNode } from "react";
import NavBar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Amarante, Lato, Open_Sans } from "next/font/google";
import { UserProvider } from "./context/UserContext";

const amarante = Amarante({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-amarante",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-lato",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-opensans",
});

export const metadata = {
  title: "Handcrafted Haven",
  description: "Unique, artisanal pieces made just for you.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${amarante.variable} ${lato.variable} ${openSans.variable}`}
    >
      <body className={openSans.className}>
        <UserProvider>
          <NavBar />
          <main>{children}</main>
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}
