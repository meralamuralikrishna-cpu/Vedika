import { ELEMENT_MAP } from "./elements";
import TemplateArt from "./TemplateArt";
import { renderCoverInner } from "../assets/vedika-cover-assets/src/render.js";

export const CANVAS_W = 800;
export const CANVAS_H = 600;
export const FLOOR_Y = 470;

export function SceneBackdrop({ scene, uid }) {
  const [b1, b2] = scene.bg;
  const [f1, f2] = scene.floor;
  return (
    <>
      <defs><linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={b1} /><stop offset="1" stopColor={b2} /></linearGradient></defs>
      <rect width={CANVAS_W} height={CANVAS_H} fill={`url(#${uid}-bg)`} />
      <rect y={FLOOR_Y} width={CANVAS_W} height={CANVAS_H - FLOOR_Y} fill={f1} />
      <rect y={FLOOR_Y} width={CANVAS_W} height="6" fill={f2} />
    </>
  );
}

export function ElementShape({ el }) {
  const def = ELEMENT_MAP[el.type];
  if (!def) return null;
  return (
    <g
      transform={`translate(${el.x} ${el.y}) rotate(${el.rotation || 0} ${el.w / 2} ${el.h / 2})`}
      opacity={el.opacity !== undefined ? el.opacity : 1}
    >
      <g transform={`scale(${el.w / def.w} ${el.h / def.h})`}>
        {def.assetUrl
          ? <image href={def.assetUrl} width={def.w} height={def.h} preserveAspectRatio="none" />
          : def.render(el.color || def.color)}
      </g>
      {el.border && (
        <rect
          width={el.w}
          height={el.h}
          fill="none"
          stroke={el.borderColor || '#A61935'}
          strokeWidth={el.borderWidth || 2}
          rx={4}
          pointerEvents="none"
        />
      )}
    </g>
  );
}

// Read-only render: used by template covers, dashboard thumbnails and the static cover generator.
export default function SceneView({ scene, uid = "scene", ...rest }) {
  if (Array.isArray(scene.coverElements)) {
    const cover = { id: scene.coverId ?? uid, name: scene.name ?? 'Event cover', elements: scene.coverElements };
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" {...rest} dangerouslySetInnerHTML={{ __html: renderCoverInner(cover) }} />;
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} {...rest}>
      <SceneBackdrop scene={scene} uid={uid} />
      {scene.templateArt ? (
        <TemplateArt template={scene.templateArt} />
      ) : (
        scene.elements.map((el) => <ElementShape key={el.id} el={el} />)
      )}
    </svg>
  );
}
