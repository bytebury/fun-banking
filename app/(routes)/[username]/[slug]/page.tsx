"use client";

import { Card } from "@/app/components/card/Card";
import { NonAuthenticatedGuard } from "@/app/guards/NonAuthGuard";
import { CustomerSignInForm } from "./form";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { POST } from "@/app/utils/http-client";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { banksAction, selectCurrentBank } from "@/lib/features/banks/banksSlice";
import { NoCustomerGuard } from "@/app/guards/NoCustomerGuard";

export default function BankSignInPage() {
  const { username, slug } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const bank = useAppSelector(selectCurrentBank);

  useEffect(() => {
    setIsLoading(true);

    sessionStorage.setItem("last_bank", `/${username}/${slug}`);

    const fetchBank = async () => {
      try {
        const response = await POST(`/banks`, { username, slug });

        if (response.ok) {
          const bank = await response.json();
          dispatch(banksAction.setBank(bank));
        } else {
          // TODO: GO TO 404
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBank();
  }, [username, slug, dispatch]);

  if (isLoading || !bank) {
    return (
      <NonAuthenticatedGuard>
        <main className="container max-w-2xl">
          <Card className="flex flex-col gap-4" type="outlined">
            <section>Loading Bank Information...</section>
          </Card>
        </main>
      </NonAuthenticatedGuard>
    );
  }

  return (
    <NonAuthenticatedGuard>
      <NoCustomerGuard>
        <main className="container max-w-2xl">
          <Card className="flex flex-col gap-4" type="outlined">
            <section>
              <h1 className="text-xl">Sign in to {bank.name}</h1>
              <p>{bank.description}</p>
            </section>
            <CustomerSignInForm bankId={bank.id} />
          </Card>
        </main>
      </NoCustomerGuard>
    </NonAuthenticatedGuard>
  );
}
