import { Noto_Sans_Thai, Nunito_Sans } from "next/font/google";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Teacher Activity System - TAS",
  description: "ระบบจัดเก็บข้อมูลกิจกรรมอาจารย์ คณะวิศวกรรมศาสตร์",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body className={`${notoSansThai.variable} ${nunitoSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
