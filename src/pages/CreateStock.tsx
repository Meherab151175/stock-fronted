"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateStock } from "@/lib/hooks/useStocks";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function CreateStockPage() {
  const navigate = useNavigate();
  const { mutate: createStock, isPending } = useCreateStock();
  const [form, setForm] = useState({
    date: "",
    trade_code: "",
    high: "",
    low: "",
    open: "",
    close: "",
    volume: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // convert types
    const payload = {
      ...form,
      high: parseFloat(form.high),
      low: parseFloat(form.low),
      open: parseFloat(form.open),
      close: parseFloat(form.close),
      volume: parseInt(form.volume, 10),
    };

    createStock(payload, {
      onSuccess: () => {
        toast.success("Stock created successfully!");
        setForm({
          date: "",
          trade_code: "",
          high: "",
          low: "",
          open: "",
          close: "",
          volume: "",
        });
        navigate("/");
      },
      onError: () => toast.error("Failed to create stock."),
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background text-foreground p-4">
      <Card className="w-full max-w-lg border-border shadow-md">
        <CardHeader>
          <CardTitle>Create Stock</CardTitle>
          <CardDescription>
            Add a new stock entry to your database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="trade_code">Trade Code</Label>
              <Input
                type="text"
                name="trade_code"
                placeholder="AAPL"
                value={form.trade_code}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="high">High</Label>
                <Input
                  type="number"
                  step="0.01"
                  name="high"
                  value={form.high}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="low">Low</Label>
                <Input
                  type="number"
                  step="0.01"
                  name="low"
                  value={form.low}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="open">Open</Label>
                <Input
                  type="number"
                  step="0.01"
                  name="open"
                  value={form.open}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="close">Close</Label>
                <Input
                  type="number"
                  step="0.01"
                  name="close"
                  value={form.close}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="volume">Volume</Label>
                <Input
                  type="number"
                  name="volume"
                  value={form.volume}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Creating..." : "Create Stock"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
