"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { NetWorthHistory } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { format, parse } from 'date-fns';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

type NetWorthChartProps = {
  history: NetWorthHistory[];
};

const chartConfig = {
  netWorth: {
    label: "Net Worth",
    color: "hsl(var(--chart-1))",
  },
};

export default function NetWorthChart({ history }: NetWorthChartProps) {
  const chartData = history.map(item => ({
    month: format(parse(item.date, 'yyyy-MM', new Date()), 'MMM yy'),
    netWorth: item.value,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Net Worth Growth</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatCurrency(Number(value)).replace('₹', '₹ ')}
              width={80}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />} />
            <defs>
              <linearGradient id="fillNetWorth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-netWorth)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-netWorth)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              dataKey="netWorth"
              type="monotone"
              fill="url(#fillNetWorth)"
              stroke="var(--color-netWorth)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
