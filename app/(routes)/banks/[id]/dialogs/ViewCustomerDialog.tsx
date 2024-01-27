import { Dialog } from "@/app/components/dialog/Dialog";
import { MatIcon } from "@/app/components/icons/MatIcon";
import { formatCurrency } from "@/app/utils/formatters";
import {
  customerAction,
  selectCustomer,
  selectCustomerTotalBalance,
} from "@/lib/features/customers/customerSlice";
import { dialogsAction } from "@/lib/features/dialogs/dialogsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Link from "next/link";

export function ViewCustomerDialog() {
  const dispatch = useAppDispatch();
  const customer = useAppSelector(selectCustomer);
  const customersTotalBalance = useAppSelector(selectCustomerTotalBalance);

  function closeDialog() {
    dispatch(customerAction.setCustomer(null));
    dispatch(dialogsAction.closeViewCustomer());
  }

  return (
    <Dialog>
      <header>
        <MatIcon icon="account-circle" />
        <div className="flex flex-col gap-2 items-center">
          <h1 className="capitalize">
            {customer?.first_name} {customer?.last_name}
          </h1>
          <div className="flex flex-wrap justify-center gap-2">
            <div className="pill bg-tonal border border-outline shrink-0">
              <MatIcon className="w-5 h-5" icon="wallet" />{" "}
              <strong className="hidden md:inline">Net Worth</strong>{" "}
              {formatCurrency(customersTotalBalance)}
            </div>
            <div className="pill bg-tonal border border-outline">
              <MatIcon className="w-5 h-5" icon="password" />{" "}
              <strong className="hidden md:inline">PIN</strong> {customer?.pin}
            </div>
          </div>
        </div>
      </header>
      <main>
        <section className="flex flex-col gap-3">
          <h2 className="font-extrabold">Banking</h2>
          <div>
            <div className="grid grid-cols-2 border border-outline rounded-t-xl px-3 py-1 bg-gray-200 font-bold">
              <div className="">Account</div>
              <div className="text-right">Balance</div>
            </div>
            {customer?.accounts.map((account: any) => {
              return (
                <Link
                  href={`/accounts/${account.id}`}
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
        </section>
      </main>
      <footer>
        <button className="common ghost" onClick={closeDialog}>
          Close
        </button>
      </footer>
    </Dialog>
  );
}