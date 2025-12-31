'use server';

import { connectToDatabase } from '@/database/mongoose';
import { Watchlist } from '@/database/models/watchlist.model';
import { searchStocks } from '@/lib/actions/finnhub.action';
import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';

/* ===========================
   DO NOT TOUCH (as requested)
=========================== */
export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
  if (!email) return [];

  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');

    const user = await db
      .collection('user')
      .findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

    if (!user) return [];

    const userId = (user.id as string) || String(user._id || '');
    if (!userId) return [];

    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
    return items.map((i) => String(i.symbol));
  } catch (err) {
    console.error('getWatchlistSymbolsByEmail error:', err);
    return [];
  }
}

/* ===========================
   FIXED WRITE ACTIONS
=========================== */

export async function addToWatchlistByUserId(
  userId: string,
  symbol: string,
  company: string
) {
  if (!userId || !symbol) {
    return { success: false, action: 'added' as const };
  }

  try {
    await connectToDatabase();

    await Watchlist.updateOne(
      { userId, symbol },
      {
        $setOnInsert: {
          userId,
          symbol,
          company,
          addedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return { success: true, action: 'added' as const };
  } catch (err) {
    console.error('addToWatchlistByUserId error:', err);
    return { success: false, action: 'added' as const };
  }
}

export async function removeFromWatchlistByUserId(
  userId: string,
  symbol: string
) {
  if (!userId || !symbol) {
    return { success: false, action: 'removed' as const };
  }

  try {
    await connectToDatabase();

    await Watchlist.deleteOne({ userId, symbol });

    return { success: true, action: 'removed' as const };
  } catch (err) {
    console.error('removeFromWatchlistByUserId error:', err);
    return { success: false, action: 'removed' as const };
  }
}

/* ===========================
   SEARCH OVERLAY (SAFE)
=========================== */

export async function searchStocksWithWatchlist(query?: string) {
  const stocks = await searchStocks(query);
  if (!stocks || stocks.length === 0) return stocks;

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const email = session?.user?.email;
    if (!email) return stocks;

    const watchlistSymbols = await getWatchlistSymbolsByEmail(email);
    const watchlistSet = new Set(watchlistSymbols.map((s) => s.toUpperCase()));

    return stocks.map((stock) => ({
      ...stock,
      isInWatchlist: watchlistSet.has(stock.symbol),
    }));
  } catch (err) {
    console.error('watchlist overlay failed, falling back:', err);
    return stocks;
  }
}
