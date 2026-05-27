const iconProps = {
  className: "h-11 w-11 text-[#72736E]",
  fill: "none",
  stroke: "currentColor",
  viewBox: "0 0 64 64",
  strokeWidth: "2.25",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const standards = [
  {
    label: "Ethically Sourced",
    icon: (
      <svg {...iconProps}>
        <path d="M32 20.9l-2.9-3a9.5 9.5 0 00-13.4 13.4L32 47.5l16.3-16.2a9.5 9.5 0 00-13.4-13.4l-2.9 3z" />
        <path d="M18.5 31.5c4.1-3.3 8.3-2.7 12.2 1.5l4.1 4.5" />
        <path d="M35 37.4l5.8-5.8c1.9-1.8 4.4-1.8 6.3.1" />
        <path d="M24.6 28.1l11.8 11.8" />
        <path d="M23 38.1c2.5 1.3 5.6 1.2 9.1-.4" />
      </svg>
    ),
  },
  {
    label: "Clean Formulations",
    icon: (
      <svg {...iconProps}>
        <path d="M32 10.5S19.8 26.6 19.8 39.1a12.2 12.2 0 1024.4 0C44.2 26.6 32 10.5 32 10.5z" />
      </svg>
    ),
  },
  {
    label: "Dosage-Specific",
    icon: (
      <svg {...iconProps}>
        <path d="M28.8 13.7h6.4c1.1 0 2 .9 2 2v12.1h12.1c1.1 0 2 .9 2 2v6.4c0 1.1-.9 2-2 2H37.2v12.1c0 1.1-.9 2-2 2h-6.4c-1.1 0-2-.9-2-2V38.2H14.7c-1.1 0-2-.9-2-2v-6.4c0-1.1.9-2 2-2h12.1V15.7c0-1.1.9-2 2-2z" />
      </svg>
    ),
  },
  {
    label: "Small-Batch Crafted",
    icon: (
      <svg {...iconProps}>
        <path d="M18.6 51.5V32.1a13.4 13.4 0 0126.8 0v19.4" />
        <path d="M24.2 51.5V32.1a7.8 7.8 0 0115.6 0v19.4" />
        <path d="M32 24.3v27.2" />
        <path d="M14.7 51.5h34.6" />
      </svg>
    ),
  },
  {
    label: "No Additives",
    icon: (
      <svg {...iconProps}>
        <circle cx="32" cy="32" r="18.4" />
        <path d="M25.2 32.4l4.3 4.4 9.2-9.3" />
      </svg>
    ),
  },
  {
    label: "No Animal Testing",
    icon: (
      <svg {...iconProps}>
        <path d="M15.1 31.4c.2 11 7.5 18.6 16.9 18.6s16.7-7.6 16.9-18.6" />
        <path d="M18.2 24.1c0-3.5 2.2-5.8 5-5.8s5 2.3 5 5.8" />
        <path d="M35.8 24.1c0-3.5 2.2-5.8 5-5.8s5 2.3 5 5.8" />
        <path d="M22.2 36.1c2.4 3.8 5.8 5.6 9.8 5.6s7.4-1.8 9.8-5.6" />
      </svg>
    ),
  },
  {
    label: "Vegan",
    icon: (
      <svg {...iconProps}>
        <path d="M32 50.7V28.4" />
        <path d="M32 35.9c-8.7 0-14-4.9-15.7-14.5 9.5-1.8 14.7 3 15.7 14.5z" />
        <path d="M32 31.4c8.7 0 14-4.9 15.7-14.5-9.5-1.8-14.7 3-15.7 14.5z" />
        <path d="M20.8 50.7h22.4" />
      </svg>
    ),
  },
  {
    label: "Gluten-Free",
    icon: (
      <svg {...iconProps}>
        <path d="M22.8 12.5c8.8 8.5 15 22.9 23.7 39" />
        <path d="M41.2 12.5c-8.8 8.5-15 22.9-23.7 39" />
        <path d="M15.3 12.2l33.4 39.6" />
      </svg>
    ),
  },
];

export default function OurStandards() {
  return (
    <section className="bg-white py-24 md:py-32 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto text-center">
        <h2
          className="text-[#111111] text-4xl md:text-5xl font-light tracking-[0.16em] mb-24 md:mb-28"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Our Standards
        </h2>

        <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-4 lg:grid-cols-8 lg:gap-x-10">
          {standards.map((item, i) => (
            <div
              key={item.label}
              className="flex min-h-36 flex-col items-center justify-start"
            >
              <div className="mb-14 flex h-12 items-center justify-center">
                {item.icon}
              </div>
              <p className="text-[#6F6A64] text-[15px] tracking-[0.08em] leading-relaxed">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
