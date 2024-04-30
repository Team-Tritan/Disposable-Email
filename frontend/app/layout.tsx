import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tritan: Temporary Email",
  description: "A super simple and secure temporary email service.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          type="image/png"
          href="https://s3.tritan.gg/main/tritan-bot/logo.webp"
        />
        <script
          defer
          data-domain="temp-mail.tritan.gg"
          src="https://analytics.tritan.gg/js/script.js"
        ></script>
      </head>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <body className={inter.className}>{children}</body>
    </html>
  );
}
