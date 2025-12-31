import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { headers } from "next/headers";

import { connectToDatabase } from "@/database/mongoose";
import { Watchlist } from "@/database/models/watchlist.model";
import { auth } from "@/lib/better-auth/auth";
import { fetchJSON } from "@/lib/actions/finnhub.action";

/* =========================
   Finnhub config
========================= */

const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";
const FINNHUB_API_KEY =
  process.env.FINNHUB_API_KEY ||
  process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

/* =========================
   Finnhub helpers
========================= */

async function getQuote(symbol: string) {
  const url = `${FINNHUB_BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
  return fetchJSON<{
    c: number; // current price
    dp: number; // % change
  }>(url);
}

async function getMetrics(symbol: string) {
  const url = `${FINNHUB_BASE_URL}/stock/metric?symbol=${symbol}&metric=all&token=${FINNHUB_API_KEY}`;
  return fetchJSON<{
    metric?: {
      peNormalizedAnnual?: number;
      marketCapitalization?: number;
    };
  }>(url);
}

export default async function WatchlistPage() {
  /* =========================
     1. Auth
  ========================= */
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id;

  if (!userId) {
    return (
      <div className="w-full px-6 py-8 text-gray-400">
        Please sign in to view your watchlist.
      </div>
    );
  }

  /* =========================
     2. Fetch watchlist (DB truth)
  ========================= */
  await connectToDatabase();
  const items = await Watchlist.find({ userId }).lean();

  if (items.length === 0) {
    return (
      <div className="w-full px-6 py-8">
        <h1 className="text-2xl font-semibold text-white mb-4">
          Watchlist
        </h1>
        <p className="text-gray-400">
          Your watchlist is empty. Add stocks to track them here.
        </p>
      </div>
    );
  }

  /* =========================
     3. Enrich with live market data
  ========================= */
  const enriched = await Promise.all(
    items.map(async (item) => {
      try {
        const [quote, metrics] = await Promise.all([
          getQuote(item.symbol),
          getMetrics(item.symbol),
        ]);

        return {
          ...item,
          price: quote?.c ?? null,
          change: quote?.dp ?? null,
          marketCap: metrics?.metric?.marketCapitalization ?? null,
          peRatio: metrics?.metric?.peNormalizedAnnual ?? null,
        };
      } catch {
        // Fail safe: never break the page
        return {
          ...item,
          price: null,
          change: null,
          marketCap: null,
          peRatio: null,
        };
      }
    })
  );

  /* =========================
     4. Render
  ========================= */
  return (
    <div className="w-full px-6 py-8">
      <h1 className="text-2xl font-semibold text-white mb-6">
        Watchlist
      </h1>

      <div className="rounded-lg border border-gray-800 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-700">
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Change</TableHead>
              <TableHead>Market Cap</TableHead>
              <TableHead>P/E Ratio</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {enriched.map((stock) => (
              <TableRow
                key={stock.symbol}
                className="hover:bg-gray-900/60"
              >
                <TableCell className="font-medium text-white">
                  {stock.company}
                </TableCell>

                <TableCell className="text-gray-400">
                  {stock.symbol}
                </TableCell>

                <TableCell className="text-white">
                  {stock.price ? `$${stock.price.toFixed(2)}` : "—"}
                </TableCell>

                <TableCell
                  className={
                    stock.change !== null
                      ? stock.change >= 0
                        ? "text-green-400"
                        : "text-red-400"
                      : "text-gray-500"
                  }
                >
                  {stock.change !== null
                    ? `${stock.change.toFixed(2)}%`
                    : "—"}
                </TableCell>

                <TableCell className="text-gray-300">
                  {stock.marketCap
                    ? `$${stock.marketCap.toLocaleString()}`
                    : "—"}
                </TableCell>

                <TableCell className="text-gray-300">
                  {stock.peRatio
                    ? stock.peRatio.toFixed(2)
                    : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
