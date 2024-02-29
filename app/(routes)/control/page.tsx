"use client";

import { Card } from "@/app/components/card/Card";
import { BarChart } from "@/app/components/graphs/BarChart";
import { LineChart } from "@/app/components/graphs/LineChart";
import { AppConstants } from "@/app/constants/app-constants";
import { formatDate, formatNumber } from "@/app/utils/formatters";
import { GET } from "@/app/utils/http-client";
import { ChartData } from "chart.js";
import { useEffect, useState } from "react";

export default function ControlPage() {
  const [appInfo, setAppInfo] = useState<any>(null);
  const [usersByWeek, setUsersByWeek] = useState<ChartData<"line"> | null>(null);
  const [visitorsByDay, setVisitorsByDay] = useState<ChartData<"bar"> | null>(null);

  useEffect(() => {
    const fetchAppInfo = async () => {
      const response = await fetch(`${AppConstants.BACKEND_URL}/metrics`, { method: "GET" });
      const data = await response.json();

      setAppInfo(data);
    };
    fetchAppInfo();
  }, []);

  useEffect(() => {
    const fetchUsersByWeek = async () => {
      const response = await GET(`/metrics/users`);
      const data = await response.json();

      const older = data.filter((d: any) => d.week > 40);
      const newer = data
        .filter((d: any) => d.week <= 40)
        .sort((a: any, b: any) => {
          return a.week - b.week;
        });
      const sortedData = [...older, ...newer];

      setUsersByWeek({
        labels: sortedData.map((d: any) => `Week ${d.week}`),
        datasets: [
          {
            fill: true,
            label: "New Users",
            data: sortedData.map((d: any) => d.count),
            borderColor: "#94d98f",
            borderWidth: 4,
            pointRadius: 6,
            pointBackgroundColor: "#94d98f",
            backgroundColor: "#94d98f25",
            pointHoverRadius: 10,
          },
        ],
      });
    };

    fetchUsersByWeek();
  }, []);

  useEffect(() => {
    const fetchVisitors = async () => {
      const response = await GET(`/metrics/visitors`);
      const data = await response.json();

      setVisitorsByDay({
        labels: data.map((d: any) => formatDate(d.date, { year: undefined, timeZone: "UTC" })),
        datasets: [
          {
            label: "Users",
            data: data.map((d: any) => d.user_count),
            backgroundColor: "#b48fd9bb",
          },
          {
            label: "Customers",
            data: data.map((d: any) => d.customer_count),
            backgroundColor: "#8fc3d9bb",
          },
          {
            label: "Total",
            data: data.map((d: any) => d.total_count),
            backgroundColor: "#94d98fbb",
          },
        ],
      });
    };

    fetchVisitors();
  }, []);

  if (!appInfo) {
    return (
      <section>
        <h1>Application Information</h1>
        Loading...
      </section>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <section className="flex flex-col gap-4">
        <h1>Application Information</h1>
        <div className="flex gap-4 flex-wrap">
          <Card type="outlined" className="flex flex-col grow">
            <span>Users</span>
            <div className="text-2xl font-extrabold">{formatNumber(appInfo.number_of_users)}</div>
          </Card>
          <Card type="outlined" className="flex flex-col grow">
            <span>Banks</span>
            <div className="text-2xl font-extrabold">{formatNumber(appInfo.number_of_banks)}</div>
          </Card>
          <Card type="outlined" className="flex flex-col grow">
            <span>Customers</span>
            <div className="text-2xl font-extrabold">
              {formatNumber(appInfo.number_of_customers)}
            </div>
          </Card>
          <Card type="outlined" className="flex flex-col grow">
            <span>Transactions</span>
            <div className="text-2xl font-extrabold">
              {formatNumber(appInfo.number_of_transactions)}
            </div>
          </Card>
        </div>
      </section>
      <section>
        <Card type="outlined">
          <h1>New Users by Week</h1>
          {usersByWeek && <LineChart data={usersByWeek} options={{ responsive: true }} />}
        </Card>
      </section>
      <section>
        <Card type="outlined">
          <h1>Visitors Past 14 Days</h1>
          {visitorsByDay && <BarChart data={visitorsByDay} options={{ responsive: true }} />}
        </Card>
      </section>
    </div>
  );
}
