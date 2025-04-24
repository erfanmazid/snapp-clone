import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const iranSans = localFont({
  src: "./fonts/IRANSans.woff2",
  variable: "--font-iran-sans",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "درخواست انلاین ماشین |‌اسنپ",
  description:
    "اسنپ یک سامانه سفر انلاین است که به کاربران اجاره ماشین خود را از طریق اپلیکیشن خود را از طریق اپلیکیشن اسنپ انجام میدهد.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
        />
      </head>
      <body className={`${iranSans.variable} font-iranSans`}>
        {children}
        {<Toaster position="top-center" reverseOrder={false} />}
      </body>
    </html>
  );
}
