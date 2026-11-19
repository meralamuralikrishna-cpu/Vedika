import { renderCoverInner, COVER_W, COVER_H } from "../render.js";

// Template card cover:  <CoverView cover={cover} />
// Every element is wrapped in <g data-id data-type>, so the Studio can hit-test / select it.
export default function CoverView({ cover, className = "", style }) {
  return (
    <svg
      viewBox={`0 0 ${COVER_W} ${COVER_H}`}
      className={className}
      style={{ width: "100%", height: "auto", display: "block", ...style }}
      role="img"
      aria-label={cover.name}
      dangerouslySetInnerHTML={{ __html: renderCoverInner(cover) }}
    />
  );
}
