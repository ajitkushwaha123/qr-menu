import { Poppins } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/global/app-shell";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Kravy QR Menu Software",
  description:
    "Digital QR menu software for restaurants and cafes with contactless ordering, real-time menu updates, and seamless table-side experiences.",
  keywords: [
    "QR Menu Software",
    "Digital Menu",
    "Restaurant QR Code",
    "Contactless Ordering",
    "QR Menu",
    "Menu QR Code",
    "Restaurant Technology",
    "Table QR Ordering",
  ],
  authors: [{ name: "Kravy Team" }],
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  themeColor: "#000000",
  openGraph: {
    title: "Kravy QR Menu Software",
    description:
      "Create and manage a digital QR code menu, let guests scan, browse, and order from their phones, and update items anytime without reprinting.",
    url: "https://kravy.in/qr-menu",
    siteName: "Kravy QR Menu Software",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kravy QR Menu Software",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="antialiased bg-gray-50 text-gray-900">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
