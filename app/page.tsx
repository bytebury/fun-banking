import Link from "next/link";
import { Card } from "./components/card/Card";
import { MatIcon } from "./components/icons/MatIcon";
import { Notice } from "./components/notice/Notice";
import { NonAuthenticatedGuard } from "./guards/NonAuthGuard";
import { AppConstants } from "./constants/app-constants";
import { formatKs } from "./utils/formatters";
import { NoCustomerGuard } from "./guards/NoCustomerGuard";
import Image from "next/image";

async function getAppInfo() {
  const response = await fetch(`${AppConstants.BACKEND_URL}/metrics`, { method: "GET" });
  return response.json();
}

export default async function Home() {
  const appInfo = await getAppInfo();

  return (
    <NonAuthenticatedGuard>
      <NoCustomerGuard>
        <main className="flex flex-col gap-4">
          <section className="pb-8">
            <div className="flex flex-col gap-8 container items-center">
              <div className="w-fit max-w-2xl">
                <Notice icon="warning-outline">
                  <span className="text-sm">
                    Fun Banking is an online simulator. Do not enter real banking information into
                    our website.
                  </span>
                </Notice>
              </div>
              <section className="flex flex-col gap-4 text-center items-center max-w-2xl">
                <h1 className="text-4xl font-extrabold">Where Money Makes Cents</h1>
                <p className="text-xl">
                  Empowering families, teachers and organizations to raise financial wizards through
                  interactive banking simulations.
                </p>
                <Link className="common filled w-fit text-lg" href="signup">
                  <MatIcon icon="savings-outline" />
                  Get Started Today
                </Link>
                <span className="text-xs text-gray-600">
                  No credit card needed &bull; Unlimited time on free plan
                </span>
              </section>
            </div>
          </section>
          <div className="container max-w-3xl">
            <Image
              src="/app_screenshot.webp"
              alt="Fun Banking Application Screenshot"
              className="rounded-[20px] border-[12px] border-white shadow"
              width={768}
              height={600}
            />
          </div>
          <section className="flex flex-col gap-2 container max-w-4xl py-8">
            <h1 className="text-3xl">What is Fun Banking?</h1>
            <p>
              Fun Banking is an innovative online banking simulator designed to provide an engaging
              and informative platform for individuals to learn about the intricacies of banking.
              It&apos;s a unique educational/record keeping tool that combines the practicality of
              financial management contained in the security of a simulation.
            </p>
          </section>
          <div className="container grid grid-cols-1 md:grid-cols-2 max-w-4xl gap-4">
            <Card>
              <h1 className="flex items-center gap-2 text-xl">
                <MatIcon className="text-primary" icon="savings-outline" />
                Be The Banker
              </h1>
              Fun Banking tailors the banking experience to suit different age groups and learning
              objectives. Create your bank&apos;s name and mission statement with ease from scratch.
            </Card>
            <Card>
              <h1 className="flex items-center gap-2 text-xl">
                <MatIcon className="text-primary" icon="diversity-3" />
                Support Customers
              </h1>
              Manage your customers by approving or denying their pending transactions. You have
              complete control while they learn. You can even create transactions on their behalf.
              Try enhancing learning through strategic decision-making and service offerings.
            </Card>
            <Card>
              <h1 className="flex items-center gap-2 text-xl">
                <MatIcon className="text-primary" icon="checkbook-outline" />
                Experience Banking
              </h1>
              Conduct a variety of financial transactions, including deposits, withdrawals, and
              transfers. Get hands-on experience with interest calculations, loan disbursements, and
              investment management (coming soon). Learn the impact of financial decisions in a
              risk-free, simulated environment.
            </Card>
            <Card>
              <h1 className="flex items-center gap-2 text-xl">
                <MatIcon className="text-primary" icon="person-play-outline" />
                Master Banking Through Play
              </h1>
              Keep the experience engaging and interactive with your customers. Although we are a
              banking simulator; try to create real-world incentives, such as reward programs.
            </Card>
          </div>
          <section className="flex flex-col gap-6 container py-8 max-w-4xl items-center">
            <h2 className="text-3xl font-extrabold text-center text-primary">We Are Serving</h2>
            <div className="flex flex-wrap gap-8">
              <div className="flex flex-col items-center grow">
                <p className="text-3xl font-extrabold">{formatKs(appInfo.number_of_users)}</p>
                <span className="font-bold">Users</span>
              </div>
              <div className="flex flex-col items-center grow">
                <p className="text-3xl font-extrabold">{formatKs(appInfo.number_of_customers)}</p>
                <span className="font-bold">Customers</span>
              </div>
              <div className="flex flex-col items-center grow">
                <p className="text-3xl font-extrabold">{formatKs(appInfo.number_of_banks)}</p>
                <span className="font-bold">Banks</span>
              </div>
              <div className="flex flex-col items-center grow">
                <p className="text-3xl font-extrabold">
                  {formatKs(appInfo.number_of_transactions)}
                </p>
                <span className="font-bold">Transactions</span>
              </div>
            </div>
          </section>
          <section className="w-full bg-tonal py-8">
            <div className="container max-w-4xl flex flex-col gap-2">
              <div>
                <span className="font-extrabold text-primary text-xl">On the Move</span>
                <h3 className="text-3xl font-extrabold">Fun Banking On The Go</h3>
              </div>
              <p>
                We believe in learning on the go! Fun Banking is fully optimized for mobile devices,
                allowing learners to access their virtual banks and financial simulations anytime,
                anywhere. Whether you&apos;re on a smartphone, tablet, or computer, our platform
                ensures a seamless learning experience across all devices. Empower financial
                education on your terms - be it at home, in the classroom, or on the move! Try it
                for yourself on your mobile phone, tablet, or desktop.
              </p>
            </div>
          </section>
          <section className="flex flex-col items-center container max-w-4xl py-8">
            <div className="text-pink-400 mb-6">
              <MatIcon className="w-20 h-20" icon="favorite" />
            </div>
            <p>
              Fun Banking was born from a partnership with special education teachers, aiming to
              cultivate a rewarding experience for students while imparting essential banking
              skills. While initially designed for maintaining a student rewards program, the
              versatility of Fun Banking extends far beyond, opening up limitless possibilities.
            </p>
          </section>
        </main>
      </NoCustomerGuard>
    </NonAuthenticatedGuard>
  );
}
