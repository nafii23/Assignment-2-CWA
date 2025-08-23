import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "LTU Assignment 1",
  description: "Front-end generator for Moodle HTML+JS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Accessible skip link */}
        <a href="#main" className="skip-link">
          Skip to main content
        </a>

        <Header />

        <main id="main" tabIndex={-1} role="main">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}

