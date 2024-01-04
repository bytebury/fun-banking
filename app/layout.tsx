import type { Metadata } from "next";
import "./globals.scss";
import "./global_icons.css";
import { TopAppBar } from "./components/top-app-bar/TopAppBar";
import { Snackbar } from "./components/snackbar/Snackbar";

export const metadata: Metadata = {
  title: "Fun Banking | Your Online Banking Simulator",
  description:
    "Fun Banking: Experience the Ultimate Online Banking Simulator for Educators, Teachers and Families. Engage in interactive financial education, manage virtual finances, and learn banking skills in a safe, fun environment. Perfect for classrooms and home learning.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div>
          <nav>
            <TopAppBar />
          </nav>
          {children}
        </div>
        <footer>This is a footer!</footer>
        <Snackbar />
      </body>
    </html>
  );
}
