import { templates } from './templates';

// Legacy starter-layout records still used by booking and event-brief flows.
export const NEW_TEMPLATES = templates.map((template) => ({
  id: template.id,
  title: template.title,
  description: `${template.category} scene with ${template.elementCount} editable elements.`,
  theme: template.theme,
  tags: template.tags,
  image: template.cover,
}));
