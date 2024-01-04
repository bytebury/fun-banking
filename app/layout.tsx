import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fun Banking | Your Online Banking Simulator",
  description:
    "Fun Banking: Experience the Ultimate Online Banking Simulator for Educators, Teachers and Families. Engage in interactive financial education, manage virtual finances, and learn banking skills in a safe, fun environment. Perfect for classrooms and home learning.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div>{children}</div>
        <footer>This is a footer!</footer>
      </body>
    </html>
  );
}
