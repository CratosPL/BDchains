"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;

      setIsLoading(true);
      try {
        const response = await fetch(`/api/bands/search?query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error("Failed to fetch search results");
        const data = await response.json();
        setResults(data);
      } catch (err) {
        setError("Error loading search results");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <main className="text-[#b0b0b0] font-russo bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] min-h-screen">
      <div className="pt-24 pb-10">
        <section className="container mx-auto px-6 max-w-7xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-unbounded text-[#d0d0d0] uppercase tracking-wide text-center" style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}>
            Search Results for "{query}"
          </h1>

          {isLoading ? (
            <p className="text-[#8a8a8a] text-center">Loading...</p>
          ) : error ? (
            <p className="text-[#8a4a4a] text-center">{error}</p>
          ) : results.length === 0 ? (
            <p className="text-[#8a8a8a] text-center">No bands found for "{query}".</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((band) => (
                <div key={band.id} className="bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] p-4 rounded-lg shadow-metal border border-[#3a1c1c]">
                  <div className="w-full h-[200px] mb-2 bg-[#2a2a2a] rounded-lg overflow-hidden">
                    <img
                      src={band.logo_url || "/images/default-band.jpg"}
                      alt={band.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h2 className="text-lg font-unbounded text-[#d0d0d0] text-center" style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}>
                    {band.name}
                  </h2>
                  <div className="text-center mt-2">
                    <Link href={`/band/${band.id}`} className="text-[#8a4a4a] hover:text-[#d0d0d0] font-unbounded uppercase tracking-wide text-sm">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-6">
            <Link href="/encyclopedia" className="text-[#8a4a4a] hover:text-[#d0d0d0] font-unbounded uppercase tracking-wide text-sm">
              Back to Encyclopedia
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}