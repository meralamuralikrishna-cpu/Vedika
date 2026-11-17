import { components as batchOneComponents } from '../../vedika-new-templates/components/index.js';
import { components as batchTwoComponents } from '../../vedika-templates-batch-2/components/index.js';

export default function TemplateArt({ template, ...props }) {
  if (!template?.elements) return null;
  const components = template.componentSet === 2 ? batchTwoComponents : batchOneComponents;

  return (
    <g transform="scale(2)" {...props}>
      {template.elements.map((element) => {
        const draw = components[element.type];
        if (!draw) return null;
        return (
          <g
            key={element.id}
            data-template-element={element.id}
            dangerouslySetInnerHTML={{ __html: draw(element) }}
          />
        );
      })}
    </g>
  );
}
