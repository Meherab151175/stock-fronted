import LoadingSpinner from "@/components/LoadingSpinner";
import MultiAxisChart from "@/components/MultiAxisChart";
import EditableTable from "@/components/Stock-Table";
import TradeCodeDropdown from "@/components/TradeCodeDropdown";
import { useStocks } from "@/lib/hooks/useStocks";
import {
  Activity,
  BarChart3,
  DollarSign,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";

// Basic UI Components
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

const Badge = ({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
}) => {
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline:
      "text-foreground border border-input hover:bg-accent hover:text-accent-foreground",
  };

  return (
    <div
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variantClasses[variant]} ${className}`}
    >
      {children}
    </div>
  );
};

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

// Statistics Cards Component
const StatsCards = ({
  stocks,
  selectedTradeCode,
}: {
  stocks: Stock[];
  selectedTradeCode: string;
}) => {
  const stats = React.useMemo(() => {
    if (!stocks || stocks.length === 0) {
      return {
        totalVolume: 0,
        avgPrice: 0,
        lastPrice: 0,
        priceChange: 0,
        priceChangePercent: 0,
        highestPrice: 0,
        lowestPrice: 0,
        totalRecords: 0,
      };
    }

    const totalVolume = stocks.reduce(
      (sum, stock) => sum + Number(stock.volume),
      0
    );

    const prices = stocks.map((stock) => parseFloat(stock.close));
    const avgPrice =
      prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const highestPrice = Math.max(...prices);
    const lowestPrice = Math.min(...prices);

    const lastPrice =
      stocks.length > 0 ? parseFloat(stocks[0]?.close || "0") : 0;
    const previousPrice =
      stocks.length > 1 ? parseFloat(stocks[1]?.close || "0") : lastPrice;
    const priceChange = lastPrice - previousPrice;
    const priceChangePercent =
      previousPrice !== 0 ? (priceChange / previousPrice) * 100 : 0;

    return {
      totalVolume,
      avgPrice,
      lastPrice,
      priceChange,
      priceChangePercent,
      highestPrice,
      lowestPrice,
      totalRecords: stocks.length,
    };
  }, [stocks]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Latest Price */}
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
            <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-300" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-muted-foreground">
              Latest Price
            </p>
            <div className="flex items-center space-x-2">
              <p className="text-2xl font-bold">{stats.lastPrice.toFixed(2)}</p>
              {stats.priceChange !== 0 && (
                <Badge
                  variant={stats.priceChange > 0 ? "default" : "destructive"}
                  className="text-xs"
                >
                  {stats.priceChange > 0 ? "+" : ""}
                  {stats.priceChangePercent.toFixed(2)}%
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Average Price */}
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
            <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-300" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-muted-foreground">
              Average Price
            </p>
            <p className="text-2xl font-bold">{stats.avgPrice.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              H: {stats.highestPrice.toFixed(2)} | L:{" "}
              {stats.lowestPrice.toFixed(2)}
            </p>
          </div>
        </div>
      </Card>

      {/* Total Volume */}
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center">
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
            <Activity className="h-5 w-5 text-purple-600 dark:text-purple-300" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-muted-foreground">
              Total Volume
            </p>
            <p className="text-2xl font-bold">
              {stats.totalVolume.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Across {stats.totalRecords} records
            </p>
          </div>
        </div>
      </Card>

      {/* Records Count */}
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center">
          <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-full">
            <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-300" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-muted-foreground">
              Total Records
            </p>
            <p className="text-2xl font-bold">
              {stats.totalRecords.toLocaleString()}
            </p>
            {selectedTradeCode !== "all" && (
              <Badge variant="outline" className="text-xs mt-1">
                {selectedTradeCode}
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

// Main Home Page Component
export default function HomePage() {
  const [selectedTradeCode, setSelectedTradeCode] = useState("all");
  const tradeCodeFilter =
    selectedTradeCode === "all" ? undefined : selectedTradeCode;

  // Fetch stocks with filtering
  const {
    data: stocks = [],
    isLoading,
    error,
  } = useStocks(0, 1500, tradeCodeFilter);
  // const { data, isLoading, error } = useStocks(0, 1500, tradeCodeFilter);

  // const { data, isLoading, error } = useStocks(0, 1500, tradeCodeFilter);

  // Flatten data pages safely
  // const stocks = React.useMemo(() => data?.pages?.flat() ?? [], [data]);

  const handleTradeCodeChange = (value: string) => {
    setSelectedTradeCode(value);
  };

  // Error state
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
              <TrendingDown className="h-8 w-8 text-red-600 dark:text-red-300" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-destructive mb-2">
                Error Loading Stock Data
              </h3>
              <p className="text-muted-foreground mb-4">
                Unable to fetch stock market data. Please check your connection
                and try again.
              </p>
              <Badge variant="destructive">API Connection Failed</Badge>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Loading state
  if (isLoading && !stocks.length) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <div className="h-8 bg-muted rounded mb-2 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
        </div>
        <LoadingSpinner message="Loading stock market data..." size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Stock Market Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">
              Monitor and analyze stock market data with real-time charts and
              detailed analytics
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              Live Data
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {new Date().toLocaleDateString()}
            </Badge>
          </div>
        </div>
      </div>

      {/* Trade Code Filter */}
      <TradeCodeDropdown
        selectedTradeCode={selectedTradeCode}
        onTradeCodeChange={handleTradeCodeChange}
      />

      {/* Loading indicator for data refresh */}
      {isLoading && stocks.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span className="text-sm">Updating data...</span>
          </div>
        </Card>
      )}

      {/* Statistics Cards */}
      <StatsCards stocks={stocks} selectedTradeCode={selectedTradeCode} />

      {/* Chart */}
      <MultiAxisChart stocks={stocks} selectedTradeCode={selectedTradeCode} />

      {/* Data Table */}
      <EditableTable
        stocks={stocks}
        isLoading={isLoading}
        selectedTradeCode={selectedTradeCode}
      />

      {/* Footer */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>📊 Stock Market Dashboard</span>
            <span>•</span>
            <span>Real-time data analysis</span>
            <span>•</span>
            <span>Interactive charts & tables</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {stocks.length} Records Loaded
            </Badge>
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
