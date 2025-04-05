
import React from "react";
import { useLoan, formatCurrency } from "@/context/loan-context";
import StatCard from "./StatCard";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote, Users, RefreshCw, PiggyBank, TrendingUp } from "lucide-react";

const DashboardStats: React.FC = () => {
  const { stats } = useLoan();

  // Prepare chart data
  const loansReleasedData = stats.loansReleased.map((value, index) => ({
    month: index + 1,
    value,
  }));

  const outstandingLoansData = stats.outstandingLoans.map((value, index) => ({
    month: index + 1,
    value,
  }));

  const repaymentsCollectedData = stats.repaymentsCollected.map((value, index) => ({
    month: index + 1,
    value,
  }));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={<Banknote className="w-8 h-8 text-white" />}
          title="LOANS"
          value={stats.totalLoans}
          iconClassName="bg-credit-green-700"
        />
        <StatCard
          icon={<Users className="w-8 h-8 text-white" />}
          title="BORROWERS"
          value={stats.totalBorrowers}
          iconClassName="bg-credit-green-700"
        />
        <StatCard
          icon={<Banknote className="w-8 h-8 text-white" />}
          title="CASH DISBURSED"
          value={`$${formatCurrency(stats.cashDisbursed)}`}
          iconClassName="bg-credit-green-700"
        />
        <StatCard
          icon={<PiggyBank className="w-8 h-8 text-white" />}
          title="SAVINGS"
          value={`$${formatCurrency(stats.savings)}`}
          iconClassName="bg-credit-green-700"
        />
        <StatCard
          icon={<RefreshCw className="w-8 h-8 text-white" />}
          title="REPAID LOANS"
          value={stats.repaidLoans}
          iconClassName="bg-credit-green-700"
        />
        <StatCard
          icon={<TrendingUp className="w-8 h-8 text-white" />}
          title="CASH RECEIVED"
          value={`$${formatCurrency(stats.cashReceived)}`}
          iconClassName="bg-credit-green-700"
        />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Loans Released Monthly</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <AreaChart
              data={loansReleasedData}
              width={800}
              height={300}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorLoans" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8BC34A" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8BC34A" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" />
              <YAxis />
              <RechartsTooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#8BC34A"
                fillOpacity={1}
                fill="url(#colorLoans)"
              />
            </AreaChart>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Total Outstanding Open Loans - Monthly</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <BarChart
              data={outstandingLoansData}
              width={800}
              height={300}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="month" />
              <YAxis />
              <RechartsTooltip />
              <Bar dataKey="value" fill="#2196F3" />
            </BarChart>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Number of Repayments Collected - Monthly</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <BarChart
              data={repaymentsCollectedData}
              width={800}
              height={300}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="month" />
              <YAxis />
              <RechartsTooltip />
              <Bar dataKey="value" fill="#EA384C" />
            </BarChart>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
