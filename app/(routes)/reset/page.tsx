import { Card } from "@/app/components/card/Card";
import { Metadata } from "next";
import Link from "next/link";
import ResetPasswordForm from "./form";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Fun Banking | Reset Password",
  description: "Reset your Fun Banking account password",
};
export default function ResetPasswordPage() {
  return (
    <main className="container max-w-2xl">
      <Card type="outlined">
        <h1 className="text-xl">Reset Your Password</h1>
        <p>
          Know your password already? <Link href="/signin">Sign in</Link>.
        </p>
        <Suspense>
          <ResetPasswordForm />
        </Suspense>
      </Card>
    </main>
  );
}
