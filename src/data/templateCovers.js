import { templates } from './templates';

export const AVAILABLE_TEMPLATE_COVERS = templates.filter((template) => template.cover);

const normalize = (value) => String(value ?? '')
  .split(/[\\/]/)
  .pop()
  .replace(/\.[^.]+$/, '')
  .toLowerCase()
  .replace(/[^a-z0-9]/g, '');

export function resolveTemplateCover(value) {
  const available = AVAILABLE_TEMPLATE_COVERS;
  if (!available.length) return '';
  const exact = available.find((template) => template.cover === value);
  if (exact) return exact.cover;
  const key = normalize(value);
  if (key) {
    const match = available.find((template) => [template.title, template.id].some((candidate) => normalize(candidate) === key));
    if (match) return match.cover;
  }
  return available[0].cover;
}
