import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import founderImg from "@/assets/founder.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — OKIKE" },
      { name: "description", content: "OKIKE was founded to bridge African tech talent with global opportunity. Build with us. Learn from us." },
      { property: "og:title", content: "About — OKIKE" },
      { property: "og:description", content: "Founder story and mission behind OKIKE." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          <div className="text-xs font-semibold tracking-widest uppercase text-brand">About</div>
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight max-w-[24ch] text-balance">
            Built in Africa. Engineered for the world.
          </h1>
          <p className="text-lg text-ink/70 max-w-[56ch]">
            OKIKE exists because the gap between world-class engineering and African opportunity is closing — and we want to help close it faster.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-5">
            <img
              src={founderImg}
              alt="Founder of OKIKE"
              loading="lazy"
              width={800}
              height={1000}
              className="w-full aspect-[4/5] object-cover rounded-2xl outline-1 -outline-offset-1 outline-black/5"
            />
          </div>
          <div className="md:col-span-7 flex flex-col gap-6 text-lg text-ink/80 leading-relaxed">
            <p>
              I started OKIKE because I kept seeing the same pattern: brilliant builders without the infrastructure to ship, and capable people without a clear path into the craft.
            </p>
            <p>
              By day, I build software for businesses that need it. By night and weekend, I teach the people who'll build the next decade of African tech. OKIKE is the home for both.
            </p>
            <p>
              We're small on purpose. Every project gets a senior builder. Every student gets a real mentor. Quality is not a marketing word — it's the only thing that compounds.
            </p>
            <p className="text-brand font-medium">— Founder, OKIKE</p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-secondary border-y border-ink/5 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-xs font-semibold tracking-widest uppercase text-brand mb-4">What we believe</div>
          <h2 className="text-3xl md:text-4xl font-medium mb-12 max-w-[32ch] text-balance">Three principles that guide every line of code and every lesson.</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Principle n="01" t="Quality compounds." d="Cheap work has to be done twice. We do it right the first time." />
            <Principle n="02" t="Teach what you ship." d="Our curriculum is the same stack we ship to clients. No toy examples." />
            <Principle n="03" t="People over platforms." d="Software is a means. The team behind it is the product that lasts." />
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-8">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight">Want to work with us — or learn from us?</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/book" className="bg-brand text-surface py-3 px-6 rounded-full font-medium hover:opacity-90 transition">Start a project</Link>
            <Link to="/enroll" className="bg-ink/5 text-ink py-3 px-6 rounded-full font-medium ring-1 ring-ink/5 hover:bg-ink/10 transition">Apply to academy</Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Principle({ n, t, d }: { n: string; t: string; d: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-sm text-brand font-semibold">{n}</div>
      <div className="text-xl font-medium">{t}</div>
      <p className="text-ink/60">{d}</p>
    </div>
  );
}
