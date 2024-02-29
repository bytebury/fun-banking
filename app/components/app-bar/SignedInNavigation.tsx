"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MatIcon } from "../icons/MatIcon";
import { useAuth } from "@/app/guards/AuthContext";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Dispatch, useEffect } from "react";
import {
  fetchApprovals,
  selectPendingApprovals,
} from "@/lib/features/pending-transactions/pendingTransactionsSlice";
import { selectCurrentUser } from "@/lib/features/users/usersSlice";
import { UserRole } from "@/lib/models/User";

type SignedInNavigationProps = { closeDrawer: () => void };

export function SignedInNavigation({ closeDrawer }: SignedInNavigationProps) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const pendingTransactions = useAppSelector(selectPendingApprovals);
  const { signout } = useAuth();
  const fetchInterval = 30_000;

  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(fetchApprovals());
    }, fetchInterval);

    dispatch(fetchApprovals());
    return () => clearInterval(intervalId);
  }, [dispatch]);

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <section className="flex gap-2 items-center">
        {/*eslint-disable-next-line @next/next/no-img-element*/}
        <img
          src={user.avatar}
          alt="avatar picture"
          className="w-16 h-16 rounded-full border-[5px] border-white bg-white"
        />
        <div className="flex flex-col gap-0">
          <h2 className="font-extrabold text-lg capitalize leading-tight">
            {user.first_name} {user.last_name}
          </h2>
          <p className="text-gray-600">@{user.username}</p>
        </div>
      </section>
      <ul>
        <li>
          <Link
            href="/dashboard"
            className={`${pathname === "/dashboard" ? "active" : ""}`}
            onClick={closeDrawer}
          >
            <div>
              <MatIcon icon="dashboard-outline" />
              Dashboard
            </div>
          </Link>
        </li>
        <li>
          <Link
            href="/approvals"
            className={`${pathname === "/approvals" ? "active" : ""}`}
            onClick={closeDrawer}
          >
            <div>
              <MatIcon icon="inactive-order-outline" />
              Pending Approvals
            </div>
            <aside>{pendingTransactions.length}</aside>
          </Link>
        </li>
        <li>
          <Link
            href={`/profile/${user.username}`}
            className={`${pathname.includes("/profile/") ? "active" : ""}`}
            onClick={closeDrawer}
          >
            <div>
              <MatIcon icon="account-circle" />
              Profile
            </div>
          </Link>
        </li>
        {user.role === UserRole.Admin && (
          <li>
            <details>
              <summary>
                <div>
                  <MatIcon icon="terminal" />
                  Control Panel
                </div>
              </summary>
              <ul>
                <li>
                  <Link
                    href={`/control`}
                    className={`${pathname === "/control" ? "active" : ""}`}
                    onClick={closeDrawer}
                  >
                    <div>
                      <MatIcon icon="analytics-outline" />
                      Application Info
                    </div>
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/control/users`}
                    className={`${pathname === "/control/users" ? "active" : ""}`}
                    onClick={closeDrawer}
                  >
                    <div>
                      <MatIcon icon="manage-accounts-outline" />
                      Manage Users
                    </div>
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/control/announcements`}
                    className={`${pathname.includes("/control/announcements") ? "active" : ""}`}
                    onClick={closeDrawer}
                  >
                    <div>
                      <MatIcon icon="brand-awareness-outline" />
                      Announcements
                    </div>
                  </Link>
                </li>
              </ul>
            </details>
          </li>
        )}
        <li>
          <details>
            <summary>
              <div>
                <MatIcon icon="settings-outline" />
                Settings
              </div>
            </summary>
            <ul>
              <li>
                <Link
                  href={`/settings/profile`}
                  className={`${pathname === "/settings/profile" ? "active" : ""}`}
                  onClick={closeDrawer}
                >
                  <div>
                    <MatIcon icon="settings-account-box-outline" />
                    Profile
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  href={`/settings/security`}
                  className={`${pathname === "/settings/security" ? "active" : ""}`}
                  onClick={closeDrawer}
                >
                  <div>
                    <MatIcon icon="security" />
                    Security
                  </div>
                </Link>
              </li>
            </ul>
          </details>
        </li>
        <li>
          <button
            onClick={() => {
              closeDrawer();
              signout();
            }}
          >
            <div>
              <MatIcon icon="logout" />
              Logout
            </div>
          </button>
        </li>
      </ul>
    </div>
  );
}
