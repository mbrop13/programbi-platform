import Image from "next/image";
import { logos } from "@/lib/data/site";

export default function LogoSlider() {
  const loop = [...logos, ...logos];

  return (
    <section id="empresas-logos" className="border-y border-line bg-wash/40 py-8 lg:py-10">
      <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="logo-track">
          {loop.map((logo, i) => (
            <div
              key={`${logo.name}-${i}`}
              className="flex h-14 w-44 shrink-0 items-center justify-center px-6 lg:h-16 lg:w-52"
            >
              <Image
                src={logo.src}
                alt={logo.name}
                width={160}
                height={48}
                className="max-h-8 w-auto object-contain opacity-50 grayscale lg:max-h-10"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
