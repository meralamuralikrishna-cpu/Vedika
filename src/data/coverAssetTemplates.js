import { covers } from '../assets/vedika-cover-assets/src/covers/covers.js';
import { defaultVenue } from '../studio/useSceneEditor';

const coverImages = import.meta.glob('../assets/vedika-cover-assets/svg/covers/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
});

export const coverAssetTemplates = covers.map((cover) => ({
  id: `asset-${cover.id}`,
  title: cover.name,
  category: cover.category,
  theme: cover.theme,
  tags: cover.tags,
  cover: coverImages[`../assets/vedika-cover-assets/svg/covers/${cover.id}.svg`],
  venueMode: cover.floorPlanReady,
  elementCount: cover.elements.length,
  coverData: cover,
  scene: {
    name: cover.name,
    coverId: cover.id,
    coverElements: cover.elements,
    venue: { ...defaultVenue, enabled: cover.floorPlanReady },
  },
}));
