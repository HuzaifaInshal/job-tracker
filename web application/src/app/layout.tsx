import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Syne } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToastProvider } from "@/components/ui/toast";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"]
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"]
});

export const metadata: Metadata = {
  title: "JobTrack — Never Lose Track of an Application",
  description:
    "The command center for your job search. Track applications, manage timelines, and land your dream job.",
  icons: {
    icon: "/favicon.svg"
  },
  openGraph: {
    title: "JobTrack — Never Lose Track of an Application",
    description:
      "The command center for your job search. Track applications, manage timelines, and land your dream job.",
    url: "https://job-tracker-e70ce.web.app",
    siteName: "JobTrack",
    images: [
      {
        url: "/static/1.png",
        width: 1920,
        height: 943,
        alt: "JobTrack Dashboard"
      },
      {
        url: "/static/2.png",
        width: 1920,
        height: 943,
        alt: "JobTrack Application Details"
      },
      {
        url: "/static/3.png",
        width: 1920,
        height: 943,
        alt: "JobTrack Timeline"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "JobTrack — Never Lose Track of an Application",
    description:
      "The command center for your job search. Track applications, manage timelines, and land your dream job.",
    images: ["/static/1.png"]
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${syne.variable} h-full dark`}
      suppressHydrationWarning
    >
      <head>
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme')||'dark';document.documentElement.classList.toggle('dark',t==='dark');})();`
          }}
        />
      </head>
      <body className="h-full bg-slate-50 dark:bg-[#080b12] transition-colors duration-200">
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>{children}</ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
