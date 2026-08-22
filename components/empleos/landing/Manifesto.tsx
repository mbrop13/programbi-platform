"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

const TEXT = "Un CV puede decir cualquier cosa. El conocimiento, no.";

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {children}&nbsp;
    </motion.span>
  );
}

/**
 * Manifiesto tipográfico: la frase se revela palabra por palabra
 * a medida que se scrollea (estilo Apple/Linear).
 */
export default function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.5"],
  });

  const words = TEXT.split(" ");

  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8 lg:py-36">
      <div ref={ref} className="mx-auto max-w-[1100px]">
        <p className="max-w-[20ch] text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.8rem]">
          {words.map((w, i) => (
            <Word
              key={i}
              progress={scrollYProgress}
              range={[i / words.length, (i + 1) / words.length]}
            >
              {w}
            </Word>
          ))}
        </p>
        <p className="mt-8 max-w-[42ch] text-base leading-relaxed text-mute lg:text-lg">
          Por eso cada habilidad de esta bolsa llega con su certificado: quien
          contrata sabe exactamente qué sabes hacer.
        </p>
      </div>
    </section>
  );
}
