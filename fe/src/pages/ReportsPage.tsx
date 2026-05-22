import { useEffect, useState } from "react";
import { api, formatCurrency } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FinancialReport {
  orders: number;
  totalRevenue: number;
  totalExpense: number;
  profit: number;
}

export function ReportsPage() {
  const [report, setReport] = useState<FinancialReport | null>(null);

  useEffect(() => {
    api.get("/reports/financial").then((res) => setReport(res.data.data));
  }, []);

  const download = async (type: "pdf" | "excel") => {
    const res = await api.get(`/reports/export/${type}`, { responseType: "blob" });
    const url = URL.createObjectURL(res.data);
    const a = document.createElement("a");
    a.href = url;
    a.download = type === "pdf" ? "laporan-order.pdf" : "laporan-order.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Laporan Keuangan</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => download("pdf")}>
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => download("excel")}>
            Export Excel
          </Button>
        </div>
      </div>

      {report && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Total Order</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{report.orders}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Pendapatan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{formatCurrency(report.totalRevenue)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Pengeluaran</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{formatCurrency(report.totalExpense)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Laba</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{formatCurrency(report.profit)}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
