"use client";

import React, { useMemo, useState } from "react";
import { toast } from "sonner";

const WatchlistButton = ({
  symbol,
  company,
  isInWatchlist,
  showTrashIcon = false,
  type = "button",
  onWatchlistChange,
}: WatchlistButtonProps) => {
  const [loading, setLoading] = useState(false);

  const label = useMemo(() => {
    if (type === "icon") return "";
    return isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist";
  }, [isInWatchlist, type]);

  const handleClick = async () => {
    if (loading) return;

    setLoading(true);

    const next = !isInWatchlist;

    try {
      
      const result = await onWatchlistChange?.(symbol, next);

      if (result === false) {
        toast.error("Something went wrong. Please try again.");
        return;
      }

      toast.success(
        next
          ? `${symbol} added to watchlist`
          : `${symbol} removed from watchlist`
      );
    } catch (err) {
      console.error("WatchlistButton error:", err);
      toast.error("Failed to update watchlist");
    } finally {
      setLoading(false);
    }
  };

  if (type === "icon") {
    return (
      <button
        disabled={loading}
        title={
          isInWatchlist
            ? `Remove ${symbol} from watchlist`
            : `Add ${symbol} to watchlist`
        }
        aria-label={
          isInWatchlist
            ? `Remove ${symbol} from watchlist`
            : `Add ${symbol} to watchlist`
        }
        className={`w-fit cursor-pointer hover:bg-transparent! text-gray-400 hover:text-yellow-500 ${
          isInWatchlist ? "!text-yellow-500 hover:!text-yellow-600" : ""
        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={handleClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={isInWatchlist ? "#FACC15" : "none"}
          stroke="#FACC15"
          strokeWidth="1.5"
          className="h-16 w-16 text-gray-500 mb-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557L3.04 10.385a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345l2.125-5.111z"
          />
        </svg>
      </button>
    );
  }

  return (
    <button
      disabled={loading}
      onClick={handleClick}
      className={`text-base w-full rounded h-11 font-semibold cursor-pointer
        ${
          isInWatchlist
            ? "bg-red-500 hover:bg-red-500 text-gray-900"
            : "bg-yellow-500 hover:bg-yellow-500 text-gray-900"
        }
        ${loading ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {showTrashIcon && isInWatchlist ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 mr-2 inline"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-7 4v6m4-6v6m4-6v6"
          />
        </svg>
      ) : null}
      <span>{label}</span>
    </button>
  );
};

export default WatchlistButton;
