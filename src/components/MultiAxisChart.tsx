import { BarChart3, TrendingUp } from "lucide-react";
import React from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
  >
    {children}
  </div>
);

interface Stock {
  id: number;
  date: string;
  trade_code: string;
  high: string;
  low: string;
  open: string;
  close: string;
  volume: number;
}

interface MultiAxisChartProps {
  stocks: Stock[];
  selectedTradeCode: string;
}

export default function MultiAxisChart({
  stocks,
  selectedTradeCode,
}: MultiAxisChartProps) {
  // Prepare chart data
  const chartData = React.useMemo(() => {
    return stocks
      .slice()
      .reverse() // Show chronological order
      .map((stock, index) => ({
        date: new Date(stock.date).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
        }),
        fullDate: stock.date,
        close: parseFloat(stock.close),
        volume: Number(stock.volume),
        high: parseFloat(stock.high),
        low: parseFloat(stock.low),
        open: parseFloat(stock.open),
        index,
      }))
      .slice(-30); // Show last 30 data points for better visualization
  }, [stocks]);

  // Calculate statistics
  const stats = React.useMemo(() => {
    if (chartData.length === 0) return null;

    const prices = chartData.map((d) => d.close);
    const volumes = chartData.map((d) => d.volume);

    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      avgPrice: prices.reduce((a, b) => a + b, 0) / prices.length,
      totalVolume: volumes.reduce((a, b) => a + b, 0),
      priceChange:
        chartData.length > 1
          ? chartData[chartData.length - 1].close - chartData[0].close
          : 0,
    };
  }, [chartData]);

  if (!stocks || stocks.length === 0) {
    return (
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Price & Volume Chart
        </h3>
        <div className="text-center py-8 text-muted-foreground">
          No data available to display chart
          {selectedTradeCode !== "all" && (
            <p className="mt-2">Try selecting a different trade code</p>
          )}
        </div>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{`Date: ${label}`}</p>
          {payload.map((entry, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.dataKey === "close" ? "Close Price" : "Volume"}:{" "}
              {entry.dataKey === "volume"
                ? entry.value.toLocaleString()
                : entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Price & Volume Chart
          {selectedTradeCode !== "all" && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({selectedTradeCode})
            </span>
          )}
        </h3>

        {stats && (
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <span>Records: {stocks.length}</span>
            </div>
            <div
              className={`flex items-center space-x-1 ${
                stats.priceChange >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              <span>
                Change: {stats.priceChange >= 0 ? "+" : ""}
                {stats.priceChange.toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-xs">
          <div className="text-center p-2 bg-muted rounded">
            <div className="font-medium">Min Price</div>
            <div className="text-sm">{stats.minPrice.toFixed(2)}</div>
          </div>
          <div className="text-center p-2 bg-muted rounded">
            <div className="font-medium">Max Price</div>
            <div className="text-sm">{stats.maxPrice.toFixed(2)}</div>
          </div>
          <div className="text-center p-2 bg-muted rounded">
            <div className="font-medium">Avg Price</div>
            <div className="text-sm">{stats.avgPrice.toFixed(2)}</div>
          </div>
          <div className="text-center p-2 bg-muted rounded">
            <div className="font-medium">Total Volume</div>
            <div className="text-sm">{stats.totalVolume.toLocaleString()}</div>
          </div>
        </div>
      )}

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              opacity={0.3}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              angle={-45}
              textAnchor="end"
              height={60}
              interval={Math.floor(chartData.length / 8)}
            />
            <YAxis
              yAxisId="price"
              orientation="left"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              domain={["dataMin - 0.1", "dataMax + 0.1"]}
            />
            <YAxis
              yAxisId="volume"
              orientation="right"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />

            {/* Volume bars */}
            <Bar
              yAxisId="volume"
              dataKey="volume"
              fill="hsl(var(--chart-2))"
              opacity={0.6}
              name="Volume"
              radius={[2, 2, 0, 0]}
            />

            {/* Close price line */}
            <Line
              yAxisId="price"
              type="monotone"
              dataKey="close"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={{
                fill: "hsl(var(--chart-1))",
                strokeWidth: 2,
                r: 3,
              }}
              activeDot={{
                r: 5,
                fill: "hsl(var(--chart-1))",
              }}
              name="Close Price"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-xs text-muted-foreground text-center">
        * Showing last {chartData.length} records{" "}
        {chartData.length === 30 ? "(limited for performance)" : ""}
      </div>
    </Card>
  );
}
