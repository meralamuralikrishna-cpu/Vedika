export default function FavoriteButton({ active, onClick, label }) {
  return (
    <button className={`ws-fav${active ? " is-on" : ""}`} onClick={onClick} aria-pressed={active} aria-label={active ? `Remove ${label} from favorites` : `Add ${label} to favorites`}>
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.2C1 8.6 2.9 5 6.3 5c2 0 3.2 1 3.7 2 .5-1 1.7-2 3.7-2 3.4 0 5.3 3.6 3.9 6.8C19.5 16.4 12 21 12 21z" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
    </button>
  );
}
