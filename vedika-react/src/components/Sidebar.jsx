import { LayoutGrid, Layers, Palette, FolderOpen, Image, Search, CalendarDays, Settings, ShieldCheck, Landmark } from "lucide-react";

const NAV = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "templates", label: "Explore Templates", icon: Layers },
  { id: "studio", label: "Design Studio", icon: Palette },
  { id: "designs", label: "My Designs", icon: FolderOpen },
  { id: "moodboards", label: "Moodboards", icon: Image },
  { id: "brief", label: "Event Brief", icon: Search },
  { id: "bookings", label: "Bookings", icon: CalendarDays },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "approvals", label: "Booking approvals", icon: ShieldCheck },
];

export default function Sidebar({ active, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <Landmark size={30} strokeWidth={1.4} />
        <div>
          <div className="brand__name">Vedika</div>
          <div className="brand__sub">STUDIO</div>
        </div>
      </div>
      <nav>
        {NAV.map(({ id, label, icon: Icon }) => (
          <button key={id} className={`nav__item ${active === id ? "is-active" : ""}`} onClick={() => onNavigate(id)}>
            <Icon size={17} strokeWidth={1.7} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
