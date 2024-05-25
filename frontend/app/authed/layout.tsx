import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import PlausibleProvider from "next-plausible";
import "../globals.css";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tritan Webmail",
  description:
    "You may login to a permanent email account here using your credentials.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PlausibleProvider
      domain="temp-mail.tritan.gg"
      customDomain="https://analytics.tritan.gg"
      selfHosted={true}
      trackLocalhost={true}
      trackOutboundLinks={true}
      enabled={true}
    >
      <html lang="en">
        <head>
          <link
            rel="icon"
            type="image/png"
            href="https://s3.tritan.gg/main/tritan-bot/logo.webp"
          />
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
    </PlausibleProvider>
  );
}
