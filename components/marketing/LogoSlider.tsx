"use client";

import Image from "next/image";
import { FadeIn } from "@/components/shared/AnimatedComponents";
import { companyLogos } from "@/lib/data/images";

export default function LogoSlider() {
  // Double the logos for infinite scroll
  const allLogos = [...companyLogos, ...companyLogos];

  return (
    <section className="border-y border-gray-100 bg-white py-12 lg:py-16">
      <FadeIn>
        <div className="max-w-[1200px] mx-auto px-5 text-center mb-8">
          <p className="text-sm sm:text-base font-bold text-gray-400 uppercase tracking-[0.2em] font-display">
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
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        @media (min-width: 1024px) {
          .logo-item {
            width: 260px;
            padding: 0 40px;
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
          transform: scale(1.08);
        }
        @keyframes logo-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
