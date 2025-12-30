"use client"

import { useEffect, useState } from "react"
import { CommandDialog, CommandEmpty, CommandInput, CommandList } from "@/components/ui/command"
import { Button } from "@/components/ui/button";
import { Loader2, TrendingUp } from "lucide-react";
import Link from "next/link";
import { searchStocks } from "@/lib/actions/finnhub.action";
import { useDebounce } from "@/hooks/useDebounce";

export default function SearchCommand({ renderAs = 'button', label = 'Add stock', initialStocks }: SearchCommandProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [stocks, setStocks] = useState<StockWithWatchlistStatus[]>(initialStocks);

  const isSearchMode = !!searchTerm.trim();
  const displayStocks = isSearchMode ? stocks : stocks?.slice(0, 10);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen(v => !v)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  useEffect(() => {
  setStocks(initialStocks);
}, [initialStocks]);

  

  const handleSearch = async () => {
  setLoading(true);

  try {
    const results = await searchStocks(
      isSearchMode ? searchTerm.trim() : undefined
    );
    setStocks(results);
  } catch {
    setStocks([]);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if (open) {
    handleSearch();
  }
}, [open]);


  const debouncedSearch = useDebounce(handleSearch, 300);

  useEffect(() => {
    debouncedSearch();
  }, [searchTerm]);

  const handleSelectStock = () => {
    setOpen(false);
    setSearchTerm("");
    setStocks(initialStocks);
  }

  return (
    <>
      {renderAs === 'text' ? (
        <span onClick={() => setOpen(true)} className="cursor-pointer hover:text-yellow-500">
          {label}
        </span>
      ) : (
        <Button onClick={() => setOpen(true)} className="cursor-pointer px-4 py-2 w-fit flex items-center gap-2 text-sm md:text-base bg-yellow-500 hover:bg-yellow-500 text-black font-medium rounded">
          {label}
        </Button>
      )}
      {open && (
    <div
      className="fixed inset-0 z-40 bg-black/40 backdrop-blur-md"
      onClick={() => setOpen(false)}
    />
  )}
      <CommandDialog open={open} onOpenChange={setOpen} className="z-50 bg-gray-800! lg:min-w-200 border-gray-600 fixed top-10 left-1/2 -translate-x-1/2 translate-y-10">
        <div className="bg-gray-800! border-b border-gray-600 relative">
          <CommandInput value={searchTerm} onValueChange={setSearchTerm} placeholder="Search stocks..." className="bg-gray-800! border-0 text-gray-400 placeholder:text-gray-500 focus:ring-0 text-base h-14 pr-10" />
          {loading && <Loader2 className="absolute right-12 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 animate-spin" />}
        </div>
        <CommandList className="bg-gray-800! max-h-[400px]  ">
           {loading ? (
              <CommandEmpty className="py-6 bg-transparent! text-center text-gray-500">Loading stocks...</CommandEmpty>
      ) : displayStocks?.length === 0 ? (
      <div className="px-5 py-2">
        {isSearchMode ? 'No results found' : 'No stocks available'}
      </div>
      ) : (
      <ul>
        <div className="py-2 px-4 text-sm font-medium text-gray-400 bg-gray-700 border-b border-gray-700">
          {isSearchMode ? 'Search results' : 'Popular stocks'}
          {` `}({displayStocks?.length || 0})
        </div>
        {displayStocks?.map((stock, i) => (
          <li key={stock.symbol} className="rounded-none my-3 px-1 w-full data-[selected=true]:bg-gray-600">
            <Link
              href={`/stocks/${stock.symbol}`}
              onClick={handleSelectStock}
              className="px-2 w-full cursor-pointer border-b border-gray-600 last:border-b-0 transition-colors flex items-center gap-3"
            >
              <TrendingUp className="h-4 w-4 text-gray-500" />
              <div className="flex-1">
                <div className="font-medium text-base text-gray-400">
                  {stock.name}
                </div>
                <div className="text-sm text-gray-500">
                  {stock.symbol} | {stock.exchange} | {stock.type}
                </div>
              </div>
              {/*<Star />*/}
            </Link>
          </li>
        ))}
      </ul>
      )
          }
    </CommandList >
      </CommandDialog >
    </>
  )
}