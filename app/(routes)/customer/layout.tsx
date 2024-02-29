import { Notice } from "@/app/components/notice/Notice";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="container max-w-3xl">
      <div className="mb-4">
        <Notice icon="warning-outline">
          <span className="text-sm">
            Fun Banking is an online banking simulator for educational purposes. Do not enter real
            bank information.
          </span>
        </Notice>
      </div>
      {children}
    </main>
  );
}
