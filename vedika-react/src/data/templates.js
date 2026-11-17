// Covers live in /public/covers/<id>.png
export const CATEGORIES = ["All", "Wedding", "Haldi", "Mehendi", "Sangeet", "Reception", "Engagement", "Anniversary", "Birthday", "Baby shower", "Diwali", "Valentine's", "Dinner"];

const t = (id, title, category, palette, elements, floorPlan = false) => ({
  id, title, category, palette, elements, floorPlan,
  cover: `/covers/${id}.png`,
});

export const TEMPLATES = [
  t("royal-gold-mandap", "Royal Gold Mandap", "Wedding", "Gold & Emerald", 7, true),
  t("marigold-courtyard", "Marigold Courtyard", "Haldi", "Marigold & Cream", 5),
  t("mehendi-courtyard-bloom", "Mehendi Courtyard Bloom", "Mehendi", "Sky & Marigold", 5),
  t("sangeet-night-lights", "Sangeet Night Lights", "Sangeet", "Violet Night", 7, true),
  t("sage-garden-reception", "Sage Garden Reception", "Reception", "Sage & Ivory", 6, true),
  t("blush-arch-ceremony", "Blush Arch Ceremony", "Wedding", "Blush & Sage", 5),
  t("engagement-ring-night", "Engagement Ring Night", "Engagement", "Noir & Rose Gold", 6, true),
  t("silver-anniversary-soiree", "Silver Anniversary Soirée", "Anniversary", "Silver & Ivory", 7, true),
  t("birthday-balloon-bash", "Birthday Balloon Bash", "Birthday", "Teal & Bright Pink", 5),
  t("soft-baby-shower-garden", "Soft Baby Shower Garden", "Baby shower", "Soft Pastel", 5),
  t("diwali-glow-courtyard", "Diwali Glow Courtyard", "Diwali", "Lantern Orange & Dusk", 7, true),
  t("valentines-sweetheart-stage", "Valentine's Sweetheart Stage", "Valentine's", "Rose & Wine", 6),
  t("valentines-candlelit-dinner", "Valentine's Candlelit Dinner", "Valentine's", "Crimson & Candlelight", 5),
  t("ivory-elegance-dinner", "Ivory Elegance Dinner", "Dinner", "Ivory & Gold", 5),
];
