export interface ArchiveArticle {
  category: string;
  title: string;
  excerpt: string;
  image: string;
  slug: string;
  href: string;
  body: string[];
}

export const archiveArticles: ArchiveArticle[] = [
  {
    category: "Botanical Profile",
    title: "The Crimson Catalyst: Hibiscus in Practice",
    excerpt:
      "Hibiscus (Japa) is a high-functioning botanical characterized by its dense concentration of anthocyanins and organic acids. Discover how these compounds provide remarkable resilience.",
    image: "/Assets/Botanical profile.webp",
    slug: "hibiscus-in-practice",
    href: "/archive/hibiscus-in-practice",
    body: [
      "Hibiscus is valued for its vivid sourness, deep crimson pigment, and cooling botanical character. In ritual practice, it brings brightness to daily infusions while supporting a feeling of clarity and refreshment.",
      "Its color comes from naturally occurring anthocyanins, the same family of plant compounds that gives many flowers and fruits their saturated red and purple tones. These compounds make hibiscus especially expressive in teas, tonics, and seasonal preparations.",
      "A thoughtful hibiscus practice is simple: steep gently, observe the color as it opens, and let the tartness become part of a steady daily rhythm.",
    ],
  },
  {
    category: "Siddha Wisdom",
    title: "The Shadow Catalyst: Siddha Wisdom and Dual Black Recovery",
    excerpt:
      "In the ancient Siddha tradition - the oldest medical lineage of South India - certain botanicals are classified as Kaya Kalpa, agents of longevity. Among these, Black Turmeric is the rarest.",
    image: "/Assets/siddha wisdom.webp",
    slug: "dual-black-recovery",
    href: "/archive/dual-black-recovery",
    body: [
      "Black Turmeric holds a distinctive place in South Indian botanical traditions. Its dark rhizome, earthy fragrance, and uncommon appearance have made it a plant associated with strength, restoration, and depth.",
      "Within Siddha-inspired practice, rare roots are approached with care rather than excess. The goal is not force, but disciplined support for the body's natural cycles of repair and renewal.",
      "Dual Black Recovery draws from this sensibility: a grounded botanical profile for moments when the body asks for steadiness, warmth, and a return to balance.",
    ],
  },
  {
    category: "Moon Rhythms",
    title: "The Lunar Pulse: Moon Rhythms and the Vitality of Herbs",
    excerpt:
      "The Moon is far more than a celestial body; it is the universal Mother of the World, the moistening principle that governs the flow of all liquids.",
    image: "/Assets/Moon Rhythms.webp",
    slug: "moon-rhythms",
    href: "/archive/moon-rhythms",
    body: [
      "Lunar thinking invites attention to moisture, timing, and subtle shifts. For many herbal traditions, the moon is a way to speak about the living pulse inside plants and people.",
      "Leaves, roots, flowers, and seeds are shaped by cycles of light, water, dormancy, and emergence. When harvest and preparation honor these cycles, a formula can feel more connected to the landscape it came from.",
      "A moon rhythm practice does not need to be elaborate. It can begin with noticing when the body wants activation, when it wants quiet, and how herbs can support that movement.",
    ],
  },
  {
    category: "Ritual Science",
    title: "The Art of Infusion",
    excerpt:
      "Explore the delicate balance of time, temperature, and botanical integrity in crafting the perfect herbal infusion.",
    image: "/Assets/art of infusion.webp",
    slug: "art-of-infusion",
    href: "/archive/art-of-infusion",
    body: [
      "Infusion is one of the oldest and most precise ways to meet a plant. Water, heat, and time draw out aromatics, color, bitterness, sweetness, and texture in different measures.",
      "Delicate flowers often ask for a gentler hand, while roots and barks can need more patience. The best cup is not always the strongest cup; it is the one that preserves the plant's character.",
      "A careful infusion practice turns preparation into attention: measure, steep, pause, and taste what has changed.",
    ],
  },
  {
    category: "Distillation",
    title: "The Science of Scent",
    excerpt:
      "Understanding how aromatic compounds interact with our nervous system to induce calm and clarity.",
    image: "/Assets/distillation.webp",
    slug: "science-of-scent",
    href: "/archive/science-of-scent",
    body: [
      "Scent is immediate. Before a botanical is tasted, its aromatic molecules can announce freshness, warmth, greenness, resin, spice, or softness.",
      "Distillation concentrates this aromatic intelligence by carrying volatile compounds through steam and condensation. The result is a material that can feel both technical and deeply sensory.",
      "In daily ritual, scent can become a cue: a quiet signal to slow down, breathe more fully, and let the nervous system recognize safety.",
    ],
  },
  {
    category: "Seasonal Rhythms",
    title: "Seasonal Rhythms",
    excerpt:
      "Aligning your daily rituals with the changing seasons to optimize vitality and well-being.",
    image: "/Assets/seasonal rhythms.webp",
    slug: "seasonal-rhythms",
    href: "/archive/seasonal-rhythms",
    body: [
      "Seasonal practice begins with the obvious: the body does not ask for the same thing every day of the year. Heat, cold, humidity, dryness, travel, rest, and work all shape what feels supportive.",
      "Botanical routines can respond to those changes. Some days call for brightness and lift; others call for warmth, grounding, and restoration.",
      "The aim is not constant reinvention, but a flexible rhythm that lets ritual remain alive through the year.",
    ],
  },
];

export function getArchiveArticle(slug: string) {
  return archiveArticles.find((article) => article.slug === slug);
}
