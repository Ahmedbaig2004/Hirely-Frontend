import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "../components/AuthProvider"; // <--- Import the wrapper
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HIRELY AI",
  description: "AI Powered Mock Interviewer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Wrap everything in the Auth Logic */}
        <AuthProvider>
            {children}
        </AuthProvider>
        <ToastContainer 
            position="bottom-right"
            theme="dark"
            autoClose={3000}
            toastStyle={{ zIndex: 99999 }} 
          />
      </body>
    </html>
  );
}