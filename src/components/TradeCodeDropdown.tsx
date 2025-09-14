import { useTradeCodes } from "@/lib/hooks/useStocks";
import { ChevronDown } from "lucide-react";
import React from "react";

// Basic Select Components
const SelectV2 = ({
  value,
  onValueChange,
  children,
}: {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(value);
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleValueChange = (newValue: string) => {
    setSelectedValue(newValue);
    onValueChange(newValue);
    setIsOpen(false);
    setSearchTerm(""); // reset after selection
  };

  // filter + limit items
  const filteredChildren = React.Children.toArray(children).filter((child) =>
    child.props.value?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const visibleChildren =
    searchTerm.trim() === "" ? filteredChildren.slice(0, 5) : filteredChildren;

  return (
    <div className="relative">
      <button
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>
          {selectedValue === "all" ? "All Trade Codes" : selectedValue}
        </span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
      {isOpen && (
        <div className="absolute top-full mt-1 w-full z-50 min-w-[8rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
          {/* 🔎 Search input */}
          <input
            type="text"
            placeholder="Search..."
            className="w-full mb-1 px-2 py-1 text-sm border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {visibleChildren.length > 0 ? (
            visibleChildren.map((child) =>
              React.cloneElement(child, { onSelect: handleValueChange })
            )
          ) : (
            <div className="px-2 py-1 text-sm text-muted-foreground">
              No results
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SelectItemV2 = ({
  value,
  children,
  onSelect,
}: {
  value: string;
  children: React.ReactNode;
  onSelect?: (value: string) => void;
}) => (
  <div
    className="relative flex w-full select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer"
    onClick={() => onSelect?.(value)}
  >
    {children}
  </div>
);

const CardV2 = ({
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

interface TradeCodeDropdownV2Props {
  selectedTradeCode: string;
  onTradeCodeChange: (value: string) => void;
}

export default function TradeCodeDropdown({
  selectedTradeCode,
  onTradeCodeChange,
}: TradeCodeDropdownV2Props) {
  const { data: tradeCodes, isLoading, error } = useTradeCodes();

  if (error) {
    return (
      <CardV2 className="p-4 mb-6">
        <div className="text-destructive text-sm">
          Error loading trade codes. Please try again.
        </div>
      </CardV2>
    );
  }

  return (
    <CardV2 className="p-4 mb-6">
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium min-w-fit">
          Filter by Trade Code:
        </label>
        <div className="w-[280px]">
          <SelectV2 value={selectedTradeCode} onValueChange={onTradeCodeChange}>
            <SelectItemV2 value="all">All Trade Codes</SelectItemV2>
            {isLoading ? (
              <SelectItemV2 value="">Loading trade codes...</SelectItemV2>
            ) : (
              tradeCodes?.map((code: string) => (
                <SelectItemV2 key={code} value={code}>
                  {code}
                </SelectItemV2>
              ))
            )}
          </SelectV2>
        </div>
        {selectedTradeCode !== "all" && (
          <div className="text-xs text-muted-foreground">
            Filtered by:{" "}
            <span className="font-medium">{selectedTradeCode}</span>
          </div>
        )}
      </div>
    </CardV2>
  );
}
