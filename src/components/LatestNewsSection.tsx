import Link from "next/link";

interface NewsItem {
  id: number;
  title: string;
  date: string;
  excerpt: string;
}

interface LatestNewsSectionProps {
  news: NewsItem[];
}

export default function LatestNewsSection({ news }: LatestNewsSectionProps) {
  return (
    <div className="mb-12 border-t border-[#3a1c1c] pt-6">
      <h2
        className="text-2xl font-unbounded text-[#d0d0d0] uppercase tracking-wide mb-4"
        style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}
      >
        Latest Metal News
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {news.map((item) => (
          <div
            key={item.id}
            className="bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] p-4 rounded-lg shadow-metal border border-[#3a1c1c]"
          >
            <h3
              className="text-md font-unbounded text-[#d0d0d0]"
              style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}
            >
              {item.title}
            </h3>
            <p className="text-[#8a8a8a] font-russo text-sm">{item.date}</p>
          </div>
        ))}
      </div>
      <div className="text-center mt-4">
        <Link
          href="/news"
          className="text-[#8a4a4a] hover:text-[#d0d0d0] font-unbounded uppercase tracking-wide text-sm"
        >
          View News Archive
        </Link>
      </div>
    </div>
  );
}