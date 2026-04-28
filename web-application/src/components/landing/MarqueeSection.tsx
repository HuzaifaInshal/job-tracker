"use client";

const ROW_1 = [
  "Google", "Apple", "Meta", "Amazon", "Netflix",
  "Stripe", "Figma", "Linear", "Vercel", "Notion",
];
const ROW_2 = [
  "Airbnb", "Shopify", "Spotify", "Uber", "Lyft",
  "Dropbox", "Atlassian", "GitHub", "Twilio", "Cloudflare",
];

function MarqueeRow({
  items,
  reverse = false,
}: {
  items: string[];
  reverse?: boolean;
}) {
  const doubled = [...items, ...items];
  return (
    <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
      <div
        className={`flex gap-10 shrink-0 ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
      >
        {doubled.map((c, i) => (
          <span
            key={i}
            className="text-sm font-semibold text-slate-500 hover:text-slate-300 transition-colors cursor-default whitespace-nowrap"
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

export function MarqueeSection() {
  return (
    <section className="relative z-10 py-14 overflow-hidden border-y border-[#1a2235]/60 bg-[#0a0d18]/60">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 mb-8">
        Track applications at companies like
      </p>
      <div className="flex flex-col gap-4">
        <MarqueeRow items={ROW_1} />
        <MarqueeRow items={ROW_2} reverse />
      </div>
    </section>
  );
}
