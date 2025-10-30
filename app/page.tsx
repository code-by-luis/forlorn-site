"use client";

import { useState, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { Variants } from "framer-motion";

const IP = "65.108.9.141:2302";
const DISCORD_URL = "https://discord.gg/A9j5pTDu"; // TODO

// --- Types & Data -----------------------------------------------------------

// Easing curve (cubic-bezier)
const easeOutExpo = [0.16, 1, 0.3, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOutExpo } },
};

const fadeUpStrong: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOutExpo } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

type RuleSection = { title: string; items: string[] };

const RULE_SECTIONS: RuleSection[] = [
  {
    title: "General",
    items: [
      "Staff reserve the right to ban at their discretion.",
      "No meta gaming (sharing of sensitive gameplay information)",
      "Gameplay clips must be provided to staff at their request.",
      "Targeted harrassment and extreme toxicity will result in a permanent ban.",
    ],
  },
  {
    title: "Safezone",
    items: [
      "Do not camp safezones.",
      "Do not follow players out of safezones.",
      "Do not block entrances or exits.",
      "Do not take anyone elses vehicles or loot when in safezone.",
      "Vehicles left in the safezone will despawn after X hours.",
    ],
  },
  {
    title: "Support + Refund",
    items: [
      "Refunds are provided at the discretion of the staff.",
      "To be considered for a refund, full evidence must be provided (clip, screenshot).",
    ],
  },
  {
    title: "Squad",
    items: [
      "6 people can be in a group at one time.",
      "All members must wear a [TAG] in their name (see guides for how-to).",
      "Squads must not team up together to gain an advantage on other squads.",
      "Players cannot switch groups or territories. Changing teams is OK but not back and forth.",
    ],
  },
  {
    title: "PvP",
    items: [
      "No combat logging - if you have been damaged by another player, you must not log out for 10 minutes (exlcuding own base and safezones)",
    ],
  },
  {
    title: "Raiding",
    items: [
      "Base raiding hours: 20:00 FRI - 20:00 SUN (UK time).",
      "Unsecured bases can be accesed freely at any time.",
      "Do not dismantle structures (excluding flag).",
      "You can only raid a base once per weekend. A base is successfully raided when their flag is removed.",
      "Do not log out during an active raid to save loot.",
      "Do not abuse bugs or unrealistic mechanics (this needs clarification lmao wtf do i write).",
    ],
  },
  {
    title: "Raid base",
    items: [
      "Max of one raid base on map at a time.",
      "Raid bases must be built and removed during raid hours.",
      "Raid bases must be at least 1km away from the target.",
      "Raid bases are for raiding only, no PvP staging.",
    ],
  },
  {
    title: "Base Building",
    items: [
      "Staff reserve the right to remove any build that undermines fair play regardless of technical compliance.",
      "One base per team  (excluding raidbase).",
      "No glitch bases or unreachable stashes (exploits = removal).",
      "Do not block high-value spawns, military access, or map choke points.",
      "Maximum of 10 codelocked entries per base (excluding windows.)",
      "Maximum of 4 codelocked windows as entry points.",
      "No building during a raid, you must wait until 30 minutes after a C4 or sledgehammer to rebuild.",
      "No forcing raiders into animations.",
      "There must be at least 1 BBP floor of space between each door.",
      "Raidpath must have solid floor.",
      "All structures must be snapped together - no gaps.",
    ],
  },
  {
    title: "Cheats & Exploits",
    items: [
      "No cheating, glitching, duping, or third-party tools (ESP, macros).",
      "No stream sniping",
      "No network manipulation (packet loss abuse, deliberate desync) to gain advantage.",
      "Report suspected cheaters to staff with evidence where possible.",
      "Knowingly benefiting from exploits may result in penalties.",
    ],
  },
];

// --- Small UI helpers -------------------------------------------------------

function SectionDivider() {
  return (
    <div
      className="relative h-px w-full my-10 overflow-hidden border-t border-white/10"
      aria-hidden
    >
      <div className="absolute inset-0 opacity-50 bg-[radial-gradient(200px_50px_at_20%_50%,#d3181844,transparent),radial-gradient(200px_50px_at_80%_50%,#ff4d4d44,transparent)]" />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#d31818]/20 bg-white/5 p-4">
      <div className="text-2xl font-bold tracking-tight">{value}</div>
      <div className="text-xs text-zinc-400 mt-1">{label}</div>
    </div>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="rounded-2xl border border-[#d31818]/20 bg-white/5 p-5 ring-0 hover:ring-1 hover:ring-[#d31818]/30"
    >
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-zinc-300/90 mt-2">{desc}</p>
    </motion.div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#d31818]/30 bg-[#d31818]/10 px-3 py-1 text-xs text-[#ffb3b3]">
      {children}
    </span>
  );
}

function SectionCard({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="rounded-2xl border border-[#d31818]/20 bg-white/5 p-5 ring-0 hover:ring-1 hover:ring-[#ff4d4d]/30"
    >
      <h3 className="text-lg font-semibold text-[#ff6b6b]">{title}</h3>
      <ul className="mt-4 grid sm:grid-cols-2 gap-2">
        {items.map((item) => (
          <motion.li
            key={item}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25 }}
            className="rounded-xl border border-[#d31818]/20 bg-black/20 px-3 py-2 text-sm text-zinc-300/90"
          >
            {item}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}


// Animated section wrapper
function AnimatedSection({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      id={id}
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// Scroll progress bar (top of page)
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 h-[2px] origin-left z-[60] bg-gradient-to-r from-[#d31818] via-[#ff4d4d] to-[#d31818]"
    />
  );
}

// Parallax background blobs (hero) — static on mobile, parallax on md+
function ParallaxBG() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 600], [0, -40]);
  const y2 = useTransform(scrollY, [0, 600], [0, 30]);

  return (
    <>
      {/* Mobile: static layers (no transforms for jank-free render) */}
      <div className="absolute inset-0 -z-10 opacity-60 md:hidden bg-[radial-gradient(800px_400px_at_80%_-10%,#d3181833,transparent),radial-gradient(900px_500px_at_20%_10%,#ff4d4d22,transparent)]" />
      <div className="absolute inset-0 -z-10 md:hidden bg-[linear-gradient(#ffffff08_1px,transparent_1px),linear-gradient(90deg,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* md+: parallax motion layers */}
      <motion.div
        style={{ y: y1 }}
        className="absolute inset-0 -z-10 hidden md:block opacity-60 bg-[radial-gradient(800px_400px_at_80%_-10%,#d3181833,transparent),radial-gradient(900px_500px_at_20%_10%,#ff4d4d22,transparent)]"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute inset-0 -z-10 hidden md:block bg-[linear-gradient(#ffffff08_1px,transparent_1px),linear-gradient(90deg,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]"
      />
    </>
  );
}



// --- Page -------------------------------------------------------------------

export default function Page() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(IP);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className="bg-[#121212] text-white">
      <ScrollProgress />
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/50 backdrop-blur border-b border-[#d31818]/20">
        <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-6">
          <a href="#top" aria-label="FORLORN home" className="flex items-center">
            <img
              src="/forlorn_straight.svg"
              alt="FORLORN"
              style={{ height: "30px", width: "auto" }}
            />
          </a>
          <div className="ml-auto flex gap-4 text-sm">
            <a href="#about" className="hover:text-[#ff6b6b]">About</a>
            <a href="#rules" className="hover:text-[#ff6b6b]">Rules</a>
            <a href="#features" className="hover:text-[#ff6b6b]">Features</a>
            <a href="#join" className="hover:text-[#ff6b6b]">Join</a>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section
        id="top"
        className="
          relative flex items-center overflow-x-clip touch-pan-y
          min-h-[calc(100vh-4rem)]
          sm:min-h-[calc(100dvh-4rem)]
          md:min-h-[calc(100svh-4rem)]
        "
      >
        <ParallaxBG />

        <div className="mx-auto max-w-6xl w-full px-4 py-16 md:py-28 text-center">
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.div variants={fadeUp}>
              <Pill>High Loot • PvP • Raiding</Pill>
            </motion.div>

            <motion.h1 variants={fadeUp} className="sr-only">FORLORN</motion.h1>
            <motion.img
              variants={fadeUp}
              src="/forlorn_tall.svg"
              alt="FORLORN"
              className="mt-4 mx-auto block"
              style={{ height: "300px", width: "auto" }}
              loading="eager"
            />

            <motion.p variants={fadeUp} className="mt-6 text-zinc-300/90 max-w-2xl mx-auto">
              Deerisle Squad PvP
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex items-center justify-center gap-3">
              <button
                onClick={copy}
                className="rounded-2xl px-4 py-2 border border-[#d31818]/50 hover:border-[#d31818] transition"
                aria-label="Copy server IP"
                title="Copy server IP"
              >
                {copied ? "Copied!" : `Copy IP: ${IP}`}
              </button>
              <a
                href={DISCORD_URL}
                className="rounded-2xl px-4 py-2 bg-[#d31818]/90 hover:bg-[#d31818] transition text-white"
                rel="noopener noreferrer"
                target="_blank"
              >
                Join Discord
              </a>
            </motion.div>

            <motion.p variants={fadeUp} className="mt-3 text-xs text-zinc-400">
              Direct connect in DayZ using the IP & port, or search us on DZSA
            </motion.p>

            <motion.div variants={fadeUp} className="mt-10 w-full overflow-hidden">
              <div
                className="relative"
                style={{ contain: "layout" }}   // stop intrinsic width inflation on mobile
              >
                <div className="marquee inline-flex gap-6 whitespace-nowrap will-change-transform">
                  {["High Loot","PvP-Focused","Weekend Raiding","Trader Economy","Dynamic PvE","Custom Map Edits","Squad Play"].map((tag, i) => (
                    <span key={`a-${i}`} className="inline-block text-sm text-zinc-300/80">• {tag} •</span>
                  ))}
                  {["High Loot","PvP-Focused","Weekend Raiding","Trader Economy","Dynamic PvE","Custom Map Edits","Squad Play"].map((tag, i) => (
                    <span key={`b-${i}`} className="inline-block text-sm text-zinc-300/80">• {tag} •</span>
                  ))}
                </div>
              </div>

              <style jsx>{`
                .marquee { animation: marquee 20s linear infinite; }
                @keyframes marquee {
                  from { transform: translateX(0); }
                  to   { transform: translateX(-50%); }
                }
              `}</style>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <AnimatedSection id="about" className="relative mx-auto max-w-6xl px-4 py-24">
        <div className="absolute inset-0 -z-10 opacity-30 bg-[radial-gradient(1000px_600px_at_10%_20%,#d3181822,transparent),radial-gradient(1000px_600px_at_90%_40%,#ff4d4d22,transparent)]" />

        <div className="grid lg:grid-cols-[1.2fr,1fr] gap-10 items-start">
          <div>
            <motion.h2 variants={fadeUpStrong} className="text-3xl md:text-4xl font-bold mt-4">
              About Forlorn
            </motion.h2>

            <motion.p variants={fadeUpStrong} className="mt-4 text-zinc-300/90 text-lg leading-relaxed">
              <span className="font-semibold">Forlorn</span> is a high-loot, PvP-first DayZ server where survival stays simple and the
              fights stay intense. Gear up fast- then dive into firefights, ambushes, and full-scale raids. Weekend raiding and
              squad-based basebuilding keep the stakes high, while rare <span className="italic">tappers</span> reward those who earn
              them. Dynamic PvE encounters, infected zones, and AI threats keep the world alive, backed by a custom trader economy
              and unique map edits with fresh POIs and hidden stashes to fight over.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Stat label="Loot Rate" value="High" />
              <Stat label="Raiding Window" value="Fri–Sun" />
              <Stat label="Squad Size" value="6" />
            </motion.div>

            <motion.ul variants={fadeUp} className="mt-8 grid sm:grid-cols-2 gap-2 text-sm">
              {[
                "Guns spawn loaded & clean",
                "Casual → hardcore PvP",
                "Survival made simple",
                "Weekend raiding",
                "One-shot tappers (rare)",
                "Dynamic PvE & AI",
                "Trader & custom economy",
                "Custom POIs & stashes",
              ].map((item) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25 }}
                  className="rounded-xl border border-[#d31818]/20 bg-white/5 px-3 py-2 text-zinc-300/90"
                >
                  {item}
                </motion.li>
              ))}
            </motion.ul>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Feature title="PvP-Centric" desc="Designed for firefights, ambushes, and all-out warfare. Built for both casual and hardcore players." />
            <Feature title="Trader Economy" desc="Buy, sell, and gear up quickly with a custom economy tuned for constant action." />
            <Feature title="Dynamic PvE" desc="Infected zones, AI threats, and events keep the island alive between raids." />
            <Feature title="Custom Map Edits" desc="Overhauled POIs and hidden stashes create new hotspots and flanking routes." />
          </div>
        </div>
      </AnimatedSection>

      <SectionDivider />

      <AnimatedSection id="rules" className="relative mx-auto max-w-6xl px-4 py-24">
        <h2 className="text-3xl font-bold">Rules</h2>
        <p className="mt-3 text-zinc-400">
          These rules are designed to ensure fair play and a happy playerbase. Staff reserve the right to punish anything
          that is deemed to break the spirit of these rules, even if compliant by some loophole or technicality.
          If you are unsure about anything, please ask a member of staff.
        </p>

        <div className="mt-8 columns-1 md:columns-2 gap-4">
          {RULE_SECTIONS.map(({ title, items }) => (
            <details
              key={title}
              className="group mb-4 break-inside-avoid rounded-2xl border border-[#d31818]/20 bg-white/5"
            >
              <summary className="cursor-pointer select-none list-none px-6 py-5 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#ff6b6b]">{title}</h3>
                <span className="ml-4 text-zinc-400 transition group-open:rotate-180">⌄</span>
              </summary>

              <ul className="px-6 pb-6 list-disc pl-6 space-y-2 text-zinc-300/90">
                {items.map((rule, i) => (
                  <li key={i}>{rule}</li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </AnimatedSection>

      <SectionDivider />

      {/* Mods & Features */}
      <AnimatedSection id="features" className="relative mx-auto max-w-6xl px-4 py-24">
        <h2 className="text-3xl font-bold">Mods & Features</h2>
        <p className="mt-2 text-zinc-400">A quick look at what Forlorn runs.</p>

        <div className="mt-6 grid lg:grid-cols-2 gap-6">
          <SectionCard
            title="Expansion Features"
            items={[
              "Parties",
              "Map Markers",
              "Banking",
              "Airdrops",
              "AIs",
              "Traders",
              "Quickmark",
            ]}
          />

          <SectionCard
            title="Survival"
            items={[
              "Slower Metabolism",
              "Infinite Running",
              "Easy Terrain Scaling",
            ]}
          />

          <SectionCard
            title="PvP"
            items={[
              "Hitmarkers",
              "PITSTOP Weapons",
            ]}
          />

          <SectionCard
            title="Building + Raiding"
            items={[
              "BaseBuildingPlus",
              "Codelocks",
              "Breaching Charges",
            ]}
          />

          <SectionCard
            title="Other Cool Stuff"
            items={[
              "Red Falcon Vehicles",
              "MMG Clothing",
              "CJ Lootchests",
            ]}
          />
        </div>
      </AnimatedSection>

      <SectionDivider />

      {/* Join */}
      <AnimatedSection id="join" className="relative mx-auto max-w-6xl px-4 py-24">
        <h2 className="text-3xl font-bold">Join the Server</h2>
        <ol className="mt-4 list-decimal pl-5 text-zinc-300/90 space-y-2">
          <li>Open DayZ → Select Direct Connect.</li>
          <li>
            Paste <span className="font-mono">65.108.9.141</span>.
          </li>
          <li>Or just search FORLORN on DZSA launcher!.</li>
        </ol>
        <div className="mt-6">
          <a
            href={DISCORD_URL}
            className="inline-block rounded-2xl px-5 py-2 bg-[#d31818]/90 hover:bg-[#d31818] transition text-white"
            rel="noopener noreferrer"
            target="_blank"
          >
            Join Discord
          </a>
        </div>
      </AnimatedSection>

      <SectionDivider />

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-zinc-400">
          © {year} FORLORN · Hosted by derwydd
        </div>
      </footer>

      {/* Subtle global accent particles */}
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-20">
        <div className="absolute top-1/3 left-1/5 size-40 rounded-full bg-[#d31818] blur-3xl" />
        <div className="absolute bottom-10 right-10 size-52 rounded-full bg-[#ff4d4d] blur-3xl" />
      </div>
    </div>
  );
}
