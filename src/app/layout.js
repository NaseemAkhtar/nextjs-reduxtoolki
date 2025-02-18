import localFont from "next/font/local";
import "./globals.css";
// import dynamic from 'next/dynamic';
import AuthProvider from "@/lib/authProvider";
import { Header } from "@/components/header";
import Providers from "@/providers";
import Footer from "@/components/footer";

// const Header =  React.lazy(() => import('@/components/header'));

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased black-bg`}
      >
        <AuthProvider>
          <Providers>
            <Header />
            {children}
            <Footer/>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
