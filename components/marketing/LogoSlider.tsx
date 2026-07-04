"use client";

import Image from "next/image";
import { FadeIn } from "@/components/shared/AnimatedComponents";
import { companyLogos } from "@/lib/data/images";

export default function LogoSlider({ transparent = false }: { transparent?: boolean }) {
  // Double the logos for infinite scroll
  const allLogos = [...companyLogos, ...companyLogos];

  return (
    <section className={`${transparent ? 'bg-transparent' : 'bg-white'} py-10 lg:py-14 border-y border-slate-100/80`}>
      <FadeIn>
        <div className="max-w-7xl mx-auto px-5 text-center mb-8">
          <p className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-[0.25em] font-display">
            Empresas que confían en nosotros
          </p>
        </div>
      </FadeIn>

      <div className="logo-slider">
        <div className="logo-track">
          {allLogos.map((logo, i) => (
            <div key={`${logo.name}-${i}`} className="logo-item">
              <Image
                src={logo.url}
                alt={logo.name}
                width={180}
                height={70}
                className="logo-img"
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .logo-slider {
          width: 100%;
          position: relative;
          overflow: hidden;
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
        .logo-track {
          display: flex;
          width: max-content;
          animation: logo-scroll 40s linear infinite;
        }
        .logo-slider:hover .logo-track {
          animation-play-state: paused;
        }
        .logo-item {
          width: 180px;
          padding: 0 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        @media (min-width: 1024px) {
          .logo-item {
            width: 260px;
            padding: 0 25px;
          }
        }
        .logo-item :global(.logo-img) {
          filter: grayscale(100%);
          opacity: 0.4;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          max-height: 50px;
          width: auto;
          object-fit: contain;
        }
        @media (min-width: 1024px) {
          .logo-item :global(.logo-img) {
            max-height: 70px;
          }
        }
        .logo-item:hover :global(.logo-img) {
          filter: grayscale(0%);
          opacity: 1;
          transform: scale(1.06);
        }
        @keyframes logo-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
