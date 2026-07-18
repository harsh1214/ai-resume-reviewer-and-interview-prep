import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import AuthProvider from "@/components/AuthProvider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "AI Resume Reviewer & Interview Coach",
    description: "Get AI-powered resume analysis and interview preparation",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
            <body>
                <Toaster richColors />
                <Navbar />
                <main className="min-h-full transition-colors duration-300">
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </main>
                <Footer />
            </body>
        </html>
    );
}
