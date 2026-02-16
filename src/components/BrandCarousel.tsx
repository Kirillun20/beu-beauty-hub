import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import reuzelLogo from "@/assets/brands/reuzel.webp";
import nishmanLogo from "@/assets/brands/nishman.png";
import wahlLogo from "@/assets/brands/wahl.png";
import boystoysLogo from "@/assets/brands/boystoys.webp";
import estelLogo from "@/assets/brands/estel.png";
import layriteLogo from "@/assets/brands/layrite.avif";
import morgansLogo from "@/assets/brands/morgans.png";
import lorealLogo from "@/assets/brands/loreal.png";
import americancrewLogo from "@/assets/brands/americancrew.png";
import rascalsLogo from "@/assets/brands/rascals.png";

const brandLogos = [
  { name: "Reuzel", logo: reuzelLogo },
  { name: "Nishman", logo: nishmanLogo },
  { name: "WAHL", logo: wahlLogo },
  { name: "Boy's Toys", logo: boystoysLogo },
  { name: "Estel", logo: estelLogo },
  { name: "Layrite", logo: layriteLogo },
  { name: "Morgan's", logo: morgansLogo },
  { name: "L'Oréal", logo: lorealLogo },
  { name: "American Crew", logo: americancrewLogo },
  { name: "Rascals", logo: rascalsLogo },
];

const BrandCarousel = () => {
  const [paused, setPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const rafRef = useRef<number>();

  // Duplicate brands for seamless loop
  const items = [...brandLogos, ...brandLogos];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const speed = 0.5; // px per frame

    const animate = () => {
      if (!paused) {
        posRef.current += speed;
        // Reset when first set scrolls out
        const halfWidth = el.scrollWidth / 2;
        if (posRef.current >= halfWidth) posRef.current = 0;
        el.style.transform = `translateX(-${posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [paused]);

  return (
    <section className="py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Наши бренды-партнёры
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Официальные представители ведущих мировых брендов в Беларуси
          </p>
        </motion.div>
      </div>

      <div
        className="relative w-full"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

        <div ref={scrollRef} className="flex items-center gap-12 will-change-transform" style={{ width: "max-content" }}>
          {items.map((brand, i) => (
            <motion.div
              key={`${brand.name}-${i}`}
              whileHover={{ scale: 1.12, y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex-shrink-0 w-40 h-28 flex items-center justify-center p-4 rounded-2xl glass-card hover:glow-border transition-all duration-300 cursor-pointer group"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="max-w-full max-h-full object-contain brightness-0 invert-0 dark:invert opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                draggable={false}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandCarousel;
