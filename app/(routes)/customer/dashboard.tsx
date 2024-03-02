import { Card } from "@/app/components/card/Card";
import { formatCurrency } from "@/app/utils/formatters";
import { selectCustomer } from "@/lib/features/customers/customerSlice";
import { useAppSelector } from "@/lib/hooks";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AccountDashboard } from "../accounts/[id]/AccountDashboard";

export function CustomerDashboard() {
  const customer = useAppSelector(selectCustomer);
  const [networth, setNetworth] = useState(0);

  useEffect(() => {
    if (!customer) return;

    setNetworth(() => {
      return customer.accounts.reduce((previous, value) => previous + value.balance, 0);
    });
  }, [customer]);

  if (customer && customer.accounts.length === 2) {
    return <AccountDashboard account={customer.accounts[0]} />;
  }

  return (
    <article className="flex flex-col gap-4">
      <h1 className="text-2xl">
        Welcome Back, <span className="capitalize">{customer?.first_name}</span>
      </h1>
      <Card>
        <header className="text-center flex flex-col gap-1">
          <h1 className="font-normal">Your Net Worth</h1>
          <span className="text-4xl font-bold">{formatCurrency(networth)}</span>
        </header>
      </Card>
      <div className="flex flex-col gap-2">
        <h2 className="font-bold">Banking</h2>
        <div>
          <div className="grid grid-cols-2 border border-outline rounded-t-xl px-3 py-1 bg-gray-200 font-bold">
            <div className="">Account</div>
            <div className="text-right">Balance</div>
          </div>
          {customer?.accounts.map((account: any) => {
            return (
              <Link
                href={`/customer/accounts/${account.id}`}
                key={account.id}
                className="grid grid-cols-2 border border-outline border-t-0 last:rounded-b-xl px-3 py-2 bg-white duration-300 transition-colors ease-in hover:bg-slate-100 cursor-pointer text-inherit hover:text-inherit no-underline"
              >
                <div className="">{account.name}</div>
                <div className="text-right font-bold">
                  {formatCurrency(account.balance)}&nbsp;&nbsp;&rsaquo;
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </article>
  );
}
