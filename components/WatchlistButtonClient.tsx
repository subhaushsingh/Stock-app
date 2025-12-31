"use client";

import WatchlistButton from "@/components/WatchlistButton";
import {
  addToWatchlistByUserId,
  removeFromWatchlistByUserId,
} from "@/lib/actions/watchlist.action";

interface Props {
  symbol: string;
  company: string;
  userId?: string;
  isInWatchlist: boolean;
}

export default function WatchlistButtonClient({
  symbol,
  company,
  userId,
  isInWatchlist,
}: Props) {
  if (!userId) {
    return (
      <WatchlistButton
        symbol={symbol}
        company={company}
        isInWatchlist={false}
      />
    );
  }

  return (
    <WatchlistButton 
      symbol={symbol}
      company={company}
      isInWatchlist={isInWatchlist}
      onWatchlistChange={async (symbol, add) => {
        if (!userId) return;

        if (add) {
          await addToWatchlistByUserId(userId, symbol, company);
        } else {
          await removeFromWatchlistByUserId(userId, symbol);
        }
      }}
    />
  );
}
