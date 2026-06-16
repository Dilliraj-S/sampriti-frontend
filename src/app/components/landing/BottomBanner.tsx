import Image from "next/image";

export default function BottomBanner() {
  return (
    <section className="pb-8 md:pb-12">
      <div className="relative w-full aspect-[3/2] md:aspect-[16/7]">
        <Image
          src="/assets/img.webp"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>
    </section>
  );
}
