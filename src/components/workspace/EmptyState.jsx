export default function EmptyState({ title, text, actions = [] }) {
  return (
    <div className="ws-empty">
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {actions.length > 0 && <div className="ws-actions">{actions.map((a) => <button key={a.label} className={`ws-btn${a.primary ? " is-primary" : ""}`} onClick={a.onClick}>{a.label}</button>)}</div>}
    </div>
  );
}
