export default function OurStandards() {
  return (
    <>
      <section className="bg-white pt-24 md:pt-32 pb-0 md:pb-32 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto text-center">
          <h2
            className="text-[#111111] text-4xl md:text-5xl font-light tracking-[0.16em] mb-6 md:mb-14"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Our Standards
          </h2>

          <div className="hidden md:block">
            <img
              src="/assests/images/ourstandard.webp"
              alt="Our Standards"
              className="w-full h-auto mx-auto"
            />
          </div>
        </div>
      </section>

      <div className="block md:hidden w-full">
        <img
          src="/assests/images/Mourstandard.webp"
          alt="Our Standards"
          className="w-full h-auto"
        />
      </div>
    </>
  );
}
