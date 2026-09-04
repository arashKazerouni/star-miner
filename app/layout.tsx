import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import BottomNav from "@/components/navigation/BottomNav";

export const metadata: Metadata = {
  title: "XLM Farm",
  description: "XLM Farm",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          {children}
          <BottomNav />
        </UserProvider>
      </body>
    </html>
  );
}
