import { useDeleteStock, useUpdateStock } from "@/lib/hooks/useStocks";
import {
  ChevronLeft,
  ChevronRight,
  Edit2,
  Save,
  Search,
  SortAsc,
  SortDesc,
  Trash2,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

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

const Button = ({
  children,
  className = "",
  variant = "default",
  size = "default",
  onClick,
  disabled = false,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "destructive" | "ghost" | "secondary";
  size?: "default" | "sm" | "icon" | "lg";
  onClick?: () => void;
  disabled?: boolean;
}) => {
  const baseClasses =
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  };
  const sizeClasses = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    icon: "h-10 w-10",
    lg: "h-11 rounded-md px-8",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const Input = ({
  value,
  onChange,
  type = "text",
  className = "",
  placeholder = "",
  step,
  disabled = false,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  className?: string;
  placeholder?: string;
  step?: string;
  disabled?: boolean;
}) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    placeholder={placeholder}
    step={step}
    disabled={disabled}
  />
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

// Table components
const Table = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`w-full ${className}`}>
    <div className="relative w-full overflow-auto">
      <table className="w-full caption-bottom text-sm">{children}</table>
    </div>
  </div>
);

const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead className="[&_tr]:border-b bg-muted/50">{children}</thead>
);

const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody className="[&_tr:last-child]:border-0">{children}</tbody>
);

const TableRow = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <tr
    className={`border-b transition-colors hover:bg-muted/30 data-[state=selected]:bg-muted ${className}`}
  >
    {children}
  </tr>
);

const TableHead = ({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => (
  <th
    className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${
      onClick ? "cursor-pointer hover:bg-muted/50" : ""
    } ${className}`}
    onClick={onClick}
  >
    {children}
  </th>
);

const TableCell = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}>
    {children}
  </td>
);

interface Stock {
  id: number;
  date: string;
  trade_code: string;
  high: string;
  low: string;
  open: string;
  close: string;
  volume: string;
}

interface EditableTableProps {
  stocks: Stock[];
  isLoading: boolean;
  selectedTradeCode: string;
}

type SortField = keyof Stock | null;
type SortOrder = "asc" | "desc";

export default function EditableTable({
  stocks,
  isLoading,
  selectedTradeCode,
}: EditableTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Stock | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const updateMutation = useUpdateStock();
  const deleteMutation = useDeleteStock();

  // Filter and sort stocks
  const filteredAndSortedStocks = React.useMemo(() => {
    const filtered = stocks.filter(
      (stock) =>
        stock.trade_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.date.includes(searchTerm) ||
        stock.open.includes(searchTerm) ||
        stock.high.includes(searchTerm) ||
        stock.low.includes(searchTerm) ||
        stock.close.includes(searchTerm) ||
        stock.volume.includes(searchTerm)
    );

    if (sortField) {
      filtered.sort((a, b) => {
        let aVal: string | number = a[sortField] as string;
        let bVal: string | number = b[sortField] as string;

        // Convert to numbers for numeric fields
        if (["open", "high", "low", "close"].includes(sortField)) {
          aVal = parseFloat(aVal);
          bVal = parseFloat(bVal);
        } else if (sortField === "volume") {
          aVal = parseInt(aVal.replace(/,/g, ""));
          bVal = parseInt(bVal.replace(/,/g, ""));
        } else if (sortField === "date") {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        }

        if (sortOrder === "asc") {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    }

    return filtered;
  }, [stocks, searchTerm, sortField, sortOrder]);

  // Pagination calculations
  const totalItems = filteredAndSortedStocks.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  // const paginatedStocks = filteredAndSortedStocks.slice(startIndex, endIndex);
  // const paginatedStocks = data?.pages.flat() ?? [];
  const paginatedStocks = filteredAndSortedStocks.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedTradeCode, searchTerm, sortField, sortOrder]);

  const handleSort = (field: keyof Stock) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field: keyof Stock) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? (
      <SortAsc className="h-3 w-3 ml-1" />
    ) : (
      <SortDesc className="h-3 w-3 ml-1" />
    );
  };

  const handleEdit = (stock: Stock) => {
    setEditingId(stock.id);
    setEditData({ ...stock });
  };

  const handleSave = () => {
    if (editData) {
      updateMutation.mutate({
        id: editData.id,
        stock: editData,
      });
      setEditingId(null);
      setEditData(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData(null);
  };

  // const handleDelete = (id: number) => {
  //   if (window.confirm("Are you sure you want to delete this stock record?")) {
  //     deleteMutation.mutate(id);
  //   }
  // };

  const handleDelete = (id: number) => {
    toast("Are you sure you want to delete this stock?", {
      action: (
        <button
          onClick={() => {
            deleteMutation.mutate(id, {
              onSuccess: () => toast.success("Deleted successfully!"),
              onError: () => toast.error("Failed to delete!"),
            });
          }}
        >
          Delete
        </button>
      ),
      onDismiss: () => toast.dismiss(),
    });
  };

  const handleInputChange = (field: keyof Stock, value: string) => {
    if (editData) {
      setEditData({ ...editData, [field]: value });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const getPriceChangeColor = (current: string, previous?: string) => {
    if (!previous) return "";
    const curr = parseFloat(current);
    const prev = parseFloat(previous);
    if (curr > prev) return "text-green-600";
    if (curr < prev) return "text-red-600";
    return "";
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <div className="text-muted-foreground">Loading table data...</div>
          </div>
        </div>
      </Card>
    );
  }

  if (!stocks || stocks.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Stock Data</h3>
          <Badge variant="secondary">0 records</Badge>
        </div>
        <div className="text-center py-12 text-muted-foreground">
          <div className="mb-2">📊 No stock data available</div>
          {selectedTradeCode !== "all" && (
            <p className="text-sm">
              Try selecting a different trade code or "All Trade Codes"
            </p>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      {/* Header with stats and controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
        <div className="flex items-center space-x-4">
          <div>
            <h3 className="text-lg font-semibold flex items-center">
              Stock Data
              <Badge variant="secondary" className="ml-2">
                {totalItems.toLocaleString()} records
              </Badge>
            </h3>
            {selectedTradeCode !== "all" && (
              <p className="text-sm text-muted-foreground mt-1">
                Filtered by:{" "}
                <Badge variant="outline">{selectedTradeCode}</Badge>
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64"
            />
          </div>

          {/* Items per page */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-muted-foreground whitespace-nowrap">
              Show:
            </label>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="border rounded-md px-3 py-2 text-sm bg-background h-10 min-w-[80px]"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                onClick={() => handleSort("date")}
                className="cursor-pointer hover:bg-muted/50"
              >
                <div className="flex items-center">
                  Date {getSortIcon("date")}
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort("trade_code")}
                className="cursor-pointer hover:bg-muted/50"
              >
                <div className="flex items-center">
                  Trade Code {getSortIcon("trade_code")}
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort("open")}
                className="text-right cursor-pointer hover:bg-muted/50"
              >
                <div className="flex items-center justify-end">
                  Open {getSortIcon("open")}
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort("high")}
                className="text-right cursor-pointer hover:bg-muted/50"
              >
                <div className="flex items-center justify-end">
                  High {getSortIcon("high")}
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort("low")}
                className="text-right cursor-pointer hover:bg-muted/50"
              >
                <div className="flex items-center justify-end">
                  Low {getSortIcon("low")}
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort("close")}
                className="text-right cursor-pointer hover:bg-muted/50"
              >
                <div className="flex items-center justify-end">
                  Close {getSortIcon("close")}
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort("volume")}
                className="text-right cursor-pointer hover:bg-muted/50"
              >
                <div className="flex items-center justify-end">
                  Volume {getSortIcon("volume")}
                </div>
              </TableHead>
              <TableHead className="w-32 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedStocks.map((stock, index) => {
              const previousStock =
                index > 0 ? paginatedStocks[index - 1] : undefined;

              return (
                <TableRow
                  key={stock.id}
                  className={editingId === stock.id ? "bg-muted/50" : ""}
                >
                  <TableCell>
                    {editingId === stock.id ? (
                      <Input
                        type="date"
                        value={editData?.date || ""}
                        onChange={(e) =>
                          handleInputChange("date", e.target.value)
                        }
                        className="w-full min-w-[140px]"
                      />
                    ) : (
                      <div className="font-mono text-sm">{stock.date}</div>
                    )}
                  </TableCell>

                  <TableCell>
                    {editingId === stock.id ? (
                      <Input
                        value={editData?.trade_code || ""}
                        onChange={(e) =>
                          handleInputChange("trade_code", e.target.value)
                        }
                        className="w-full min-w-[120px]"
                      />
                    ) : (
                      <Badge variant="outline" className="font-medium">
                        {stock.trade_code}
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    {editingId === stock.id ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={editData?.open || ""}
                        onChange={(e) =>
                          handleInputChange("open", e.target.value)
                        }
                        className="w-full min-w-[80px] text-right"
                      />
                    ) : (
                      <div
                        className={`font-mono font-medium ${getPriceChangeColor(
                          stock.open,
                          previousStock?.open
                        )}`}
                      >
                        {stock.open}
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    {editingId === stock.id ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={editData?.high || ""}
                        onChange={(e) =>
                          handleInputChange("high", e.target.value)
                        }
                        className="w-full min-w-[80px] text-right"
                      />
                    ) : (
                      <div className="font-mono font-medium text-green-600">
                        {stock.high}
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    {editingId === stock.id ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={editData?.low || ""}
                        onChange={(e) =>
                          handleInputChange("low", e.target.value)
                        }
                        className="w-full min-w-[80px] text-right"
                      />
                    ) : (
                      <div className="font-mono font-medium text-red-600">
                        {stock.low}
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    {editingId === stock.id ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={editData?.close || ""}
                        onChange={(e) =>
                          handleInputChange("close", e.target.value)
                        }
                        className="w-full min-w-[80px] text-right"
                      />
                    ) : (
                      <div
                        className={`font-mono font-bold ${getPriceChangeColor(
                          stock.close,
                          previousStock?.close
                        )}`}
                      >
                        {stock.close}
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    {editingId === stock.id ? (
                      <Input
                        value={editData?.volume || ""}
                        onChange={(e) =>
                          handleInputChange("volume", e.target.value)
                        }
                        className="w-full min-w-[100px] text-right"
                      />
                    ) : (
                      <div className="font-mono text-sm text-muted-foreground">
                        {stock.volume}
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="text-center">
                    <div className="flex justify-center space-x-1">
                      {editingId === stock.id ? (
                        <>
                          <Button
                            size="icon"
                            variant="default"
                            onClick={handleSave}
                            disabled={updateMutation.isPending}
                            className="h-8 w-8"
                          >
                            <Save className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={handleCancel}
                            className="h-8 w-8"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEdit(stock)}
                            className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete(stock.id)}
                            disabled={deleteMutation.isPending}
                            className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
          <div className="flex items-center text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
            {totalItems.toLocaleString()} entries
            {searchTerm && (
              <Badge variant="secondary" className="ml-2">
                Filtered
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-9 px-3"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page =
                  currentPage <= 3
                    ? i + 1
                    : currentPage >= totalPages - 2
                    ? totalPages - 4 + i
                    : currentPage - 2 + i;

                if (page < 1 || page > totalPages) return null;

                return (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="h-9 w-9"
                  >
                    {page}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-9 px-3"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Footer stats */}
      <div className="mt-4 pt-4 border-t text-xs text-muted-foreground text-center">
        {searchTerm && `Search: "${searchTerm}" • `}
        {sortField && `Sorted by ${sortField} (${sortOrder}) • `}
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </Card>
  );
}
