import { Bell, User, LogOut } from "lucide-react";

export default function Topbar() {
  return (
    <header className="topbar">
      <span className="topbar__title">EVENT DECORATIONS DESIGN STUDIO</span>
      <div className="topbar__actions">
        <button aria-label="Notifications"><Bell size={18} /></button>
        <button aria-label="Profile"><User size={18} /></button>
        <button className="signout"><LogOut size={16} /> Sign out</button>
      </div>
    </header>
  );
}
